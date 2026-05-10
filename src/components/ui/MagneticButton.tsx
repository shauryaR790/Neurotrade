import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  href?: string;
};

export default function MagneticButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  className,
  href,
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const rx = useTransform(sy, [-20, 20], [6, -6]);
  const ry = useTransform(sx, [-20, 20], [-6, 6]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width / 2;
    const cy = e.clientY - r.top - r.height / 2;
    x.set(cx * 0.25);
    y.set(cy * 0.4);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-7 text-[15px]",
  } as const;

  const variants = {
    primary: cn(
      "text-white",
      "bg-[linear-gradient(180deg,#1a2236_0%,#0c1220_100%)]",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-12px_rgba(110,168,255,0.35)]"
    ),
    ghost:
      "text-white/85 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10",
    outline:
      "text-white/90 border border-white/15 bg-white/[0.03] hover:bg-white/[0.06]",
  } as const;

  const Inner = (
    <motion.span
      style={{ x: sx, y: sy, rotateX: rx, rotateY: ry }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight will-change-transform",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {variant === "primary" && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(80%_120%_at_50%_-10%,rgba(168,200,255,0.55),transparent_60%)] opacity-80" />
          <span className="pointer-events-none absolute -inset-px rounded-full bg-[conic-gradient(from_180deg,rgba(110,168,255,0.5),rgba(157,123,255,0.4),rgba(125,240,194,0.3),rgba(110,168,255,0.5))] opacity-30 blur-md" />
        </>
      )}
      {icon && <span className="relative z-10 -ml-0.5 opacity-90">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {iconRight && (
        <span className="relative z-10 -mr-0.5 opacity-90">{iconRight}</span>
      )}
    </motion.span>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="inline-block [perspective:600px]"
      >
        {Inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      className="inline-block [perspective:600px]"
    >
      {Inner}
    </button>
  );
}
