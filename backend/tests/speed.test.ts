import { test } from "node:test";
import assert from "node:assert/strict";

import { MockLanguageModelV4 } from "ai/test";
import { runAgent } from "../src/agent/agent";

type Part = Record<string, unknown>;
const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
};
const text = (t: string): Part[] => [
  { type: "text-start", id: "t" },
  { type: "text-delta", id: "t", delta: t },
  { type: "text-end", id: "t" },
];
const suggest: Part = {
  type: "tool-call",
  toolCallId: "s1",
  toolName: "suggest_follow_up",
  input: JSON.stringify({ questions: ["Apa itu PBV?"] }),
};

/** Model tiruan: tiap panggilan ke-i mengalirkan steps[i]. */
function scripted(steps: Part[][]) {
  let i = 0;
  return new MockLanguageModelV4({
    doStream: async () => {
      const parts = steps[Math.min(i++, steps.length - 1)];
      const hasTool = parts.some((p) => p.type === "tool-call");
      return {
        stream: new ReadableStream({
          start(c) {
            for (const p of parts) c.enqueue(p as never);
            c.enqueue({ type: "finish", finishReason: { unified: hasTool ? "tool-calls" : "stop", raw: "" }, usage } as never);
            c.close();
          },
        }),
      };
    },
  });
}

async function run(q: string, model: MockLanguageModelV4) {
  const r = await runAgent({ model, messages: [{ id: "u", role: "user", parts: [{ type: "text", text: q }] }] });
  assert.equal(r.type, "ok");
  await r.stream.consumeStream();
}

test("jawaban + suggest_follow_up dalam satu langkah: tidak ada putaran tambahan", async () => {
  const model = scripted([[...text("PER adalah ..."), suggest], text("SEHARUSNYA TIDAK DIPANGGIL")]);
  await run("apa itu PER?", model);
  assert.equal(model.doStreamCalls.length, 1);
});

test("suggest_follow_up dipanggil sebelum jawaban: loop lanjut supaya jawaban tidak hilang", async () => {
  const model = scripted([[suggest], text("PER adalah ...")]);
  await run("apa itu PER?", model);
  assert.equal(model.doStreamCalls.length, 2);
});

test("pertanyaan definisi: kamus disisipkan ke prompt, lookup_glossary tidak ditawarkan", async () => {
  const model = scripted([[...text("ok"), suggest]]);
  await run("apa itu PER dan PBV?", model);
  const call = model.doStreamCalls[0];
  const system = JSON.stringify(call.prompt.find((m) => m.role === "system"));
  assert.match(system, /KAMUS/);
  assert.match(system, /PBV \(Price to Book Value\)/);
  const toolNames = (call.tools ?? []).map((t) => t.name);
  assert.ok(!toolNames.includes("lookup_glossary"));
  assert.ok(toolNames.includes("suggest_follow_up"));
});

test("pertanyaan biasa: lookup_glossary tetap tersedia", async () => {
  const model = scripted([[...text("ok"), suggest]]);
  await run("harga BBCA sebulan terakhir?", model);
  const toolNames = (model.doStreamCalls[0].tools ?? []).map((t) => t.name);
  assert.ok(toolNames.includes("lookup_glossary"));
  assert.doesNotMatch(JSON.stringify(model.doStreamCalls[0].prompt), /KAMUS \(/);
});
