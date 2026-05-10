import { Router } from "express";
import { requireAuth } from "@/middleware/auth.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { summarizePortfolio } from "@/services/portfolio.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(summarizePortfolio(req.userId!));
  })
);

export default router;
