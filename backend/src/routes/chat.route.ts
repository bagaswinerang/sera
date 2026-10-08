import express, { Router } from "express";
import { chatController, type ChatDeps } from "../controllers/chat.controller";
import { rateLimit } from "../middlewares/rateLimit";

export function createChatRoute(deps: ChatDeps) {
  const router = Router();
  // urutan: batasi dulu, baru baca body, lalu controller
  router.post("/", rateLimit(), express.json({ limit: "1mb" }), chatController(deps));
  return router;
}
