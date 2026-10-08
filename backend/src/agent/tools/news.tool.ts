import { tool } from "ai";
import { z } from "zod";
import { getNews } from "../../integrations/sectors/endpoints";
import { slimNews } from "../../services/news.service";
import { safe } from "./safe";
import { symbolSchema } from "./schemas";

export const getCompanyNewsTool = tool({
  description:
    "Berita terbaru seputar saham IDX (1 kredit). Isi `symbols` (1-4 kode) untuk berita perusahaan, atau `keyword` untuk topik. Ringkas dengan kata-katamu sendiri dan sebut sumbernya. Jangan menyimpulkan beli/jual dari berita.",
  inputSchema: z.object({
    symbols: z.array(symbolSchema).max(4).optional(),
    keyword: z
      .string()
      .max(60)
      .optional()
      .describe("Kata di judul berita, contoh: dividen"),
    limit: z.number().int().min(1).max(10).default(5),
  }),
  execute: async ({ symbols, keyword, limit }) =>
    safe(async () => slimNews(await getNews({ symbols, keyword, limit }))),
});
