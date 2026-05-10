import { useEffect, useState } from "react";

export type MousePos = { x: number; y: number };

export function useMousePosition(): MousePos {
  const [pos, setPos] = useState<MousePos>({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pos;
}
