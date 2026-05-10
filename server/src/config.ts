import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  jwt: {
    secret: process.env.JWT_SECRET ?? "neurotrade_dev_secret_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },

  data: {
    file: process.env.DATA_FILE ?? "./data/neurotrade.json",
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },

  market: {
    binanceWsUrl: process.env.BINANCE_WS_URL ?? "wss://stream.binance.com:9443/ws",
    coingeckoApiUrl: process.env.COINGECKO_API_URL ?? "https://api.coingecko.com/api/v3",
  },
} as const;

export const isProd = config.nodeEnv === "production";
