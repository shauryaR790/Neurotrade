import { Router } from "express";
import { z } from "zod";
import { db, newId } from "@/database/db.js";
import { hashPassword, verifyPassword } from "@/auth/password.js";
import { signToken } from "@/auth/jwt.js";
import { asyncHandler, HttpError } from "@/utils/asyncHandler.js";
import { requireAuth } from "@/middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1).max(80).optional(),
});

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, password, name } = signupSchema.parse(req.body);
    const existing = db.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) throw new HttpError(409, "Email already registered");

    const passwordHash = await hashPassword(password);
    const user = {
      id: newId("usr"),
      email: email.toLowerCase(),
      name: name ?? email.split("@")[0],
      passwordHash,
      createdAt: Date.now(),
      cashBalance: 100_000, // paper-trading starting balance
    };
    db.data.users.push(user);
    await db.write();

    const token = await signToken({ sub: user.id, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, cashBalance: user.cashBalance },
    });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = db.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) throw new HttpError(401, "Invalid credentials");
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const token = await signToken({ sub: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, cashBalance: user.cashBalance },
    });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = db.data.users.find((u) => u.id === req.userId);
    if (!user) throw new HttpError(404, "User not found");
    res.json({
      user: { id: user.id, email: user.email, name: user.name, cashBalance: user.cashBalance },
    });
  })
);

export default router;
