import type { RequestHandler } from "express";
import { z } from "zod";
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  toUIMessageStream,
  type LanguageModel,
  type UIMessage,
} from "ai";
import { runAgent, extractTextFromMessage } from "../agent/agent";
import { generateFollowUps } from "../agent/followups";
import { tools } from "../agent/tools";
import { prepareHistory } from "../agent/history";

/**
 * Mengklasifikasikan error teknis menjadi pesan ramah untuk pengguna.
 * Pesan ini yang akan dikirim ke frontend dan ditampilkan ke user.
 */
function classifyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);

  // Model sedang ramai / overload (503)
  if (/high demand|overloaded|unavailable|503/i.test(msg)) {
    return "SERA_BUSY";
  }
  // Kuota harian Google habis (Free Tier)
  if (/quota|resource.?exhausted|FreeTier/i.test(msg)) {
    return "SERA_QUOTA_EXHAUSTED";
  }
  // Rate limit / terlalu banyak request (429)
  if (/429|rate.?limit/i.test(msg)) {
    return "SERA_RATE_LIMIT";
  }
  // Timeout (408)
  if (/timeout|408|timed?\s*out|deadline/i.test(msg)) {
    return "SERA_TIMEOUT";
  }
  // Network / koneksi putus
  if (/network|econnrefused|enotfound|fetch failed|dns/i.test(msg)) {
    return "SERA_NETWORK";
  }
  // API key bermasalah (401/403)
  if (/401|403|unauthorized|forbidden|api.?key/i.test(msg)) {
    return "SERA_AUTH";
  }
  // Fallback generik
  return "SERA_UNKNOWN";
}

export type ChatDeps = {
  getModel: () => LanguageModel | null;
  /** model ringan untuk saran pertanyaan cadangan; kosong = pakai model utama */
  getFollowUpModel?: () => LanguageModel | null;
};

// Isi pesan (UIMessage) divalidasi longgar; strukturnya dikelola AI SDK.
const chatBodySchema = z.object({
  messages: z.array(z.record(z.string(), z.unknown())).min(1),
  level: z.enum(["simple", "detail"]).optional(),
});

/** POST /api/chat: validasi -> jalankan agent -> streaming SSE ke frontend. */
export function chatController(deps: ChatDeps): RequestHandler {
  return async (req, res) => {
    const model = deps.getModel();
    if (!model) {
      res.status(500).json({ error: "Model Gemini belum dikonfigurasi (cek GEMINI_MODELS di .env)" });
      return;
    }

    const parsed = chatBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "messages kosong." });
      return;
    }
    const { messages, level } = parsed.data;

    // user menutup tab di tengah jawaban -> hentikan model dan tool (hemat kredit)
    const abort = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) abort.abort();
    });

    try {
      const result = await runAgent({
        model,
        messages: prepareHistory(messages as unknown as UIMessage[]),
        level,
        abortSignal: abort.signal,
      });

      // Input diblokir guardrail: kirim penolakan ramah sebagai stream biasa supaya frontend merendernya normal.
      if (result.type === "blocked") {
        pipeUIMessageStreamToResponse({
          response: res,
          stream: createUIMessageStream({
            execute: ({ writer }) => {
              const id = "blocked";
              writer.write({ type: "text-start", id });
              writer.write({ type: "text-delta", id, delta: result.response });
              writer.write({ type: "text-end", id });
            },
          }),
        });
        return;
      }

      const onError = (e: unknown) => {
        console.error("[stream error]", e);
        return classifyError(e);
      };
      const history = prepareHistory(messages as unknown as UIMessage[]);
      const lastUser = [...history].reverse().find((m) => m.role === "user");

      pipeUIMessageStreamToResponse({
        response: res,
        stream: createUIMessageStream({
          onError,
          execute: async ({ writer }) => {
            // Teruskan jawaban model chunk demi chunk (berurutan, supaya chunk tambahan di bawah
            // pasti terkirim sebelum "finish").
            const ui = toUIMessageStream({ stream: result.stream.stream, tools, onError, sendFinish: false });
            for await (const chunk of ui) writer.write(chunk);

            // Model lupa memanggil suggest_follow_up -> buatkan saran cadangan.
            const steps = await Promise.resolve(result.stream.steps).catch(() => null);
            const answer = steps?.map((s) => s.text).join("").trim() ?? "";
            const suggested = steps?.some((s) => s.toolCalls.some((c) => c.toolName === "suggest_follow_up"));
            if (steps && answer && !suggested && !abort.signal.aborted) {
              const questions = await generateFollowUps({
                model: deps.getFollowUpModel?.() ?? model,
                question: lastUser ? extractTextFromMessage(lastUser) : "",
                answer,
                abortSignal: abort.signal,
              });
              if (questions.length) {
                const toolCallId = "follow-up-fallback";
                writer.write({ type: "tool-input-available", toolCallId, toolName: "suggest_follow_up", input: { questions } });
                writer.write({ type: "tool-output-available", toolCallId, output: { questions } });
              }
            }
            writer.write({ type: "finish" });
          },
        }),
      });
    } catch (e) {
      console.error("[chat error]", e);
      if (!res.headersSent) {
        const msg = classifyError(e);
        res.status(503).json({ error: msg });
      }
    }
  };
}
