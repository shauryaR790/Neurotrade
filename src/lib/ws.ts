import { WS_URL } from "./config";

export interface WSPriceTick {
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: number;
  ts: number;
}

type ServerMessage =
  | { type: "hello"; ts: number; symbols: number }
  | { type: "snapshot"; prices: WSPriceTick[] }
  | { type: "tick"; tick: WSPriceTick }
  | { type: "ticks"; ticks: WSPriceTick[] }
  | { type: "pong"; ts: number }
  | { type: "notification"; title: string; body: string; tone?: string };

export type WSStatus = "idle" | "connecting" | "open" | "closed";

type Listener = (msg: ServerMessage) => void;
type StatusListener = (s: WSStatus) => void;

class LiveSocket {
  private ws?: WebSocket;
  private status: WSStatus = "idle";
  private retry = 0;
  private retryTimer?: number;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();

  connect() {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) return;
    this.setStatus("connecting");
    try {
      this.ws = new WebSocket(WS_URL);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.retry = 0;
      this.setStatus("open");
    };
    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as ServerMessage;
        this.listeners.forEach((l) => l(msg));
      } catch {
        // ignore parse errors
      }
    };
    this.ws.onclose = () => {
      this.setStatus("closed");
      this.scheduleReconnect();
    };
    this.ws.onerror = () => {
      // close handler will fire reconnect
    };
  }

  private scheduleReconnect() {
    if (this.retryTimer) return;
    const delay = Math.min(15000, 800 * Math.pow(1.6, this.retry++));
    this.retryTimer = window.setTimeout(() => {
      this.retryTimer = undefined;
      this.connect();
    }, delay);
  }

  private setStatus(s: WSStatus) {
    this.status = s;
    this.statusListeners.forEach((l) => l(s));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: StatusListener): () => void {
    listener(this.status);
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  send(payload: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  close() {
    this.ws?.close();
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }
}

export const liveSocket = new LiveSocket();
