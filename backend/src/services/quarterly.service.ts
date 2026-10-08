import type { Json } from "../integrations/sectors/types";

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const pct = (a: number | null, b: number | null) => (a === null || b === null || b === 0 ? null : (a - b) / Math.abs(b));

/**
 * Angka tren dihitung di KODE, bukan oleh LLM.
 * earnings_stability.cv = simpangan baku / rata-rata laba antar kuartal.
 * Makin kecil makin stabil. Ini heuristik kasar (belum menghitung musiman).
 */
export function summarizeQuarterly(rows: Json[]) {
  const sorted = rows.filter((r) => r?.date).sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const quarters = sorted.map((r, i) => {
    const prev = sorted[i - 1];
    return {
      date: r.date as string,
      revenue: num(r.revenue),
      earnings: num(r.earnings),
      earnings_change_vs_prev_quarter: prev ? pct(num(r.earnings), num(prev.earnings)) : null,
    };
  });

  const e = quarters.map((q) => q.earnings).filter((x): x is number => x !== null);
  let stability: { quarters_used: number; cv: number } | null = null;
  if (e.length >= 3) {
    const mean = e.reduce((s, x) => s + x, 0) / e.length;
    if (mean !== 0) {
      const sd = Math.sqrt(e.reduce((s, x) => s + (x - mean) ** 2, 0) / e.length);
      stability = { quarters_used: e.length, cv: sd / Math.abs(mean) };
    }
  }

  // metrik khusus bank/asuransi dari kuartal terbaru (jika ada)
  const last = sorted[sorted.length - 1];
  const sm = (last?.financials_sector_metrics ?? {}) as Json;
  const sector_metrics_latest: Json = {};
  for (const k of ["net_interest_income", "gross_loan", "total_deposit"]) {
    if (num(sm[k]) !== null) sector_metrics_latest[k] = sm[k];
  }

  return {
    quarters,
    earnings_stability: stability,
    sector_metrics_latest: Object.keys(sector_metrics_latest).length ? sector_metrics_latest : null,
    note: "Nilai dalam Rupiah. Perubahan dan cv berupa desimal (0.05 = 5%).",
  };
}
