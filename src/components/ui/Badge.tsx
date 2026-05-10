import { cn } from "@/utils/cn";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "buy" | "sell" | "hold" | "alpha" | "risk" | "macro" | "anomaly";
  className?: string;
  pulse?: boolean;
};

const styles: Record<NonNullable<Props["variant"]>, string> = {
  default: "bg-white/5 text-white/75 border-white/10",
  buy: "bg-accent-mint/10 text-accent-mint border-accent-mint/25",
  sell: "bg-accent-rose/10 text-accent-rose border-accent-rose/25",
  hold: "bg-white/5 text-white/70 border-white/10",
  alpha: "bg-accent-blue/10 text-accent-ice border-accent-blue/25",
  risk: "bg-accent-rose/10 text-accent-rose border-accent-rose/25",
  macro: "bg-accent-violet/10 text-accent-mist border-accent-violet/25",
  anomaly: "bg-accent-mint/10 text-accent-mint border-accent-mint/25",
};

export default function Badge({
  children,
  variant = "default",
  className,
  pulse,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium tracking-wide uppercase",
        styles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
