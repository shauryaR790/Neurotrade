import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Bot,
  Activity,
  TrendingUp,
  Zap,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import Sparkline from "@/components/ui/Sparkline";
import Badge from "@/components/ui/Badge";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { ASSETS } from "@/utils/mockData";

const reveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function Hero() {
  const featured = ASSETS.slice(0, 3);

  return (
    <section className="relative isolate pt-24 sm:pt-28 lg:pt-32">
      {/* Section-local mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px]"
      >
        <div className="absolute inset-0 mesh-aurora opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 sm:px-6 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-24">
        {/* LEFT — Headline */}
        <div className="lg:col-span-7">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}
            className="flex flex-col gap-6"
          >
            <motion.div
              variants={reveal}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5 text-accent-ice" />
                Introducing Aurora · The AI trading core
              </span>
            </motion.div>

            <motion.h1
              variants={reveal}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-[38px] font-semibold leading-[1.02] tracking-tight sm:text-[60px] sm:leading-[0.98] lg:text-[78px]"
            >
              <span className="text-gradient block">Trade like the future</span>
              <span className="text-gradient-blue block">
                already happened.
              </span>
            </motion.h1>

            <motion.p
              variants={reveal}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl pretty text-[16px] leading-relaxed text-white/65 sm:text-[17.5px]"
            >
              NEUROTRADE is an AI-native trading intelligence platform — a
              cinematic terminal that thinks in markets, hedges in real time,
              and explains every decision in your language.
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                size="lg"
                variant="primary"
                iconRight={<ArrowUpRight className="h-4 w-4" />}
              >
                Open the terminal
              </MagneticButton>
              <MagneticButton size="lg" variant="outline">
                Watch the demo
              </MagneticButton>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={reveal}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] text-white/45"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-ice" />
                SOC 2 Type II
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-accent-mist" />
                12 frontier models
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-accent-mint" />
                {`< 38ms`} median latency
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-accent-ice" />
                $2.84B AUM modeled
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — Floating cinematic stack (desktop only — too dense for mobile) */}
        <div className="relative hidden lg:col-span-5 lg:block">
          <FloatingStack featured={featured} />
        </div>

        {/* RIGHT — Mobile preview (compact, single card flow) */}
        <div className="flex flex-col gap-3 lg:hidden">
          <GlassCard variant="strong" className="overflow-hidden rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 text-[10.5px] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
                Aurora · Active
              </span>
              <Badge variant="alpha">ALPHA</Badge>
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
              AI directive
            </div>
            <div className="mt-1 text-[14px] font-medium leading-snug text-white">
              Rotate +2.4% from{" "}
              <span className="text-accent-rose">defensives</span> into{" "}
              <span className="text-accent-mint">semis & AI infra</span>.
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <span className="num text-[10px] text-white/40">Confidence</span>
              <span className="num text-[12px] font-medium text-white">92%</span>
            </div>
          </GlassCard>

          <GlassCard className="overflow-hidden rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                Live signal
              </div>
              <Badge variant="buy" pulse>
                BUY
              </Badge>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-xl font-semibold tracking-tight text-white">
                NVDA
              </div>
              <div className="num text-[12px] text-white/55">
                <AnimatedCounter
                  value={1184.32}
                  prefix="$"
                  decimals={2}
                  duration={1800}
                />
              </div>
              <div className="ml-auto flex items-center gap-1 text-[11px] text-accent-mint">
                <TrendingUp className="h-3 w-3" />
                +3.84%
              </div>
            </div>
            <div className="mt-2">
              <Sparkline
                data={featured[0].series}
                width={420}
                height={44}
                strokeWidth={1.6}
                positive
                className="w-full"
              />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom HUD bar */}
      <BottomHUD />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none mt-12 flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-white/30"
      >
        <span>Scroll to explore</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-7 w-px bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

function FloatingStack({ featured }: { featured: typeof ASSETS }) {
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[520px] [perspective:1400px]">
      {/* Subtle floor reflection */}
      <div
        aria-hidden
        className="absolute inset-x-12 bottom-0 h-32 rounded-[40px] opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(110,168,255,0.45), transparent 70%)",
        }}
      />

      {/* CARD 1 — Big AI command card (back) */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateY: -10 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-2 w-[88%] [transform-style:preserve-3d]"
      >
        <GlassCard
          variant="strong"
          className="overflow-hidden rounded-[22px] p-5"
          style={{ transform: "rotateX(4deg) rotateY(-6deg)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/5 px-2.5 text-[11px] text-white/75">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-mint/70 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-mint" />
                </span>
                Aurora · Active
              </span>
              <Badge variant="alpha">ALPHA</Badge>
            </div>
            <span className="num text-[11px] text-white/40">14:08:22 EST</span>
          </div>

          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              AI directive
            </div>
            <div className="mt-1.5 text-[17px] font-medium leading-snug text-white">
              Rotate +2.4% portfolio weight from{" "}
              <span className="text-accent-rose">defensives</span> into{" "}
              <span className="text-accent-mint">semis & AI infra</span>.
              Hedge 0.3R in long-vol on macro tail.
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["NVDA +0.9%", "AMD +0.7%", "AVGO +0.5%", "XLP -0.8%", "Hedge VIX 0.3R"].map(
                (t, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-white/70"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              <div className="num text-[10px] text-white/40">Confidence</div>
              <div className="num text-[13px] font-medium text-white">92%</div>
            </div>
            <div className="relative h-1 w-32 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7df0c2,#a8c8ff,#9d7bff)]"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* CARD 2 — Mid live ticker */}
      <motion.div
        initial={{ opacity: 0, y: 30, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-[210px] w-[78%] [transform-style:preserve-3d]"
        style={{ transform: "rotateY(8deg) rotateX(2deg)" }}
      >
        <GlassCard className="overflow-hidden rounded-[20px] p-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Live signal
            </div>
            <Badge variant="buy" pulse>
              BUY
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-semibold tracking-tight text-white">
              NVDA
            </div>
            <div className="num text-[13px] text-white/55">
              <AnimatedCounter
                value={1184.32}
                prefix="$"
                decimals={2}
                duration={1800}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[12px] text-accent-mint">
            <TrendingUp className="h-3.5 w-3.5" />
            +3.84% · vol 48.2M
          </div>
          <div className="mt-3">
            <Sparkline
              data={featured[0].series}
              width={420}
              height={56}
              strokeWidth={1.6}
              positive
              className="w-full"
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* CARD 3 — Compact metric chip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-2 top-[400px] w-[60%]"
      >
        <GlassCard className="rounded-[18px] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Portfolio · 24h
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div className="num text-2xl font-semibold text-white">
              <AnimatedCounter
                value={2.84}
                prefix="$"
                suffix="B"
                decimals={2}
                duration={2000}
              />
            </div>
            <Badge variant="buy">+12.4%</Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            {[
              { l: "Sharpe", v: "2.81" },
              { l: "DD", v: "-6.2%" },
              { l: "Win", v: "67%" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-2"
              >
                <div className="text-white/40">{s.l}</div>
                <div className="num text-[12.5px] font-medium text-white">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Floating glow chips */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-3 top-[80px]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/75 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
          Latency 32ms
        </span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-2 top-[160px]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/75 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-ice" />
          12 models · streaming
        </span>
      </motion.div>
    </div>
  );
}

function BottomHUD() {
  const items = [
    { l: "Models running", v: 12 },
    { l: "Strategies live", v: 47 },
    { l: "Signals / min", v: 3142 },
    { l: "Median latency", v: 38, suffix: "ms" },
  ];
  return (
    <div className="mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <GlassCard className="grid grid-cols-2 gap-y-4 rounded-2xl px-6 py-5 sm:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 border-r border-white/[0.06] pl-1 last:border-r-0 sm:pl-3"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              {it.l}
            </div>
            <div className="num text-2xl font-semibold tracking-tight text-white">
              <AnimatedCounter value={it.v} suffix={it.suffix} duration={1800} />
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
