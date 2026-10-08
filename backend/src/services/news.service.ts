import type { Json } from "../integrations/sectors/types";

const noJk = (s: unknown) => String(s).replace(/\.JK$/i, "");

/**
 * Ringkas respons /v2/news/. `excerpt` hanya untuk LLM (jangan ditampilkan penuh di UI:
 * itu isi artikel pihak ketiga). UI cukup judul + sumber + waktu + label.
 */
export function slimNews(res: Json) {
  const list: Json[] = Array.isArray(res?.results) ? res.results : [];
  return {
    articles: list.slice(0, 10).map((a) => ({
      title: a.title as string,
      source: a.source as string,
      timestamp: a.timestamp as string,
      symbols: Array.isArray(a.symbols) ? a.symbols.map(noJk) : [],
      tags: Array.isArray(a.tags) ? (a.tags as string[]).slice(0, 5) : [],
      excerpt: typeof a.body === "string" ? a.body.slice(0, 400) : undefined,
    })),
    total_count: res?.pagination?.total_count as number | undefined,
    note: "Ringkas dengan kata-katamu sendiri, sebut sumbernya. Label (tags) adalah klasifikasi artikel, bukan saran investasi.",
  };
}
