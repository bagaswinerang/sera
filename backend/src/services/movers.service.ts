import type { Json } from "../integrations/sectors/types";

const arr = (v: unknown): Json[] => (Array.isArray(v) ? (v as Json[]) : []);

/** Bentuk akhir: { movers: { top_gainers: { "1d": [...] }, top_losers: {...} } } dengan symbol tanpa .JK. */
export function slimMovers(res: Json) {
  const movers: Record<string, Record<string, unknown[]>> = {};
  for (const cls of ["top_gainers", "top_losers"]) {
    const byPeriod = res?.[cls] as Json | undefined;
    if (!byPeriod || typeof byPeriod !== "object") continue;
    movers[cls] = {};
    for (const [period, rows] of Object.entries(byPeriod)) {
      movers[cls][period] = arr(rows).map((r) => ({
        symbol: String(r.symbol).replace(/\.JK$/i, ""),
        name: r.name as string,
        price_change: r.price_change as number,
        last_close_price: r.last_close_price as number,
        latest_close_date: r.latest_close_date as string,
      }));
    }
  }
  return {
    movers,
    note:
      "price_change desimal (0.05 = +5%). Hanya perusahaan berkapitalisasi pasar besar (default API: di atas Rp 5 triliun). " +
      "Pergerakan harga masa lalu, bukan prediksi.",
  };
}
