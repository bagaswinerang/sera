import { z } from "zod";

export const symbolSchema = z.string().describe("Kode saham IDX 4 huruf, tanpa .JK. Contoh: BBCA");
