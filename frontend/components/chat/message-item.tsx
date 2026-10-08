"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Check, Copy, RotateCcw } from "lucide-react";
import { isToolUIPart, type UIMessage } from "ai";
import { StepTracker } from "./step-tracker";
import { ToolPart } from "@/components/blocks/tool-part";
import type { ToolPartT } from "@/lib/tool-part";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const mdComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  h1: ({ children }) => <h3 className="mb-2 mt-3 text-base font-bold">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-3 text-base font-bold">{children}</h3>,
  h3: ({ children }) => <h3 className="mb-2 mt-3 text-base font-bold">{children}</h3>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.9em] font-mono">
      {children}
    </code>
  ),
};

type Props = {
  message: UIMessage;
  isLast: boolean;
  busy: boolean;
  onSend: (text: string) => void;
  onRegenerate: () => void;
};

export function MessageItem({ message, isLast, busy, onSend, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

  if (message.role === "user") {
    return (
      <div className="flex justify-end sera-animate-slide-left">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-r from-primary via-primary to-accent px-4 py-2.5 text-[15px] font-medium text-white shadow-md shadow-primary/20">
          {text}
        </div>
      </div>
    );
  }

  const toolParts = message.parts.filter(isToolUIPart) as unknown as ToolPartT[];

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard tidak tersedia, abaikan
    }
  }

  return (
    <div className="flex flex-col gap-3 sera-animate-slide-right">
      <StepTracker parts={toolParts} />
      {toolParts.map((part, i) => (
        <ToolPart key={i} part={part} onSend={onSend} />
      ))}
      {text && (
        <div className="sera-glass rounded-2xl rounded-bl-md border border-border/60 px-4 py-3 text-[15px] shadow-sm">
          <ReactMarkdown components={mdComponents} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{text}</ReactMarkdown>
        </div>
      )}
      {/* Fix #2: Sembunyikan tombol Salin/Ulangi saat masih streaming */}
      {isLast && !busy && text && message.role === "assistant" && (
        <div className="flex gap-2 sera-animate-fade-in" style={{ animationDelay: "200ms" }}>
          <button
            type="button"
            onClick={copy}
            className="sera-glass inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-105 active:scale-95"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" aria-hidden />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden />
            )}
            {copied ? "Tersalin" : "Salin"}
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="sera-glass inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-105 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Ulangi
          </button>
        </div>
      )}
    </div>
  );
}
