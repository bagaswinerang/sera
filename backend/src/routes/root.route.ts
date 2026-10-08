import { Router } from "express";
import pkg from "../../package.json";

export const rootRoute = Router();

rootRoute.get("/", (_req, res) => {
  res.json({
    name: "Sera Backend API",
    version: pkg.version,
    endpoints: {
      health: "GET /health",
      chat: "POST /api/chat",
    },
  });
});
