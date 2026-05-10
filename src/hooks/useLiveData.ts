import { useEffect } from "react";
import { liveSocket } from "@/lib/ws";
import { usePrices } from "@/store/prices";
import { useAuth } from "@/store/auth";
import { useWatchlist } from "@/store/watchlist";
import { usePortfolio } from "@/store/portfolio";

/**
 * Boots all live data:
 *  - WS connection (prices)
 *  - Auth hydration from token
 *  - Watchlist hydration (server if logged in, else local)
 *  - Portfolio refresh when authed
 */
export function useLiveData() {
  // ---- Auth bootstrap ----
  useEffect(() => {
    useAuth.getState().hydrate();
  }, []);

  // ---- WS price stream ----
  useEffect(() => {
    const { applySnapshot, applyTicks, setStatus } = usePrices.getState();
    const offMsg = liveSocket.subscribe((msg) => {
      if (msg.type === "snapshot") applySnapshot(msg.prices);
      else if (msg.type === "tick") applyTicks([msg.tick]);
      else if (msg.type === "ticks") applyTicks(msg.ticks);
    });
    const offStatus = liveSocket.onStatus((s) => setStatus(s));
    liveSocket.connect();
    return () => {
      offMsg();
      offStatus();
    };
  }, []);

  // ---- Watchlist + portfolio sync to auth ----
  const userId = useAuth((s) => s.user?.id);
  useEffect(() => {
    if (userId) {
      useWatchlist.getState().hydrateFromServer();
      usePortfolio.getState().refresh();
    } else {
      useWatchlist.getState().hydrateFromLocal();
      usePortfolio.getState().reset();
    }
  }, [userId]);

  // Periodically refresh portfolio so PnL keeps moving with prices
  useEffect(() => {
    if (!userId) return;
    const id = window.setInterval(() => {
      usePortfolio.getState().refresh();
    }, 20_000);
    return () => clearInterval(id);
  }, [userId]);
}
