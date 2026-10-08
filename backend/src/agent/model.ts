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

/** Mencoba model satu per satu sampai ada yang berhasil. Fallback hanya bisa terjadi SEBELUM jawaban mulai mengalir. */
export function createFallbackModel(models: ModelV4[]): ModelV4 {
  const skipUntil = new Map<string, number>();

  async function run<T>(
    call: (m: ModelV4, attemptSignal?: AbortSignal) => PromiseLike<T>,
    userSignal?: AbortSignal
  ): Promise<T> {
    const now = Date.now();
    const ready = models.filter((m) => (skipUntil.get(m.modelId) ?? 0) <= now);
    const order = ready.length ? ready : models; // semua sedang cooldown -> coba semuanya lagi
    let lastError: unknown;

    for (const m of order) {
      let isTimeout = false;
      const attemptCtrl = new AbortController();

      // Timeout: jika 12 detik model belum merespons, coba model berikutnya.
      // Free tier Gemini sering butuh 5-10 detik untuk mulai stream.
      const timeoutTimer = setTimeout(() => {
        isTimeout = true;
        attemptCtrl.abort(new Error("TimeoutLimit"));
      }, 12_000);

      const onUserAbort = () => attemptCtrl.abort(userSignal?.reason);
      userSignal?.addEventListener("abort", onUserAbort);

      try {
        const out = await call(m, attemptCtrl.signal);
        clearTimeout(timeoutTimer);
        userSignal?.removeEventListener("abort", onUserAbort);

        if (m !== models[0]) console.warn(`[model] memakai cadangan: ${m.modelId}`);
        return out;
      } catch (e) {
        clearTimeout(timeoutTimer);
        userSignal?.removeEventListener("abort", onUserAbort);

        // Jika user yang menutup tab/batalin, jangan fallback, langsung lemparkan error-nya
        if (userSignal?.aborted) throw e;

        // Jika timeout atau memang error teknis (429, 503, dll), lakukan fallback
        if (isTimeout || shouldFallback(e)) {
          skipUntil.set(m.modelId, Date.now() + cooldownMs(e));
          console.warn(
            `[model] ${m.modelId} gagal (${isTimeout ? "Timeout 3 detik" : "Error"}), coba model berikutnya`
          );
          lastError = e;
        } else {
          // Error yang tidak wajar (misal salah API Key), batalkan semua
          throw e;
        }
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
