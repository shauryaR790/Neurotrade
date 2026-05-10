import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, LineChart, Globe2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Sparkline from "@/components/ui/Sparkline";
import Badge from "@/components/ui/Badge";
import { HEATMAP_SECTORS } from "@/utils/mockData";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { cn } from "@/utils/cn";

export default function MarketOverview() {
  const ASSETS = useLiveAssets();
  return (
    <section id="markets" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Globe2 className="h-3.5 w-3.5 text-accent-ice" /> Live markets
            </>
          }
          title={
            <>
              Every tick. Every venue.{" "}
              <span className="text-gradient-blue">One terminal.</span>
            </>
          }
          description="Stream Level-2 data, sector rotation, options flow, and macro events through a single elegant surface — composed and reasoned in real time."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Heatmap */}
          <GlassCard className="rounded-3xl p-6 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Sector heatmap · 24h
                </div>
                <div className="text-lg font-semibold text-white">
                  Capital is rotating into AI infra
                </div>
              </div>
              <Badge variant="alpha" pulse>
                LIVE
              </Badge>
            </div>

            <div className="grid auto-rows-fr grid-cols-3 gap-2 sm:grid-cols-4">
              {HEATMAP_SECTORS.map((s, i) => {
                const positive = s.change >= 0;
                const intensity = Math.min(1, Math.abs(s.change) / 4);
                const bg = positive
                  ? `linear-gradient(135deg, rgba(125,240,194,${0.15 + intensity * 0.4}), rgba(110,168,255,${0.10 + intensity * 0.25}))`
                  : `linear-gradient(135deg, rgba(255,126,155,${0.15 + intensity * 0.4}), rgba(157,123,255,${0.10 + intensity * 0.25}))`;
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 p-3 transition-shadow hover:shadow-[0_30px_60px_-20px_rgba(110,168,255,0.4)]"
                    style={{ background: bg, minHeight: 92 }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30"
                      style={{
                        background:
                          "radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.12), transparent 60%)",
                      }}
                    />
                    <div className="relative flex h-full flex-col justify-between">
                      <div className="text-[12px] font-medium text-white/85">
                        {s.name}
                      </div>
                      <div
                        className={cn(
                          "num text-[18px] font-semibold tracking-tight",
                          positive ? "text-accent-mint" : "text-accent-rose"
                        )}
                      >
                        {positive ? "+" : ""}
                        {s.change.toFixed(2)}%
                      </div>
                      <div className="text-[10px] text-white/40">
                        weight · {s.weight}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* World pulse */}
          <GlassCard className="relative overflow-hidden rounded-3xl p-6 lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Global liquidity
                </div>
                <div className="text-lg font-semibold text-white">
                  Capital flow pulse
                </div>
              </div>
              <Badge variant="macro">MACRO</Badge>
            </div>
            <WorldPulse />
            <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
              {[
                { l: "US", v: "+$1.8B", c: "text-accent-mint" },
                { l: "EU", v: "+$420M", c: "text-accent-mint" },
                { l: "ASIA", v: "-$230M", c: "text-accent-rose" },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
                >
                  <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">
                    {x.l}
                  </div>
                  <div className={cn("num font-medium", x.c)}>{x.v}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Movers list */}
          <GlassCard className="rounded-3xl p-6 lg:col-span-12">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Top movers · curated by Aurora
                </div>
                <div className="text-lg font-semibold text-white">
                  Where the smart money is leaning right now
                </div>
              </div>
              <div className="flex items-center gap-2">
                {["1H", "1D", "1W", "1M", "YTD"].map((p, i) => (
                  <button
                    key={p}
                    className={cn(
                      "rounded-full px-3 py-1 text-[12px] transition-colors",
                      i === 1
                        ? "bg-white/[0.08] text-white ring-1 ring-white/15"
                        : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead>
                  <tr className="text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                    <th className="py-3 pr-4 font-medium">Asset</th>
                    <th className="px-4 font-medium">Price</th>
                    <th className="px-4 font-medium">Change</th>
                    <th className="px-4 font-medium">Volume</th>
                    <th className="px-4 font-medium">Trend</th>
                    <th className="px-4 font-medium">AI signal</th>
                    <th className="px-4 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {ASSETS.map((a, i) => {
                    const positive = a.change >= 0;
                    return (
                      <motion.tr
                        key={a.symbol}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                        className="group border-t border-white/[0.05] text-[13px] text-white/85 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] text-[10px] font-semibold uppercase tracking-wider text-white/85 ring-1 ring-white/10">
                              {a.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {a.symbol}
                              </div>
                              <div className="text-[11.5px] text-white/45">
                                {a.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="num px-4 font-medium text-white">
                          $
                          {a.price.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={cn(
                            "num px-4 font-medium",
                            positive ? "text-accent-mint" : "text-accent-rose"
                          )}
                        >
                          <span className="inline-flex items-center gap-1">
                            {positive ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                            {positive ? "+" : ""}
                            {a.change.toFixed(2)}%
                          </span>
                        </td>
                        <td className="num px-4 text-white/65">{a.volume}</td>
                        <td className="px-4">
                          <Sparkline
                            data={a.series}
                            width={120}
                            height={32}
                            positive={positive}
                          />
                        </td>
                        <td className="px-4">
                          <Badge
                            variant={
                              a.ai.signal === "BUY"
                                ? "buy"
                                : a.ai.signal === "SELL"
                                  ? "sell"
                                  : "hold"
                            }
                          >
                            {a.ai.signal}
                          </Badge>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-2">
                            <div className="relative h-1 w-20 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7df0c2,#a8c8ff,#9d7bff)]"
                                style={{ width: `${a.ai.confidence}%` }}
                              />
                            </div>
                            <span className="num text-[11.5px] text-white/65">
                              {a.ai.confidence}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">
              <div className="flex items-center gap-2 text-[11.5px] text-white/45">
                <LineChart className="h-3.5 w-3.5" />
                Streaming · last sync 0.4s ago
              </div>
              <button className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.06] hover:text-white">
                Open full screener →
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function WorldPulse() {
  // Decorative globe-pulse SVG with animated rings.
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_at_center,rgba(110,168,255,0.18),transparent_60%),#06080d]">
      <svg
        viewBox="0 0 800 460"
        className="absolute inset-0 h-full w-full opacity-90"
      >
        <defs>
          <radialGradient id="sphere" cx="50%" cy="48%" r="40%">
            <stop offset="0%" stopColor="#1a2236" />
            <stop offset="80%" stopColor="#0a0c12" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="lat" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(168,200,255,0)" />
            <stop offset="50%" stopColor="rgba(168,200,255,0.5)" />
            <stop offset="100%" stopColor="rgba(168,200,255,0)" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="230" r="170" fill="url(#sphere)" />
        {/* meridians */}
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse
            key={`m${i}`}
            cx="400"
            cy="230"
            rx={170 - i * 18}
            ry={170}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        {/* parallels */}
        {[40, 80, 120, 160].map((r, i) => (
          <ellipse
            key={`p${i}`}
            cx="400"
            cy="230"
            rx={170}
            ry={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
          />
        ))}
        {/* equator */}
        <line
          x1="230"
          y1="230"
          x2="570"
          y2="230"
          stroke="url(#lat)"
          strokeWidth="1"
        />
        {/* nodes */}
        {[
          { x: 320, y: 200, c: "#7df0c2" },
          { x: 420, y: 170, c: "#a8c8ff" },
          { x: 470, y: 260, c: "#9d7bff" },
          { x: 360, y: 280, c: "#a8c8ff" },
          { x: 510, y: 220, c: "#7df0c2" },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="2.5" fill={n.c} />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="2.5"
              fill="none"
              stroke={n.c}
              strokeWidth="1"
              animate={{ r: [2.5, 22], opacity: [0.7, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          </g>
        ))}
        {/* arcs */}
        {[
          ["320,200", "470,260"],
          ["420,170", "510,220"],
          ["360,280", "510,220"],
        ].map(([a, b], i) => (
          <motion.path
            key={i}
            d={`M ${a} Q 400,${100 + i * 20} ${b}`}
            fill="none"
            stroke="rgba(168,200,255,0.45)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.4 + i * 0.3 }}
          />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10.5px] text-white/40">
        <span>Cross-asset capital flow · 28 markets</span>
        <span className="num">UPDATED 0.6s</span>
      </div>
    </div>
  );
}
