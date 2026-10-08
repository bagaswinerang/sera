import { env } from "../../config/env";
import { cacheGet, cacheSet } from "./cache";

const BASE = "https://api.sectors.app";

export class SectorsError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// Penghitung kredit untuk dev/demo (reset tiap server restart).
// Aturan tagihan dari docs Sectors: 2xx = biaya endpoint, 404 = 1 kredit,
// 400/401/403/429/5xx = gratis.
let credits = 0;
export const creditsSpent = () => credits;
export const _resetCredits = () => {
  credits = 0;
};

/** Kode saham IDX: 4 huruf, boleh berakhiran .JK. Validasi di sini supaya
 *  kode ngawur tidak sampai ke API (404 tetap ditagih 1 kredit). */
export function normalizeSymbol(input: string): string {
  const s = String(input).trim().toUpperCase().replace(/\.JK$/, "");
  if (!/^[A-Z]{4}$/.test(s)) {
    throw new SectorsError(
      400,
      `Kode saham "${input}" tidak valid. Pakai 4 huruf, contoh: BBCA.`,
    );
  }
  return s;
}

type Opts = {
  /** biaya kredit jika respons sukses */
  cost: number;
  /** isi untuk mengaktifkan cache; kosongkan jika cache diatur pemanggil */
  ttlSeconds?: number;
};

async function readError(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return j.message ?? j.error ?? JSON.stringify(j);
  } catch {
    return res.statusText;
  }
}

export async function sectorsGet<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  opts: Opts,
): Promise<T> {
  const apiKey = env.sectorsApiKey;
  if (!apiKey)
    throw new SectorsError(500, "SECTORS_API_KEY belum diisi di .env");

  const qs = new URLSearchParams();
  for (const k of Object.keys(params).sort()) {
    const v = params[k];
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  const query = qs.toString().replace(/%2C/g, ","); // koma tetap koma, lebih mudah dibaca di log
  const url = `${BASE}${path}${query ? `?${query}` : ""}`;

  const cacheKey = `GET ${path}?${query}`;
  if (opts.ttlSeconds) {
    const hit = await cacheGet<T>(cacheKey);
    if (hit) return hit;
  }

  // Pengaman anggaran: tolak SEBELUM memanggil API kalau batas CREDIT_BUDGET akan terlampaui.
  const budget = env.creditBudget;
  if (budget && credits + opts.cost > budget) {
    throw new SectorsError(
      429,
      `Anggaran kredit demo (${budget}) hampir habis. Coba lagi nanti.`,
    );
  }

  // Authorization: API key apa adanya (tanpa "Bearer"; itu hanya untuk MCP)
  const res = await fetch(url, {
    headers: { Authorization: apiKey },
    signal: AbortSignal.timeout(20_000),
  });

  if (res.status === 404) credits += 1;
  if (!res.ok) {
    const msg = await readError(res);
    if (res.status === 429)
      throw new SectorsError(
        429,
        "Kuota atau rate limit Sectors habis. Coba lagi nanti.",
      );
    throw new SectorsError(res.status, msg);
  }

  credits += opts.cost;
  const data = (await res.json()) as T;
  if (opts.ttlSeconds) await cacheSet(cacheKey, data, opts.ttlSeconds);
  return data;
}
