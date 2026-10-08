"use client";

import { TrendingUp, BookOpen, BarChart3, Scale, Flame } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const SUGGESTIONS: { text: string; icon: ReactNode; desc: string }[] = [
  {
    text: "Apa itu PER & PBV saham?",
    icon: <BookOpen className="h-4 w-4 text-primary" aria-hidden />,
    desc: "Valuasi dasar untuk pemula",
  },
  {
    text: "Jelasin prospek BBCA dong",
    icon: <TrendingUp className="h-4 w-4 text-primary" aria-hidden />,
    desc: "Analisis fundamental & teknikal",
  },
  {
    text: "Bandingin BBCA vs BBRI",
    icon: <Scale className="h-4 w-4 text-accent" aria-hidden />,
    desc: "Duel perbankan raksasa IHSG",
  },
  {
    text: "Bagaimana cara baca Candlestick?",
    icon: <BarChart3 className="h-4 w-4 text-accent" aria-hidden />,
    desc: "Membaca formasi chart & reversal",
  },
];

export function SuggestionChips({ onPick }: { onPick: (text: string) => void }) {
  const [logoSrc, setLogoSrc] = useState<string>("/logo-trans.webp");

  useEffect(() => {
    fetch("/api/set-active-logo")
      .then((res) => res.json())
      .then((data) => {
        if (data?.activeMeta?.transUrl) {
          setLogoSrc(data.activeMeta.transUrl);
        } else if (data?.activeMeta?.iconUrl) {
          setLogoSrc(data.activeMeta.iconUrl);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      {/* Clean Minimalist Hero Logo Badge */}
      <div className="sera-animate-scale-in mb-4">
        <div className="w-14 h-14 rounded-2xl bg-card border border-border/80 shadow-sm flex items-center justify-center p-2.5 mx-auto transition-transform duration-200 hover:scale-105 hover:border-primary/40">
          <img
            src={logoSrc}
            alt="Sera AI"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-3 sera-animate-fade-up">
        <Flame className="w-3.5 h-3.5 text-primary" />
        <span>AI Saham Indonesia</span>
      </div>

      <h1 className="sera-animate-fade-up text-2xl font-black tracking-tight sm:text-4xl bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
        Bingung baca saham? Tanya Sera aja.
      </h1>
      <p
        className="sera-animate-fade-up mt-2.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed"
        style={{ animationDelay: "80ms" }}
      >
        Sera mengambil data pasar modal Indonesia (IDX) lalu menjelaskannya dengan bahasa
        sehari-hari — praktis, akurat, dan tanpa jargon rumit.
      </p>

      {/* Suggestion Cards Grid with sleek Hitam-Oren-Merah accents */}
      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg sera-stagger">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            type="button"
            onClick={() => onPick(s.text)}
            className="sera-card-hover group flex items-center gap-3 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/40 hover:bg-card p-3 text-left text-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 sera-glass"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/80 border border-border/60 text-muted-foreground transition-all group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/10">
              {s.icon}
            </span>
            <div className="min-w-0">
              <span className="font-bold text-foreground text-xs sm:text-sm block truncate group-hover:text-primary transition-colors">
                {s.text}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate">
                {s.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
