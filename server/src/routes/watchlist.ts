import { Router } from "express";
import { z } from "zod";
import { db, newId } from "@/database/db.js";
import { requireAuth } from "@/middleware/auth.js";
import { asyncHandler, HttpError } from "@/utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = db.data.watchlist.filter((w) => w.userId === req.userId);
    res.json({ items });
  })
);

const addSchema = z.object({ symbol: z.string().min(1).max(16) });

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { symbol } = addSchema.parse(req.body);
    const sym = symbol.toUpperCase();
    if (!db.data.assets.find((a) => a.symbol === sym)) {
      throw new HttpError(400, `Unknown symbol: ${sym}`);
    }
    const exists = db.data.watchlist.find(
      (w) => w.userId === req.userId && w.symbol === sym
    );
    if (exists) return res.json({ item: exists });
    const item = {
      id: newId("wl"),
      userId: req.userId!,
      symbol: sym,
      createdAt: Date.now(),
    };
    db.data.watchlist.push(item);
    await db.write();
    res.status(201).json({ item });
  })
);

router.delete(
  "/:symbol",
  asyncHandler(async (req, res) => {
    const sym = req.params.symbol.toUpperCase();
    const before = db.data.watchlist.length;
    db.data.watchlist = db.data.watchlist.filter(
      (w) => !(w.userId === req.userId && w.symbol === sym)
    );
    if (before !== db.data.watchlist.length) await db.write();
    res.json({ ok: true });
  })
);

export default router;
