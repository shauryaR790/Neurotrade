import WebSocket from "ws";
import { EventEmitter } from "node:events";
import { db, type AssetRecord } from "@/database/db.js";
import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";

export interface PriceTick {
  symbol: string;
  price: number;
  change24h: number; // percent
  volume24h?: number;
  ts: number;
}

/**
 * Holds the latest known price for every tradable symbol and emits ticks.
 * Sources:
 *   - Crypto: Binance combined stream of !miniTicker@arr (every second, all symbols)
 *   - Stocks: server-side random-walk drift (deterministic-feeling)
 */
class MarketDataService extends EventEmitter {
  private prices = new Map<string, PriceTick>();
  private cryptoBySymbol = new Map<string, AssetRecord>(); // BINANCE symbol -> asset
  private stockHistory = new Map<string, number[]>(); // sparkline series in memory
  private cryptoHistory = new Map<string, number[]>();
  private ws?: WebSocket;
  private reconnectTimer?: NodeJS.Timeout;
  private stockTimer?: NodeJS.Timeout;
  private historyTimer?: NodeJS.Timeout;
  private started = false;

  start() {
    if (this.started) return;
    this.started = true;

    // Index crypto assets and seed initial prices
    for (const a of db.data.assets) {
      const initial: PriceTick = {
        symbol: a.symbol,
        price: a.basePrice,
        change24h: 0,
        ts: Date.now(),
      };
      this.prices.set(a.symbol, initial);

      // Seed sparkline with a small synthesized history so charts have shape immediately
      const series = Array.from({ length: 48 }, (_, i) => {
        const phase = Math.sin((i / 48) * Math.PI * 2 + Math.random()) * 0.02;
        return +(a.basePrice * (1 + phase + (Math.random() - 0.5) * 0.01)).toFixed(4);
      });
      if (a.class === "crypto") {
        this.cryptoHistory.set(a.symbol, series);
        if (a.binanceSymbol) this.cryptoBySymbol.set(a.binanceSymbol.toLowerCase(), a);
      } else {
        this.stockHistory.set(a.symbol, series);
      }
    }

    this.connectBinance();
    this.startStockSimulator();
    this.startHistoryAppender();
  }

  stop() {
    if (this.ws) this.ws.close();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.stockTimer) clearInterval(this.stockTimer);
    if (this.historyTimer) clearInterval(this.historyTimer);
    this.started = false;
  }

  /* --------------------- Public API --------------------- */

  getPrice(symbol: string): PriceTick | undefined {
    return this.prices.get(symbol.toUpperCase());
  }

  getAllPrices(): PriceTick[] {
    return [...this.prices.values()];
  }

  getSeries(symbol: string): number[] {
    const s = symbol.toUpperCase();
    return this.cryptoHistory.get(s) ?? this.stockHistory.get(s) ?? [];
  }

  /* --------------------- Binance --------------------- */

  private connectBinance() {
    const cryptoAssets = db.data.assets.filter(
      (a) => a.class === "crypto" && a.binanceSymbol
    );
    if (cryptoAssets.length === 0) return;

    // Use combined ticker stream — efficient, single socket
    const streams = cryptoAssets
      .map((a) => `${a.binanceSymbol!.toLowerCase()}@miniTicker`)
      .join("/");
    const url = `${config.market.binanceWsUrl}/${streams}`;

    logger.info("market", `connecting Binance · ${cryptoAssets.length} symbols`);
    this.ws = new WebSocket(url);

    this.ws.on("open", () => logger.info("market", "Binance WS connected"));

    this.ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as {
          s: string; // BTCUSDT
          c: string; // close
          o: string; // open
          v: string; // volume
          E?: number;
        };
        const asset = this.cryptoBySymbol.get(msg.s.toLowerCase());
        if (!asset) return;
        const close = parseFloat(msg.c);
        const open = parseFloat(msg.o);
        const change = open > 0 ? ((close - open) / open) * 100 : 0;
        const tick: PriceTick = {
          symbol: asset.symbol,
          price: close,
          change24h: +change.toFixed(3),
          volume24h: parseFloat(msg.v),
          ts: msg.E ?? Date.now(),
        };
        this.prices.set(asset.symbol, tick);
        this.emit("tick", tick);
      } catch (e) {
        logger.warn("market", "binance parse error", { err: (e as Error).message });
      }
    });

    this.ws.on("close", () => {
      logger.warn("market", "Binance WS closed — reconnecting in 4s");
      this.scheduleReconnect();
    });
    this.ws.on("error", (err) => {
      logger.warn("market", "Binance WS error", { err: err.message });
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connectBinance(), 4000);
  }

  /* --------------------- Stock simulator --------------------- */

  private startStockSimulator() {
    const stockAssets = db.data.assets.filter((a) => a.class === "stock");
    // Update stock prices every 1.5s with realistic drift
    this.stockTimer = setInterval(() => {
      for (const a of stockAssets) {
        const prev = this.prices.get(a.symbol)!;
        // Mean-reverting random walk anchored to basePrice
        const reversion = (a.basePrice - prev.price) * 0.0008;
        const drift = (Math.random() - 0.5) * a.basePrice * 0.0015;
        const next = +(prev.price + drift + reversion).toFixed(4);
        const change24h = +(((next - a.basePrice) / a.basePrice) * 100).toFixed(3);
        const tick: PriceTick = {
          symbol: a.symbol,
          price: next,
          change24h,
          ts: Date.now(),
        };
        this.prices.set(a.symbol, tick);
        this.emit("tick", tick);
      }
    }, 1500);
  }

  /* --------------------- Sparkline appender --------------------- */

  private startHistoryAppender() {
    // Push the latest price into the rolling sparkline every 30s
    this.historyTimer = setInterval(() => {
      for (const a of db.data.assets) {
        const tick = this.prices.get(a.symbol);
        if (!tick) continue;
        const map = a.class === "crypto" ? this.cryptoHistory : this.stockHistory;
        const series = map.get(a.symbol) ?? [];
        series.push(tick.price);
        if (series.length > 96) series.shift();
        map.set(a.symbol, series);
      }
    }, 30_000);
  }
}

export const marketData = new MarketDataService();
