import { Router } from "express";
import type { ChatDeps } from "../controllers/chat.controller";
import { rootRoute } from "./root.route";
import { healthRoute } from "./health.route";
import { createChatRoute } from "./chat.route";

/** Semua route dipasang di sini: GET /, GET /health, POST /api/chat. */
export function createRoutes(deps: ChatDeps) {
  const router = Router();
  router.use("/", rootRoute);
  router.use("/health", healthRoute);
  router.use("/api/chat", createChatRoute(deps));
  return router;
}
