import { Router } from "express";
import authRoutes from "./auth.js";
import assetRoutes from "./assets.js";
import watchlistRoutes from "./watchlist.js";
import portfolioRoutes from "./portfolio.js";
import tradesRoutes from "./trades.js";
import aiRoutes from "./ai.js";
import newsRoutes from "./news.js";
import insightsRoutes from "./insights.js";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({ ok: true, ts: Date.now(), service: "neurotrade-api" })
);

router.use("/auth", authRoutes);
router.use("/assets", assetRoutes);
router.use("/watchlist", watchlistRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/trades", tradesRoutes);
router.use("/ai", aiRoutes);
router.use("/news", newsRoutes);
router.use("/insights", insightsRoutes);

export default router;
