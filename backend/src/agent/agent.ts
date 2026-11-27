import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  type StopCondition,
  type UIMessage,
  type LanguageModel,
} from "ai";
import { tools } from "./tools";
import { buildSystemPrompt } from "./prompts";
import { extractSessionCompanies } from "./session";
import { detectInjection, findAdviceViolations, INJECTION_RESPONSE } from "./guardrail";
import { creditsSpent } from "../integrations/sectors/client";
import { findDefinitionEntries } from "../services/glossary.service";

const ALL_TOOLS = Object.keys(tools) as (keyof typeof tools)[];

/**
 * Berhenti begitu suggest_follow_up dipanggil SETELAH ada teks jawaban: tanpa ini AI SDK
 * mengirim hasil tool ke model lagi hanya untuk mendapat respons kosong (satu putaran sia-sia).
 * Jika model memanggilnya sebelum menulis jawaban, loop tetap lanjut supaya jawaban tidak hilang.
 */
const followUpAfterAnswer: StopCondition<typeof tools> = ({ steps }) =>
  steps.some((s) => s.text.trim() !== "") &&
  (steps.at(-1)?.toolCalls.some((c) => c.toolName === "suggest_follow_up") ?? false);

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
  const userText = lastUserMsg ? extractTextFromMessage(lastUserMsg) : "";
  if (lastUserMsg) {
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
  // Pertanyaan definisi: kamus dicari di server (gratis, instan), bukan lewat tool call.
  const glossary = findDefinitionEntries(userText);

  const result = streamText({
    model: opts.model,
    system: buildSystemPrompt({ level: opts.level, companies, glossary }),
    messages: await convertToModelMessages(opts.messages),
    tools,
    activeTools: glossary.length ? ALL_TOOLS.filter((t) => t !== "lookup_glossary") : ALL_TOOLS,
    abortSignal: opts.abortSignal,
    maxOutputTokens: opts.level === "detail" ? 2048 : 1024, // Beda limit sesuai mode
    // Fallback antar-model sudah jadi mekanisme coba-ulang utama; retry di sini mengulang
    // SELURUH rantai model, jadi dibatasi 1 supaya user tidak menunggu terlalu lama saat Google overload.
    maxRetries: 1,
    stopWhen: [stepCountIs(6), followUpAfterAnswer], // maksimal 6 langkah, atau selesai setelah saran lanjutan
    onFinish: (event) => {
      // ── LAYER 3: Output Guardrail (monitoring) ───────
      // Teks sudah ter-stream ke user, jadi di sini hanya dicatat untuk evaluasi prompt.
      const violations = findAdviceViolations(event.text ?? "");
      if (violations.length) console.warn("[guardrail] 🛑 Terdeteksi bahasa saran investasi:", violations);

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
