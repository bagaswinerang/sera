import { getToolName } from "ai";
import { asLoose, type ToolPartT } from "@/lib/tool-part";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

function sym(v: unknown): string {
  return typeof v === "string" ? v.toUpperCase() : "";
}

function symList(v: unknown): string {
  return Array.isArray(v) ? v.map(sym).filter(Boolean).join(", ") : "";
}

export function stepLabel(part: ToolPartT): string {
  const name = getToolName(part);
  const input = (asLoose(part).input ?? {}) as Record<string, unknown>;
  switch (name) {
    case "lookup_glossary":
      return "Mencari istilah di kamus Sera";
    case "get_company_report":
      return `Mengambil laporan ${sym(input.symbol)}`.trim();
    case "get_quarterly_financials":
      return `Membaca laporan keuangan kuartalan ${sym(input.symbol)}`.trim();
    case "screen_companies":
      return "Mencari perusahaan yang cocok";
    case "compare_companies":
      return `Membandingkan ${symList(input.symbols)}`.trim();
    case "get_price_history":
      return `Melihat riwayat harga ${sym(input.symbol)}`.trim();
    case "get_company_news": {
      const list = symList(input.symbols);
      return list ? `Mencari berita ${list}` : "Mencari berita terbaru";
    }
    case "get_dividend_history":
      return `Memeriksa dividen ${sym(input.symbol)}`.trim();
    case "get_market_movers":
      return "Melihat saham yang paling bergerak";
    default:
      return "Mengolah data";
  }
}

export function StepTracker({ parts }: { parts: ToolPartT[] }) {
  if (parts.length === 0) return null;
  return (
    <ol
      aria-label="Langkah yang dikerjakan Sera"
      className="sera-animate-fade-up sera-glass flex flex-col gap-2 rounded-2xl border border-border/60 px-4 py-3 shadow-sm"
    >
      {parts.map((part, i) => {
        const state = asLoose(part).state;
        const done = state === "output-available";
        const failed = state === "output-error";
        return (
          <li
            key={i}
            className="flex items-center gap-2.5 text-sm"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {done ? (
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-success"
                aria-hidden
              />
            ) : failed ? (
              <XCircle
                className="h-4 w-4 shrink-0 text-destructive"
                aria-hidden
              />
            ) : (
              <Loader2
                className="h-4 w-4 shrink-0 text-primary animate-spin"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "transition-colors duration-300",
                done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {stepLabel(part)}
              {failed ? " (gagal)" : ""}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
