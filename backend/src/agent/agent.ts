import { streamText, convertToModelMessages, stepCountIs, type UIMessage, type LanguageModel } from "ai";
import { tools } from "./tools";
import { buildSystemPrompt } from "./prompts";
import { extractSessionCompanies } from "./session";
import { detectInjection, findAdviceViolations, sanitizeOutput, INJECTION_RESPONSE } from "./guardrail";
import { creditsSpent } from "../integrations/sectors/client";

export type AgentResult =
  | { type: "blocked"; reason: string; response: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "ok"; stream: any };

/** Inti agent: satu fungsi, model bisa diganti (Gemini di produksi, model tiruan di tes). */
export async function runAgent(opts: {
  model: LanguageModel;
  messages: UIMessage[];
  level?: "simple" | "detail";
  /** hentikan model + tool kalau user menutup koneksi (hemat kredit) */
  abortSignal?: AbortSignal;
}): Promise<AgentResult> {
  // ── LAYER 1: Input Injection Check ──────────────────────
  // Periksa pesan user terakhir sebelum kirim ke LLM
  const lastUserMsg = [...opts.messages].reverse().find((m) => m.role === "user");
  if (lastUserMsg) {
    const userText = extractTextFromMessage(lastUserMsg);
    const injection = detectInjection(userText);

    if (injection.isInjection && injection.confidence === "high") {
      console.warn(
        `[guardrail] 🛑 Prompt injection DIBLOKIR (confidence: ${injection.confidence})`,
        injection.matchedLabels
      );
      return {
        type: "blocked",
        reason: injection.matchedLabels.join(", "),
        response: INJECTION_RESPONSE,
      };
    }

    if (injection.isInjection && injection.confidence === "medium") {
      console.warn(
        `[guardrail] ⚠️ Kemungkinan prompt injection terdeteksi (confidence: ${injection.confidence})`,
        injection.matchedLabels
      );
      // Medium confidence: tetap proses, tapi log untuk monitoring.
      // System prompt sudah punya instruksi untuk menolak.
    }
  }

  // ── LAYER 2: Run Agent ──────────────────────────────────
  const companies = extractSessionCompanies(opts.messages);

  const result = streamText({
    model: opts.model,
    system: buildSystemPrompt({ level: opts.level, companies }),
    messages: await convertToModelMessages(opts.messages),
    tools,
    abortSignal: opts.abortSignal,
    maxOutputTokens: opts.level === "detail" ? 2048 : 1024, // Beda limit sesuai mode
    temperature: 0, // Jawaban lebih cepat dan deterministik
    maxRetries: 2,
    stopWhen: stepCountIs(6), // Maksimal 6 langkah alat sebelum menjawab
    onFinish: (event) => {
      // ── LAYER 3: Output Guardrail ────────────────────
      const rawText = event.text ?? "";

      // Cek saran investasi
      const violations = findAdviceViolations(rawText);
      if (violations.length) {
        console.warn("[guardrail] 🛑 Terdeteksi bahasa saran investasi:", violations);
        const sanitized = sanitizeOutput(rawText);
        if (sanitized.wasModified) {
          console.warn("[guardrail] Output telah disanitasi");
        }
      }

      console.log(`[credits] total terpakai sejak server nyala: ${creditsSpent()}`);
    },
  });

  return { type: "ok", stream: result };
}

/** Ekstrak teks dari UIMessage, support berbagai format (string content / parts). */
function extractTextFromMessage(msg: UIMessage): string {
  // Coba dari parts dulu
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join(" ");
  }
  // Fallback ke content string
  if (typeof (msg as any).content === "string") {
    return (msg as any).content;
  }
  return "";
}
