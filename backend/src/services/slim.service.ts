import type { Json } from "../integrations/sectors/types";

// Respons Sectors penuh dengan field null. Sebelum dikirim ke LLM, dibersihkan
// dan dipangkas supaya hemat token dan tidak membingungkan model.

export function compact(v: unknown): unknown {
  if (v === null || v === undefined) return undefined;
  if (Array.isArray(v)) {
    const arr = v.map(compact).filter((x) => x !== undefined);
    return arr.length ? arr : undefined;
  }
  if (typeof v === "object") {
    const o: Json = {};
    for (const [k, val] of Object.entries(v as Json)) {
      const c = compact(val);
      if (c !== undefined) o[k] = c;
    }
    return Object.keys(o).length ? o : undefined;
  }
  return v;
}

/** ambil n elemen dengan `year` terbaru */
export function latestByYear(list: unknown, n: number): Json[] {
  if (!Array.isArray(list)) return [];
  return [...list]
    .filter((x) => x && typeof x === "object")
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, n);
}

export function slimReport(report: Json): Json {
  const r: Json = { ...report };

  if (r.valuation) {
    r.valuation = { ...r.valuation, historical_valuation: latestByYear(r.valuation.historical_valuation, 3) };
  }
  if (r.financials) {
    r.financials = {
      ...r.financials,
      historical_financials: latestByYear(r.financials.historical_financials, 3),
      historical_financial_ratio: latestByYear(r.financials.historical_financial_ratio, 3),
    };
  }
  if (r.overview) {
    // buang bagian yang tidak berguna untuk penjelasan awam
    const { address, phone, email, website, all_time_price, ...rest } = r.overview;
    void address; void phone; void email; void website; void all_time_price;
    r.overview = rest;
  }
  if (Array.isArray(r.peers)) {
    const companies = r.peers[0]?.peers_data?.companies;
    r.peers = Array.isArray(companies)
      ? companies.slice(0, 6).map((c: Json) => ({
          symbol: c.symbol,
          company_name: c.company_name,
          pe_ttm: c.pe_ttm,
          pb_mrq: c.pb_mrq,
          market_cap: c.market_cap,
        }))
      : undefined;
  }
  if (r.ownership) {
    r.ownership = { major_shareholders: Array.isArray(r.ownership.major_shareholders) ? r.ownership.major_shareholders.slice(0, 5) : undefined };
  }
  return (compact(r) as Json) ?? {};
}
