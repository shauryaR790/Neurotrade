import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Cpu,
  LineChart,
  Newspaper,
  Search,
  Command,
  LogOut,
  User as UserIcon,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/store/auth";
import { usePrices } from "@/store/prices";
import { notify } from "@/store/notifications";

const links = [
  { label: "Copilot", href: "#copilot", icon: Cpu },
  { label: "Markets", href: "#markets", icon: LineChart },
  { label: "Strategies", href: "#strategy", icon: Sparkles },
  { label: "Intel", href: "#news", icon: Newspaper },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], [10, 22]);
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.10)"]
  );
  const backdrop = useTransform(blur, (v) => `blur(${v}px) saturate(140%)`);
  const bg = useTransform(scrollY, [0, 80], [
    "rgba(8, 10, 16, 0.22)",
    "rgba(8, 10, 16, 0.62)",
  ]);

  const user = useAuth((s) => s.user);
  const signout = useAuth((s) => s.signout);
  const wsStatus = usePrices((s) => s.status);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileNavOpen]);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <motion.header
        style={{
          backdropFilter: backdrop,
          WebkitBackdropFilter: backdrop,
          backgroundColor: bg,
          borderColor: border,
        }}
        className="fixed inset-x-0 top-0 z-50 border-b"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#"
            className="text-[15px] font-bold tracking-[0.22em] text-white"
          >
            NEUROTRADE
          </a>

          {/* Nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 backdrop-blur md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <l.icon className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <WSStatusBadge status={wsStatus} />

            <button className="hidden h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[12px] text-white/55 hover:bg-white/[0.06] sm:inline-flex">
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Search markets…</span>
              <span className="ml-2 hidden items-center gap-1 text-[10px] text-white/40 lg:inline-flex">
                <Command className="h-3 w-3" /> K
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 transition-colors hover:bg-white/[0.07]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#a8c8ff,#6ea8ff_55%,#1a2236)] text-[10.5px] font-semibold uppercase text-white">
                    {user.name.slice(0, 2)}
                  </span>
                  <span className="hidden text-[12.5px] text-white/85 sm:inline">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                {menuOpen && (
                  <div
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl ring-edge"
                  >
                    <div className="border-b border-white/[0.06] p-3">
                      <div className="text-[13px] font-medium text-white">
                        {user.name}
                      </div>
                      <div className="text-[11.5px] text-white/55">
                        {user.email}
                      </div>
                      <div className="mt-2 flex items-baseline justify-between text-[11px] text-white/40">
                        <span className="uppercase tracking-[0.14em]">
                          Cash balance
                        </span>
                        <span className="num text-white">
                          ${user.cashBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signout();
                        setMenuOpen(false);
                        notify.info("Signed out", "Session ended securely.");
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth("signin")}
                  className="hidden h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[12.5px] text-white/85 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  Sign in
                </button>
                <MagneticButton
                  size="sm"
                  variant="primary"
                  onClick={() => openAuth("signup")}
                >
                  Launch app
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              onClick={() => setMobileNavOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l border-white/10 bg-[rgba(8,10,16,0.92)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <span className="text-[14px] font-bold tracking-[0.22em] text-white">
                  NEUROTRADE
                </span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-3 py-4">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="group inline-flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-[14px] text-white/80 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] text-accent-ice ring-1 ring-white/10">
                      <l.icon className="h-4 w-4" />
                    </span>
                    {l.label}
                  </a>
                ))}
              </nav>

              {!user && (
                <div className="mt-2 flex flex-col gap-2 px-5 pb-6">
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      openAuth("signin");
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-[13.5px] text-white/85 hover:bg-white/[0.06]"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      openAuth("signup");
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1d2944,#0e1320)] text-[13.5px] font-medium text-white ring-1 ring-white/10 shadow-[0_18px_40px_-12px_rgba(110,168,255,0.4)] hover:ring-white/20"
                  >
                    Launch app
                  </button>
                </div>
              )}

              {user && (
                <div className="mt-2 flex flex-col gap-3 border-t border-white/[0.06] px-5 py-5">
                  <div>
                    <div className="text-[14px] font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-[12px] text-white/55">
                      {user.email}
                    </div>
                    <div className="mt-2 flex items-baseline justify-between text-[11px] text-white/40">
                      <span className="uppercase tracking-[0.14em]">
                        Cash
                      </span>
                      <span className="num text-white">
                        $
                        {user.cashBalance.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signout();
                      setMobileNavOpen(false);
                      notify.info("Signed out", "Session ended securely.");
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-[13px] text-white/80 hover:bg-white/[0.06]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}

function WSStatusBadge({ status }: { status: string }) {
  const tone =
    status === "open"
      ? { dot: "bg-accent-mint shadow-[0_0_8px_rgba(125,240,194,0.7)]", text: "Live" }
      : status === "connecting"
        ? { dot: "bg-accent-ice animate-pulse-soft", text: "Sync…" }
        : { dot: "bg-white/30", text: "Offline" };
  return (
    <span className="hidden h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[11px] text-white/65 sm:inline-flex">
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      <span className="num">{tone.text}</span>
    </span>
  );
}
