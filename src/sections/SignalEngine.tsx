import { motion } from "framer-motion";
import { Radar, Target, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import ParticleField from "@/components/effects/ParticleField";
import { AI_INSIGHTS } from "@/utils/mockData";
import { cn } from "@/utils/cn";

const tagToVariant = {
  ALPHA: "alpha",
  RISK: "risk",
  MACRO: "macro",
  ANOMALY: "anomaly",
} as const;

export default function SignalEngine() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Radar className="h-3.5 w-3.5 text-accent-ice" /> AI signal
              engine
            </>
          }
          title={
            <>
              487 alpha factors.{" "}
              <span className="text-gradient-blue">One coherent view.</span>
            </>
          }
          description="Streaming order book, options flow, social sentiment, on-chain activity and macro indicators are fused into ranked, explainable signals."
        />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Radar viz */}
          <GlassCard className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:col-span-5">
            <ParticleField density={32} className="opacity-60" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Live scan · 487 factors
              </div>
              <div className="text-lg font-semibold text-white">
                Composite alpha radar
              </div>

              <RadarChart />

              <div className="mt-5 grid grid-cols-3 gap-2 text-[11.5px]">
                {[
                  { l: "Price action", v: "0.82", c: "text-accent-mint" },
                  { l: "Options flow", v: "0.71", c: "text-accent-mint" },
                  { l: "Sentiment", v: "0.66", c: "text-accent-mint" },
                  { l: "On-chain", v: "0.42", c: "text-accent-ice" },
                  { l: "Macro", v: "0.38", c: "text-accent-ice" },
                  { l: "Microstructure", v: "0.61", c: "text-accent-mint" },
                ].map((d) => (
                  <div
                    key={d.l}
                    className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2"
                  >
                    <div className="text-white/45">{d.l}</div>
                    <div className={cn("num font-medium", d.c)}>{d.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Insights stream */}
          <div className="grid gap-4 lg:col-span-7">
            {AI_INSIGHTS.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <GlassCard className="group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[radial-gradient(circle_at_30%_30%,#a8c8ff,#6ea8ff_60%,#1a2236)] text-white shadow-[0_0_18px_rgba(110,168,255,0.4)]">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={tagToVariant[ins.tag]}>
                            {ins.tag}
                          </Badge>
                          {ins.asset && (
                            <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10.5px] text-white/65">
                              {ins.asset}
                            </span>
                          )}
                          <span className="text-[10.5px] text-white/35">
                            · {Math.floor(Math.random() * 20) + 2}m ago
                          </span>
                        </div>
                        <div className="mt-1.5 text-[15px] font-medium text-white">
                          {ins.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-white/40" />
                      <div className="num text-[13px] font-medium text-white">
                        {ins.confidence}%
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 pretty text-[13.5px] leading-relaxed text-white/65">
                    {ins.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative h-1 w-32 overflow-hidden rounded-full bg-white/[0.06] sm:w-40">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${ins.confidence}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.3 + i * 0.05 }}
                        className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7df0c2,#a8c8ff,#9d7bff)]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-full bg-white/[0.04] px-3 py-1 text-[11.5px] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.07]">
                        Explain →
                      </button>
                      <button className="rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-3 py-1 text-[11.5px] text-white ring-1 ring-white/10">
                        Act on signal
                      </button>
                    </div>
                  </div>

                  <span className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(110,168,255,0.25),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RadarChart() {
  const axes = ["Price", "Options", "News", "On-chain", "Macro", "Micro"];
  const values = [0.82, 0.71, 0.66, 0.42, 0.38, 0.61];
  const cx = 150;
  const cy = 150;
  const R = 110;

  const angleFor = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const ptFor = (v: number, i: number) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
  };

  const polygon = values
    .map((v, i) => {
      const [x, y] = ptFor(v, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="mt-4 flex justify-center">
      <svg viewBox="0 0 300 300" className="h-56 w-56 sm:h-72 sm:w-72">
        <defs>
          <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(110,168,255,0.55)" />
            <stop offset="100%" stopColor="rgba(157,123,255,0.10)" />
          </radialGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((s, i) => (
          <polygon
            key={i}
            points={axes
              .map((_, j) => {
                const [x, y] = ptFor(s, j);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        {axes.map((label, i) => {
          const [x, y] = ptFor(1.06, i);
          const a = angleFor(i);
          return (
            <g key={label}>
              <line
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(a) * R}
                y2={cy + Math.sin(a) * R}
                stroke="rgba(255,255,255,0.05)"
              />
              <text
                x={x}
                y={y + 3}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(255,255,255,0.45)"
              >
                {label}
              </text>
            </g>
          );
        })}
        <motion.polygon
          points={polygon}
          fill="url(#radar-fill)"
          stroke="url(#line-stroke)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        <defs>
          <linearGradient id="line-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#a8c8ff" />
            <stop offset="100%" stopColor="#9d7bff" />
          </linearGradient>
        </defs>
        {values.map((v, i) => {
          const [x, y] = ptFor(v, i);
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="#a8c8ff" />
          );
        })}
      </svg>
    </div>
  );
}
