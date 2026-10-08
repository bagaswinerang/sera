import type { Json } from "../integrations/sectors/types";

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

/** Perubahan harga dihitung di KODE (bukan oleh LLM). change_pct desimal: 0.05 = 5%. */
export function summarizePrices(rows: Json[], symbol: string) {
  const sorted = rows
    .filter((r) => r?.date && num(r.close) !== null)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const points = sorted.map((r) => ({
    date: r.date as string,
    close: r.close as number,
    volume: num(r.volume),
  }));

  const note =
    "Harga dalam Rupiah. change_pct desimal (0.05 = 5%). Ini perubahan masa lalu, bukan prediksi.";
  if (points.length === 0)
    return { symbol: symbol.toUpperCase(), points, summary: null, note };

  const first = points[0];
  const last = points[points.length - 1];
  const closes = points.map((p) => p.close);

  return {
    symbol: symbol.toUpperCase(),
    points,
    summary: {
      start_date: first.date,
      end_date: last.date,
      start_close: first.close,
      last_close: last.close,
      change_pct: first.close ? (last.close - first.close) / first.close : null,
      highest_close: Math.max(...closes),
      lowest_close: Math.min(...closes),
      trading_days: points.length,
      market_cap_latest: num(sorted[sorted.length - 1].market_cap),
    },
    note,
  };
}
