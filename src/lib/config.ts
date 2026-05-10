// Resolve the API + WS base URLs. In development we use the Vite proxy
// (so we can call `/api` directly with no CORS dance). In production, set
// `VITE_API_URL` (e.g. https://api.neurotrade.com) and `VITE_WS_URL`
// (wss://api.neurotrade.com/ws) to point at the deployed backend.
const env = import.meta.env;

export const API_URL = (env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export const WS_URL = (() => {
  if (env.VITE_WS_URL) return env.VITE_WS_URL as string;
  if (typeof window === "undefined") return "ws://localhost:4000/ws";
  // In dev with Vite proxy, hit the backend directly on :4000.
  // In production, prefer same-origin /ws via reverse proxy.
  const isDev = env.DEV;
  if (isDev) return "ws://localhost:4000/ws";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws`;
})();
