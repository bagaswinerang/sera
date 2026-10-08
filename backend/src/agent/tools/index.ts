import { lookupGlossaryTool } from "./glossary.tool";
import { getCompanyReportTool } from "./companyReport.tool";
import { getQuarterlyFinancialsTool } from "./quarterly.tool";
import { screenCompaniesTool } from "./screener.tool";
import { compareCompaniesTool } from "./compare.tool";
import { suggestFollowUpTool } from "./suggest.tool";
import { getPriceHistoryTool } from "./priceHistory.tool";
import { getCompanyNewsTool } from "./news.tool";
import { getDividendHistoryTool } from "./dividend.tool";
import { getMarketMoversTool } from "./movers.tool";

// Nama di sini = nama tool yang dilihat Gemini (dan nama part `tool-<nama>` di frontend).
export const tools = {
  lookup_glossary: lookupGlossaryTool,
  get_company_report: getCompanyReportTool,
  get_quarterly_financials: getQuarterlyFinancialsTool,
  screen_companies: screenCompaniesTool,
  compare_companies: compareCompaniesTool,
  suggest_follow_up: suggestFollowUpTool,
  get_price_history: getPriceHistoryTool,
  get_company_news: getCompanyNewsTool,
  get_dividend_history: getDividendHistoryTool,
  get_market_movers: getMarketMoversTool,
};
