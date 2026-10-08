export type MetricUnit = "idr" | "x" | "ratio"; // ratio = desimal, 0.05 = 5%
export type MetricDirection = "high" | "low"; // high = makin besar makin unggul

export type Comparison = {
  symbols: string[];
  companies: Record<
    string,
    { name: string | null; subSector: string | null; asOf: string | null }
  >;
  rows: {
    key: string;
    label: string;
    hint: string; // arti metrik dalam bahasa awam
    unit: MetricUnit;
    better: MetricDirection;
    values: Record<string, number | null>; // null = data tidak tersedia
    winners: string[] | null; // null = tidak bisa dibandingkan
  }[];
  warnings: string[];
  unavailable: { symbol: string; reason: string }[];
};
