import type { MetricUnit } from "@/types/comparison";

const LOCALE = "id-ID";
export const NA = "Tidak tersedia";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/** 750e12 -> "Rp 750 T". Satuan: ribu, Jt, M, T. */
export function formatIdr(v: number | null | undefined): string {
  if (!isNum(v)) return NA;
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  const units: [number, string][] = [
    [1e12, "T"],
    [1e9, "M"],
    [1e6, "Jt"],
    [1e3, "ribu"],
  ];
  for (const [size, label] of units) {
    if (abs >= size) {
      const n = abs / size;
      const digits = n >= 100 ? 0 : n >= 10 ? 1 : 2;
      return `${sign}Rp ${n.toLocaleString(LOCALE, {
        maximumFractionDigits: digits,
      })} ${label}`;
    }
  }
  return `${sign}Rp ${abs.toLocaleString(LOCALE, { maximumFractionDigits: 0 })}`;
}

/** 0.058 -> "5,8%" */
export function formatRatio(v: number | null | undefined): string {
  if (!isNum(v)) return NA;
  return `${(v * 100).toLocaleString(LOCALE, { maximumFractionDigits: 1 })}%`;
}

/** 12.8 -> "12,8x" */
export function formatMultiple(v: number | null | undefined): string {
  if (!isNum(v)) return NA;
  return `${v.toLocaleString(LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}x`;
}

export function formatNumber(v: number | null | undefined, digits = 2): string {
  if (!isNum(v)) return NA;
  return v.toLocaleString(LOCALE, { maximumFractionDigits: digits });
}

/** "2026-07-08" -> "8 Jul 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return NA;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}`;
}

/** "2026-03-31" -> "Mar 2026" */
export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return NA;
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}`;
}

export function formatMetric(
  unit: MetricUnit,
  v: number | null | undefined,
): string {
  switch (unit) {
    case "idr":
      return formatIdr(v);
    case "x":
      return formatMultiple(v);
    case "ratio":
      return formatRatio(v);
    default:
      return formatNumber(v);
  }
}
