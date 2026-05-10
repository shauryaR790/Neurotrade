import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function Performance() {
  const metrics = [
    { v: 38, suffix: "ms", label: "Median model latency", note: "P99 < 92ms" },
    { v: 4200, suffix: "+", label: "News sources scored", note: "every 600ms" },
    { v: 487, suffix: "", label: "Alpha factors tracked", note: "auto-pruned weekly" },
    { v: 99.997, suffix: "%", decimals: 3, label: "Uptime · last 12 months", note: "SOC 2 Type II" },
  ];

  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <TrendingUp className="h-3.5 w-3.5 text-accent-ice" /> Engineered
              for alpha
            </>
          }
          title={
            <>
              Performance is a{" "}
              <span className="text-gradient-blue">first-class feature.</span>
            </>
          }
          description="Every microsecond, every model decision, every signal — observable, reproducible, audit-grade."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <GlassCard className="relative overflow-hidden rounded-2xl p-6">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(closest-side,rgba(110,168,255,0.25),transparent_70%)]"
                />
                <div className="relative">
                  <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                    {m.label}
                  </div>
                  <div className="mt-2 num text-4xl font-semibold tracking-tight text-gradient">
                    <AnimatedCounter
                      value={m.v}
                      suffix={m.suffix}
                      decimals={m.decimals ?? 0}
                      duration={1900}
                    />
                  </div>
                  <div className="mt-2 text-[12px] text-white/55">{m.note}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
