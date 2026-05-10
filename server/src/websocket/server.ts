import type { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { marketData, type PriceTick } from "@/services/marketData.js";
import { logger } from "@/utils/logger.js";

type ServerMessage =
  | { type: "hello"; ts: number; symbols: number }
  | { type: "snapshot"; prices: PriceTick[] }
  | { type: "tick"; tick: PriceTick }
  | { type: "ticks"; ticks: PriceTick[] }
  | { type: "notification"; title: string; body: string; tone?: string };

type ClientMessage =
  | { type: "ping" }
  | { type: "subscribe"; symbols?: string[] };

interface ClientState {
  socket: WebSocket;
  symbols: Set<string> | null; // null = all
}

export function attachWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Set<ClientState>();

  // Buffer ticks and flush in batches every 250ms — keeps the wire efficient
  const buffered = new Map<string, PriceTick>();
  const flush = () => {
    if (buffered.size === 0) return;
    const ticks = [...buffered.values()];
    buffered.clear();
    const allMsg: ServerMessage = { type: "ticks", ticks };
    const allJson = JSON.stringify(allMsg);
    for (const c of clients) {
      if (c.socket.readyState !== WebSocket.OPEN) continue;
      if (c.symbols === null) {
        c.socket.send(allJson);
      } else {
        const filtered = ticks.filter((t) => c.symbols!.has(t.symbol));
        if (filtered.length === 0) continue;
        c.socket.send(JSON.stringify({ type: "ticks", ticks: filtered } as ServerMessage));
      }
    }
  };
  setInterval(flush, 250);

  marketData.on("tick", (tick: PriceTick) => {
    buffered.set(tick.symbol, tick);
  });

  wss.on("connection", (socket) => {
    const state: ClientState = { socket, symbols: null };
    clients.add(state);
    logger.info("ws", `client connected · ${clients.size} total`);

    const hello: ServerMessage = {
      type: "hello",
      ts: Date.now(),
      symbols: marketData.getAllPrices().length,
    };
    socket.send(JSON.stringify(hello));

    const snapshot: ServerMessage = {
      type: "snapshot",
      prices: marketData.getAllPrices(),
    };
    socket.send(JSON.stringify(snapshot));

    socket.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as ClientMessage;
        if (msg.type === "ping") {
          socket.send(JSON.stringify({ type: "pong", ts: Date.now() }));
        } else if (msg.type === "subscribe") {
          if (!msg.symbols || msg.symbols.length === 0) {
            state.symbols = null;
          } else {
            state.symbols = new Set(msg.symbols.map((s) => s.toUpperCase()));
          }
        }
      } catch {
        // ignore malformed frames
      }
    });

    socket.on("close", () => {
      clients.delete(state);
      logger.info("ws", `client disconnected · ${clients.size} total`);
    });
  });

  return {
    broadcast: (msg: ServerMessage) => {
      const json = JSON.stringify(msg);
      for (const c of clients) {
        if (c.socket.readyState === WebSocket.OPEN) c.socket.send(json);
      }
    },
  };
}
