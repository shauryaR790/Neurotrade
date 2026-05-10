import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowUp,
  Mic,
  Wand2,
  ShieldAlert,
  TrendingUp,
  Brain,
  Loader2,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import AIOrb from "@/components/ui/AIOrb";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import ParticleField from "@/components/effects/ParticleField";
import { useEffect, useRef, useState } from "react";
import { api, ApiError, type AIChatResponse } from "@/lib/api";
import { notify } from "@/store/notifications";

interface ChatTurn {
  role: "user" | "ai";
  text: string;
  cards?: { title: string; bullets: string[] }[];
  actions?: { label: string; tone: string }[];
  source?: AIChatResponse["source"];
}

const INITIAL_CONVERSATION: ChatTurn[] = [
  {
    role: "user",
    text: "Why is my portfolio down 1.2% today and what should I do about it?",
  },
  {
    role: "ai",
    text: "Drawdown is concentrated in your mobility sleeve (TSLA -2.4%). Two attribution drivers: weak delivery whisper + China FX repricing. Risk regime is still Risk-On, so this looks tactical, not structural.",
    actions: [
      { label: "Trim TSLA 30%", tone: "primary" },
      { label: "Hedge w/ XLK puts", tone: "ghost" },
      { label: "Hold & monitor", tone: "ghost" },
    ],
    cards: [
      {
        title: "Attribution",
        bullets: [
          "TSLA -2.41% → -68bps total",
          "Defensives drag → -22bps",
          "Semis tailwind → +44bps",
        ],
      },
      {
        title: "Recommendation",
        bullets: [
          "Trim TSLA → 4% weight",
          "Add NVDA / AMD +0.6% each",
          "Long VIX 0.3R hedge layer",
        ],
      },
    ],
  },
];

const suggestions = [
  { icon: Wand2, label: "Scan for momentum + sentiment opportunities" },
  { icon: ShieldAlert, label: "Hedge my book against macro tail risk" },
  { icon: TrendingUp, label: "Explain today's BTC move with attribution" },
  { icon: Brain, label: "What is the current macro regime?" },
];

export default function AICopilot() {
  const [conversation, setConversation] = useState<ChatTurn[]>(INITIAL_CONVERSATION);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationRef.current) return;
    conversationRef.current.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversation, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    const next: ChatTurn[] = [...conversation, { role: "user", text: trimmed }];
    setConversation(next);
    setBusy(true);
    try {
      const history = next.map((t) => ({
        role: t.role === "ai" ? ("assistant" as const) : ("user" as const),
        content: t.text,
      }));
      const resp = await api.ai.chat(history);
      setConversation((c) => [
        ...c,
        {
          role: "ai",
          text: resp.reply,
          cards: resp.cards,
          actions: resp.actions,
          source: resp.source,
        },
      ]);
    } catch (e) {
      const msg =
        e instanceof ApiError && e.status === 0
          ? "Backend offline — start the server with `npm run dev` in /server."
          : (e as Error).message;
      notify.error("Aurora couldn't respond", msg);
      setConversation((c) => [
        ...c,
        {
          role: "ai",
          text: `I'm having trouble reaching my models right now. ${msg}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="copilot" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="h-3.5 w-3.5 text-accent-ice" /> AI Copilot
            </>
          }
          title={
            <>
              A trading mind that{" "}
              <span className="text-gradient-blue">never sleeps.</span>
            </>
          }
          description="Aurora speaks markets. Ask it anything in natural language — it reasons across tick data, news, options flow, macro, and your own positions, then acts with one click."
        />

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT — orb */}
          <div className="relative lg:col-span-5">
            <GlassCard
              variant="strong"
              className="relative h-[460px] overflow-hidden rounded-3xl"
            >
              <ParticleField density={45} className="opacity-60" />
              <div className="absolute inset-0 mesh-aurora opacity-50" />
              <div className="relative flex h-full flex-col items-center justify-center px-8 py-10 text-center">
                <AIOrb size={240} />
                <div className="mt-8">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Aurora · neural core
                  </div>
                  <div className="mt-2 text-xl font-semibold tracking-tight text-white">
                    Reasoning across <span className="text-accent-ice">12</span>{" "}
                    frontier models
                  </div>
                  <ThinkingTrace />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT — conversation */}
          <div className="lg:col-span-7">
            <GlassCard className="flex flex-col rounded-3xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-mint shadow-[0_0_12px_rgba(125,240,194,0.7)]" />
                  <div className="text-[12.5px] font-medium text-white/85">
                    Aurora · Trading Copilot
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="alpha">REAL-TIME</Badge>
                  <span className="num text-[11px] text-white/40">
                    GPU · 38ms
                  </span>
                </div>
              </div>

              {/* Conversation */}
              <div
                ref={conversationRef}
                className="flex max-h-[480px] flex-col gap-4 overflow-y-auto px-5 py-5"
              >
                {conversation.map((m, i) =>
                  m.role === "user" ? (
                    <UserBubble key={i} text={m.text} />
                  ) : (
                    <AIBubble key={i} message={m} animateIn={i >= INITIAL_CONVERSATION.length} />
                  )
                )}
                {busy && (
                  <div className="flex items-center gap-2 pl-10 text-[12px] text-white/55">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-ice" />
                    Aurora is reasoning across live market context…
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="grid grid-cols-1 gap-2 px-5 pb-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => send(s.label)}
                    disabled={busy}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-[12.5px] text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.04] text-accent-ice ring-1 ring-white/10 transition group-hover:bg-white/[0.08]">
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1 truncate">{s.label}</span>
                    <ArrowUp className="h-3.5 w-3.5 -rotate-45 text-white/30 transition group-hover:text-white/70" />
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="m-3 mt-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 ring-edge"
              >
                <div className="flex items-center gap-2 px-2">
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-lg text-white/55 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Aurora · /scan, /hedge, explain BTC…"
                    disabled={busy}
                    className="flex-1 bg-transparent py-2 text-[13.5px] text-white outline-none placeholder:text-white/35 disabled:opacity-60"
                  />
                  <span className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/40 sm:inline-flex">
                    ⌘K
                  </span>
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    className="group inline-flex h-8 items-center gap-1 rounded-lg bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-3 text-[12.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_24px_-8px_rgba(110,168,255,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_28px_-8px_rgba(110,168,255,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        Send
                        <ArrowUp className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[linear-gradient(180deg,#1a2236_0%,#0d1220_100%)] px-4 py-3 text-[13.5px] leading-relaxed text-white/85 ring-1 ring-white/10"
    >
      {text}
    </motion.div>
  );
}

function AIBubble({
  message,
  animateIn,
}: {
  message: {
    text: string;
    actions?: { label: string; tone: string }[];
    cards?: { title: string; bullets: string[] }[];
    source?: "openai" | "fallback";
  };
  animateIn?: boolean;
}) {
  const motionProps = animateIn
    ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" } as const,
      };
  return (
    <motion.div
      {...motionProps}
      transition={{ duration: 0.6, delay: 0.05 }}
      className="flex max-w-[92%] flex-col gap-3"
    >
      <div className="flex gap-3">
        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#a8c8ff,#6ea8ff_50%,#1a2236)] ring-1 ring-white/15 shadow-[0_0_18px_rgba(110,168,255,0.5)]">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 rounded-2xl rounded-tl-sm bg-white/[0.03] px-4 py-3 text-[13.5px] leading-relaxed text-white/80 ring-1 ring-white/[0.07]">
          <Typewriter text={message.text} />
        </div>
      </div>

      {message.cards && (
        <div className="ml-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {message.cards.map((c, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"
            >
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                {c.title}
              </div>
              <ul className="mt-1.5 space-y-1 text-[12.5px] text-white/75">
                {c.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-accent-ice" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {message.actions && (
        <div className="ml-10 flex flex-wrap gap-2">
          {message.actions.map((a, i) => (
            <button
              key={i}
              className={
                a.tone === "primary"
                  ? "inline-flex h-8 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-3 text-[12px] text-white ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:ring-white/20"
                  : "inline-flex h-8 items-center gap-1.5 rounded-full bg-white/[0.03] px-3 text-[12px] text-white/75 ring-1 ring-white/10 hover:bg-white/[0.06] hover:text-white"
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    let t: number | undefined;
    const tick = () => {
      i++;
      setShown(text.slice(0, i));
      if (i < text.length) t = window.setTimeout(tick, 14 + Math.random() * 16);
    };
    tick();
    return () => {
      if (t) clearTimeout(t);
    };
  }, [text]);
  return (
    <>
      {shown}
      {shown.length < text.length && (
        <span className="ml-0.5 inline-block h-3.5 w-1 -translate-y-[1px] animate-pulse-soft rounded bg-accent-ice align-middle" />
      )}
    </>
  );
}

function ThinkingTrace() {
  const lines = [
    "Streaming order book · 12 venues",
    "Cross-correlating macro regime",
    "Scoring 487 alpha factors",
    "Composing recommendation",
  ];
  return (
    <div className="mt-6 flex flex-col gap-1.5 text-left">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4 + i * 0.4,
          }}
          className="flex items-center gap-2 text-[11.5px] text-white/55"
        >
          <span className="font-mono text-[10px] text-white/30">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="h-1 w-1 rounded-full bg-accent-mint shadow-[0_0_8px_rgba(125,240,194,0.7)]" />
          {l}
        </motion.div>
      ))}
    </div>
  );
}
