"use client";

import { getToolName } from "ai";
import { asLoose, type ToolPartT } from "@/lib/tool-part";
import type {
  CompanyReportOutput,
  GlossaryOutput,
  QuarterlyOutput,
  ScreenerOutput,
  PriceHistoryOutput,
  NewsOutput,
  DividendOutput,
  MoversOutput,
} from "@/types/tools";
import type { Comparison } from "@/types/comparison";
import { ToolError } from "./tool-error";
import { ComparisonTable } from "./comparison-table";
import { QuarterlyChart } from "./quarterly-chart";
import { CompanyCard } from "./company-card";
import { GlossaryCard } from "./glossary-card";
import { ScreenerList } from "./screener-list";
import { SuggestedPrompts } from "./suggested-prompts";
import { PriceChart } from "./price-chart";
import { NewsList } from "./news-list";
import { DividendCard } from "./dividend-card";
import { MoversList } from "./movers-list";

function BlockSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
    >
      <div className="h-4 w-1/3 rounded-lg sera-shimmer" />
      <div className="h-20 w-full rounded-xl sera-shimmer" />
      <div className="h-4 w-2/3 rounded-lg sera-shimmer" />
    </div>
  );
}

function isErrorOutput(o: unknown): o is { error: string } {
  return typeof o === "object" && o !== null && "error" in o;
}

export function ToolPart({
  part,
  onSend,
}: {
  part: ToolPartT;
  onSend: (text: string) => void;
}) {
  const name = getToolName(part);
  const p = asLoose(part);

  if (p.state === "output-error") return <ToolError message={p.errorText} />;
  if (p.state !== "output-available") return <BlockSkeleton />;

  const output = p.output;
  if (isErrorOutput(output))
    return <ToolError message={String(output.error)} />;

  switch (name) {
    case "compare_companies": {
      const data = output as Comparison;
      if (!Array.isArray(data?.rows)) return null;
      return <ComparisonTable data={data} />;
    }
    case "get_quarterly_financials": {
      const data = output as Exclude<QuarterlyOutput, { error: string }>;
      if (!Array.isArray(data?.quarters)) return null;
      return <QuarterlyChart data={data} />;
    }
    case "get_company_report":
      return (
        <CompanyCard
          data={output as Exclude<CompanyReportOutput, { error: string }>}
        />
      );
    case "lookup_glossary":
      return <GlossaryCard data={output as GlossaryOutput} />;
    case "screen_companies": {
      const data = output as Exclude<ScreenerOutput, { error: string }>;
      if (!Array.isArray(data?.results)) return null;
      return <ScreenerList data={data} onSend={onSend} />;
    }
    case "get_price_history": {
      const data = output as Exclude<PriceHistoryOutput, { error: string }>;
      if (!Array.isArray(data?.points)) return null;
      return <PriceChart data={data} />;
    }
    case "get_company_news": {
      const data = output as Exclude<NewsOutput, { error: string }>;
      if (!Array.isArray(data?.articles)) return null;
      return <NewsList data={data} />;
    }
    case "get_dividend_history": {
      const data = output as Exclude<DividendOutput, { error: string }>;
      if (!Array.isArray(data?.dividends)) return null;
      return <DividendCard data={data} />;
    }
    case "get_market_movers": {
      const data = output as Exclude<MoversOutput, { error: string }>;
      if (typeof data?.movers !== "object" || data.movers === null) return null;
      return <MoversList data={data} onSend={onSend} />;
    }
    case "suggest_follow_up": {
      const data = output as { questions: string[] };
      return <SuggestedPrompts questions={data.questions} onSend={onSend} />;
    }
    default:
      return null;
  }
}
