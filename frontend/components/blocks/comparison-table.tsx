"use client";

import { Fragment, useState } from "react";
import { ChevronDown, Trophy, Lightbulb, Info } from "lucide-react";
import type { Comparison } from "@/types/comparison";
import { formatDate, formatMetric } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ComparisonTable({ data }: { data: Comparison }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const symbols = data.symbols ?? [];
  const rows = data.rows ?? [];
  const warnings = data.warnings ?? [];
  const unavailable = data.unavailable ?? [];

  return (
    <section aria-label="Perbandingan perusahaan" className="sera-animate-scale-in flex flex-col gap-2">
      {warnings.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-sm sera-glass">
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <Lightbulb className="h-4 w-4" aria-hidden />
            <span>Catatan Analisis</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[13px] text-muted-foreground">
            {warnings.map((w, i) => (
              <li key={i} className="leading-relaxed">{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/80 sera-glass shadow-sm">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th
                scope="col"
                className="sticky left-0 bg-card/90 backdrop-blur-sm px-3 py-3 text-left text-xs font-medium text-muted-foreground"
              >
                Metrik
              </th>
              {symbols.map((s) => {
                const c = data.companies?.[s];
                return (
                  <th key={s} scope="col" className="px-3 py-3 text-left align-top font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                        {s.slice(0, 2)}
                      </span>
                      <div>
                        <div>{c?.name ?? s}</div>
                        <div className="text-xs font-normal text-muted-foreground">{s}</div>
                      </div>
                    </div>
                    {c?.subSector && (
                      <div className="mt-1 text-xs font-normal text-muted-foreground">{c.subSector}</div>
                    )}
                    {c?.asOf && (
                      <div className="text-xs font-normal text-muted-foreground">
                        Data per {formatDate(c.asOf)}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const open = openKey === row.key;
              return (
                <Fragment key={row.key}>
                  <tr className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30">
                    <th
                      scope="row"
                      className="sticky left-0 bg-card/90 backdrop-blur-sm px-3 py-3 text-left font-medium"
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenKey(open ? null : row.key)}
                        className="inline-flex items-center gap-1 text-left underline decoration-dotted underline-offset-4 hover:text-primary transition-colors"
                      >
                        {row.label}
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")}
                          aria-hidden
                        />
                      </button>
                    </th>
                    {symbols.map((s) => {
                      const winner = row.winners?.includes(s) ?? false;
                      return (
                        <td key={s} className={cn("px-3 py-3 align-top transition-colors", winner && "bg-success/5")}>
                          <div className="font-medium">{formatMetric(row.unit, row.values?.[s])}</div>
                          {winner && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                              <Trophy className="h-3 w-3" aria-hidden />
                              unggul
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {open && (
                    <tr className="border-b border-border/50 bg-secondary/20">
                      <td colSpan={symbols.length + 1} className="px-3 py-2 text-xs text-muted-foreground">
                        {row.hint}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-secondary/30 px-3 py-2.5">
        <div className="flex items-start gap-2 text-xs text-muted-foreground/80">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <div className="flex flex-col gap-1">
            <p>
              Label &quot;unggul&quot; hanya berarti angka tersebut lebih baik pada metrik terkait, 
              bukan rekomendasi investasi.
            </p>
            {unavailable.length > 0 && (
              <p>
                Data gagal dimuat: {unavailable.map((u) => `${u.symbol} (${u.reason})`).join(", ")}.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
