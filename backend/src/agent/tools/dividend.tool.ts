import { tool } from "ai";
import { z } from "zod";
import { getCorporateActions } from "../../integrations/sectors/endpoints";
import { slimActions } from "../../services/actions.service";
import { safe } from "./safe";
import { symbolSchema } from "./schemas";

export const getDividendHistoryTool = tool({
  description:
    "Riwayat dan jadwal dividen satu saham IDX, plus aksi korporasi lain (stock split, RUPS). 1 kredit. Pakai untuk 'kapan BBCA bagi dividen?', 'dividennya berapa?'.",
  inputSchema: z.object({ symbol: symbolSchema }),
  execute: async ({ symbol }) =>
    safe(async () => slimActions(await getCorporateActions(symbol))),
});
