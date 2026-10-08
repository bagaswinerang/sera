import { cacheGet, cacheSet } from "./cache";
import { normalizeSymbol, sectorsGet, SectorsError } from "./client";
import type { Json } from "./types";

export const REPORT_SECTIONS = [
  "overview",
  "valuation",
  "future",
  "peers",
  "financials",
  "dividend",
  "management",
  "ownership",
] as const;
export type ReportSection = (typeof REPORT_SECTIONS)[number];

const REPORT_TTL = 6 * 3600; // 6 jam
const QUARTERLY_TTL = 12 * 3600; // 12 jam
const SCREENER_TTL = 3 * 3600; // 3 jam

/**
 * GET /v2/company/report/{symbol}/  (1 kredit per section)
 * Cache dilakukan PER SECTION: kalau BBCA/overview sudah ada, hanya section
 * yang belum ada yang diminta ke API.
 */
export async function getCompanyReport(
  symbol: string,
  sections: ReportSection[],
): Promise<Json> {
  const sym = normalizeSymbol(symbol);
  const wanted = [...new Set(sections)].sort();
  const out: Json = { symbol: `${sym}.JK` };
  const missing: ReportSection[] = [];

  for (const s of wanted) {
    const hit = await cacheGet<{ value: unknown; company_name?: string }>(
      `report:${sym}:${s}`,
    );
    if (hit) {
      out[s] = hit.value;
      if (hit.company_name) out.company_name = hit.company_name;
    } else {
      missing.push(s);
    }
  }

  if (missing.length) {
    const data = await sectorsGet<Json>(
      `/v2/company/report/${sym}/`,
      { sections: missing.join(",") },
      { cost: missing.length },
    );
    if (data.company_name) out.company_name = data.company_name;
    for (const s of missing) {
      out[s] = data[s] ?? null;
      await cacheSet(
        `report:${sym}:${s}`,
        { value: data[s] ?? null, company_name: data.company_name },
        REPORT_TTL,
      );
    }
  }
  return out;
}

/**
 * GET /v2/financials/quarterly/{symbol}/  (1 kredit PER KUARTAL yang dikembalikan)
 * n_quarters selalu dikirim dan dibatasi 1..8, supaya tidak pernah menarik semua kuartal.
 */
export async function getQuarterly(
  symbol: string,
  nQuarters = 4,
): Promise<Json[]> {
  const sym = normalizeSymbol(symbol);
  const n = Math.min(Math.max(Math.trunc(nQuarters) || 4, 1), 8);
  return sectorsGet<Json[]>(
    `/v2/financials/quarterly/${sym}/`,
    { n_quarters: n },
    { cost: n, ttlSeconds: QUARTERLY_TTL },
  );
}

/**
 * GET /v2/companies/  (1 kredit untuk where/order_by, 3 kredit untuk q bahasa natural)
 * Utamakan `where` (murah, dan kita yang mengendalikan filternya).
 */
export async function screenCompanies(args: {
  where?: string;
  orderBy?: string;
  q?: string;
  limit?: number;
}): Promise<Json> {
  const limit = Math.min(Math.max(Math.trunc(args.limit ?? 10) || 10, 1), 20);
  if (args.where) {
    return sectorsGet<Json>(
      "/v2/companies/",
      {
        where: args.where,
        order_by: args.orderBy ?? "-market_cap",
        limit,
        include_query_values: true,
      },
      { cost: 1, ttlSeconds: SCREENER_TTL },
    );
  }
  if (args.q) {
    return sectorsGet<Json>(
      "/v2/companies/",
      { q: args.q, include_query_values: true },
      { cost: 3, ttlSeconds: SCREENER_TTL },
    );
  }
  throw new SectorsError(400, "Isi `where` (disarankan) atau `q`.");
}

// ───────────────────────── Tambahan: harga, berita, dividen, top movers ─────────────────────────
// Path, parameter, dan biaya diverifikasi dari docs.sectors.app (halaman .md tiap endpoint).

const DAILY_TTL = 3 * 3600; // 3 jam
const NEWS_TTL = 30 * 60; // 30 menit
const ACTIONS_TTL = 12 * 3600; // 12 jam
const MOVERS_TTL = 30 * 60; // 30 menit

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(Math.trunc(n) || lo, lo), hi);
// UTC dipakai sengaja: tanggal UTC tidak pernah lebih maju dari tanggal WIB, jadi `end` tidak jadi "tanggal masa depan" (400).
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** GET /v2/daily/{symbol}/  (1 kredit; maksimal 90 hari; close/open/high/low/volume/market_cap) */
export async function getDailyPrices(
  symbol: string,
  days = 30,
): Promise<Json[]> {
  const sym = normalizeSymbol(symbol);
  const n = clamp(days, 5, 90);
  const end = new Date();
  const start = new Date(end.getTime() - n * 86_400_000);
  return sectorsGet<Json[]>(
    `/v2/daily/${sym}/`,
    { start: isoDay(start), end: isoDay(end) },
    { cost: 1, ttlSeconds: DAILY_TTL },
  );
}

/** GET /v2/news/  (1 kredit; extension=idx; filter symbols/keyword; limit maks 30, kita batasi 10) */
export async function getNews(args: {
  symbols?: string[];
  keyword?: string;
  limit?: number;
}): Promise<Json> {
  const symbols = args.symbols?.length
    ? [...new Set(args.symbols.map(normalizeSymbol))].slice(0, 4).join(",")
    : undefined;
  const keyword = args.keyword?.trim().slice(0, 60) || undefined;
  if (!symbols && !keyword)
    throw new SectorsError(400, "Isi `symbols` atau `keyword`.");
  return sectorsGet<Json>(
    "/v2/news/",
    {
      extension: "idx",
      symbols,
      keyword,
      limit: clamp(args.limit ?? 5, 1, 10),
    },
    { cost: 1, ttlSeconds: NEWS_TTL },
  );
}

/** GET /v2/company/corporate-actions/{symbol}/  (1 kredit; dividen, split, rights, AGM) */
export async function getCorporateActions(symbol: string): Promise<Json> {
  const sym = normalizeSymbol(symbol);
  return sectorsGet<Json>(
    `/v2/company/corporate-actions/${sym}/`,
    {},
    { cost: 1, ttlSeconds: ACTIONS_TTL },
  );
}

export const MOVER_CLASSES = ["top_gainers", "top_losers"] as const;
export const MOVER_PERIODS = ["1d", "7d", "14d", "30d", "365d"] as const;
export type MoverClass = (typeof MOVER_CLASSES)[number];
export type MoverPeriod = (typeof MOVER_PERIODS)[number];

/**
 * GET /v2/companies/top-changes/
 * BIAYA = 1 kredit per (classification x period). Default API = 2 x 5 = 10 kredit!
 * Karena itu kita SELALU kirim classifications & periods eksplisit (default kita: 2 x 1 = 2 kredit).
 * API hanya menyertakan perusahaan dengan market cap >= 5.000 miliar Rp (min_mcap_billion, default API).
 */
export async function getTopMovers(args: {
  classifications?: MoverClass[];
  periods?: MoverPeriod[];
  subSector?: string;
  nStock?: number;
}): Promise<Json> {
  const classes = args.classifications?.length
    ? [...new Set(args.classifications)]
    : [...MOVER_CLASSES];
  const periods = args.periods?.length
    ? [...new Set(args.periods)]
    : (["1d"] as MoverPeriod[]);
  const sub =
    args.subSector && /^[a-z0-9-]{2,60}$/.test(args.subSector)
      ? args.subSector
      : undefined;
  return sectorsGet<Json>(
    "/v2/companies/top-changes/",
    {
      classifications: classes.join(","),
      periods: periods.join(","),
      n_stock: clamp(args.nStock ?? 5, 1, 10),
      sub_sector: sub,
    },
    { cost: classes.length * periods.length, ttlSeconds: MOVERS_TTL },
  );
}
