import type { GlossaryOutput } from "@/types/tools";
import { BookOpen, ChevronDown } from "lucide-react";

export function GlossaryCard({ data }: { data: GlossaryOutput }) {
  if (!data || data.found !== true || !Array.isArray(data.entries)) return null;

  return (
    <div className="flex flex-col gap-2 sera-stagger">
      {data.entries.map((e) => (
        <section
          key={e.term}
          aria-label={`Arti istilah ${e.term}`}
          className="sera-animate-scale-in sera-card-hover rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/20 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
              {e.term}
            </h3>
          </div>
          <p className="mt-2 text-base font-semibold leading-snug">{e.simple}</p>
          {e.example && (
            <p className="sera-glass mt-2 rounded-xl px-3 py-2 text-sm">
              <span className="text-muted-foreground">Contoh:</span> {e.example}
            </p>
          )}
          {e.detail && (
            <details className="mt-2 text-sm group">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
                Penjelasan lengkap
              </summary>
              <p className="mt-2 leading-relaxed text-muted-foreground">{e.detail}</p>
            </details>
          )}
        </section>
      ))}
    </div>
  );
}
