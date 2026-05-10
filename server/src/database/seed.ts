import { db, type AssetRecord } from "@/database/db.js";
import { logger } from "@/utils/logger.js";

const ASSETS: AssetRecord[] = [
  // Crypto — live from Binance
  { symbol: "BTC", name: "Bitcoin", class: "crypto", binanceSymbol: "BTCUSDT", basePrice: 96284, sector: "Crypto" },
  { symbol: "ETH", name: "Ethereum", class: "crypto", binanceSymbol: "ETHUSDT", basePrice: 3412, sector: "Crypto" },
  { symbol: "SOL", name: "Solana", class: "crypto", binanceSymbol: "SOLUSDT", basePrice: 184, sector: "Crypto" },
  { symbol: "BNB", name: "BNB", class: "crypto", binanceSymbol: "BNBUSDT", basePrice: 612, sector: "Crypto" },
  { symbol: "XRP", name: "XRP", class: "crypto", binanceSymbol: "XRPUSDT", basePrice: 2.21, sector: "Crypto" },
  { symbol: "ADA", name: "Cardano", class: "crypto", binanceSymbol: "ADAUSDT", basePrice: 0.92, sector: "Crypto" },
  { symbol: "DOGE", name: "Dogecoin", class: "crypto", binanceSymbol: "DOGEUSDT", basePrice: 0.41, sector: "Crypto" },
  { symbol: "AVAX", name: "Avalanche", class: "crypto", binanceSymbol: "AVAXUSDT", basePrice: 38.4, sector: "Crypto" },

  // Stocks — server-side simulated random walk
  { symbol: "NVDA", name: "NVIDIA Corp.", class: "stock", basePrice: 1184.32, sector: "Semiconductors" },
  { symbol: "AAPL", name: "Apple Inc.", class: "stock", basePrice: 232.18, sector: "Consumer Tech" },
  { symbol: "TSLA", name: "Tesla Inc.", class: "stock", basePrice: 271.04, sector: "Mobility" },
  { symbol: "MSFT", name: "Microsoft Corp.", class: "stock", basePrice: 438.71, sector: "Cloud / AI" },
  { symbol: "META", name: "Meta Platforms", class: "stock", basePrice: 612.55, sector: "Social / AI" },
  { symbol: "GOOGL", name: "Alphabet Inc.", class: "stock", basePrice: 184.27, sector: "Cloud / AI" },
  { symbol: "AMZN", name: "Amazon.com", class: "stock", basePrice: 218.42, sector: "E-Commerce / Cloud" },
  { symbol: "AMD", name: "Advanced Micro", class: "stock", basePrice: 156.91, sector: "Semiconductors" },
];

export async function seedAssets() {
  if (db.data.assets.length === 0) {
    db.data.assets = ASSETS;
    db.data.meta.seededAt = Date.now();
    await db.write();
    logger.info("seed", `inserted ${ASSETS.length} assets`);
  }
}
