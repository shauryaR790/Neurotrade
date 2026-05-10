import { useEffect, useState } from "react";

/**
 * Slowly ticks a numeric value with controlled randomness so the UI
 * always feels alive without jumping wildly.
 */
export function useTickingValue(
  initial: number,
  amplitude = 0.0015,
  intervalMs = 1500
): number {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const drift = (Math.random() - 0.5) * 2 * amplitude * initial;
        const next = prev + drift;
        // gravitate toward initial to avoid drifting away forever
        return next * 0.985 + initial * 0.015;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [initial, amplitude, intervalMs]);
  return v;
}
