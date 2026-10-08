"use client";

import Link from "next/link";
import { Palette, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
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
    <header className="sera-glass border-b border-border/40 sticky top-0 z-50">
      <div className="mx-auto flex h-14 w-full max-w-[760px] items-center justify-between px-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          {/* Minimalist, Clean Logo Container */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card/80 border border-border/70 flex items-center justify-center p-0.5 sm:p-1 transition-all duration-200 group-hover:border-primary/40 group-hover:bg-card shrink-0">
            <img
              src={logoSrc}
              alt="Sera Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight leading-none text-foreground group-hover:text-primary transition-colors">
              Sera
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground leading-none mt-0.5">
              AI Saham Indonesia
            </span>
          </div>
        </Link>

        {/* Mobile & Desktop Navigation Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/features"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-secondary/80 hover:bg-secondary active:scale-95 text-foreground/80 hover:text-foreground border border-border/60 transition-all hover:scale-[1.01] shadow-xs"
            title="Lihat semua fitur & data yang bisa ditanyakan"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              <span className="hidden sm:inline">Panduan </span>Fitur
            </span>
          </Link>
          <Link
            href="/logo"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-secondary/80 hover:bg-secondary active:scale-95 text-foreground/80 hover:text-foreground border border-border/60 transition-all hover:scale-[1.01] shadow-xs"
            title="Lihat Identitas Brand & Logo SERA"
          >
            <Palette className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Logo</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
