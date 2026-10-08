import type { Comparison } from "./comparison";

export type ToolError = { error: string; status?: number };

// tool-lookup_glossary
export type GlossaryOutput =
  | {
      found: true;
      entries: {
        term: string;
        simple: string;
        detail: string;
        example: string;
      }[];
    }
  | { found: false; hint: string };

// tool-get_company_report: render DEFENSIF, semua field opsional
export type CompanyReportOutput =
  | (Record<string, unknown> & {
      symbol?: string;
      company_name?: string;
      overview?: {
        sub_sector?: string;
        market_cap?: number;
        latest_close_date?: string;
      };
      valuation?: { forward_pe?: number };
      dividend?: {
        yield_ttm?: number;
        dividend_ttm?: number;
        payout_ratio?: number;
      };
      financials?: { yoy_quarter_earnings_growth?: number };
    })
  | ToolError;

// tool-get_quarterly_financials
export type QuarterlyOutput =
  | {
      quarters: {
        date: string;
        revenue: number | null;
        earnings: number | null;
        earnings_change_vs_prev_quarter: number | null;
      }[];
      earnings_stability: { quarters_used: number; cv: number } | null;
      sector_metrics_latest: Record<string, number> | null;
      note: string;
    }
  | ToolError;

// tool-screen_companies
export type ScreenerOutput =
  | {
      results: {
        symbol: string;
        company_name: string;
        query_values?: Record<string, unknown>;
      }[];
      total_count?: number;
      interpreted_as?: unknown;
      note?: string;
    }
  | ToolError;

// tool-compare_companies
export type CompareOutput = Comparison | ToolError;

// tool-get_price_history
export type PriceHistoryOutput =
  | {
      symbol: string;
      points: { date: string; close: number; volume: number | null }[];
      summary: {
        start_date: string;
        end_date: string;
        start_close: number;
        last_close: number;
        change_pct: number | null; // desimal, 0.05 = 5%
        highest_close: number;
        lowest_close: number;
        trading_days: number;
        market_cap_latest: number | null;
      } | null;
      note: string;
    }
  | ToolError;

// tool-get_company_news
export type NewsOutput =
  | {
      articles: {
        title: string;
        source: string; // URL artikel
        timestamp: string; // ISO, contoh 2026-07-09T18:05:00
        symbols: string[];
        tags: string[];
        excerpt?: string; // hanya untuk LLM, jangan ditampilkan penuh
      }[];
      total_count?: number;
      note: string;
    }
  | ToolError;

// tool-get_dividend_history
export type DividendEvent = {
  ex_date?: string;
  payment_date?: string;
  dividend_yield?: number; // desimal
  dividend_amount?: number; // Rupiah per lembar
} & Record<string, unknown>;

export type DividendOutput =
  | {
      symbol: string;
      upcoming_dividend: DividendEvent[];
      dividends: DividendEvent[];
      stock_splits: { date?: string; split_ratio?: number }[];
      latest_agm: Record<string, unknown>[];
      note: string;
    }
  | ToolError;

// tool-get_market_movers
export type MoverRow = {
  symbol: string;
  name: string;
  price_change: number; // desimal, 0.05 = +5%
  last_close_price: number;
  latest_close_date: string;
};

export type MoversOutput =
  | {
      movers: Partial<
        Record<"top_gainers" | "top_losers", Record<string, MoverRow[]>>
      >;
      note: string;
    }
  | ToolError;
