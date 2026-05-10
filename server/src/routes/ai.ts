import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { chat } from "@/services/ai.js";
import { optionalAuth } from "@/middleware/auth.js";

const router = Router();

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(40),
});

router.post(
  "/chat",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { messages } = chatSchema.parse(req.body);
    const response = await chat(messages);
    res.json(response);
  })
);

export default router;
