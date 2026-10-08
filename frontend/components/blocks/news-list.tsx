import { ExternalLink, Newspaper } from "lucide-react";
import type { NewsOutput } from "@/types/tools";
import { formatDate } from "@/lib/format";

type Data = Exclude<NewsOutput, { error: string }>;

const isHttp = (u: string) => /^https?:\/\//i.test(u);

export function NewsList({ data }: { data: Data }) {
  const articles = data.articles ?? [];

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        Belum ada berita yang cocok.
      </div>
    );
  }

  return (
    <section
      aria-label="Berita terbaru"
      className="sera-animate-scale-in flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm"
    >
      <div className="flex items-center gap-2 px-1">
        <Newspaper className="h-4 w-4 text-primary" aria-hidden />
        <h3 className="text-sm font-semibold">Berita terbaru</h3>
      </div>
      <ul className="divide-y divide-border/60">
        {articles.map((a, i) => (
          <li key={`${a.source}-${i}`} className="px-1 py-2.5">
            {isHttp(a.source) ? (
              <a
                href={a.source}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-start gap-1.5 text-sm font-medium leading-snug hover:text-primary"
              >
                <span>{a.title}</span>
                <ExternalLink
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60"
                  aria-hidden
                />
              </a>
            ) : (
              <span className="text-sm font-medium leading-snug">
                {a.title}
              </span>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>{formatDate(a.timestamp?.slice(0, 10))}</span>
              {a.symbols?.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-secondary px-2 py-0.5 font-medium text-foreground"
                >
                  {s}
                </span>
              ))}
              {a.tags?.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
