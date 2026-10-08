"use client";

import { Sparkles } from "lucide-react";

type Props = {
  questions: string[];
  onSend: (text: string) => void;
};

export function SuggestedPrompts({ questions, onSend }: Props) {
  if (!questions || questions.length === 0) return null;

  return (
    <div
      className="mt-2 flex flex-col gap-2 sera-animate-fade-in"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground ml-1">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>Saran Pertanyaan Lainnya</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSend(q)}
            className="sera-glass rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-[13px] text-foreground transition-all duration-200 hover:scale-105 hover:bg-primary/10 hover:text-primary active:scale-95 text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
