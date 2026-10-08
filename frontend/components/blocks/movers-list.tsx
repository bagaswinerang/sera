import { TrendingDown, TrendingUp } from "lucide-react";
import type { MoversOutput } from "@/types/tools";
import { formatDate, formatNumber, formatRatio } from "@/lib/format";
import { cn } from "@/lib/utils";

type Data = Exclude<MoversOutput, { error: string }>;

const CLASS_LABEL = {
  top_gainers: "Paling naik",
  top_losers: "Paling turun",
} as const;
const PERIOD_LABEL: Record<string, string> = {
  "1d": "1 hari",
  "7d": "7 hari",
  "14d": "14 hari",
  "30d": "30 hari",
  "365d": "1 tahun",
};

export function MoversList({
  data,
  onSend,
}: {
  data: Data;
  onSend: (text: string) => void;
}) {
  const groups = (["top_gainers", "top_losers"] as const).flatMap((cls) =>
    Object.entries(data.movers?.[cls] ?? {}).map(([period, rows]) => ({
      cls,
      period,
      rows,
    })),
  );

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        Belum ada data pergerakan saham.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {groups.map(({ cls, period, rows }) => {
        const up = cls === "top_gainers";
        const Icon = up ? TrendingUp : TrendingDown;
        return (
          <section
            key={`${cls}-${period}`}
            aria-label={`${CLASS_LABEL[cls]} ${PERIOD_LABEL[period] ?? period}`}
            className="sera-animate-scale-in rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm"
          >
            <div className="mb-1 flex items-center gap-1.5 px-1 text-sm font-semibold">
              <Icon
                className={cn(
                  "h-4 w-4",
                  up ? "text-success" : "text-destructive",
                )}
                aria-hidden
              />
              {CLASS_LABEL[cls]} · {PERIOD_LABEL[period] ?? period}
            </div>
            <ul className="divide-y divide-border/60">
              {rows.map((r) => (
                <li key={r.symbol}>
                  <button
                    type="button"
                    onClick={() => onSend(`Jelasin ${r.symbol}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-2 text-left transition hover:bg-secondary/60"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {r.symbol}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {r.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span
                        className={cn(
                          "block text-sm font-semibold",
                          up ? "text-success" : "text-destructive",
                        )}
                      >
                        {r.price_change >= 0 ? "+" : "-"}
                        {formatRatio(Math.abs(r.price_change))}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Rp {formatNumber(r.last_close_price, 0)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {rows[0]?.latest_close_date && (
              <p className="px-1 pt-1 text-[11px] text-muted-foreground">
                Data per {formatDate(rows[0].latest_close_date)}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
