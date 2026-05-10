import { Github, Twitter, Linkedin } from "lucide-react";

const groups = [
  {
    title: "Product",
    links: [
      "Aurora Copilot",
      "Strategy Builder",
      "Signal Engine",
      "Workspace",
      "Backtesting",
    ],
  },
  {
    title: "Company",
    links: ["About", "Manifesto", "Customers", "Careers", "Press"],
  },
  {
    title: "Resources",
    links: ["Docs", "Changelog", "API", "Status", "Security"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Disclosures", "Risk", "Compliance"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950/40 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a
              href="#"
              className="text-[16px] font-bold tracking-[0.22em] text-white"
            >
              NEUROTRADE
            </a>
            <p className="mt-5 max-w-md pretty text-[14px] leading-relaxed text-white/55">
              An AI-native trading intelligence platform built for the next
              generation of operators, allocators, and quants. Cinematic by
              design, ruthless by performance.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {groups.map((g) => (
              <div key={g.title}>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  {g.title}
                </div>
                <ul className="mt-3 space-y-2 text-[13px]">
                  {g.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-white/65 transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-[12px] text-white/45 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-mint shadow-[0_0_8px_rgba(125,240,194,0.7)]" />
            All systems nominal · Tokyo, London, NY
          </div>
          <div className="flex items-center gap-4">
            <span>© 2025 Neurotrade Labs Inc.</span>
            <span>SOC 2 Type II · ISO 27001</span>
          </div>
        </div>

        {/* Massive wordmark */}
        <div className="pointer-events-none mt-12 select-none text-center">
          <div
            className="bg-clip-text text-transparent"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontSize: "clamp(72px, 17vw, 240px)",
              lineHeight: 0.85,
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.0) 80%)",
            }}
          >
            NEUROTRADE
          </div>
        </div>
      </div>
    </footer>
  );
}
