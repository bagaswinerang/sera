import { tool } from "ai";
import { z } from "zod";
import {
  getTopMovers,
  MOVER_CLASSES,
  MOVER_PERIODS,
} from "../../integrations/sectors/endpoints";
import { slimMovers } from "../../services/movers.service";
import { safe } from "./safe";

export const getMarketMoversTool = tool({
  description:
    "Saham yang paling naik/turun (top gainers/losers) di BEI. Biaya = jumlah classifications x periods kredit, jadi minta SEDIKIT saja (default: gainers+losers, periode 1d = 2 kredit). Pakai untuk 'saham apa yang naik hari ini?'. Data masa lalu, bukan rekomendasi.",
  inputSchema: z.object({
    classifications: z
      .array(z.enum(MOVER_CLASSES))
      .min(1)
      .max(2)
      .default(["top_gainers", "top_losers"]),
    periods: z
      .array(z.enum(MOVER_PERIODS))
      .min(1)
      .max(2)
      .default(["1d"])
      .describe("Maksimal 2 periode untuk hemat kredit"),
    sub_sector: z
      .string()
      .optional()
      .describe("Slug subsektor kebab-case, contoh: banks"),
    n_stock: z.number().int().min(1).max(10).default(5),
  }),
  execute: async ({ classifications, periods, sub_sector, n_stock }) =>
    safe(async () =>
      slimMovers(
        await getTopMovers({
          classifications,
          periods,
          subSector: sub_sector,
          nStock: n_stock,
        }),
      ),
    ),
});
