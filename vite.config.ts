import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const BACKEND = process.env.VITE_BACKEND_URL ?? "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Forward /api → backend (so the frontend can call relative URLs)
      "/api": {
        target: BACKEND,
        changeOrigin: true,
      },
      // Forward /ws → backend (allows same-origin ws connection in some setups)
      "/ws": {
        target: BACKEND.replace(/^http/, "ws"),
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
