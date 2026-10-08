"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuarterlyOutput } from "@/types/tools";
import { NA, formatIdr, formatMonthYear, formatNumber, formatRatio } from "@/lib/format";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Data = Exclude<QuarterlyOutput, { error: string }>;

const SECTOR_LABELS: Record<string, string> = {
  net_interest_income: "Pendapatan bunga bersih",
  gross_loan: "Total kredit",
  total_deposit: "Total simpanan",
};

export function QuarterlyChart({ data }: { data: Data }) {
  const quarters = data.quarters ?? [];
  const chartData = quarters.map((q) => ({
    label: formatMonthYear(q.date),
    earnings: q.earnings ?? undefined,
  }));
  const stability = data.earnings_stability;
  const sector = data.sector_metrics_latest
    ? Object.entries(data.sector_metrics_latest)
    : [];

  return (
    <section
      aria-label="Laba per kuartal"
      className="sera-animate-scale-in flex flex-col gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/30 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Activity className="h-4 w-4" aria-hidden />
        </div>
        <h3 className="text-sm font-semibold">Laba per kuartal</h3>
      </div>

      <div className="h-56 w-full rounded-xl border border-border/40 bg-card/50 p-2 sera-glass">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.4} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              width={64}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => formatIdr(v).replace("Rp ", "")}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v) => [formatIdr(typeof v === "number" ? v : undefined), "Laba"]}
              cursor={{ fill: 'var(--secondary)', opacity: 0.5 }}
              contentStyle={{
                background: "var(--glass)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.1)",
              }}
            />
            <Bar 
              dataKey="earnings" 
              fill="var(--primary)" 
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-medium text-muted-foreground">
          Perubahan laba vs kuartal sebelumnya
        </h4>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sera-stagger">
          {quarters.map((q) => {
            const isPos = q.earnings_change_vs_prev_quarter != null && q.earnings_change_vs_prev_quarter > 0;
            const isNeg = q.earnings_change_vs_prev_quarter != null && q.earnings_change_vs_prev_quarter < 0;
            return (
              <li key={q.date} className="flex flex-col justify-between gap-1 rounded-xl bg-card/60 border border-border/40 p-2.5 shadow-sm">
                <span className="text-[11px] text-muted-foreground">{formatMonthYear(q.date)}</span>
                <div className="flex items-center gap-1.5 font-medium">
                  {isPos ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  ) : isNeg ? (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={cn(
                    isPos ? "text-success" : isNeg ? "text-destructive" : "text-foreground"
                  )}>
                    {formatRatio(q.earnings_change_vs_prev_quarter)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {stability && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Activity className="h-3 w-3" />
          </div>
          <p className="text-muted-foreground">
            Skor kestabilan laba: <strong className="text-foreground">{formatNumber(stability.cv, 2)}</strong> (makin
            kecil makin stabil), dari {stability.quarters_used} kuartal.
          </p>
        </div>
      )}

      {sector.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sera-stagger">
          {sector.map(([key, value]) => (
            <div key={key} className="sera-glass rounded-xl px-3 py-2.5 transition-transform hover:scale-105">
              <div className="text-[11px] text-muted-foreground line-clamp-1">
                {SECTOR_LABELS[key] ?? key.replace(/_/g, " ")}
              </div>
              <div className="mt-1 text-sm font-semibold">
                {typeof value === "number" ? formatIdr(value) : NA}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
