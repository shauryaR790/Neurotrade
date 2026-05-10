import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogIn, Sparkles, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/store/auth";
import { notify } from "@/store/notifications";

type Mode = "signin" | "signup";

export default function AuthModal({
  open,
  onClose,
  initialMode = "signin",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { signin, signup } = useAuth();

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setName("");
      setErr(null);
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = async () => {
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await signin(email, password);
        notify.success("Welcome back", "Aurora is syncing your book…");
      } else {
        await signup(email, password, name);
        notify.success("Account created", "$100,000 in paper capital is ready to deploy.");
      }
      onClose();
    } catch (e) {
      setErr((e as Error).message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md"
          >
            <GlassCard
              variant="strong"
              className="relative overflow-hidden rounded-3xl p-7"
            >
              <div className="absolute inset-0 mesh-aurora opacity-25" />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-md text-white/45 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
                  <Sparkles className="h-3.5 w-3.5 text-accent-ice" />
                  Aurora · access
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gradient">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-1 text-[13px] text-white/55">
                  {mode === "signin"
                    ? "Sign in to sync your book, watchlists, and AI sessions."
                    : "$100,000 in paper capital lands in your account instantly."}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="mt-5 flex flex-col gap-3"
                >
                  {mode === "signup" && (
                    <Field
                      label="Name"
                      value={name}
                      onChange={setName}
                      placeholder="Ada Lovelace"
                    />
                  )}
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="ada@neurotrade.com"
                    required
                  />
                  <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    required
                  />

                  {err && (
                    <div className="rounded-lg border border-accent-rose/25 bg-accent-rose/10 px-3 py-2 text-[12.5px] text-accent-rose">
                      {err}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] px-5 text-[13.5px] font-medium text-white ring-1 ring-white/10 shadow-[0_18px_40px_-12px_rgba(110,168,255,0.35)] transition hover:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : mode === "signin" ? (
                      <LogIn className="h-3.5 w-3.5" />
                    ) : (
                      <UserPlus className="h-3.5 w-3.5" />
                    )}
                    {mode === "signin" ? "Sign in" : "Create account"}
                  </button>
                </form>

                <div className="mt-5 flex items-center justify-center gap-1.5 text-[12.5px] text-white/55">
                  {mode === "signin" ? (
                    <>
                      <span>New here?</span>
                      <button
                        onClick={() => setMode("signup")}
                        className="font-medium text-white hover:underline"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      <span>Already on the platform?</span>
                      <button
                        onClick={() => setMode("signin")}
                        className="font-medium text-white hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10.5px] uppercase tracking-[0.16em] text-white/40">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={
          type === "password"
            ? "current-password"
            : type === "email"
              ? "email"
              : "name"
        }
        className="h-11 rounded-xl border border-white/[0.08] bg-black/30 px-4 text-[13.5px] text-white placeholder:text-white/30 outline-none transition focus:border-accent-blue/40 focus:bg-black/40 focus:ring-2 focus:ring-accent-blue/15"
      />
    </label>
  );
}
