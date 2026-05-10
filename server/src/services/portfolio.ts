import { db, type Holding } from "@/database/db.js";
import { marketData } from "@/services/marketData.js";

export interface HoldingView {
  symbol: string;
  quantity: number;
  avgCost: number;
  marketPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  weight: number;
}

export interface PortfolioSummary {
  cashBalance: number;
  marketValue: number;
  totalEquity: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  holdings: HoldingView[];
}

export function getUserHoldings(userId: string): Holding[] {
  return db.data.holdings.filter((h) => h.userId === userId);
}

export function summarizePortfolio(userId: string): PortfolioSummary {
  const user = db.data.users.find((u) => u.id === userId);
  const cashBalance = user?.cashBalance ?? 0;
  const holdings = getUserHoldings(userId);

  const enriched: HoldingView[] = holdings.map((h) => {
    const tick = marketData.getPrice(h.symbol);
    const marketPrice = tick?.price ?? h.avgCost;
    const marketValue = +(marketPrice * h.quantity).toFixed(2);
    const cost = h.avgCost * h.quantity;
    const unrealizedPnl = +(marketValue - cost).toFixed(2);
    const unrealizedPnlPct = cost > 0 ? +((unrealizedPnl / cost) * 100).toFixed(2) : 0;
    return {
      symbol: h.symbol,
      quantity: h.quantity,
      avgCost: h.avgCost,
      marketPrice,
      marketValue,
      unrealizedPnl,
      unrealizedPnlPct,
      weight: 0,
    };
  });

  const marketValue = +enriched.reduce((s, h) => s + h.marketValue, 0).toFixed(2);
  const totalEquity = +(cashBalance + marketValue).toFixed(2);
  for (const h of enriched) {
    h.weight = totalEquity > 0 ? +((h.marketValue / totalEquity) * 100).toFixed(2) : 0;
  }
  const unrealizedPnl = +enriched.reduce((s, h) => s + h.unrealizedPnl, 0).toFixed(2);
  const cost = enriched.reduce((s, h) => s + h.avgCost * h.quantity, 0);
  const unrealizedPnlPct = cost > 0 ? +((unrealizedPnl / cost) * 100).toFixed(2) : 0;

  return {
    cashBalance,
    marketValue,
    totalEquity,
    unrealizedPnl,
    unrealizedPnlPct,
    holdings: enriched.sort((a, b) => b.marketValue - a.marketValue),
  };
}
