import type { ScreenerOutput } from "@/types/tools";
import { ChevronRight } from "lucide-react";

type Data = Exclude<ScreenerOutput, { error: string }>;

export function ScreenerList({
  data,
  onSend,
}: {
  data: Data;
  onSend: (text: string) => void;
}) {
  const results = data.results ?? [];

  if (results.length === 0) {
    return (
      <div className="sera-glass rounded-2xl border border-border/60 px-4 py-3 text-sm text-muted-foreground shadow-sm">
        Belum ada perusahaan yang cocok.
      </div>
    );
  }

  return (
    <section
      aria-label="Daftar perusahaan yang cocok"
      className="sera-animate-scale-in rounded-2xl border border-border/60 bg-card/80 p-2 shadow-sm sera-glass"
    >
      <ul className="divide-y divide-border/50 sera-stagger">
        {results.map((r) => (
          <li key={r.symbol}>
            <button
              type="button"
              onClick={() => onSend(`Jelasin ${r.symbol}`)}
              className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {r.symbol.slice(0, 2)}
                </span>
                <div>
                  <span className="text-sm font-semibold">{r.symbol}</span>
                  <span className="ml-2 truncate text-xs text-muted-foreground">{r.company_name}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      {typeof data.total_count === "number" && data.total_count > results.length && (
        <p className="px-3 pb-1 pt-2 text-xs text-muted-foreground">
          Menampilkan {results.length} dari {data.total_count} perusahaan.
        </p>
      )}
    </section>
  );
}
