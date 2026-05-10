import { create } from "zustand";
import { api } from "@/lib/api";

const LS_KEY = "neurotrade.watchlist";
const DEFAULTS = ["BTC", "ETH", "NVDA", "AAPL", "TSLA", "SOL"];

function loadLocal(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.every((x) => typeof x === "string")) return arr;
  } catch {
    /* noop */
  }
  return DEFAULTS;
}

function saveLocal(items: string[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    /* noop */
  }
}

interface WatchlistState {
  items: string[];
  hydrated: boolean;
  hydrateFromLocal: () => void;
  hydrateFromServer: () => Promise<void>;
  add: (sym: string) => Promise<void>;
  remove: (sym: string) => Promise<void>;
  has: (sym: string) => boolean;
  toggle: (sym: string) => Promise<void>;
}

export const useWatchlist = create<WatchlistState>((set, get) => ({
  items: [],
  hydrated: false,

  hydrateFromLocal: () => set({ items: loadLocal(), hydrated: true }),

  hydrateFromServer: async () => {
    try {
      const { items } = await api.watchlist.list();
      const symbols = items.map((i) => i.symbol);
      set({ items: symbols, hydrated: true });
      saveLocal(symbols);
    } catch {
      // fall back to local
      set({ items: loadLocal(), hydrated: true });
    }
  },

  add: async (sym) => {
    const symbol = sym.toUpperCase();
    if (get().items.includes(symbol)) return;
    const next = [...get().items, symbol];
    set({ items: next });
    saveLocal(next);
    try {
      await api.watchlist.add(symbol);
    } catch {
      /* keep local optimistic update */
    }
  },

  remove: async (sym) => {
    const symbol = sym.toUpperCase();
    const next = get().items.filter((s) => s !== symbol);
    set({ items: next });
    saveLocal(next);
    try {
      await api.watchlist.remove(symbol);
    } catch {
      /* keep local */
    }
  },

  has: (sym) => get().items.includes(sym.toUpperCase()),

  toggle: async (sym) => {
    if (get().has(sym)) await get().remove(sym);
    else await get().add(sym);
  },
}));
