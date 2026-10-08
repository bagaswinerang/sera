import { tool } from "ai";
import { z } from "zod";
import { compareCompanies } from "../../services/compare.service";
import { safe } from "./safe";
import { symbolSchema } from "./schemas";

export const compareCompaniesTool = tool({
  description:
    "Bandingkan 2-4 perusahaan pada ukuran, valuasi (PER, PBV), ROE, pertumbuhan laba, dan dividen. Pemenang tiap metrik dihitung oleh kode, bukan oleh kamu. Hasil otomatis tampil sebagai tabel di layar user. Biaya sekitar 4 kredit per perusahaan (hemat jika sudah ada di cache).",
  inputSchema: z.object({
    symbols: z.array(symbolSchema).min(2).max(4).describe("2-4 kode saham, misal ['BBCA','BBRI']"),
  }),
  execute: async ({ symbols }) => safe(() => compareCompanies(symbols)),
});
