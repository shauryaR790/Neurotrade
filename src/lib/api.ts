import { API_URL } from "./config";

/* ============================================================
   Types — these mirror the backend responses
   ============================================================ */

export interface User {
  id: string;
  email: string;
  name: string;
  cashBalance: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiAsset {
  symbol: string;
  name: string;
  class: "crypto" | "stock";
  sector: string;
  price: number;
  change24h: number;
  volume24h?: number;
  series: number[];
}

export interface ApiTrade {
  id: string;
  userId: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  notional: number;
  fee: number;
  createdAt: number;
}

export interface ApiHolding {
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
  holdings: ApiHolding[];
}

export interface ApiInsight {
  id: string;
  title: string;
  summary: string;
  tag: "ALPHA" | "RISK" | "MACRO" | "ANOMALY";
  confidence: number;
  asset?: string;
}

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIChatResponse {
  reply: string;
  source: "openai" | "fallback";
  model: string;
  context: { symbols: string[]; summary: string };
  cards?: { title: string; bullets: string[] }[];
  actions?: { label: string; tone: "primary" | "ghost" }[];
}

/* ============================================================
   Token store (singleton, in localStorage)
   ============================================================ */

const TOKEN_KEY = "neurotrade.token";

export const tokenStore = {
  get: (): string | null =>
    typeof localStorage === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/* ============================================================
   Tiny fetch wrapper with auth + error handling
   ============================================================ */

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };
  const token = tokenStore.get();
  if (init.auth !== false && token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch (e) {
    throw new ApiError(0, `Network error: ${(e as Error).message}`);
  }

  const ct = res.headers.get("content-type") ?? "";
  const body: unknown = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && "error" in body
        ? String((body as { error: string }).error)
        : null) ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, msg, body);
  }
  return body as T;
}

/* ============================================================
   Endpoint surface
   ============================================================ */

export const api = {
  health: () => request<{ ok: boolean }>("/health"),

  auth: {
    signup: (email: string, password: string, name?: string) =>
      request<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        auth: false,
      }),
    login: (email: string, password: string) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        auth: false,
      }),
    me: () => request<{ user: User }>("/auth/me"),
  },

  assets: {
    list: () => request<{ assets: ApiAsset[] }>("/assets"),
    get: (symbol: string) =>
      request<{ asset: ApiAsset }>(`/assets/${encodeURIComponent(symbol)}`),
  },

  watchlist: {
    list: () =>
      request<{ items: { id: string; symbol: string; createdAt: number }[] }>(
        "/watchlist"
      ),
    add: (symbol: string) =>
      request("/watchlist", {
        method: "POST",
        body: JSON.stringify({ symbol }),
      }),
    remove: (symbol: string) =>
      request(`/watchlist/${encodeURIComponent(symbol)}`, { method: "DELETE" }),
  },

  portfolio: {
    summary: () => request<PortfolioSummary>("/portfolio"),
  },

  trades: {
    list: () => request<{ trades: ApiTrade[] }>("/trades"),
    place: (symbol: string, side: "BUY" | "SELL", quantity: number) =>
      request<{ trade: ApiTrade }>("/trades", {
        method: "POST",
        body: JSON.stringify({ symbol, side, quantity }),
      }),
  },

  ai: {
    chat: (messages: AIChatMessage[]) =>
      request<AIChatResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
      }),
  },

  news: () =>
    request<{
      headlines: {
        id: string;
        src: string;
        time: string;
        title: string;
        sentiment: number;
        tickers: string[];
      }[];
    }>("/news"),

  insights: () => request<{ insights: ApiInsight[] }>("/insights"),
};
