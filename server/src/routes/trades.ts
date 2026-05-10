import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "@/middleware/auth.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { executeOrder, getUserTrades } from "@/services/trades.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const trades = getUserTrades(req.userId!, 100);
    res.json({ trades });
  })
);

const orderSchema = z.object({
  symbol: z.string().min(1).max(16),
  side: z.enum(["BUY", "SELL"]),
  quantity: z.number().positive(),
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = orderSchema.parse(req.body);
    const trade = await executeOrder({ ...input, userId: req.userId! });
    res.status(201).json({ trade });
  })
);

export default router;
