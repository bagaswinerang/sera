"use client";

import { useEffect, useRef } from "react";
import { isToolUIPart, type UIMessage } from "ai";
import { AlertCircle } from "lucide-react";
import { MessageItem } from "./message-item";

type Props = {
  messages: UIMessage[];
  status: string;
  busy: boolean;
  errorText: string;
  onSend: (text: string) => void;
  onRegenerate: () => void;
  onRetry: () => void;
};

/** Cek apakah pesan assistant punya konten yang visible (teks atau tool) */
function hasVisibleContent(m: UIMessage): boolean {
  if (m.role === "user") return true;
  return m.parts?.some(
    (p) =>
      (p.type === "text" && p.text?.trim()) ||
      isToolUIPart(p)
  ) ?? false;
}

export function MessageList({
  messages,
  status,
  busy,
  errorText,
  onSend,
  onRegenerate,
  onRetry,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const prevMsgCount = useRef(messages.length);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Hanya force-stick saat ada pesan baru dari user (pesan bertambah)
    if (messages.length > prevMsgCount.current) {
      const latest = messages[messages.length - 1];
      if (latest?.role === "user") stick.current = true;
    }
    prevMsgCount.current = messages.length;

    if (stick.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Fix #4: Filter pesan assistant kosong (gagal) agar tidak ke-render
  const visibleMessages = messages.filter(hasVisibleContent);

  return (
    <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto sera-scrollbar">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-4 py-6">
        {visibleMessages.map((m, i) => (
          <MessageItem
            key={m.id}
            message={m}
            isLast={i === visibleMessages.length - 1}
            busy={busy}
            onSend={onSend}
            onRegenerate={onRegenerate}
          />
        ))}

        {/* Fix #1: "Sera sedang berpikir…" hanya tampil saat submitted, BUKAN saat streaming */}
        {busy && (
          <div role="status" className="sera-animate-fade-up flex items-center gap-3 py-2">
            <div className="flex items-center gap-1">
              <span
                aria-hidden
                className="sera-typing-dot h-2 w-2 rounded-full bg-primary"
              />
              <span
                aria-hidden
                className="sera-typing-dot h-2 w-2 rounded-full bg-primary"
              />
              <span
                aria-hidden
                className="sera-typing-dot h-2 w-2 rounded-full bg-primary"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              Sera sedang berpikir…
            </span>
          </div>
        )}

        {errorText && (
          <div
            role="alert"
            className="sera-animate-scale-in flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
              <span>{errorText}</span>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="self-start rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
            >
              Coba lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
