import { create } from "zustand";
import { api, type PortfolioSummary } from "@/lib/api";

interface PortfolioState {
  summary: PortfolioSummary | null;
  loading: boolean;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const usePortfolio = create<PortfolioState>((set) => ({
  summary: null,
  loading: false,

  refresh: async () => {
    set({ loading: true });
    try {
      const summary = await api.portfolio.summary();
      set({ summary, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  reset: () => set({ summary: null, loading: false }),
}));
