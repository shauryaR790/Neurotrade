import { ArrowDown, ArrowUp } from "lucide-react";
import { TICKER_TAPE } from "@/utils/mockData";
import { cn } from "@/utils/cn";
import { usePrices } from "@/store/prices";
import { useMemo } from "react";

const PRIORITY = ["BTC", "ETH", "SOL", "BNB", "NVDA", "AAPL", "TSLA", "MSFT", "META", "GOOGL", "AMZN", "AMD"];

export default function TickerTape({ className = "" }: { className?: string }) {
  const prices = usePrices((s) => s.prices);

  const items = useMemo(() => {
    const live = PRIORITY.map((sym) => {
      const p = prices[sym];
      if (!p) return null;
      return {
        sym,
        val: p.price.toLocaleString("en-US", {
          maximumFractionDigits: p.price > 100 ? 2 : 4,
        }),
        chg: p.change24h,
      };
    }).filter(Boolean) as { sym: string; val: string; chg: number }[];
    // Fall back to mock data if no live prices yet
    return live.length > 0 ? live : TICKER_TAPE;
  }, [prices]);

  const repeated = [...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-white/[0.06] bg-white/[0.02]",
        className
      )}
    >
      <div className="mask-fade-x">
        <div className="flex w-max animate-ticker gap-10 py-2">
          {repeated.map((it, i) => (
            <div
              key={i}
              className="flex items-center gap-3 whitespace-nowrap text-[12.5px] text-white/80"
            >
              <span className="font-medium tracking-wide text-white/55">
                {it.sym}
              </span>
              <span className="num font-medium text-white">{it.val}</span>
              <span
                className={cn(
                  "num inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px]",
                  it.chg >= 0
                    ? "bg-accent-mint/10 text-accent-mint"
                    : "bg-accent-rose/10 text-accent-rose"
                )}
              >
                {it.chg >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {it.chg >= 0 ? "+" : ""}
                {it.chg.toFixed(2)}%
              </span>
              <span className="text-white/15">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
