import type { Json } from "../integrations/sectors/types";

const arr = (v: unknown): Json[] => (Array.isArray(v) ? (v as Json[]) : []);
const byDateDesc = (key: string) => (a: Json, b: Json) =>
  String(b[key] ?? "").localeCompare(String(a[key] ?? ""));

/** Ringkas /v2/company/corporate-actions/{symbol}/ jadi bagian yang berguna untuk pemula. */
export function slimActions(res: Json) {
  const ca = (res?.corporate_actions ?? {}) as Json;
  return {
    symbol: String(res?.symbol ?? "").replace(/\.JK$/i, ""),
    upcoming_dividend: arr(ca.upcoming_dividend).slice(0, 2),
    dividends: arr(ca.dividend).sort(byDateDesc("ex_date")).slice(0, 6),
    stock_splits: arr(ca.stock_split).sort(byDateDesc("date")).slice(0, 3),
    latest_agm: arr(ca.agm).sort(byDateDesc("agm_date")).slice(0, 1),
    note:
      "dividend_yield desimal (0.0064 = 0.64%). dividend_amount = Rupiah per lembar saham. " +
      "ex_date = tanggal saham mulai diperdagangkan TANPA hak dividen; payment_date = tanggal dibayarkan.",
  };
}
