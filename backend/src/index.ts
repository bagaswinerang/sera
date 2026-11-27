import { createApp } from "./app";
import { env } from "./config/env";
import { google } from "@ai-sdk/google";
import { getModel } from "./agent/model";

const followUpModel = google(env.followUpModel);

const app = createApp({
  getModel,
  getFollowUpModel: () => followUpModel,
  frontendOrigin: env.frontendOrigin,
  trustProxy: env.trustProxy,
});

app.listen(env.port, () => {
  console.log(`Sera API siap di http://localhost:${env.port}`);
  console.log(`Model (urutan fallback): ${env.geminiModels.join(" > ")}`);
  if (!env.sectorsApiKey) console.warn("PERINGATAN: SECTORS_API_KEY belum diisi.");
});
