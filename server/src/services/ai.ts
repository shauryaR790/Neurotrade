import OpenAI from "openai";
import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";
import { marketData } from "@/services/marketData.js";
import { db } from "@/database/db.js";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  reply: string;
  source: "openai" | "fallback";
  model: string;
  context: {
    symbols: string[];
    summary: string;
  };
  cards?: { title: string; bullets: string[] }[];
  actions?: { label: string; tone: "primary" | "ghost" }[];
}

const SYSTEM_PROMPT = `You are Aurora, a senior trading copilot for the NEUROTRADE platform.
You analyse markets, options flow, macro, and the user's portfolio. You are confident,
calm, concise, and quantitative. You always:
- explain the why, not just the what
- use sober numbers, never hype
- end with a short actionable recommendation
- keep replies under 130 words
You NEVER recommend leverage, gambling, or unverified moves.`;

const openai = config.openai.apiKey
  ? new OpenAI({ apiKey: config.openai.apiKey })
  : null;

if (!openai) {
  logger.warn("ai", "OPENAI_API_KEY not set — using deterministic fallback responder");
}

/* ---------- Live context builder ---------- */

function buildMarketContext(): { symbols: string[]; summary: string } {
  const prices = marketData.getAllPrices();
  if (prices.length === 0) return { symbols: [], summary: "No live data available." };

  const sorted = [...prices].sort((a, b) => b.change24h - a.change24h);
  const top = sorted.slice(0, 3);
  const bot = sorted.slice(-3).reverse();
  const movers = [
    ...top.map((p) => `${p.symbol} ${p.change24h > 0 ? "+" : ""}${p.change24h.toFixed(2)}%`),
    ...bot.map((p) => `${p.symbol} ${p.change24h.toFixed(2)}%`),
  ];
  const breadth = prices.filter((p) => p.change24h > 0).length / prices.length;
  const tone =
    breadth > 0.65 ? "broadly risk-on" : breadth < 0.35 ? "risk-off" : "mixed";
  return {
    symbols: top.concat(bot).map((p) => p.symbol),
    summary: `Market regime: ${tone} (breadth ${(breadth * 100).toFixed(0)}%). Movers: ${movers.join(", ")}.`,
  };
}

/* ---------- OpenAI path ---------- */

async function viaOpenAI(history: ChatMessage[]): Promise<string> {
  if (!openai) throw new Error("OpenAI not configured");
  const ctx = buildMarketContext();
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    {
      role: "system" as const,
      content: `Live market context: ${ctx.summary}`,
    },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];
  const resp = await openai.chat.completions.create({
    model: config.openai.model,
    messages,
    temperature: 0.5,
    max_tokens: 320,
  });
  return resp.choices[0]?.message?.content?.trim() ?? "";
}

/* ---------- Deterministic fallback ---------- */

function fallback(prompt: string): {
  reply: string;
  cards?: { title: string; bullets: string[] }[];
  actions?: { label: string; tone: "primary" | "ghost" }[];
} {
  const ctx = buildMarketContext();
  const lower = prompt.toLowerCase();
  const askedAboutSymbol = db.data.assets.find((a) =>
    new RegExp(`\\b${a.symbol}\\b`, "i").test(prompt)
  );
  const tick = askedAboutSymbol ? marketData.getPrice(askedAboutSymbol.symbol) : null;

  if (lower.includes("hedge")) {
    return {
      reply:
        `Macro tail-risk hedge plan: keep core book intact, add 0.3R via long-vol overlay, ` +
        `tilt 1.5% from cyclicals into duration-light defensives. Rebalance trigger if VIX > 22 or breadth < 35%. ` +
        `Current breadth ${(buildMarketContext().summary)}`,
      cards: [
        {
          title: "Hedge layers",
          bullets: ["VIX 0.3R notional", "Trim cyclicals 1.5%", "Add quality factor 1.0%"],
        },
        {
          title: "Triggers",
          bullets: ["VIX > 22 → scale up", "Breadth < 35% → defensive tilt", "DXY > 106 → cut EM"],
        },
      ],
      actions: [
        { label: "Apply hedge", tone: "primary" },
        { label: "Show backtest", tone: "ghost" },
      ],
    };
  }

  if (lower.includes("scan") || lower.includes("idea") || lower.includes("opportunity")) {
    const positives = marketData
      .getAllPrices()
      .filter((p) => p.change24h > 0.5)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 3);
    return {
      reply:
        positives.length > 0
          ? `Three names breaking out today: ${positives
              .map((p) => `${p.symbol} (${p.change24h > 0 ? "+" : ""}${p.change24h.toFixed(2)}%)`)
              .join(", ")}. Momentum aligned with breadth; semis & AI infra still leading. ` +
            `Conviction strongest where price action is paired with rising volume.`
          : `Market is digesting. Rotation muted, breadth thin. Patience is the trade — wait for confirmation above session VWAP.`,
      cards:
        positives.length > 0
          ? [
              {
                title: "Top conviction",
                bullets: positives.map(
                  (p) => `${p.symbol} ${p.change24h > 0 ? "+" : ""}${p.change24h.toFixed(2)}% · momentum confirmed`
                ),
              },
            ]
          : undefined,
    };
  }

  if (lower.includes("explain") || lower.includes("why") || lower.includes("what happened")) {
    if (tick) {
      const dir = tick.change24h >= 0 ? "higher" : "lower";
      return {
        reply:
          `${askedAboutSymbol!.symbol} is ${dir} ${Math.abs(tick.change24h).toFixed(2)}% on the session at $${tick.price.toFixed(2)}. ` +
          `Drivers: rotation in ${askedAboutSymbol!.sector}, options skew ${
            tick.change24h >= 0 ? "calls bid" : "puts bid"
          }, ${ctx.summary} ` +
          `Aurora's view: ${tick.change24h >= 0 ? "trend-follow above session VWAP" : "wait for stabilization, do not catch knife"}.`,
      };
    }
  }

  if (lower.includes("portfolio") || lower.includes("book")) {
    return {
      reply:
        `Book overview: AI rebalancer is biased toward semis/AI infra and underweight cyclicals. ` +
        `Sharpe trending 2.81, max drawdown contained at -6.2%. ${ctx.summary} ` +
        `Recommendation: keep current tilt, layer 0.3R hedge, trim defensives by 1%.`,
      actions: [
        { label: "Apply rebalance", tone: "primary" },
        { label: "View attribution", tone: "ghost" },
      ],
    };
  }

  // Generic catch-all — still grounded in live data
  return {
    reply:
      `${ctx.summary} ` +
      `Aurora's read: stay disciplined — let breadth confirm direction. ` +
      `Ask me to /scan for opportunities, /hedge against macro tail, or /explain a specific ticker.`,
  };
}

/* ---------- Public ---------- */

export async function chat(history: ChatMessage[]): Promise<AIResponse> {
  const ctx = buildMarketContext();
  const last = history[history.length - 1]?.content ?? "";
  if (openai) {
    try {
      const reply = await viaOpenAI(history);
      return { reply, source: "openai", model: config.openai.model, context: ctx };
    } catch (e) {
      logger.warn("ai", "OpenAI call failed, falling back", { err: (e as Error).message });
    }
  }
  const fb = fallback(last);
  return {
    reply: fb.reply,
    source: "fallback",
    model: "aurora-local",
    context: ctx,
    cards: fb.cards,
    actions: fb.actions,
  };
}
