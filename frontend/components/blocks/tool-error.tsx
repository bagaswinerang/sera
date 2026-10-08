import { AlertTriangle } from "lucide-react";

export function ToolError({ message }: { message?: string }) {
  return (
    <div
      role="note"
      className="sera-animate-fade-up flex items-start gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-muted-foreground"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/60" aria-hidden />
      <span>Data belum bisa diambil{message ? `: ${message}` : "."}</span>
    </div>
  );
}
