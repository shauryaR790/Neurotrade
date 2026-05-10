import { JSONFilePreset } from "lowdb/node";
import path from "node:path";
import fs from "node:fs";
import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";

/* ============================================================
   Domain types
   ============================================================ */

export type Side = "BUY" | "SELL";
export type AssetClass = "crypto" | "stock";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  cashBalance: number;
}

export interface AssetRecord {
  symbol: string; // e.g. "BTC", "NVDA"
  name: string;
  class: AssetClass;
  binanceSymbol?: string; // for live crypto, e.g. "BTCUSDT"
  basePrice: number; // anchor for stocks simulator / fallback
  sector: string;
}

export interface WatchlistEntry {
  id: string;
  userId: string;
  symbol: string;
  createdAt: number;
}

export interface Holding {
  id: string;
  userId: string;
  symbol: string;
  quantity: number;
  avgCost: number;
  updatedAt: number;
}

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
  notional: number;
  fee: number;
  createdAt: number;
}

export interface AlertRecord {
  id: string;
  userId: string;
  symbol: string;
  condition: "above" | "below";
  price: number;
  triggeredAt?: number;
  createdAt: number;
}

export interface DBSchema {
  users: UserRecord[];
  assets: AssetRecord[];
  watchlist: WatchlistEntry[];
  holdings: Holding[];
  trades: Trade[];
  alerts: AlertRecord[];
  meta: { version: number; seededAt?: number };
}

const defaultData: DBSchema = {
  users: [],
  assets: [],
  watchlist: [],
  holdings: [],
  trades: [],
  alerts: [],
  meta: { version: 1 },
};

/* ============================================================
   Init
   ============================================================ */

const dataFile = path.resolve(config.data.file);
const dataDir = path.dirname(dataFile);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = await JSONFilePreset<DBSchema>(dataFile, defaultData);

logger.info("db", `loaded ${dataFile}`, {
  users: db.data.users.length,
  assets: db.data.assets.length,
});

/* ============================================================
   Tiny id generator (sufficient for prototype scale)
   ============================================================ */
export const newId = (prefix = "id"): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
