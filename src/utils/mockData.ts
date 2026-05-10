// Deterministic mock data for the entire experience.
// Pseudo-random generator so visuals stay stable across renders.

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Asset = {
  symbol: string;
  name: string;
  price: number;
  change: number; // %
  volume: string;
  marketCap: string;
  sector: string;
  series: number[]; // sparkline
  ai: { score: number; signal: "BUY" | "SELL" | "HOLD"; confidence: number };
};

function makeSeries(seed: number, points = 48, base = 100, vol = 0.04): number[] {
  const rand = mulberry32(seed);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.48) * vol * base;
    v = Math.max(base * 0.5, v + drift);
    out.push(+v.toFixed(2));
  }
  return out;
}

export const ASSETS: Asset[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 1184.32,
    change: 3.84,
    volume: "48.2M",
    marketCap: "2.91T",
    sector: "Semiconductors",
    series: makeSeries(11, 48, 1184, 0.06),
    ai: { score: 94, signal: "BUY", confidence: 92 },
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 232.18,
    change: 0.62,
    volume: "62.1M",
    marketCap: "3.51T",
    sector: "Consumer Tech",
    series: makeSeries(2, 48, 232, 0.025),
    ai: { score: 71, signal: "HOLD", confidence: 64 },
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 271.04,
    change: -2.41,
    volume: "91.4M",
    marketCap: "863B",
    sector: "Mobility",
    series: makeSeries(3, 48, 271, 0.07),
    ai: { score: 58, signal: "HOLD", confidence: 55 },
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 438.71,
    change: 1.12,
    volume: "21.7M",
    marketCap: "3.26T",
    sector: "Cloud / AI",
    series: makeSeries(4, 48, 438, 0.022),
    ai: { score: 88, signal: "BUY", confidence: 81 },
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 612.55,
    change: 2.07,
    volume: "14.0M",
    marketCap: "1.55T",
    sector: "Social / AI",
    series: makeSeries(5, 48, 612, 0.035),
    ai: { score: 83, signal: "BUY", confidence: 76 },
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 184.27,
    change: 0.91,
    volume: "19.6M",
    marketCap: "2.27T",
    sector: "Cloud / AI",
    series: makeSeries(6, 48, 184, 0.025),
    ai: { score: 79, signal: "BUY", confidence: 70 },
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    price: 218.42,
    change: -0.43,
    volume: "33.8M",
    marketCap: "2.28T",
    sector: "E-Commerce / Cloud",
    series: makeSeries(7, 48, 218, 0.03),
    ai: { score: 74, signal: "HOLD", confidence: 66 },
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 96284.0,
    change: 1.85,
    volume: "31.2B",
    marketCap: "1.91T",
    sector: "Crypto",
    series: makeSeries(8, 48, 96284, 0.04),
    ai: { score: 81, signal: "BUY", confidence: 73 },
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3412.55,
    change: -1.20,
    volume: "14.6B",
    marketCap: "411B",
    sector: "Crypto",
    series: makeSeries(9, 48, 3412, 0.045),
    ai: { score: 67, signal: "HOLD", confidence: 60 },
  },
  {
    symbol: "AMD",
    name: "Advanced Micro",
    price: 156.91,
    change: 4.21,
    volume: "44.3M",
    marketCap: "254B",
    sector: "Semiconductors",
    series: makeSeries(10, 48, 156, 0.06),
    ai: { score: 89, signal: "BUY", confidence: 84 },
  },
];

export const TICKER_TAPE = [
  { sym: "S&P 500", val: "5,742.18", chg: 0.42 },
  { sym: "NASDAQ", val: "18,326.04", chg: 0.81 },
  { sym: "DOW", val: "42,108.55", chg: -0.12 },
  { sym: "VIX", val: "13.22", chg: -2.40 },
  { sym: "DXY", val: "104.31", chg: 0.18 },
  { sym: "10Y", val: "4.182%", chg: -0.04 },
  { sym: "GOLD", val: "2,684.20", chg: 0.65 },
  { sym: "OIL", val: "71.84", chg: -1.10 },
  { sym: "BTC", val: "96,284", chg: 1.85 },
  { sym: "ETH", val: "3,412", chg: -1.20 },
  { sym: "SOL", val: "184.42", chg: 3.24 },
  { sym: "NVDA", val: "1,184.32", chg: 3.84 },
  { sym: "AAPL", val: "232.18", chg: 0.62 },
  { sym: "TSLA", val: "271.04", chg: -2.41 },
];

export type AIInsight = {
  id: string;
  title: string;
  summary: string;
  tag: "ALPHA" | "RISK" | "MACRO" | "ANOMALY";
  confidence: number;
  asset?: string;
};

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: "i1",
    title: "Semiconductor momentum strengthening",
    summary:
      "Cross-asset signal stack flags accelerating breadth in chip names with options skew normalizing. NVDA/AMD showing institutional accumulation across 4 venues.",
    tag: "ALPHA",
    confidence: 92,
    asset: "NVDA",
  },
  {
    id: "i2",
    title: "USDJPY carry unwind risk",
    summary:
      "BoJ rate-path repricing combined with widening 10Y differentials raises tail-risk for JPY-funded longs. Recommend hedge layer or trim exposure.",
    tag: "RISK",
    confidence: 78,
  },
  {
    id: "i3",
    title: "Anomalous flow detected: SPY 0DTE",
    summary:
      "Unusual block prints (3.2σ) with delta-neutral footprint detected on SPY 0DTE call wings. Pattern matches gamma-squeeze precursor (last 6 occurrences: +1.9% next session).",
    tag: "ANOMALY",
    confidence: 84,
  },
  {
    id: "i4",
    title: "Macro regime: Risk-On (mid-cycle)",
    summary:
      "Composite of 32 macro indicators returns Risk-On regime with mid-cycle posture. Equities and credit favored over duration; cyclicals over defensives.",
    tag: "MACRO",
    confidence: 71,
  },
];

export const NEWS_FEED = [
  {
    id: "n1",
    src: "Bloomberg",
    time: "2m",
    title: "Nvidia secures multi-year supply deal with sovereign AI fund",
    sentiment: 0.82,
    tickers: ["NVDA"],
  },
  {
    id: "n2",
    src: "Reuters",
    time: "11m",
    title: "Fed minutes signal patience as inflation continues glide path",
    sentiment: 0.34,
    tickers: ["SPY", "TLT"],
  },
  {
    id: "n3",
    src: "WSJ",
    time: "27m",
    title: "Apple's services revenue accelerates on AI-tier subscriptions",
    sentiment: 0.71,
    tickers: ["AAPL"],
  },
  {
    id: "n4",
    src: "FT",
    time: "44m",
    title: "Tesla delivery cadence misses whisper number; analysts split",
    sentiment: -0.58,
    tickers: ["TSLA"],
  },
  {
    id: "n5",
    src: "CoinDesk",
    time: "1h",
    title: "Spot BTC ETF inflows hit 14-week high as macro tailwinds align",
    sentiment: 0.66,
    tickers: ["BTC"],
  },
  {
    id: "n6",
    src: "Bloomberg",
    time: "2h",
    title: "Mega-cap breadth widens — semis lead, healthcare lags",
    sentiment: 0.41,
    tickers: ["XLK", "XLV"],
  },
];

export const HEATMAP_SECTORS = [
  { name: "Semis", change: 3.42, weight: 18 },
  { name: "AI Infra", change: 2.81, weight: 15 },
  { name: "Software", change: 1.24, weight: 14 },
  { name: "Cloud", change: 0.91, weight: 12 },
  { name: "Mobility", change: -1.22, weight: 9 },
  { name: "Energy", change: -0.81, weight: 8 },
  { name: "Healthcare", change: -0.34, weight: 8 },
  { name: "Financials", change: 0.42, weight: 8 },
  { name: "Crypto", change: 1.85, weight: 8 },
];

export const PORTFOLIO_HOLDINGS = [
  { sym: "NVDA", weight: 22, pnl: 18.4 },
  { sym: "MSFT", weight: 14, pnl: 9.1 },
  { sym: "AAPL", weight: 12, pnl: 4.2 },
  { sym: "META", weight: 9, pnl: 12.6 },
  { sym: "GOOGL", weight: 8, pnl: 6.3 },
  { sym: "BTC", weight: 12, pnl: 24.1 },
  { sym: "ETH", weight: 6, pnl: -3.4 },
  { sym: "TSLA", weight: 7, pnl: -8.7 },
  { sym: "AMD", weight: 6, pnl: 21.3 },
  { sym: "Cash", weight: 4, pnl: 0 },
];

export const STRATEGY_NODES = [
  { id: "s1", label: "Universe", type: "input", desc: "S&P 500 + Top 50 Crypto" },
  { id: "s2", label: "Momentum 20D", type: "factor", desc: "Z-score > 1.2" },
  { id: "s3", label: "AI Sentiment", type: "factor", desc: "NLP score > 0.6" },
  { id: "s4", label: "Volatility Filter", type: "filter", desc: "ATR < 4%" },
  { id: "s5", label: "Risk Engine", type: "risk", desc: "Position sizing · 0.5R" },
  { id: "s6", label: "Execution", type: "exec", desc: "TWAP · 30m slice" },
];

export const PERFORMANCE_SERIES = makeSeries(99, 90, 100, 0.025).map((v, i) => {
  // bias upward
  return +(v + i * 0.45).toFixed(2);
});

export const BENCHMARK_SERIES = makeSeries(77, 90, 100, 0.022).map((v, i) => {
  return +(v + i * 0.18).toFixed(2);
});

export const KPIS = [
  { label: "AUM", value: "$2.84B", delta: "+12.4%", positive: true },
  { label: "Sharpe", value: "2.81", delta: "+0.42", positive: true },
  { label: "Max DD", value: "-6.2%", delta: "vs -18% SPY", positive: true },
  { label: "Win Rate", value: "67.4%", delta: "+3.1%", positive: true },
];

export const COMMAND_PALETTE = [
  { k: "/buy", desc: "Place a buy order with AI risk-sizing", group: "Trade" },
  { k: "/sell", desc: "Reduce or close a position", group: "Trade" },
  { k: "/hedge", desc: "Auto-build a hedge for a holding", group: "Trade" },
  { k: "/scan", desc: "Run a multi-factor scan across the universe", group: "AI" },
  { k: "/explain", desc: "Explain a price move using attribution model", group: "AI" },
  { k: "/backtest", desc: "Backtest a natural-language strategy", group: "AI" },
  { k: "/watchlist", desc: "Open or modify a watchlist", group: "Workspace" },
  { k: "/news", desc: "Surface high-impact news for tickers", group: "Workspace" },
  { k: "/regime", desc: "Show macro regime + posture recommendation", group: "Macro" },
];
