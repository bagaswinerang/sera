import { tool } from "ai";
import { z } from "zod";
import { getDailyPrices } from "../../integrations/sectors/endpoints";
import { summarizePrices } from "../../services/price.service";
import { safe } from "./safe";
import { symbolSchema } from "./schemas";

export const getPriceHistoryTool = tool({
  description:
    "Riwayat harga penutupan harian satu saham IDX (maks 90 hari) plus ringkasan perubahan (dihitung kode). 1 kredit. Pakai untuk 'harga BBCA sebulan terakhir', 'naik atau turun belakangan ini?'. Data masa lalu, BUKAN prediksi.",
  inputSchema: z.object({
    symbol: symbolSchema,
    days: z
      .number()
      .int()
      .min(5)
      .max(90)
      .default(30)
      .describe("Jumlah hari ke belakang (default 30, maks 90)"),
  }),
  execute: async ({ symbol, days }) =>
    safe(async () =>
      summarizePrices(await getDailyPrices(symbol, days), symbol),
    ),
});
