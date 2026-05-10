import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, Plus, Filter, X } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Sparkline from "@/components/ui/Sparkline";
import Badge from "@/components/ui/Badge";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { useWatchlist } from "@/store/watchlist";
import { useAuth } from "@/store/auth";
import { notify } from "@/store/notifications";
import { cn } from "@/utils/cn";

const tabs = ["All", "AI Conviction", "Macro", "Crypto", "Earnings"] as const;

export default function Watchlist() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const allAssets = useLiveAssets();
  const items = useWatchlist((s) => s.items);
  const remove = useWatchlist((s) => s.remove);
  const add = useWatchlist((s) => s.add);
  const user = useAuth((s) => s.user);

  // Filter by tab + watchlist membership
  const ASSETS = (() => {
    const base = items.length > 0
      ? items.map((sym) => allAssets.find((a) => a.symbol === sym)).filter(Boolean) as typeof allAssets
      : allAssets.slice(0, 6);
    if (tab === "Crypto") return base.filter((a) => ["BTC", "ETH", "SOL"].includes(a.symbol));
    if (tab === "AI Conviction") return base.filter((a) => a.ai.signal === "BUY");
    return base;
  })();

  const handleRemove = (sym: string) => {
    remove(sym);
    notify.info("Removed from watchlist", `${sym} dropped from your tracker.`);
  };
  const addSuggestion = () => {
    const candidates = allAssets.filter((a) => !items.includes(a.symbol));
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    add(pick.symbol);
    notify.success("Added to watchlist", `${pick.symbol} is now being tracked.`);
  };
  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Eye className="h-3.5 w-3.5 text-accent-ice" /> Watchlists
            </>
          }
          title={
            <>
              Curated by you.{" "}
              <span className="text-gradient-blue">Augmented by Aurora.</span>
            </>
          }
          description="Composable watchlists with live AI commentary, smart alerts, and one-click drilldown into any asset's full research dossier."
        />

        <GlassCard className="rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[12.5px] transition-colors",
                    t === tab
                      ? "bg-white/[0.08] text-white ring-1 ring-white/15"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] text-white/40 sm:inline">
                {user ? "synced to your account" : "saved locally"} · {items.length} tracked
              </span>
              <button className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[12.5px] text-white/70 hover:bg-white/[0.06]">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
              <button
                onClick={addSuggestion}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-3 text-[12.5px] text-white ring-1 ring-white/10 hover:ring-white/20"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ASSETS.slice(0, 9).map((a, i) => {
              const positive = a.change >= 0;
              return (
                <motion.div
                  key={a.symbol}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-shadow hover:shadow-[0_30px_60px_-20px_rgba(110,168,255,0.4)]"
                >
                  <span className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(110,168,255,0.18),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] text-[10.5px] font-semibold uppercase tracking-wider text-white/85 ring-1 ring-white/10">
                        {a.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[14.5px] font-medium text-white">
                          {a.symbol}
                          <Star className="h-3.5 w-3.5 text-accent-ice" fill="currentColor" />
                        </div>
                        <div className="text-[11.5px] text-white/45">
                          {a.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={positive ? "buy" : "sell"}>
                        {positive ? "+" : ""}
                        {a.change.toFixed(2)}%
                      </Badge>
                      <button
                        onClick={() => handleRemove(a.symbol)}
                        title="Remove from watchlist"
                        className="grid h-7 w-7 place-items-center rounded-md text-white/35 transition-colors hover:bg-white/[0.05] hover:text-accent-rose"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="num text-2xl font-semibold tracking-tight text-white">
                      $
                      {a.price.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-[11px] text-white/45">
                      Vol {a.volume}
                    </div>
                  </div>

                  <div className="mt-2">
                    <Sparkline
                      data={a.series}
                      width={420}
                      height={42}
                      positive={positive}
                      strokeWidth={1.6}
                      className="w-full"
                    />
                  </div>

                  <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                        Aurora note
                      </div>
                      <span className="num text-[10.5px] text-white/45">
                        {a.ai.confidence}% conf.
                      </span>
                    </div>
                    <div className="mt-1 text-[12.5px] leading-relaxed text-white/70">
                      {auroraNote(a.symbol, a.change)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function auroraNote(sym: string, change: number) {
  if (change > 3)
    return `${sym} broke 20-day momentum threshold with rising breadth — typical of phase-2 trend continuation.`;
  if (change > 1)
    return `${sym} compressing into resistance with constructive options skew. Watch for confirmation on volume.`;
  if (change > 0)
    return `Quiet drift on ${sym}; AI factor stack neutral, awaiting catalyst.`;
  if (change > -2)
    return `${sym} pulling back inside trend. Liquidity providers absorbing — no regime break detected.`;
  return `${sym} broke short-term support; risk model suggests trimming or hedging.`;
}
