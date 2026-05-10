import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, Sparkles, X, AlertOctagon } from "lucide-react";
import { useNotifications, type ToastTone } from "@/store/notifications";
import { cn } from "@/utils/cn";

const ICONS: Record<ToastTone, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warn: AlertTriangle,
  error: AlertOctagon,
  ai: Sparkles,
};

const TONE: Record<ToastTone, string> = {
  info: "text-accent-ice",
  success: "text-accent-mint",
  warn: "text-amber-300",
  error: "text-accent-rose",
  ai: "text-accent-mist",
};

export default function Toaster() {
  const toasts = useNotifications((s) => s.toasts);
  const dismiss = useNotifications((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto"
            >
              <div className="glass relative flex items-start gap-3 overflow-hidden rounded-2xl px-4 py-3 ring-edge">
                <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10", TONE[t.tone])}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium leading-tight text-white">
                    {t.title}
                  </div>
                  {t.body && (
                    <div className="mt-1 text-[12px] leading-relaxed text-white/65">
                      {t.body}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 rounded-md p-1 text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {/* Progress bar */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: 0 }}
                  transition={{ duration: t.ttl / 1000, ease: "linear" }}
                  className={cn(
                    "absolute bottom-0 left-0 h-px",
                    t.tone === "success" && "bg-accent-mint/50",
                    t.tone === "info" && "bg-accent-ice/50",
                    t.tone === "warn" && "bg-amber-300/50",
                    t.tone === "error" && "bg-accent-rose/50",
                    t.tone === "ai" && "bg-accent-mist/50"
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
