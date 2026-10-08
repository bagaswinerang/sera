"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp, Square, Sparkles, BarChart2 } from "lucide-react";
import type { Level } from "@/hooks/use-sera";
import { cn } from "@/lib/utils";

const LEVELS: {
  value: Level;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    value: "simple",
    label: "Sederhana",
    icon: <Sparkles className="h-3 w-3 text-primary" aria-hidden />,
    desc: "Bahasa santai & to the point",
  },
  {
    value: "detail",
    label: "Detail",
    icon: <BarChart2 className="h-3 w-3 text-accent" aria-hidden />,
    desc: "Rasio teknikal & fundamental mendalam",
  },
];

type Props = {
  level: Level;
  onLevelChange: (l: Level) => void;
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  /** Pre-fill text from URL query param (e.g. from features page) */
  prefill?: string;
};

export function ChatInput({
  level,
  onLevelChange,
  busy,
  onSend,
  onStop,
  prefill,
}: Props) {
  const [text, setText] = useState("");
  const prefillApplied = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = text.trim().length > 0 && !busy;

  // Pre-fill from URL query param (e.g. /?q=Apa itu PER?)
  useEffect(() => {
    if (prefill && !prefillApplied.current) {
      setText(prefill);
      prefillApplied.current = true;
      // Focus the textarea so user can just press Enter
      setTimeout(() => textareaRef.current?.focus(), 100);
      
      // Bersihkan URL dari query param ?q=... tanpa reload page
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [prefill]);

  function submit() {
    if (!canSend) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-3 pb-3 pt-2">
      {/* Master Clean Floating Input Box */}
      <div className="sera-input-glow flex flex-col rounded-2xl border border-border/80 bg-card/90 sera-glass shadow-lg shadow-black/10 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-[0_4px_24px_-4px_rgba(255,85,0,0.18)]">
        {/* Textarea Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Tanya soal saham BBCA, teknikal IHSG, atau istilah pasar…"
          aria-label="Pertanyaan untuk Sera"
          className="max-h-36 min-h-[46px] w-full resize-none bg-transparent px-3.5 pt-3 pb-1.5 text-sm sm:text-base outline-none field-sizing-content placeholder:text-muted-foreground/60 leading-relaxed text-foreground"
        />

        {/* Integrated Bottom Toolbar INSIDE the Message Box */}
        <div className="flex items-center justify-between border-t border-border/30 px-2.5 py-1.5 bg-black/[0.02] dark:bg-white/[0.02] rounded-b-2xl">
          {/* Sederhana vs Detail Segmented Toggle (Inside Box) */}
          <div
            role="radiogroup"
            aria-label="Mode jawaban"
            className="flex items-center gap-1 p-0.5 rounded-xl bg-secondary/70 border border-border/40"
          >
            {LEVELS.map((l) => {
              const active = level === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onLevelChange(l.value)}
                  title={l.desc}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 select-none",
                    active
                      ? "bg-card text-foreground shadow-sm border border-border/50 shadow-black/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  {l.icon}
                  <span>{l.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: Send / Stop Button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] text-muted-foreground/50 select-none">
              Enter kirim
            </span>

            {busy ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Hentikan jawaban"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-destructive text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Square
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  aria-hidden
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Kirim pertanyaan"
                className="sera-logo-gradient flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 hover:shadow-primary/30 active:scale-95 disabled:opacity-25 disabled:hover:scale-100 disabled:shadow-none"
              >
                <ArrowUp className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Micro Disclaimer (Clean & Minimal) */}
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50 select-none">
        Sera hanya menganalisis data pasar modal
      </p>
    </div>
  );
}
