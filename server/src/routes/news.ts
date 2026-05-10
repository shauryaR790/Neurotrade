import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { marketData } from "@/services/marketData.js";

const router = Router();

/**
 * For the prototype we synthesize news headlines from current price action
 * (rather than wiring an external news API) so the feed always feels alive.
 * Swap for newsapi.org / Alpaca news in production.
 */
const TEMPLATES = [
  { src: "Bloomberg", up: "{sym} accelerates as institutional flows return", down: "{sym} pulls back; analysts split on near-term path" },
  { src: "Reuters", up: "{sym} rallies on macro tailwinds and improving breadth", down: "{sym} slips as risk appetite fades" },
  { src: "WSJ", up: "{sym} extends gains; AI-tier demand stronger than expected", down: "{sym} gives back gains amid sector rotation" },
  { src: "FT", up: "{sym} climbs to multi-month highs as buyers absorb supply", down: "{sym} tests support after recent run-up" },
  { src: "CoinDesk", up: "{sym} surges on ETF inflow strength", down: "{sym} cools as funding rates normalize" },
];

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const prices = marketData.getAllPrices();
    const sorted = [...prices].sort(
      (a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)
    );
    const headlines = sorted.slice(0, 6).map((p, i) => {
      const t = TEMPLATES[i % TEMPLATES.length];
      const up = p.change24h >= 0;
      return {
        id: `news_${p.symbol}_${i}`,
        src: t.src,
        time: `${Math.max(2, i * 7 + 2)}m`,
        title: (up ? t.up : t.down).replace("{sym}", p.symbol),
        sentiment: +(Math.tanh(p.change24h / 3)).toFixed(2),
        tickers: [p.symbol],
      };
    });
    res.json({ headlines });
  })
);

export default router;
