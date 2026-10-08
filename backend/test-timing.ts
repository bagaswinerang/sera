import { getModel } from "./src/agent/model";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

async function testTiming() {
  console.log("=== Test Waktu Respons AI (Dengan Timeout Super Cepat) ===\n");

  const model = getModel();
  if (!model) {
    console.error("Model tidak tersedia.");
    return;
  }
  console.log(`Model: ${model.modelId}\n`);

  const messages: UIMessage[] = [
    {
      id: "1",
      role: "user" as const,
      parts: [{ type: "text" as const, text: "Apa itu PER?" }],
    },
  ];

  const startTotal = Date.now();

  try {
    const result = streamText({
      model,
      system: "Kamu Sera, AI asisten saham BEI. Jawab singkat dalam 2 kalimat.",
      messages: await convertToModelMessages(messages),
      temperature: 0,
      maxTokens: 200,
      maxRetries: 1,
    });

    let firstChunkTime: number | null = null;
    let chunks = 0;
    let fullText = "";

    for await (const chunk of result.textStream) {
      if (!firstChunkTime) {
        firstChunkTime = Date.now();
        console.log(`⏱️  Waktu sampai token pertama (TTFT): ${firstChunkTime - startTotal}ms`);
      }
      chunks++;
      fullText += chunk;
    }

    const endTotal = Date.now();
    console.log(`⏱️  Waktu total streaming: ${endTotal - startTotal}ms`);
    console.log(`📦 Jumlah chunk: ${chunks}`);
  } catch (e: any) {
    const endTotal = Date.now();
    console.error(`\n❌ Selesai (atau error) setelah ${endTotal - startTotal}ms`);
    console.error(`Pesan: ${e.message?.slice(0, 300)}`);
  }
}

testTiming().catch(console.error);
