import { motion } from "framer-motion";
import { Newspaper, Globe2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { NEWS_FEED } from "@/utils/mockData";
import { cn } from "@/utils/cn";

export default function NewsFeed() {
  return (
    <section id="news" className="relative py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Newspaper className="h-3.5 w-3.5 text-accent-ice" /> News &
              sentiment
            </>
          }
          title={
            <>
              The world's news,{" "}
              <span className="text-gradient-blue">scored in real time.</span>
            </>
          }
          description="Aurora reads every headline, transcript, and filing across 4,200 sources, then projects sentiment onto your book in milliseconds."
        />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          <GlassCard className="rounded-3xl p-4 sm:p-6 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Live newswire
                </div>
                <div className="text-lg font-semibold text-white">
                  Streaming · scored
                </div>
              </div>
              <Badge variant="alpha" pulse>
                LIVE
              </Badge>
            </div>

            <ul className="divide-y divide-white/[0.05]">
              {NEWS_FEED.map((n, i) => {
                const tone =
                  n.sentiment > 0.5
                    ? "mint"
                    : n.sentiment > 0
                      ? "ice"
                      : "rose";
                return (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group flex cursor-pointer items-start gap-4 py-3.5"
                  >
                    <span
                      className={cn(
                        "mt-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-white/10",
                        tone === "mint" && "bg-accent-mint/10 text-accent-mint",
                        tone === "ice" && "bg-accent-blue/10 text-accent-ice",
                        tone === "rose" && "bg-accent-rose/10 text-accent-rose"
                      )}
                    >
                      {n.sentiment > 0 ? "+" : ""}
                      {n.sentiment.toFixed(1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/40">
                        <span className="uppercase tracking-[0.16em]">
                          {n.src}
                        </span>
                        <span>·</span>
                        <span>{n.time}</span>
                        {n.tickers.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10.5px] text-white/65"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-[14px] leading-snug text-white/85 transition-colors group-hover:text-white">
                        {n.title}
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.04]">
                        <div
                          className={cn(
                            "h-full",
                            tone === "mint" &&
                              "bg-[linear-gradient(90deg,rgba(125,240,194,0.5),#7df0c2)]",
                            tone === "ice" &&
                              "bg-[linear-gradient(90deg,rgba(168,200,255,0.5),#a8c8ff)]",
                            tone === "rose" &&
                              "bg-[linear-gradient(90deg,#ff7e9b,rgba(255,126,155,0.5))]"
                          )}
                          style={{
                            width: `${Math.abs(n.sentiment) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </GlassCard>

          {/* Sentiment radial */}
          <GlassCard className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Aggregate sentiment
                </div>
                <div className="text-lg font-semibold text-white">
                  Market mood · 24h
                </div>
              </div>
              <Badge variant="macro">
                <Globe2 className="h-3 w-3" /> Global
              </Badge>
            </div>

            <SentimentDial />

            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Equities", v: 0.62, c: "mint" },
                { l: "Crypto", v: 0.41, c: "ice" },
                { l: "Bonds", v: -0.18, c: "rose" },
                { l: "Commodities", v: 0.12, c: "ice" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2"
                >
                  <span className="text-[12.5px] text-white/75">{s.l}</span>
                  <span
                    className={cn(
                      "num text-[12.5px] font-medium",
                      s.c === "mint" && "text-accent-mint",
                      s.c === "ice" && "text-accent-ice",
                      s.c === "rose" && "text-accent-rose"
                    )}
                  >
                    {s.v > 0 ? "+" : ""}
                    {s.v.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function SentimentDial() {
  const value = 0.62;
  const cx = 130;
  const cy = 130;
  const r = 100;
  const t = (value + 1) / 2;
  const angleRad = Math.PI - t * Math.PI;
  const markerX = cx + Math.cos(angleRad) * r;
  const markerY = cy - Math.sin(angleRad) * r;
  const arcLen = Math.PI * r;

  return (
    <div className="my-5 flex flex-col items-center">
      <svg viewBox="0 0 260 170" className="h-40 w-72">
        <defs>
          <linearGradient id="dial" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ff7e9b" />
            <stop offset="50%" stopColor="#a8c8ff" />
            <stop offset="100%" stopColor="#7df0c2" />
          </linearGradient>
          <filter id="dial-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Filled arc up to value */}
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="url(#dial)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arcLen}
          initial={{ strokeDashoffset: arcLen }}
          whileInView={{ strokeDashoffset: arcLen - arcLen * t }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        {/* Tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = Math.PI - (i / 10) * Math.PI;
          const inner = r - 16;
          const outer = r - 22;
          const x1 = cx + Math.cos(a) * outer;
          const y1 = cy - Math.sin(a) * outer;
          const x2 = cx + Math.cos(a) * inner;
          const y2 = cy - Math.sin(a) * inner;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={i === 5 ? 1.5 : 1}
            />
          );
        })}

        {/* Marker dot on the arc */}
        <motion.circle
          cx={markerX}
          cy={markerY}
          r="6"
          fill="white"
          filter="url(#dial-glow)"
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* End-cap labels */}
        <text
          x={cx - r}
          y={cy + 22}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(255,255,255,0.35)"
        >
          BEAR
        </text>
        <text
          x={cx + r}
          y={cy + 22}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(255,255,255,0.35)"
        >
          BULL
        </text>
      </svg>

      {/* Value + label below the dial — clean, no overlap */}
      <div className="mt-1 flex flex-col items-center">
        <div className="num text-3xl font-semibold tracking-tight text-white">
          +0.62
        </div>
        <div className="mt-0.5 text-[9.5px] uppercase tracking-[0.28em] text-white/45">
          Bullish · Confident
        </div>
      </div>
    </div>
  );
}
