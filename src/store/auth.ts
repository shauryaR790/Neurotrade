import { create } from "zustand";
import { api, tokenStore, type User } from "@/lib/api";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  hydrate: () => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  signout: () => void;
  setCash: (n: number) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  error: null,

  hydrate: async () => {
    const token = tokenStore.get();
    if (!token) {
      set({ status: "ready", user: null });
      return;
    }
    set({ status: "loading" });
    try {
      const { user } = await api.auth.me();
      set({ user, status: "ready", error: null });
    } catch {
      tokenStore.clear();
      set({ user: null, status: "ready" });
    }
  },

  signin: async (email, password) => {
    set({ status: "loading", error: null });
    try {
      const { token, user } = await api.auth.login(email, password);
      tokenStore.set(token);
      set({ user, status: "ready" });
    } catch (e) {
      set({ status: "error", error: (e as Error).message });
      throw e;
    }
  },

  signup: async (email, password, name) => {
    set({ status: "loading", error: null });
    try {
      const { token, user } = await api.auth.signup(email, password, name);
      tokenStore.set(token);
      set({ user, status: "ready" });
    } catch (e) {
      set({ status: "error", error: (e as Error).message });
      throw e;
    }
  },

  signout: () => {
    tokenStore.clear();
    set({ user: null, status: "ready", error: null });
  },

  setCash: (n) =>
    set((s) => (s.user ? { user: { ...s.user, cashBalance: n } } : s)),
}));
