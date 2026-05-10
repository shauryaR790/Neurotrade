import { motion } from "framer-motion";
import {
  Workflow,
  Database,
  Filter,
  Brain,
  Shield,
  Zap,
  Play,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Sparkline from "@/components/ui/Sparkline";
import Badge from "@/components/ui/Badge";

const stages = [
  {
    icon: Database,
    title: "Universe",
    desc: "S&P 500 + Top 50 Crypto",
    accent: "from-accent-blue/30 to-accent-blue/0",
  },
  {
    icon: Brain,
    title: "Momentum 20D",
    desc: "Z-score > 1.2",
    accent: "from-accent-violet/30 to-accent-violet/0",
  },
  {
    icon: Brain,
    title: "AI Sentiment",
    desc: "NLP score > 0.6",
    accent: "from-accent-violet/30 to-accent-violet/0",
  },
  {
    icon: Filter,
    title: "Volatility filter",
    desc: "ATR < 4%",
    accent: "from-accent-blue/30 to-accent-blue/0",
  },
  {
    icon: Shield,
    title: "Risk engine",
    desc: "Position 0.5R · CVaR cap",
    accent: "from-accent-mint/30 to-accent-mint/0",
  },
  {
    icon: Zap,
    title: "Execution",
    desc: "TWAP · 30m slice",
    accent: "from-accent-mint/30 to-accent-mint/0",
  },
];

const equity = [
  100, 101.2, 102.4, 102.1, 103.8, 105.3, 106.1, 105.4, 107.6, 109.4, 110.8,
  111.6, 113.2, 114.5, 115.9, 117.4, 118.6, 119.8, 121.4, 123.7, 124.2, 126.1,
  127.8, 129.4, 131.2, 132.8, 134.6, 136.1, 137.8, 139.4,
];

export default function StrategyBuilder() {
  return (
    <section id="strategy" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Workflow className="h-3.5 w-3.5 text-accent-ice" /> Strategy
              builder
            </>
          }
          title={
            <>
              Compose strategies in{" "}
              <span className="text-gradient-blue">English.</span>
              <br />
              We translate to alpha.
            </>
          }
          description="Type a thesis. Aurora compiles it into a multi-factor pipeline, runs 10,000 walk-forward folds, and ships a tradeable strategy you can deploy in one click."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Builder canvas */}
          <GlassCard className="rounded-3xl p-6 lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Pipeline · Aurora-Momentum-Sentiment
                </div>
                <div className="text-lg font-semibold text-white">
                  Visual strategy graph
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="alpha" pulse>
                  COMPILED
                </Badge>
                <button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-3 text-[12.5px] text-white ring-1 ring-white/10">
                  <Play className="h-3.5 w-3.5" /> Run
                </button>
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                Prompt
              </div>
              <div className="mt-1 text-[14px] leading-relaxed text-white/85">
                <span className="text-accent-ice">"</span>Long the top 30 names
                with rising 20-day momentum AND positive AI news sentiment.
                Filter low-volatility liquid stocks. Cap risk at 0.5R per
                position. Execute via 30-minute TWAP.
                <span className="text-accent-ice">"</span>
              </div>
            </div>

            {/* Pipeline graph */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {stages.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:-translate-y-1 hover:border-white/15"
                  >
                    <div
                      className={`pointer-events-none absolute -inset-x-4 -top-4 h-24 bg-gradient-to-b ${s.accent} blur-2xl`}
                    />
                    <div className="relative">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10 text-accent-ice">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="mt-3 text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                        Step {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="mt-0.5 text-[14px] font-medium text-white">
                        {s.title}
                      </div>
                      <div className="mt-1 text-[12px] text-white/55">
                        {s.desc}
                      </div>
                    </div>
                    {i < stages.length - 1 && (
                      <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-white/0 via-white/25 to-white/0 sm:block" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Backtest panel */}
          <GlassCard
            variant="strong"
            className="relative overflow-hidden rounded-3xl p-6 lg:col-span-4"
          >
            <div className="absolute inset-0 mesh-aurora opacity-25" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Walk-forward backtest
                  </div>
                  <div className="text-lg font-semibold text-white">
                    Out-of-sample
                  </div>
                </div>
                <Badge variant="buy">+39.4%</Badge>
              </div>

              <div className="mt-4">
                <Sparkline
                  data={equity}
                  width={320}
                  height={86}
                  strokeWidth={1.8}
                  positive
                  className="w-full"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-[12px]">
                {[
                  { l: "Sharpe", v: "2.81" },
                  { l: "Sortino", v: "4.02" },
                  { l: "Max DD", v: "-6.2%" },
                  { l: "Hit rate", v: "67%" },
                  { l: "Avg trade", v: "+1.42%" },
                  { l: "Capacity", v: "$4.1B" },
                ].map((m) => (
                  <div
                    key={m.l}
                    className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2"
                  >
                    <span className="text-white/55">{m.l}</span>
                    <span className="num font-medium text-white">{m.v}</span>
                  </div>
                ))}
              </div>

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-4 py-2.5 text-[13px] font-medium text-white ring-1 ring-white/10 hover:ring-white/20">
                Deploy live
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
