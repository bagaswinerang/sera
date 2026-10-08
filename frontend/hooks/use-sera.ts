"use client";

import { useCallback, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, type UIMessage } from "ai";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export type Level = "simple" | "detail";

export function useSera() {
  const [level, setLevel] = useState<Level>("simple");
  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: `${API_URL}/api/chat`,
      }),
    [],
  );

  const chat = useChat({ transport });
  const { sendMessage: rawSend, regenerate: rawRegenerate, setMessages } = chat;

  const sendMessage = useCallback(
    (message: { text: string }) => rawSend(message, { body: { level } }),
    [rawSend, level],
  );

  const regenerate = useCallback(
    () => rawRegenerate({ body: { level } }),
    [rawRegenerate, level],
  );

  /** Hapus pesan assistant terakhir yang kosong/gagal sebelum retry */
  const cleanRetry = useCallback(() => {
    setMessages((prev) => {
      const cleaned = [...prev];
      while (cleaned.length > 0) {
        const last = cleaned[cleaned.length - 1];
        if (last.role !== "assistant") break;
        // Cek apakah pesan assistant ini kosong (gagal)
        const hasContent = last.parts?.some(
          (p) =>
            (p.type === "text" && p.text?.trim()) ||
            isToolUIPart(p),
        );
        if (!hasContent) {
          cleaned.pop();
        } else {
          break;
        }
      }
      return cleaned;
    });
  }, [setMessages]);

  return {
    ...chat,
    sendMessage,
    regenerate,
    cleanRetry,
    level,
    setLevel,
    busy: chat.status === "submitted" || chat.status === "streaming",
  };
}
