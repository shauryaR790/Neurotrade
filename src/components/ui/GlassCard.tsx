import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type Props = HTMLMotionProps<"div"> & {
  variant?: "default" | "strong" | "dark";
  glow?: boolean;
  edge?: boolean;
};

const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { className, children, variant = "default", glow = false, edge = true, ...rest },
  ref
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative isolate rounded-2xl",
        variant === "default" && "glass",
        variant === "strong" && "glass-strong",
        variant === "dark" && "glass-dark",
        edge && "ring-edge",
        glow && "shadow-glow",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export default GlassCard;
