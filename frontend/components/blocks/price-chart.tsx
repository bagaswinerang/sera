"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart as LineIcon, TrendingDown, TrendingUp } from "lucide-react";
import type { PriceHistoryOutput } from "@/types/tools";
import { NA, formatDate, formatNumber, formatRatio } from "@/lib/format";
import { cn } from "@/lib/utils";

type Data = Exclude<PriceHistoryOutput, { error: string }>;

const price = (v: number | null | undefined) =>
  typeof v === "number" ? `Rp ${formatNumber(v, 0)}` : NA;

export function PriceChart({ data }: { data: Data }) {
  const points = data.points ?? [];
  const s = data.summary;

  if (points.length < 2 || !s) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        Data harga belum cukup untuk digambar.
      </div>
    );
  }

  const chartData = points.map((p) => ({
    label: formatDate(p.date),
    close: p.close,
  }));
  const change = s.change_pct;
  const up = (change ?? 0) >= 0;
  const Arrow = up ? TrendingUp : TrendingDown;

  const stats: { label: string; value: string }[] = [
    { label: "Penutupan terakhir", value: price(s.last_close) },
    { label: "Tertinggi (penutupan)", value: price(s.highest_close) },
    { label: "Terendah (penutupan)", value: price(s.lowest_close) },
  ];

  return (
    <section
      aria-label={`Harga penutupan ${data.symbol}`}
      className="sera-animate-scale-in flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LineIcon className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold">
              {data.symbol} · harga penutupan
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(s.start_date)} – {formatDate(s.end_date)} (
              {s.trading_days} hari bursa)
            </p>
          </div>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            up
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive",
          )}
        >
          <Arrow className="h-3.5 w-3.5" aria-hidden />
          {change === null
            ? NA
            : `${up ? "+" : "-"}${formatRatio(Math.abs(change))}`}
        </div>
      </div>

      <div className="h-52 w-full rounded-xl border border-border/40 bg-card/50 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={48}
            />
            <YAxis
              width={56}
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => formatNumber(v, 0)}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v) => [
                price(typeof v === "number" ? v : undefined),
                "Penutupan",
              ]}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {stats.map((it) => (
          <div key={it.label} className="rounded-xl bg-secondary/60 px-3 py-2">
            <div className="text-xs text-muted-foreground">{it.label}</div>
            <div className="text-sm font-semibold">{it.value}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Pergerakan harga di masa lalu, bukan prediksi.
      </p>
    </section>
  );
}
