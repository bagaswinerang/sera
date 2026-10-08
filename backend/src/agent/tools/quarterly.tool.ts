import { tool } from "ai";
import { z } from "zod";
import { getQuarterly } from "../../integrations/sectors/endpoints";
import { summarizeQuarterly } from "../../services/quarterly.service";
import { safe } from "./safe";
import { symbolSchema } from "./schemas";

export const getQuarterlyFinancialsTool = tool({
  description:
    "Laporan keuangan per kuartal satu perusahaan: pendapatan, laba bersih, perubahan laba antar kuartal, dan skor kestabilan laba (cv, makin kecil makin stabil). Tiap kuartal = 1 kredit. Pakai untuk 'labanya naik atau turun?' atau 'stabil nggak?'.",
  inputSchema: z.object({
    symbol: symbolSchema,
    n_quarters: z.number().int().min(1).max(8).default(4).describe("Jumlah kuartal terbaru (default 4, maks 8)"),
  }),
  execute: async ({ symbol, n_quarters }) => safe(async () => summarizeQuarterly(await getQuarterly(symbol, n_quarters))),
});
