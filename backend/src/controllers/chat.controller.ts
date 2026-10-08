import type { RequestHandler } from "express";
import { z } from "zod";
import { toUIMessageStream, pipeUIMessageStreamToResponse, type LanguageModel, type UIMessage } from "ai";
import { runAgent } from "../agent/agent";
import { tools } from "../agent/tools";

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

export type ChatDeps = { getModel: () => LanguageModel | null };

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
      // Ambil 10 pesan terakhir, tapi bersihkan dari tool-invocation yang menggantung (gagal/belum selesai)
      // Gemini 400 error jika ada function call tanpa function response di riwayat
      const rawMessages = (messages as unknown as UIMessage[]).slice(-10);
      const safeMessages = rawMessages
        .map((m) => {
          if (m.role === "assistant" && Array.isArray(m.parts)) {
            // Hanya pertahankan teks atau tool-invocation yang sudah punya hasil (selesai)
            m.parts = m.parts.filter(
              (p) =>
                p.type === "text" ||
                (p.type === "tool-invocation" && "result" in p && p.result !== undefined)
            );
          }
          return m;
        })
        .filter(
          (m) =>
            m.role === "user" ||
            (m.role === "assistant" &&
              ((Array.isArray(m.parts) && m.parts.length > 0) ||
                (typeof (m as any).content === "string" && (m as any).content.trim() !== "")))
        );

      const result = await runAgent({
        model,
        messages: safeMessages,
        level,
        abortSignal: abort.signal,
      });

      // ── Jika input terdeteksi sebagai prompt injection ──
      if (result.type === "blocked") {
        console.warn(`[guardrail] Input diblokir: ${result.reason}`);
        // Kirim respons ramah sebagai stream SSE agar frontend tetap bisa render normal
        res.setHeader("X-Vercel-AI-Data-Stream", "v1");
        // Format AI SDK data stream: text part
        res.write(`0:${JSON.stringify(result.response)}\n`);
        res.end();
        return;
      }

      await pipeUIMessageStreamToResponse({
        response: res,
        stream: toUIMessageStream({
          stream: result.stream.stream,
          tools,
          onError: (e) => {
            console.error("[stream error]", e);
            return classifyError(e);
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
