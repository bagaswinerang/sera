import { tool } from "ai";
import { z } from "zod";

export const suggestFollowUpTool = tool({
  description: "Tampilkan saran pertanyaan lanjutan (maksimal 3) kepada user di akhir jawaban. Gunakan ini SETELAH selesai menjawab pertanyaan.",
  inputSchema: z.object({
    questions: z
      .array(z.string().describe("Pertanyaan lanjutan yang sangat relevan dan menarik untuk ditanyakan user"))
      .max(3)
      .describe("Daftar pertanyaan lanjutan. Maksimal 3 pertanyaan."),
  }),
  execute: async ({ questions }) => {
    return { questions };
  },
});
