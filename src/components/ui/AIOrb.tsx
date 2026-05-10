import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/** A glowing, animated AI core orb with concentric rings. */
export default function AIOrb({
  size = 220,
  thinking = true,
  className = "",
}: {
  size?: number;
  thinking?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(110,168,255,0.0), rgba(110,168,255,0.7), rgba(157,123,255,0.6), rgba(125,240,194,0.5), rgba(110,168,255,0.0))",
          filter: "blur(2px)",
          mask: "radial-gradient(circle, transparent 60%, #000 60%, #000 65%, transparent 65%)",
          WebkitMask:
            "radial-gradient(circle, transparent 60%, #000 60%, #000 65%, transparent 65%)",
        }}
        animate={{ rotate: thinking ? 360 : 0 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* mid ring (counter-rotation) */}
      <motion.div
        className="absolute inset-[14%] rounded-full border border-white/10"
        style={{
          background:
            "conic-gradient(from 90deg, rgba(168,200,255,0.0), rgba(168,200,255,0.6), rgba(168,200,255,0.0) 50%, rgba(157,123,255,0.5), rgba(168,200,255,0.0))",
          mask: "radial-gradient(circle, transparent 70%, #000 70%, #000 78%, transparent 78%)",
          WebkitMask:
            "radial-gradient(circle, transparent 70%, #000 70%, #000 78%, transparent 78%)",
        }}
        animate={{ rotate: thinking ? -360 : 0 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* core */}
      <div
        className="absolute inset-[26%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ffffff 0%, #c9d8f5 18%, #6ea8ff 50%, #2a3a66 80%, #0a0c12 100%)",
          boxShadow:
            "inset 0 0 30px rgba(255,255,255,0.45), inset 0 -10px 30px rgba(157,123,255,0.4), 0 0 80px rgba(110,168,255,0.55)",
        }}
      />

      {/* inner highlight */}
      <motion.div
        className="absolute inset-[34%] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.0) 60%)",
        }}
        animate={{ scale: thinking ? [1, 1.06, 1] : 1, opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* pulsing aura */}
      <motion.div
        className="absolute -inset-4 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(110,168,255,0.35), transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* orbiting dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{ width: size, height: size }}
      >
        <span
          className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_18px_rgba(168,200,255,0.9)]"
          style={{ top: "4%", left: "calc(50% - 4px)" }}
        />
      </motion.div>
    </div>
  );
}
