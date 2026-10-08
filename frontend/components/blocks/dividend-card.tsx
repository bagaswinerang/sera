import { CalendarClock } from "lucide-react";
import type { DividendEvent, DividendOutput } from "@/types/tools";
import { NA, formatDate, formatNumber, formatRatio } from "@/lib/format";

type Data = Exclude<DividendOutput, { error: string }>;

const rp = (v: unknown) =>
  typeof v === "number" ? `Rp ${formatNumber(v, 2)}` : NA;

function Row({ e }: { e: DividendEvent }) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-3 py-2">{formatDate(e.ex_date)}</td>
      <td className="px-3 py-2">{formatDate(e.payment_date)}</td>
      <td className="px-3 py-2 font-medium">{rp(e.dividend_amount)}</td>
      <td className="px-3 py-2">{formatRatio(e.dividend_yield)}</td>
    </tr>
  );
}

export function DividendCard({ data }: { data: Data }) {
  const upcoming = data.upcoming_dividend ?? [];
  const history = data.dividends ?? [];

  if (upcoming.length === 0 && history.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        Belum ada data dividen untuk {data.symbol || "saham ini"}.
      </div>
    );
  }

  return (
    <section
      aria-label={`Dividen ${data.symbol}`}
      className="sera-animate-scale-in flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarClock className="h-4 w-4" aria-hidden />
        </div>
        <h3 className="text-sm font-semibold">Dividen {data.symbol}</h3>
      </div>

      {upcoming.length > 0 && (
        <div className="rounded-xl bg-secondary/60 px-3 py-2 text-sm">
          <div className="text-xs font-medium text-muted-foreground">
            Dividen berikutnya
          </div>
          {upcoming.map((e, i) => (
            <div key={i}>
              Cum/ex: {formatDate(e.ex_date)} · dibayar{" "}
              {formatDate(e.payment_date)} · {rp(e.dividend_amount)} per lembar
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th scope="col" className="px-3 py-2 font-medium">
                  Tanggal ex
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Dibayarkan
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Per lembar
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Yield
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((e, i) => (
                <Row key={i} e={e} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tanggal ex = saham mulai diperdagangkan tanpa hak dividen. Riwayat masa
        lalu tidak menjamin dividen berikutnya.
      </p>
    </section>
  );
}
