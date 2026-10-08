import { getCompanyReport } from "../integrations/sectors/endpoints";
import { normalizeSymbol, SectorsError } from "../integrations/sectors/client";
import type { Json } from "../integrations/sectors/types";
import type { Comparison, MetricDirection, MetricUnit } from "../types/comparison";
import { latestByYear } from "./slim.service";

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

type Metric = {
  key: string;
  label: string;
  /** arti angka ini dalam bahasa awam (dipakai UI dan LLM) */
  hint: string;
  unit: MetricUnit;
  better: MetricDirection;
  get: (r: Json) => number | null;
};

// Jalur field sesuai contoh respons /v2/company/report di docs Sectors.
export const METRICS: Metric[] = [
  {
    key: "market_cap",
    label: "Ukuran perusahaan (kapitalisasi pasar)",
    hint: "Total nilai seluruh saham perusahaan di bursa.",
    unit: "idr",
    better: "high",
    get: (r) => num(r.overview?.market_cap),
  },
  {
    key: "forward_pe",
    label: "Valuasi (PER ke depan)",
    hint: "Berapa tahun laba (perkiraan) untuk menyamai harga saham. Makin kecil, makin murah relatif terhadap laba.",
    unit: "x",
    better: "low",
    get: (r) => num(r.valuation?.forward_pe),
  },
  {
    key: "pb",
    label: "Harga vs nilai buku (PBV)",
    hint: "Harga saham dibanding nilai bersih aset perusahaan di pembukuan. Makin kecil, makin murah relatif terhadap aset.",
    unit: "x",
    better: "low",
    get: (r) => num(latestByYear(r.valuation?.historical_valuation, 1)[0]?.pb),
  },
  {
    key: "roe",
    label: "Kemampuan menghasilkan laba dari modal (ROE)",
    hint: "Dari modal pemegang saham, berapa persen jadi laba dalam setahun. Makin besar, makin efisien.",
    unit: "ratio",
    better: "high",
    get: (r) => num(latestByYear(r.financials?.historical_financial_ratio, 1)[0]?.profitability?.roe),
  },
  {
    key: "earnings_growth",
    label: "Pertumbuhan laba (kuartal terakhir vs tahun lalu)",
    hint: "Seberapa cepat laba naik dibanding kuartal yang sama tahun lalu.",
    unit: "ratio",
    better: "high",
    get: (r) => num(r.financials?.yoy_quarter_earnings_growth),
  },
  {
    key: "dividend_yield",
    label: "Dividen (yield 12 bulan)",
    hint: "Dividen setahun dibanding harga saham. Makin besar, makin besar bagian laba yang dibagikan.",
    unit: "ratio",
    better: "high",
    get: (r) => num(r.dividend?.yield_ttm),
  },
];

export const COMPARE_SECTIONS = ["overview", "valuation", "financials", "dividend"] as const;

/** Murni (tanpa jaringan): hitung siapa unggul per metrik. Mudah diuji. */
export function buildComparison(
  reports: Record<string, Json>,
  unavailable: Comparison["unavailable"] = [],
): Comparison {
  const symbols = Object.keys(reports);

  const companies: Comparison["companies"] = {};
  for (const s of symbols) {
    const r = reports[s];
    companies[s] = {
      name: r.company_name ?? null,
      subSector: r.overview?.sub_sector ?? null,
      asOf: r.overview?.latest_close_date ?? null,
    };
  }

  const rows = METRICS.map((m) => {
    const values: Record<string, number | null> = {};
    for (const s of symbols) values[s] = m.get(reports[s]);
    const valid = symbols.filter((s) => values[s] !== null);
    let winners: string[] | null = null;
    if (valid.length >= 2) {
      const nums = valid.map((s) => values[s] as number);
      const best = m.better === "high" ? Math.max(...nums) : Math.min(...nums);
      winners = valid.filter((s) => values[s] === best);
    }
    return { key: m.key, label: m.label, hint: m.hint, unit: m.unit, better: m.better, values, winners };
  });

  const warnings: string[] = [];
  const subs = new Set(symbols.map((s) => companies[s].subSector).filter(Boolean));
  if (subs.size > 1) {
    warnings.push(
      "Perusahaan ini beda subsektor, jadi angka seperti PER dan PBV kurang adil dibandingkan langsung (tiap industri punya kisaran wajar berbeda).",
    );
  }
  if (rows.some((r) => symbols.some((s) => r.values[s] === null))) {
    warnings.push("Sebagian data tidak tersedia dari sumbernya; metrik itu tidak ikut dinilai.");
  }

  return { symbols, companies, rows, warnings, unavailable };
}

/** Ambil laporan 2-4 perusahaan secara paralel lalu bandingkan. */
export async function compareCompanies(symbolsIn: string[]): Promise<Comparison> {
  const symbols = [...new Set(symbolsIn.map(normalizeSymbol))];
  if (symbols.length < 2 || symbols.length > 4) {
    throw new SectorsError(400, "Pilih 2 sampai 4 perusahaan untuk dibandingkan.");
  }

  const settled = await Promise.allSettled(symbols.map((s) => getCompanyReport(s, [...COMPARE_SECTIONS])));

  const reports: Record<string, Json> = {};
  const unavailable: Comparison["unavailable"] = [];
  settled.forEach((res, i) => {
    if (res.status === "fulfilled") reports[symbols[i]] = res.value;
    else unavailable.push({ symbol: symbols[i], reason: res.reason instanceof Error ? res.reason.message : "gagal diambil" });
  });

  if (Object.keys(reports).length < 2) {
    throw new SectorsError(404, `Data tidak cukup untuk membandingkan. ${unavailable.map((u) => `${u.symbol}: ${u.reason}`).join("; ")}`);
  }
  return buildComparison(reports, unavailable);
}
