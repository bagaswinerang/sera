import { google } from "@ai-sdk/google";
import { APICallError, type LanguageModel } from "ai";
import { env } from "../config/env";

type ModelV4 = Extract<LanguageModel, { specificationVersion: "v4" }>;

// Error yang wajar diatasi dengan pindah model: model tidak ada (404), timeout (408),
// kuota habis (429), atau server Google bermasalah (5xx) / jaringan putus.
// 400/401/403 (request atau API key bermasalah) TIDAK di-fallback karena model lain pun akan gagal.
const FALLBACK_STATUS = new Set([404, 408, 429, 500, 502, 503, 504]);

function shouldFallback(e: unknown): boolean {
  if (e instanceof Error && e.name === "AbortError") return false;
  if (APICallError.isInstance(e)) return e.statusCode === undefined || FALLBACK_STATUS.has(e.statusCode);
  return true;
}

// Model yang baru gagal dilewati sementara, supaya tiap request tidak membuang waktu ke model yang sedang mati.
const cooldownMs = (e: unknown) => (APICallError.isInstance(e) && e.statusCode === 404 ? 10 * 60_000 : 60_000);

function describe(e: unknown, isTimeout: boolean, timeoutMs: number): string {
  if (isTimeout) return `timeout ${timeoutMs / 1000} detik`;
  if (APICallError.isInstance(e)) return `HTTP ${e.statusCode ?? "?"}`;
  return e instanceof Error ? e.message.slice(0, 120) : String(e);
}

/** Mencoba model satu per satu sampai ada yang berhasil. Fallback hanya bisa terjadi SEBELUM jawaban mulai mengalir. */
export function createFallbackModel(models: ModelV4[], timeoutMs = env.modelTimeoutMs): ModelV4 {
  const skipUntil = new Map<string, number>();

  async function run<T>(
    call: (m: ModelV4, attemptSignal: AbortSignal) => PromiseLike<T>,
    userSignal?: AbortSignal
  ): Promise<T> {
    const now = Date.now();
    const ready = models.filter((m) => (skipUntil.get(m.modelId) ?? 0) <= now);
    const order = ready.length ? ready : models; // semua sedang cooldown -> coba semuanya lagi
    let lastError: unknown;

    for (const [i, m] of order.entries()) {
      let isTimeout = false;
      const attemptCtrl = new AbortController();
      // Jika model belum mulai merespons dalam timeoutMs, batalkan dan coba model berikutnya.
      const timer = setTimeout(() => {
        isTimeout = true;
        attemptCtrl.abort(new Error(`Model ${m.modelId} timeout`));
      }, timeoutMs);
      const onUserAbort = () => attemptCtrl.abort(userSignal?.reason);
      userSignal?.addEventListener("abort", onUserAbort);

      try {
        const out = await call(m, attemptCtrl.signal);
        if (m !== models[0]) console.warn(`[model] memakai cadangan: ${m.modelId}`);
        return out;
      } catch (e) {
        // User menutup tab / membatalkan: jangan fallback.
        if (userSignal?.aborted) throw e;
        // Error request/API key (400/401/403): model lain pun akan gagal.
        if (!isTimeout && !shouldFallback(e)) throw e;

        skipUntil.set(m.modelId, Date.now() + cooldownMs(e));
        const next = order[i + 1];
        console.warn(
          `[model] ${m.modelId} gagal (${describe(e, isTimeout, timeoutMs)})` +
            (next ? `, coba ${next.modelId}` : ", tidak ada cadangan lagi")
        );
        lastError = e;
      } finally {
        clearTimeout(timer);
        userSignal?.removeEventListener("abort", onUserAbort);
      }
    }
    throw lastError;
  }

  return {
    specificationVersion: "v4",
    provider: "fallback",
    modelId: models.map((m) => m.modelId).join(" > "),
    supportedUrls: models[0].supportedUrls,
    doGenerate: (options) =>
      run((m, signal) => m.doGenerate({ ...options, abortSignal: signal }), options.abortSignal),
    doStream: (options) =>
      run((m, signal) => m.doStream({ ...options, abortSignal: signal }), options.abortSignal),
  };
}

// Dibuat sekali dan dipakai ulang, supaya status cooldown tidak hilang di tiap request.
let cached: { key: string; model: LanguageModel } | null = null;

/** Model yang dipakai agent: rantai fallback dari env GEMINI_MODELS. */
export function getModel(): LanguageModel | null {
  const ids = env.geminiModels;
  if (!ids.length) return null;
  const key = ids.join(",");
  if (cached?.key === key) return cached.model;

  const models = ids.map((id) => google(id) as ModelV4);
  const model = models.length === 1 ? models[0] : createFallbackModel(models);
  cached = { key, model };
  return model;
}
