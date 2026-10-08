const flag = (v: string | undefined) => v === "1" || v === "true";

/**
 * Satu-satunya tempat membaca process.env.
 * Dibaca saat dipakai (lazy), bukan saat import, supaya urutan pemuatan .env tidak jadi masalah.
 * (GOOGLE_GENERATIVE_AI_API_KEY dibaca langsung oleh @ai-sdk/google.)
 */
export const env = {
  get sectorsApiKey() {
    return process.env.SECTORS_API_KEY;
  },
  /** Daftar model berurutan (yang pertama dicoba dulu, sisanya cadangan). Boleh isi GEMINI_MODELS atau GEMINI_MODEL. */
  get geminiModels(): string[] {
    const raw =
      process.env.GEMINI_MODELS ??
      process.env.GEMINI_MODEL ??
      "gemini-3.8-flash,gemini-3.7-flash,gemini-3.6-flash,gemini-3.5-flash";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  },
  get supabaseUrl() {
    return process.env.SUPABASE_URL;
  },
  get supabaseServiceKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  },
  get port() {
    return Number(process.env.PORT ?? 8787);
  },
  get frontendOrigin() {
    return process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
  },
  get trustProxy() {
    return flag(process.env.TRUST_PROXY);
  },
  /** Batas keras kredit Sectors per proses server (0/kosong = tanpa batas). Pengaman demo. */
  get creditBudget() {
    const n = Number(process.env.CREDIT_BUDGET ?? 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  },
};
