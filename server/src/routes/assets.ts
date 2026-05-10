import { Router } from "express";
import { db } from "@/database/db.js";
import { marketData } from "@/services/marketData.js";
import { asyncHandler, HttpError } from "@/utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const list = db.data.assets.map((a) => {
      const tick = marketData.getPrice(a.symbol);
      return {
        symbol: a.symbol,
        name: a.name,
        class: a.class,
        sector: a.sector,
        price: tick?.price ?? a.basePrice,
        change24h: tick?.change24h ?? 0,
        volume24h: tick?.volume24h,
        series: marketData.getSeries(a.symbol),
      };
    });
    res.json({ assets: list });
  })
);

router.get(
  "/:symbol",
  asyncHandler(async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const asset = db.data.assets.find((a) => a.symbol === symbol);
    if (!asset) throw new HttpError(404, `Unknown symbol: ${symbol}`);
    const tick = marketData.getPrice(asset.symbol);
    res.json({
      asset: {
        ...asset,
        price: tick?.price ?? asset.basePrice,
        change24h: tick?.change24h ?? 0,
        volume24h: tick?.volume24h,
        series: marketData.getSeries(asset.symbol),
      },
    });
  })
);

export default router;
