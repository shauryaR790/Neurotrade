import { useMemo } from "react";
import { ASSETS, type Asset } from "@/utils/mockData";
import { usePrices } from "@/store/prices";

/**
 * Returns the asset universe enriched with the latest live prices.
 * If a symbol has no live tick yet, the original mock values are used —
 * so the UI never shows blanks during initial connection.
 */
export function useLiveAssets(): Asset[] {
  const prices = usePrices((s) => s.prices);

  return useMemo(() => {
    return ASSETS.map((a) => {
      const tick = prices[a.symbol];
      if (!tick) return a;
      return {
        ...a,
        price: tick.price,
        change: tick.change24h,
      };
    });
  }, [prices]);
}
