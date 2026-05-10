import http from "node:http";
import { createApp } from "@/app.js";
import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";
import { seedAssets } from "@/database/seed.js";
import { marketData } from "@/services/marketData.js";
import { attachWebSocket } from "@/websocket/server.js";

async function main() {
  await seedAssets();
  marketData.start();

  const app = createApp();
  const server = http.createServer(app);
  attachWebSocket(server);

  server.listen(config.port, () => {
    logger.info("server", `🚀 NEUROTRADE API listening on :${config.port}`);
    logger.info("server", `   REST  → http://localhost:${config.port}/api`);
    logger.info("server", `   WS    → ws://localhost:${config.port}/ws`);
  });

  const shutdown = (signal: string) => {
    logger.info("server", `received ${signal}, shutting down…`);
    marketData.stop();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 8000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error("server", "fatal startup error", { err: (err as Error).message });
  process.exit(1);
});
