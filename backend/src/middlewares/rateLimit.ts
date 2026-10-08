import type { RequestHandler } from "express";

/**
 * Pembatas sederhana per IP (memori server). Melindungi 1.000 kredit dari spam
 * saat demo dibuka publik. Untuk produksi, pakai penyimpanan bersama.
 */
export function rateLimit(
  opts: { max?: number; windowMs?: number } = {},
): RequestHandler {
  const max = opts.max ?? 100;
  const windowMs = opts.windowMs ?? 10 * 60_000;
  const hits = new Map<string, number[]>();

  return (req, res, next) => {
    const key = req.ip ?? "local";
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      hits.set(key, recent);
      res.status(429).json({ error: "SERA_RATE_LIMIT" });
      return;
    }
    recent.push(now);
    hits.set(key, recent);

    if (hits.size > 5000) {
      // buang IP yang sudah lama tidak aktif supaya memori tidak membengkak
      for (const [k, v] of hits)
        if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    next();
  };
}
