const GENERIC = "Ada masalah saat memproses permintaan. Coba lagi ya.";

/**
 * Peta kode error dari backend → pesan ramah untuk pengguna awam.
 * Kode-kode ini dikirim oleh classifyError() di backend.
 */
const ERROR_MAP: Record<string, { message: string; emoji: string }> = {
  SERA_BUSY: {
    emoji: "😴",
    message:
      "Sera lagi banyak yang pakai nih, jadi agak kewalahan. Tunggu sebentar ya, biasanya beberapa menit juga udah bisa lagi!",
  },
  SERA_RATE_LIMIT: {
    emoji: "⏳",
    message:
      "Kamu sudah banyak bertanya — Sera butuh istirahat sebentar. Coba lagi dalam beberapa menit ya!",
  },
  SERA_QUOTA_EXHAUSTED: {
    emoji: "🔋",
    message:
      "Sera sudah capek banget hari ini karena sudah melayani banyak orang. Sera perlu istirahat dulu ya, coba lagi besok pagi!",
  },
  SERA_TIMEOUT: {
    emoji: "🐌",
    message:
      "Sera kelamaan mikir dan akhirnya ketiduran. Coba tanya lagi ya, biasanya lebih cepat kok!",
  },
  SERA_NETWORK: {
    emoji: "📡",
    message:
      "Sera nggak bisa terhubung ke server. Coba cek koneksi internet kamu, lalu coba lagi.",
  },
  SERA_AUTH: {
    emoji: "🔑",
    message:
      "Ada masalah konfigurasi di sisi server. Hubungi admin untuk memperbaikinya ya.",
  },
  SERA_UNKNOWN: {
    emoji: "🤔",
    message: GENERIC,
  },
};

/** Ubah error dari useChat menjadi pesan ramah berbahasa Indonesia. */
export function friendlyError(error: Error | undefined | null): string {
  if (!error) return "";
  const raw = error.message ?? "";

  // Cek apakah error berisi kode SERA_ dari backend
  for (const [code, info] of Object.entries(ERROR_MAP)) {
    if (raw.includes(code)) {
      return `${info.emoji} ${info.message}`;
    }
  }

  // Fallback: deteksi langsung dari pesan error mentah (jika backend tidak mengirim kode)
  if (/429|terlalu banyak|rate.?limit/i.test(raw)) {
    return `${ERROR_MAP.SERA_RATE_LIMIT.emoji} ${ERROR_MAP.SERA_RATE_LIMIT.message}`;
  }
  if (/high demand|overloaded|unavailable|503/i.test(raw)) {
    return `${ERROR_MAP.SERA_BUSY.emoji} ${ERROR_MAP.SERA_BUSY.message}`;
  }
  if (/failed to fetch|networkerror|load failed|network/i.test(raw)) {
    return `${ERROR_MAP.SERA_NETWORK.emoji} ${ERROR_MAP.SERA_NETWORK.message}`;
  }
  if (/timeout|timed?\s*out/i.test(raw)) {
    return `${ERROR_MAP.SERA_TIMEOUT.emoji} ${ERROR_MAP.SERA_TIMEOUT.message}`;
  }

  // Cek apakah ada JSON error dari backend
  try {
    const parsed = JSON.parse(raw) as { error?: unknown };
    if (typeof parsed?.error === "string" && parsed.error) {
      // Cek apakah JSON error juga mengandung kode SERA_
      for (const [code, info] of Object.entries(ERROR_MAP)) {
        if (parsed.error.includes(code)) {
          return `${info.emoji} ${info.message}`;
        }
      }
      return parsed.error;
    }
  } catch {
    // bukan JSON, abaikan
  }

  return `${ERROR_MAP.SERA_UNKNOWN.emoji} ${GENERIC}`;
}
