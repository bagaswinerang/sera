import express from "express";
import cors from "cors";
import type { ChatDeps } from "./controllers/chat.controller";
import { createRoutes } from "./routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";

export function createApp(opts: ChatDeps & {
  /** origin frontend, boleh beberapa dipisah koma: "http://localhost:3000,https://sera.vercel.app" */
  frontendOrigin: string;
  /** nyalakan jika di belakang proxy hosting, supaya req.ip = IP user asli */
  trustProxy?: boolean;
}) {
  const app = express();
  if (opts.trustProxy) app.set("trust proxy", 1);
  app.use(cors({ origin: opts.frontendOrigin.split(",").map((s) => s.trim()) }));
  app.use(createRoutes({ getModel: opts.getModel }));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
