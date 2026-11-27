import { isToolUIPart, type UIMessage } from "ai";

/** Jumlah pesan terakhir yang dikirim ke model (hemat token, cukup untuk konteks percakapan). */
export const HISTORY_LIMIT = 10;

/**
 * Siapkan riwayat chat dari frontend untuk dikirim ke model.
 * - Ambil HISTORY_LIMIT pesan terakhir.
 * - Buang tool call yang belum punya hasil (gagal/terputus di tengah jalan):
 *   Gemini menolak (400) function call tanpa function response.
 * - Tool call yang SUDAH selesai tetap disimpan, supaya model ingat data sebelumnya
 *   dan memori sesi ("yang tadi") tetap bekerja.
 * Input tidak diubah (pesan disalin).
 */
export function prepareHistory(messages: UIMessage[]): UIMessage[] {
  return messages
    .slice(-HISTORY_LIMIT)
    .map((m) => {
      if (m.role !== "assistant" || !Array.isArray(m.parts)) return m;
      const parts = m.parts.filter(
        (p) => !isToolUIPart(p) || p.state === "output-available" || p.state === "output-error"
      );
      return { ...m, parts };
    })
    .filter(
      (m) =>
        m.role !== "assistant" ||
        m.parts.some((p) => isToolUIPart(p) || (p.type === "text" && p.text.trim() !== ""))
    );
}
