import { motion } from "framer-motion";
import {
  Command,
  CornerDownLeft,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import ParticleField from "@/components/effects/ParticleField";
import { COMMAND_PALETTE } from "@/utils/mockData";

export default function CommandCenter() {
  const grouped = COMMAND_PALETTE.reduce<Record<string, typeof COMMAND_PALETTE>>(
    (acc, c) => {
      (acc[c.group] ||= []).push(c);
      return acc;
    },
    {}
  );

  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Command className="h-3.5 w-3.5 text-accent-ice" /> Command
              center
            </>
          }
          title={
            <>
              The whole platform,{" "}
              <span className="text-gradient-blue">a keystroke away.</span>
            </>
          }
          description="Press ⌘K from anywhere. Trade, scan, hedge, explain — all from one fluid command surface."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <GlassCard
            variant="strong"
            className="relative overflow-hidden rounded-3xl p-6 lg:col-span-7"
          >
            <ParticleField density={28} className="opacity-50" />
            <div className="relative">
              {/* Search input */}
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 ring-edge">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  defaultValue="hedge my book against macro tail"
                  className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/30"
                />
                <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-white/45">
                  ESC
                </span>
              </div>

              <div className="mt-4 max-h-[360px] space-y-4 overflow-hidden">
                {Object.entries(grouped).map(([g, items], gi) => (
                  <div key={g}>
                    <div className="mb-1 px-2 text-[10.5px] uppercase tracking-[0.18em] text-white/35">
                      {g}
                    </div>
                    <div className="space-y-1">
                      {items.map((it, i) => (
                        <motion.div
                          key={it.k}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: gi * 0.04 + i * 0.03,
                          }}
                          className={
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors " +
                            (gi === 0 && i === 0
                              ? "bg-white/[0.06] text-white ring-1 ring-white/10"
                              : "text-white/75 hover:bg-white/[0.04] hover:text-white")
                          }
                        >
                          <span className="grid h-7 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.03] font-mono text-[11px] text-accent-ice">
                            {it.k}
                          </span>
                          <span className="flex-1 truncate">{it.desc}</span>
                          {gi === 0 && i === 0 && (
                            <CornerDownLeft className="h-3.5 w-3.5 text-white/55" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-white/40">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" />
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" />
                    select
                  </span>
                  <span>esc to close</span>
                </div>
                <span>powered by Aurora</span>
              </div>
            </div>
          </GlassCard>

          {/* Right CTA */}
          <GlassCard className="relative overflow-hidden rounded-3xl p-8 lg:col-span-5">
            <div className="absolute inset-0 mesh-aurora opacity-30" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Ready when you are
              </div>
              <h3 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
                Your terminal is{" "}
                <span className="text-gradient-blue">already running.</span>
              </h3>
              <p className="mt-3 max-w-md pretty text-[14.5px] leading-relaxed text-white/65">
                Connect your broker, choose your risk profile, and let Aurora
                open positions with surgical precision while you sleep.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton variant="primary" size="lg">
                  Open the terminal
                </MagneticButton>
                <MagneticButton variant="outline" size="lg">
                  Talk to sales
                </MagneticButton>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { l: "Connect broker", v: "12 brokers" },
                  { l: "Risk preset", v: "Adaptive" },
                  { l: "Latency", v: "< 38ms" },
                  { l: "Audit", v: "SOC 2" },
                ].map((m) => (
                  <div
                    key={m.l}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
                  >
                    <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                      {m.l}
                    </div>
                    <div className="num mt-1 text-[14px] font-medium text-white">
                      {m.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
