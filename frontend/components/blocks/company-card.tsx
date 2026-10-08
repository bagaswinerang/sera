import type { CompanyReportOutput } from "@/types/tools";
import {
  formatDate,
  formatIdr,
  formatMultiple,
  formatRatio,
} from "@/lib/format";
import { Building2, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";

type Data = Exclude<CompanyReportOutput, { error: string }>;

const has = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

type MetricItem = { label: string; value: string; icon: ReactNode };

export function CompanyCard({ data }: { data: Data }) {
  const items: MetricItem[] = [];

  if (has(data.overview?.market_cap))
    items.push({
      label: "Kapitalisasi pasar",
      value: formatIdr(data.overview?.market_cap),
      icon: <Building2 className="h-3.5 w-3.5" aria-hidden />,
    });
  if (has(data.valuation?.forward_pe))
    items.push({
      label: "PER ke depan",
      value: formatMultiple(data.valuation?.forward_pe),
      icon: <TrendingUp className="h-3.5 w-3.5" aria-hidden />,
    });
  if (has(data.dividend?.yield_ttm))
    items.push({
      label: "Yield dividen",
      value: formatRatio(data.dividend?.yield_ttm),
      icon: <Wallet className="h-3.5 w-3.5" aria-hidden />,
    });
  if (has(data.financials?.yoy_quarter_earnings_growth))
    items.push({
      label: "Pertumbuhan laba (tahunan)",
      value: formatRatio(data.financials?.yoy_quarter_earnings_growth),
      icon: <BarChart3 className="h-3.5 w-3.5" aria-hidden />,
    });

  const title = data.company_name ?? data.symbol;
  if (!title && items.length === 0) return null;

  return (
    <section
      aria-label="Angka kunci perusahaan"
      className="sera-animate-scale-in sera-card-hover flex flex-col gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/30 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="sera-logo-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm">
          {(data.symbol ?? "?").slice(0, 2)}
        </div>
        <div>
          <h3 className="text-base font-bold">
            {title}
            {data.symbol && data.company_name ? (
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {data.symbol}
              </span>
            ) : null}
          </h3>
          <p className="text-xs text-muted-foreground">
            {[
              data.overview?.sub_sector,
              data.overview?.latest_close_date
                ? `Data per ${formatDate(data.overview.latest_close_date)}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sera-stagger">
          {items.map((it) => (
            <div key={it.label} className="sera-glass rounded-xl px-3 py-2.5 transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {it.icon}
                {it.label}
              </div>
              <div className="mt-1 text-base font-semibold">{it.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Angka kunci belum tersedia.
        </p>
      )}
    </section>
  );
}
