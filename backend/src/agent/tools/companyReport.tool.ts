import { tool } from "ai";
import { z } from "zod";
import { getCompanyReport, REPORT_SECTIONS } from "../../integrations/sectors/endpoints";
import { slimReport } from "../../services/slim.service";
import { safe } from "./safe";
import { symbolSchema } from "./schemas";

export const getCompanyReportTool = tool({
  description:
    "Ambil laporan satu perusahaan IDX. Minta HANYA section yang dibutuhkan (tiap section = 1 kredit): overview (profil, harga, kapitalisasi pasar), valuation (PER ke depan, nilai wajar, riwayat PER/PBV), dividend (yield, payout), financials (laba, rasio ROE/margin), peers (pesaing), future (proyeksi analis), management, ownership.",
  inputSchema: z.object({
    symbol: symbolSchema,
    sections: z
      .array(z.enum(REPORT_SECTIONS))
      .min(1)
      .max(4)
      .default(["overview", "valuation"])
      .describe("Section yang diminta. Maksimal 4."),
  }),
  execute: async ({ symbol, sections }) => safe(async () => slimReport(await getCompanyReport(symbol, sections))),
});
