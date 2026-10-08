"use client";

import { useSearchParams } from "next/navigation";
import { useSera } from "@/hooks/use-sera";
import { friendlyError } from "@/lib/errors";
import { Header } from "@/components/layout/header";
import { SuggestionChips } from "./suggestion-chips";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { DisclaimerFooter } from "@/components/layout/disclaimer-footer";

export function ChatView() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("q") ?? "";

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    cleanRetry,
    clearError,
    level,
    setLevel,
    busy,
  } = useSera();

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
  }

  function retry() {
    clearError();
    cleanRetry();
    regenerate();
  }

  return (
    <div className="flex h-dvh flex-col bg-transparent text-foreground relative z-0">
      <Header />

      {messages.length === 0 ? (
        <div className="flex flex-1 overflow-y-auto sera-scrollbar">
          <SuggestionChips onPick={send} />
        </div>
      ) : (
        <MessageList
          messages={messages}
          status={status}
          busy={busy}
          errorText={friendlyError(error)}
          onSend={send}
          onRegenerate={regenerate}
          onRetry={retry}
        />
      )}

      <div className="bg-gradient-to-t from-background via-background/90 to-transparent pt-2">
        <ChatInput
          level={level}
          onLevelChange={setLevel}
          busy={busy}
          onSend={send}
          onStop={stop}
          prefill={prefill}
        />
      </div>
    </div>
  );
}
