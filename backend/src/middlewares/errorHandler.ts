import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
};

// Menangkap error dari middleware (JSON rusak, body kebesaran) dan error tak terduga.
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err?.status ?? err?.statusCode;
  if (status === 413) return void res.status(413).json({ error: "Body terlalu besar." });
  if (status === 400) return void res.status(400).json({ error: "Body harus JSON." });
  console.error("[server error]", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
};
