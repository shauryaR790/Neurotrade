import { motion } from "framer-motion";
import { LayoutGrid, Maximize2, Minimize2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Sparkline from "@/components/ui/Sparkline";
import Badge from "@/components/ui/Badge";
import { ASSETS } from "@/utils/mockData";
import { cn } from "@/utils/cn";

export default function Workspace() {
  const main = ASSETS[0];

  return (
    <section className="relative py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <LayoutGrid className="h-3.5 w-3.5 text-accent-ice" /> Trading
              workspace
            </>
          }
          title={
            <>
              Your terminal,{" "}
              <span className="text-gradient-blue">built like a cockpit.</span>
            </>
          }
          description="Resizable, brain-friendly panels. Order book, ladder, options chain, alerts, and AI commentary — all in one breathable canvas."
        />

        <GlassCard variant="strong" className="overflow-hidden rounded-3xl">
          {/* OS-like top bar */}
          <div className="flex items-center justify-between border-b border-white/[0.07] bg-black/30 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[11.5px] text-white/60">
                NEUROTRADE — workspace · {main.symbol}
              </span>
            </div>
            <div className="flex items-center gap-1 text-white/50">
              <button className="rounded p-1 hover:bg-white/[0.06]">
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button className="rounded p-1 hover:bg-white/[0.06]">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-px bg-white/[0.04]">
            {/* Symbol + chart area */}
            <div className="col-span-12 flex flex-col gap-px lg:col-span-8">
              <div className="bg-ink-900/60 px-3 py-3 sm:px-5 sm:py-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[22px] font-semibold tracking-tight text-white">
                        {main.symbol}
                      </div>
                      <span className="text-[12px] text-white/45">
                        {main.name}
                      </span>
                      <Badge variant="buy" pulse>
                        BUY · 92
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <div className="num text-3xl font-semibold tracking-tight text-white">
                        ${main.price.toLocaleString()}
                      </div>
                      <span className="num text-[13px] font-medium text-accent-mint">
                        +${(main.price * 0.0384).toFixed(2)} (+
                        {main.change.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1 scrollbar-hidden">
                    {["1m", "5m", "15m", "1H", "4H", "1D"].map((t, i) => (
                      <button
                        key={t}
                        className={cn(
                          "shrink-0 rounded-full px-2 py-1 text-[11px] sm:px-3 sm:text-[11.5px]",
                          i === 3
                            ? "bg-white/[0.08] text-white ring-1 ring-white/15"
                            : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <CandleChart data={main.series} />
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11.5px] text-white/45">
                  <span>O 1170.21</span>
                  <span>H 1192.04</span>
                  <span>L 1162.55</span>
                  <span>C 1184.32</span>
                  <span>·</span>
                  <span className="text-accent-mint">VWAP held</span>
                  <span className="text-accent-ice">Aurora long bias 92%</span>
                </div>
              </div>

              {/* Order ladder */}
              <div className="bg-ink-900/60 px-3 py-3 sm:px-5 sm:py-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Order ladder · DOM
                  </div>
                  <span className="text-[11.5px] text-white/45">
                    Streaming · 12 venues
                  </span>
                </div>
                <Ladder />
              </div>
            </div>

            {/* Right column — order ticket + alerts + AI */}
            <div className="col-span-12 flex flex-col gap-px lg:col-span-4">
              <div className="bg-ink-900/60 px-3 py-3 sm:px-5 sm:py-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Smart order
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="rounded-lg bg-accent-mint/15 py-2 text-[12.5px] font-medium text-accent-mint ring-1 ring-accent-mint/30">
                    BUY
                  </button>
                  <button className="rounded-lg bg-accent-rose/10 py-2 text-[12.5px] font-medium text-accent-rose ring-1 ring-accent-rose/25 hover:bg-accent-rose/15">
                    SELL
                  </button>
                </div>
                <div className="mt-3 grid gap-2.5">
                  <Field label="Quantity" value="2,450 sh" />
                  <Field label="Type" value="AURORA · Smart TWAP" hint="0.5R" />
                  <Field label="Slippage" value="≤ 4 bps" />
                  <Field label="Limit" value="$1,184.20" />
                </div>
                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-4 py-2.5 text-[13px] font-medium text-white ring-1 ring-white/10 hover:ring-white/20">
                  Confirm with Aurora
                </button>
                <div className="mt-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-[11.5px] leading-relaxed text-white/60">
                  Aurora will validate sizing against your book, splice the
                  order across 4 venues, and abort on adverse microstructure.
                </div>
              </div>

              <div className="bg-ink-900/60 px-3 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Alerts
                  </div>
                  <button className="text-[11.5px] text-white/55 hover:text-white">
                    + add
                  </button>
                </div>
                <ul className="mt-2 space-y-2 text-[12.5px]">
                  {[
                    {
                      l: "NVDA crosses $1,200",
                      t: "armed",
                      c: "text-accent-mint",
                    },
                    {
                      l: "Macro print > consensus",
                      t: "watching",
                      c: "text-accent-ice",
                    },
                    {
                      l: "Anomaly score > 3σ",
                      t: "armed",
                      c: "text-accent-mint",
                    },
                  ].map((a, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2"
                    >
                      <span className="text-white/75">{a.l}</span>
                      <span className={cn("text-[11px] font-medium", a.c)}>
                        {a.t}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-ink-900/60 px-3 py-3 sm:px-5 sm:py-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Aurora · live commentary
                </div>
                <div className="mt-2 space-y-2 text-[12.5px] leading-relaxed text-white/70">
                  <p>
                    Tape print: {main.symbol} absorbing 38% of session volume
                    above VWAP — institutional accumulation pattern detected.
                  </p>
                  <p>
                    Cross-asset confirmation:{" "}
                    <span className="text-accent-ice">SOXX</span>,{" "}
                    <span className="text-accent-ice">AVGO</span> and{" "}
                    <span className="text-accent-ice">AMD</span> all in
                    momentum quadrant. Conviction strengthening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/40 uppercase tracking-[0.14em]">
          {label}
        </span>
        {hint && <span className="text-white/40">{hint}</span>}
      </div>
      <div className="num mt-0.5 text-[13.5px] font-medium text-white">
        {value}
      </div>
    </div>
  );
}

function CandleChart({ data }: { data: number[] }) {
  // Render a stylized candle chart from the series.
  const candles = data.slice(-32);
  const min = Math.min(...candles);
  const max = Math.max(...candles);
  const range = max - min || 1;
  const w = 760;
  const h = 220;
  const cw = w / candles.length;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_top,rgba(110,168,255,0.10),transparent_60%)]">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[160px] w-full sm:h-[200px] lg:h-[220px]"
        preserveAspectRatio="none"
      >
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line
            key={i}
            x1={0}
            x2={w}
            y1={h * p}
            y2={h * p}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 6"
          />
        ))}
        {candles.map((v, i) => {
          const prev = i === 0 ? v : candles[i - 1];
          const up = v >= prev;
          const open = prev;
          const close = v;
          const high = Math.max(open, close) + Math.random() * range * 0.05;
          const low = Math.min(open, close) - Math.random() * range * 0.05;
          const yFor = (val: number) => h - ((val - min) / range) * (h - 16) - 8;
          const x = i * cw + cw / 2;
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={yFor(high)}
                y2={yFor(low)}
                stroke={up ? "rgba(125,240,194,0.55)" : "rgba(255,126,155,0.55)"}
              />
              <rect
                x={x - cw * 0.32}
                width={cw * 0.64}
                y={Math.min(yFor(open), yFor(close))}
                height={Math.max(2, Math.abs(yFor(close) - yFor(open)))}
                fill={up ? "url(#cu)" : "url(#cd)"}
                stroke={up ? "#7df0c2" : "#ff7e9b"}
                strokeOpacity="0.7"
                rx="1.5"
              />
            </g>
          );
        })}
        <defs>
          <linearGradient id="cu" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(125,240,194,0.5)" />
            <stop offset="100%" stopColor="rgba(125,240,194,0.15)" />
          </linearGradient>
          <linearGradient id="cd" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,126,155,0.5)" />
            <stop offset="100%" stopColor="rgba(255,126,155,0.15)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Volume strip (using sparkline) */}
      <div className="border-t border-white/[0.06] px-3 py-2">
        <Sparkline
          data={candles.map((v) => v - min)}
          width={760}
          height={26}
          positive
          showArea
          strokeWidth={1}
          className="w-full opacity-60"
        />
      </div>
    </div>
  );
}

function Ladder() {
  const rows = [
    { px: 1186.40, sz: 1240, side: "ask" },
    { px: 1185.95, sz: 2810, side: "ask" },
    { px: 1185.10, sz: 4520, side: "ask" },
    { px: 1184.55, sz: 8120, side: "ask" },
    { px: 1184.20, sz: 12040, side: "mid" },
    { px: 1183.95, sz: 9420, side: "bid" },
    { px: 1183.50, sz: 5180, side: "bid" },
    { px: 1182.85, sz: 3210, side: "bid" },
    { px: 1182.10, sz: 1680, side: "bid" },
  ];
  const max = Math.max(...rows.map((r) => r.sz));
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
      <table className="w-full text-[11.5px] sm:text-[12px]">
        <thead>
          <tr className="border-b border-white/[0.05] text-[10px] uppercase tracking-[0.16em] text-white/40 sm:text-[10.5px]">
            <th className="px-2 py-2 text-left font-medium sm:px-4">Bid size</th>
            <th className="px-2 py-2 text-center font-medium sm:px-4">Price</th>
            <th className="px-2 py-2 text-right font-medium sm:px-4">Ask size</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isMid = r.side === "mid";
            const isBid = r.side === "bid";
            return (
              <tr
                key={r.px}
                className={cn(
                  "relative border-b border-white/[0.04] last:border-b-0",
                  isMid && "bg-white/[0.04]"
                )}
              >
                <td
                  className={cn(
                    "relative px-2 py-1.5 sm:px-4",
                    isBid ? "text-accent-mint" : "text-white/30"
                  )}
                >
                  {isBid && (
                    <span
                      className="absolute inset-y-0 right-0 -z-0 bg-accent-mint/10"
                      style={{ width: `${(r.sz / max) * 100}%` }}
                    />
                  )}
                  <span className="num relative">
                    {isBid ? r.sz.toLocaleString() : ""}
                  </span>
                </td>
                <td
                  className={cn(
                    "num px-2 py-1.5 text-center font-medium sm:px-4",
                    isMid ? "text-white" : "text-white/75"
                  )}
                >
                  {r.px.toFixed(2)}
                </td>
                <td
                  className={cn(
                    "relative px-2 py-1.5 text-right sm:px-4",
                    !isBid && !isMid ? "text-accent-rose" : "text-white/30"
                  )}
                >
                  {!isBid && !isMid && (
                    <span
                      className="absolute inset-y-0 left-0 -z-0 bg-accent-rose/10"
                      style={{ width: `${(r.sz / max) * 100}%` }}
                    />
                  )}
                  <span className="num relative">
                    {!isBid && !isMid ? r.sz.toLocaleString() : ""}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
