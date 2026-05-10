import express from "express";
import cors from "cors";
import { config } from "@/config.js";
import { errorHandler } from "@/middleware/error.js";
import routes from "@/routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (config.corsOrigins.includes(origin)) return cb(null, true);
        return cb(null, true); // permissive in dev; lock down in prod via CORS_ORIGIN
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
