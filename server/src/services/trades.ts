import { db, newId, type Side, type Trade } from "@/database/db.js";
import { marketData } from "@/services/marketData.js";
import { HttpError } from "@/utils/asyncHandler.js";

const FEE_BPS = 5; // 0.05% paper-trading fee

export interface ExecuteOrderInput {
  userId: string;
  symbol: string;
  side: Side;
  quantity: number;
}

export async function executeOrder(input: ExecuteOrderInput): Promise<Trade> {
  const { userId, side, quantity } = input;
  const symbol = input.symbol.toUpperCase();
  if (quantity <= 0) throw new HttpError(400, "Quantity must be positive");

  const user = db.data.users.find((u) => u.id === userId);
  if (!user) throw new HttpError(404, "User not found");

  const asset = db.data.assets.find((a) => a.symbol === symbol);
  if (!asset) throw new HttpError(404, `Unknown symbol: ${symbol}`);

  const tick = marketData.getPrice(symbol);
  const price = tick?.price ?? asset.basePrice;
  const notional = +(price * quantity).toFixed(2);
  const fee = +((notional * FEE_BPS) / 10000).toFixed(2);

  if (side === "BUY") {
    const totalCost = notional + fee;
    if (user.cashBalance < totalCost) {
      throw new HttpError(400, "Insufficient cash balance for this order");
    }
    user.cashBalance = +(user.cashBalance - totalCost).toFixed(2);
    upsertHolding(userId, symbol, quantity, price);
  } else {
    const holding = db.data.holdings.find(
      (h) => h.userId === userId && h.symbol === symbol
    );
    if (!holding || holding.quantity < quantity) {
      throw new HttpError(400, "Insufficient position to sell");
    }
    holding.quantity = +(holding.quantity - quantity).toFixed(8);
    holding.updatedAt = Date.now();
    if (holding.quantity <= 0.0000001) {
      db.data.holdings = db.data.holdings.filter((h) => h.id !== holding.id);
    }
    user.cashBalance = +(user.cashBalance + (notional - fee)).toFixed(2);
  }

  const trade: Trade = {
    id: newId("trd"),
    userId,
    symbol,
    side,
    quantity,
    price: +price.toFixed(4),
    notional,
    fee,
    createdAt: Date.now(),
  };
  db.data.trades.unshift(trade);
  if (db.data.trades.length > 1000) db.data.trades.length = 1000;

  await db.write();
  return trade;
}

function upsertHolding(userId: string, symbol: string, addQty: number, atPrice: number) {
  const existing = db.data.holdings.find(
    (h) => h.userId === userId && h.symbol === symbol
  );
  if (existing) {
    const totalCost = existing.avgCost * existing.quantity + atPrice * addQty;
    const newQty = +(existing.quantity + addQty).toFixed(8);
    existing.avgCost = +(totalCost / newQty).toFixed(6);
    existing.quantity = newQty;
    existing.updatedAt = Date.now();
  } else {
    db.data.holdings.push({
      id: newId("hld"),
      userId,
      symbol,
      quantity: addQty,
      avgCost: +atPrice.toFixed(6),
      updatedAt: Date.now(),
    });
  }
}

export function getUserTrades(userId: string, limit = 100): Trade[] {
  return db.data.trades.filter((t) => t.userId === userId).slice(0, limit);
}
