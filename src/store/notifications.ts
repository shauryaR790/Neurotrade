import { create } from "zustand";

export type ToastTone = "info" | "success" | "warn" | "error" | "ai";

export interface Toast {
  id: string;
  title: string;
  body?: string;
  tone: ToastTone;
  createdAt: number;
  ttl: number;
}

interface NotificationsState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id" | "createdAt" | "ttl"> & { ttl?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const newId = () =>
  `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const useNotifications = create<NotificationsState>((set) => ({
  toasts: [],

  push: (t) => {
    const id = newId();
    const toast: Toast = {
      id,
      title: t.title,
      body: t.body,
      tone: t.tone,
      ttl: t.ttl ?? 4500,
      createdAt: Date.now(),
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (toast.ttl > 0) {
      window.setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
      }, toast.ttl);
    }
    return id;
  },

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/** Convenience helpers */
export const notify = {
  info: (title: string, body?: string) =>
    useNotifications.getState().push({ title, body, tone: "info" }),
  success: (title: string, body?: string) =>
    useNotifications.getState().push({ title, body, tone: "success" }),
  warn: (title: string, body?: string) =>
    useNotifications.getState().push({ title, body, tone: "warn" }),
  error: (title: string, body?: string) =>
    useNotifications.getState().push({ title, body, tone: "error", ttl: 6000 }),
  ai: (title: string, body?: string) =>
    useNotifications.getState().push({ title, body, tone: "ai" }),
};
