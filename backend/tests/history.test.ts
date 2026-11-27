import { test } from "node:test";
import assert from "node:assert/strict";
import type { UIMessage } from "ai";
import { prepareHistory, HISTORY_LIMIT } from "../src/agent/history";
import { extractSessionCompanies } from "../src/agent/session";

const user = (id: string, text: string): UIMessage => ({ id, role: "user", parts: [{ type: "text", text }] });

test("tool call yang selesai dipertahankan, yang menggantung dibuang", () => {
  const assistant = {
    id: "a1",
    role: "assistant",
    parts: [
      { type: "step-start" },
      { type: "tool-compare_companies", toolCallId: "t1", state: "output-available", input: { symbols: ["BBCA", "BBRI"] }, output: {} },
      { type: "tool-get_company_news", toolCallId: "t2", state: "input-available", input: { symbols: ["TLKM"] } },
      { type: "text", text: "BBCA unggul di ROE." },
    ],
  } as unknown as UIMessage;

  const out = prepareHistory([user("u1", "bandingkan BBCA dan BBRI"), assistant]);
  const types = out[1].parts.map((p) => p.type);
  assert.deepEqual(types, ["step-start", "tool-compare_companies", "text"]);
  // memori sesi ("yang tadi") membaca symbol dari tool yang selesai
  assert.deepEqual(extractSessionCompanies(out), ["BBCA", "BBRI"]);
  // input tidak diubah
  assert.equal(assistant.parts.length, 4);
});

test("pesan assistant kosong dibuang, riwayat dibatasi", () => {
  const empty = { id: "a0", role: "assistant", parts: [{ type: "step-start" }] } as unknown as UIMessage;
  assert.equal(prepareHistory([user("u", "hai"), empty]).length, 1);

  const many = Array.from({ length: 25 }, (_, i) => user(`u${i}`, `q${i}`));
  const out = prepareHistory(many);
  assert.equal(out.length, HISTORY_LIMIT);
  assert.equal(out.at(-1)?.id, "u24");
});
