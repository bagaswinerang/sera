import { tool } from "ai";
import { z } from "zod";
import { lookupGlossary } from "../../services/glossary.service";

export const lookupGlossaryTool = tool({
  description:
    "Cari penjelasan istilah saham/keuangan (PER, PBV, ROE, dividen, kapitalisasi pasar, laporan kuartalan, dll.). Pakai ini SEBELUM menjelaskan sebuah istilah. Tidak memakai kredit API.",
  inputSchema: z.object({ term: z.string().describe("Istilah yang ditanyakan, misal 'PER'") }),
  execute: async ({ term }) => lookupGlossary(term),
});
