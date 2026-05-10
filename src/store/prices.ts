import { create } from "zustand";
import type { WSPriceTick, WSStatus } from "@/lib/ws";

export interface PriceEntry extends WSPriceTick {
  prevPrice?: number;
  flash?: "up" | "down" | null;
  flashUntil?: number;
}

interface PricesState {
  prices: Record<string, PriceEntry>;
  status: WSStatus;
  applySnapshot: (ticks: WSPriceTick[]) => void;
  applyTicks: (ticks: WSPriceTick[]) => void;
  setStatus: (s: WSStatus) => void;
}

const FLASH_MS = 700;

export const usePrices = create<PricesState>((set) => ({
  prices: {},
  status: "idle",

  applySnapshot: (ticks) =>
    set(() => ({
      prices: Object.fromEntries(ticks.map((t) => [t.symbol, t])),
    })),

  applyTicks: (ticks) =>
    set((state) => {
      if (ticks.length === 0) return state;
      const next: Record<string, PriceEntry> = { ...state.prices };
      const now = Date.now();
      for (const t of ticks) {
        const prev = next[t.symbol];
        const prevPrice = prev?.price;
        let flash: PriceEntry["flash"] = null;
        if (prevPrice !== undefined && prevPrice !== t.price) {
          flash = t.price > prevPrice ? "up" : "down";
        }
        next[t.symbol] = {
          ...t,
          prevPrice,
          flash,
          flashUntil: flash ? now + FLASH_MS : undefined,
        };
      }
      return { prices: next };
    }),

  setStatus: (status) => set({ status }),
}));
