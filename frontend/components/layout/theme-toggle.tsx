"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Ganti tema terang atau gelap"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="sera-glass inline-flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden />
    </button>
  );
}
