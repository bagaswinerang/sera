export const DISCLAIMER = "Informasi dan analisis, bukan saran investasi.";

// ─────────────────────────────────────────────────────────────
//  LAYER 1 — INPUT INJECTION DETECTION
//  Mendeteksi pola prompt injection di pesan user SEBELUM
//  dikirim ke LLM. Pola bilingual (ID + EN).
// ─────────────────────────────────────────────────────────────

const INJECTION_PATTERNS: { pattern: RegExp; label: string }[] = [
  // ── Role / Identity Override ──
  { pattern: /\b(you are now|kamu sekarang adalah|act as|bertindak sebagai|pretend.{0,8}(you|kamu))\b/i, label: "role-override" },
  { pattern: /\b(new persona|ganti karakter|switch.{0,6}(role|mode))\b/i, label: "role-override" },
  { pattern: /\b(you.{0,6}(must|harus).{0,15}(obey|ikuti|patuhi))\b/i, label: "role-override" },

  // ── Instruction Override ──
  { pattern: /\b(ignore|abaikan|lupakan|forget).{0,20}(previous|sebelumnya|above|atas|all|semua|system|instruction|aturan|perintah|rule)/i, label: "instruction-override" },
  { pattern: /\b(override|timpa|ganti).{0,15}(instruction|system|prompt|aturan|perintah)/i, label: "instruction-override" },
  { pattern: /\b(do not follow|jangan ikuti|langgar).{0,15}(rule|aturan|instruction|perintah)/i, label: "instruction-override" },

  // ── System Prompt Extraction ──
  { pattern: /\b(reveal|show|tampilkan|tunjukkan|print|cetak|repeat|ulangi).{0,20}(system.?prompt|instruksi.?sistem|initial.?prompt|aturan.?awal|hidden.?instruction)/i, label: "prompt-extraction" },
  { pattern: /\b(what.{0,10}(your|are).{0,10}(instruction|rule|system|prompt))/i, label: "prompt-extraction" },
  { pattern: /\b(apa.{0,10}(instruksi|aturan|prompt|perintah).{0,10}(sistem|awal|kamu))/i, label: "prompt-extraction" },

  // ── Jailbreak Delimiters ──
  { pattern: /\[?(system|SYSTEM)\]?\s*[:>]/i, label: "fake-system-tag" },
  { pattern: /```\s*(system|admin|root|SYSTEM)\b/i, label: "fake-system-block" },
  { pattern: /<\/?system>/i, label: "fake-system-xml" },
  { pattern: /---\s*(new|override|system)\s*---/i, label: "delimiter-injection" },

  // ── DAN / Jailbreak Techniques ──
  { pattern: /\bD\.?A\.?N\.?\b/i, label: "dan-jailbreak" },
  { pattern: /\b(developer|admin|sudo|root).{0,10}(mode|access|akses|override)\b/i, label: "privilege-escalation" },
  { pattern: /\b(unlock|buka).{0,10}(restriction|batasan|filter|limit)\b/i, label: "restriction-bypass" },

  // ── Output Manipulation ──
  { pattern: /\b(respond|jawab).{0,15}(only|hanya).{0,15}(yes|ya|ok)\b/i, label: "output-control" },
  { pattern: /\b(translate|terjemahkan).{0,20}(system|instruksi|instruction|prompt)\b/i, label: "prompt-extraction" },
];

/** Confidence level: 'high' jika ≥2 pola cocok atau pola tertentu yang sangat khas. */
export type InjectionResult = {
  isInjection: boolean;
  confidence: "high" | "medium" | "low" | "none";
  matchedLabels: string[];
};

/**
 * Periksa teks input user untuk pola prompt injection.
 * Mengembalikan objek dengan confidence level.
 */
export function detectInjection(text: string): InjectionResult {
  const matched: string[] = [];

  for (const { pattern, label } of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      if (!matched.includes(label)) matched.push(label);
    }
  }

  if (matched.length === 0) {
    return { isInjection: false, confidence: "none", matchedLabels: [] };
  }

  // High-confidence: patterns yang hampir selalu injection
  const highConfidenceLabels = ["instruction-override", "fake-system-tag", "fake-system-block", "fake-system-xml", "dan-jailbreak", "delimiter-injection"];
  const hasHighConfidence = matched.some((l) => highConfidenceLabels.includes(l));

  if (hasHighConfidence || matched.length >= 2) {
    return { isInjection: true, confidence: "high", matchedLabels: matched };
  }

  return { isInjection: true, confidence: "medium", matchedLabels: matched };
}

// ─────────────────────────────────────────────────────────────
//  LAYER 2 — OUTPUT ADVICE VIOLATION DETECTION
//  Mendeteksi bahasa saran investasi di jawaban AI.
// ─────────────────────────────────────────────────────────────

const ADVICE_PATTERNS: RegExp[] = [
  /\b(sebaiknya|disarankan|saya sarankan|rekomendasi(?:kan)?)\b.{0,40}\b(beli|jual|tahan|akumulasi)\b/i,
  /\b(beli|jual)\s+(sekarang|saja|segera)\b/i,
  /\bwajib\s+(beli|jual)\b/i,
  /\b(pasti|dijamin)\s+(naik|untung|cuan)\b/i,
];

/** Pemeriksa pasca-jawaban: mengembalikan potongan teks yang terdengar seperti saran investasi. */
export function findAdviceViolations(text: string): string[] {
  const hits: string[] = [];
  for (const re of ADVICE_PATTERNS) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  return hits;
}

// ─────────────────────────────────────────────────────────────
//  LAYER 3 — OUTPUT SANITIZATION
//  Mengganti kalimat yang mengandung saran investasi dengan
//  disclaimer, bukan cuma log.
// ─────────────────────────────────────────────────────────────

/**
 * Sanitasi output: mengganti kalimat yang mengandung saran investasi
 * dengan peringatan disclaimer.
 */
export function sanitizeOutput(text: string): { text: string; wasModified: boolean } {
  let modified = false;

  for (const re of ADVICE_PATTERNS) {
    if (re.test(text)) {
      // Ganti kalimat yang mengandung pola saran (baris yang cocok)
      text = text.replace(re, `[${DISCLAIMER}]`);
      modified = true;
    }
  }

  return { text, wasModified: modified };
}

// ─────────────────────────────────────────────────────────────
//  PESAN PENOLAKAN
//  Pesan ramah untuk user jika input terdeteksi sebagai injection.
// ─────────────────────────────────────────────────────────────

export const INJECTION_RESPONSE =
  "Maaf, aku tidak bisa memproses permintaan itu. 😊 Aku Sera, asisten khusus untuk membantu kamu memahami saham di BEI. Ada pertanyaan soal saham yang bisa aku bantu?";
