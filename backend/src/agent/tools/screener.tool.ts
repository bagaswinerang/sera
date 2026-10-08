import { tool } from "ai";
import { z } from "zod";
import { screenCompanies } from "../../integrations/sectors/endpoints";
import { safe } from "./safe";

export const screenCompaniesTool = tool({
  description:
    "Cari/saring perusahaan IDX (mis. 'bank terbesar', 'dividen tinggi'). Hasil: daftar symbol + nama. Utamakan `where` + `order_by` (1 kredit); `q` bahasa natural (3 kredit) hanya jika terpaksa. Ikuti panduan di instruksi sistem untuk nama field.",
  inputSchema: z.object({
    where: z.string().optional().describe("Kondisi gaya SQL, contoh: sub_sector like '%bank%' and yield_ttm > 0.04"),
    order_by: z.string().optional().describe("Urutan, awalan - untuk menurun. Contoh: -market_cap"),
    q: z.string().optional().describe("Pertanyaan bahasa natural (3 kredit). Abaikan jika where diisi."),
    limit: z.number().int().min(1).max(20).default(5),
  }),
  execute: async ({ where, order_by, q, limit }) =>
    safe(async () => {
      const r = await screenCompanies({ where, orderBy: order_by, q, limit });
      return {
        results: r.results,
        total_count: r.pagination?.total_count,
        interpreted_as: r.llm_translation?.translated_params,
        note: r.llm_translation?.message ?? undefined,
      };
    }),
});
