import { motion } from "framer-motion";
import { PieChart, ArrowUpRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import AreaChart from "@/components/ui/AreaChart";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  PERFORMANCE_SERIES,
  BENCHMARK_SERIES,
  PORTFOLIO_HOLDINGS,
  KPIS,
} from "@/utils/mockData";
import { cn } from "@/utils/cn";

export default function PortfolioAnalytics() {
  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <PieChart className="h-3.5 w-3.5 text-accent-ice" /> Portfolio
              intelligence
            </>
          }
          title={
            <>
              Smart analytics that{" "}
              <span className="text-gradient-blue">explain themselves.</span>
            </>
          }
          description="Drilldown attribution, regime-aware risk, factor exposures, and AI-generated rebalancing — every chart tells you why, not just what."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-12 lg:grid-cols-4">
            {KPIS.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <GlassCard className="rounded-2xl p-5">
                  <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                    {k.label}
                  </div>
                  <div className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
                    {k.value}
                  </div>
                  <div
                    className={cn(
                      "mt-1 text-[12px]",
                      k.positive ? "text-accent-mint" : "text-accent-rose"
                    )}
                  >
                    {k.delta}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Equity curve */}
          <GlassCard className="rounded-3xl p-6 lg:col-span-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Equity curve · 90D
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <div className="num text-3xl font-semibold tracking-tight text-white">
                    <AnimatedCounter
                      value={2843910420}
                      prefix="$"
                      duration={2200}
                    />
                  </div>
                  <span className="rounded-full bg-accent-mint/10 px-2 py-0.5 text-[12px] text-accent-mint">
                    +24.1% vs SPY +9.2%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[12px] text-white/55">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-3 rounded-sm bg-[linear-gradient(90deg,#a8c8ff,#9d7bff)]" />
                  Aurora portfolio
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-px w-3 border-t border-dashed border-white/40" />
                  S&P 500
                </div>
              </div>
            </div>

            <div className="relative h-[300px] w-full">
              <AreaChart
                data={PERFORMANCE_SERIES}
                benchmark={BENCHMARK_SERIES}
                width={900}
                height={300}
                ariaLabel="Equity curve vs benchmark"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-white/45">
              <span className="num">Inception · Jul 12</span>
              <span>•</span>
              <span>Hold-out validated</span>
              <span>•</span>
              <span className="num">Sharpe 2.81 · Sortino 4.02</span>
            </div>
          </GlassCard>

          {/* Holdings + Allocation */}
          <GlassCard className="rounded-3xl p-6 lg:col-span-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Allocation
                </div>
                <div className="text-lg font-semibold text-white">
                  Live composition
                </div>
              </div>
              <button className="text-[12px] text-white/55 hover:text-white">
                Rebalance →
              </button>
            </div>

            <div className="mt-5 flex justify-center">
              <DonutChart />
            </div>

            <div className="mt-5 space-y-2.5">
              {PORTFOLIO_HOLDINGS.map((h, i) => (
                <motion.div
                  key={h.sym}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="group flex items-center gap-3"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: holdingColor(i) }}
                  />
                  <div className="flex-1 text-[13px] text-white/85">
                    {h.sym}
                  </div>
                  <div className="num w-12 text-right text-[12px] text-white/55">
                    {h.weight}%
                  </div>
                  <div
                    className={cn(
                      "num w-14 text-right text-[12px]",
                      h.pnl >= 0 ? "text-accent-mint" : "text-accent-rose"
                    )}
                  >
                    {h.pnl > 0 ? "+" : ""}
                    {h.pnl}%
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Risk + factor exposure */}
          <GlassCard className="rounded-3xl p-6 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Factor exposures
                </div>
                <div className="text-lg font-semibold text-white">
                  Risk decomposition
                </div>
              </div>
              <span className="text-[12px] text-white/55">
                Z-score normalized
              </span>
            </div>
            <FactorBars />
          </GlassCard>

          {/* AI Rebalancer */}
          <GlassCard
            variant="strong"
            className="relative overflow-hidden rounded-3xl p-6 lg:col-span-5"
          >
            <div className="absolute inset-0 mesh-aurora opacity-30" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                AI rebalancer
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                Optimal trade list
              </div>
              <div className="mt-1 text-[12.5px] text-white/55">
                Confidence-weighted, capacity-checked, tax-aware.
              </div>

              <div className="mt-5 space-y-2.5">
                {[
                  { side: "BUY", sym: "NVDA", w: "+0.9%", note: "Momentum + sentiment surge" },
                  { side: "BUY", sym: "AMD", w: "+0.7%", note: "Breadth confirmation" },
                  { side: "TRIM", sym: "TSLA", w: "-1.2%", note: "Delivery risk · regime tilt" },
                  { side: "HEDGE", sym: "VIX", w: "0.3R", note: "Tail-risk protection" },
                ].map((t) => (
                  <div
                    key={t.sym}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold tracking-wider",
                        t.side === "BUY" && "bg-accent-mint/15 text-accent-mint",
                        t.side === "TRIM" && "bg-accent-rose/15 text-accent-rose",
                        t.side === "HEDGE" && "bg-accent-violet/15 text-accent-mist"
                      )}
                    >
                      {t.side}
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-white">
                        {t.sym}
                      </div>
                      <div className="text-[11.5px] text-white/45">
                        {t.note}
                      </div>
                    </div>
                    <div className="num text-[13px] font-medium text-white">
                      {t.w}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-4 py-2.5 text-[13px] font-medium text-white ring-1 ring-white/10 hover:ring-white/20">
                Apply rebalance
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

const HOLDING_COLORS = [
  "#a8c8ff",
  "#9d7bff",
  "#7df0c2",
  "#6ea8ff",
  "#c9b8ff",
  "#5b9bff",
  "#ff7e9b",
  "#a8c8ff",
  "#7df0c2",
  "#3a4254",
];

function holdingColor(i: number) {
  return HOLDING_COLORS[i % HOLDING_COLORS.length];
}

function DonutChart() {
  const total = PORTFOLIO_HOLDINGS.reduce((s, h) => s + h.weight, 0);
  const r = 64;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 200 200" className="h-44 w-44 -rotate-90">
      <circle
        cx="100"
        cy="100"
        r={r}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="14"
        fill="none"
      />
      {PORTFOLIO_HOLDINGS.map((h, i) => {
        const len = (h.weight / total) * C;
        const dasharray = `${len} ${C - len}`;
        const offset = -acc;
        acc += len;
        return (
          <motion.circle
            key={h.sym}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={holdingColor(i)}
            strokeWidth="14"
            strokeDasharray={dasharray}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.04 }}
          />
        );
      })}
      <g className="rotate-90" style={{ transformOrigin: "100px 100px" }}>
        <text
          x="100"
          y="96"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          letterSpacing="2"
        >
          TOTAL
        </text>
        <text
          x="100"
          y="116"
          textAnchor="middle"
          fill="white"
          fontSize="20"
          fontWeight="600"
        >
          $2.84B
        </text>
      </g>
    </svg>
  );
}

const factors = [
  { label: "Momentum", v: 0.82 },
  { label: "Quality", v: 0.61 },
  { label: "Growth", v: 0.74 },
  { label: "Value", v: -0.21 },
  { label: "Volatility", v: -0.42 },
  { label: "Size", v: 0.18 },
  { label: "AI Sentiment", v: 0.88 },
];

function FactorBars() {
  return (
    <div className="space-y-3.5">
      {factors.map((f, i) => {
        const positive = f.v >= 0;
        const widthPct = Math.min(100, Math.abs(f.v) * 100);
        return (
          <motion.div
            key={f.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          >
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span className="text-white/75">{f.label}</span>
              <span
                className={cn(
                  "num font-medium",
                  positive ? "text-accent-mint" : "text-accent-rose"
                )}
              >
                {positive ? "+" : ""}
                {f.v.toFixed(2)}
              </span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <span className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${widthPct / 2}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.1 + i * 0.04, ease: "easeOut" }}
                className={cn(
                  "absolute top-0 h-full",
                  positive
                    ? "left-1/2 bg-[linear-gradient(90deg,rgba(125,240,194,0.5),#7df0c2)]"
                    : "right-1/2 bg-[linear-gradient(90deg,#ff7e9b,rgba(255,126,155,0.5))]"
                )}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
