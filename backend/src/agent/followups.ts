import { generateText, type LanguageModel } from "ai";

/**
 * Cadangan saran pertanyaan lanjutan: dipakai HANYA jika model utama lupa memanggil
 * suggest_follow_up (model kecil seperti flash-lite kadang melewatkannya).
 * Memakai model ringan terpisah supaya cepat; gagal = tanpa saran (tidak merusak jawaban).
 */
export async function generateFollowUps(opts: {
  model: LanguageModel;
  question: string;
  answer: string;
  abortSignal?: AbortSignal;
  timeoutMs?: number;
}): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: opts.model,
      maxRetries: 0,
      maxOutputTokens: 200,
      abortSignal: AbortSignal.any([
        AbortSignal.timeout(opts.timeoutMs ?? 6_000),
        ...(opts.abortSignal ? [opts.abortSignal] : []),
      ]),
      prompt:
        "Kamu membantu pemula di pasar saham Indonesia (BEI). Berdasarkan percakapan di bawah, tulis TEPAT 3 " +
        "pertanyaan lanjutan singkat (maks 12 kata) yang mungkin ingin ditanyakan user berikutnya. " +
        "Satu pertanyaan per baris, tanpa nomor, tanpa penjelasan, bukan saran beli/jual.\n\n" +
        `User: ${opts.question.slice(0, 500)}\nJawaban: ${opts.answer.slice(0, 1500)}`,
    });
    return text
      .split("\n")
      .map((l) => l.replace(/^\s*([-*•]|\d+[.)])\s*/, "").trim())
      .filter((l) => l.length > 3 && l.length <= 120)
      .slice(0, 3);
  } catch (e) {
    console.warn("[follow-up] gagal membuat saran cadangan:", e instanceof Error ? e.message : e);
    return [];
  }
}
