import { useMemo } from "react";

type Props = {
  data: number[];
  benchmark?: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
};

/** Premium area chart with grid, glow, gradient fill and a benchmark line. */
export default function AreaChart({
  data,
  benchmark,
  width = 800,
  height = 280,
  className = "",
  ariaLabel = "Performance chart",
}: Props) {
  const { mainPath, areaPath, benchPath, ticks, min, max } = useMemo(() => {
    const all = benchmark ? [...data, ...benchmark] : data;
    const mn = Math.min(...all);
    const mx = Math.max(...all);
    const pad = (mx - mn) * 0.05;
    const min = mn - pad;
    const max = mx + pad;
    const range = max - min || 1;
    const toPath = (arr: number[]) => {
      const stepX = width / (arr.length - 1);
      const pts = arr.map((v, i) => [i * stepX, height - ((v - min) / range) * height] as const);
      let p = `M ${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [px, py] = pts[i - 1];
        const [cx, cy] = pts[i];
        const mx2 = (px + cx) / 2;
        p += ` Q ${px},${py} ${mx2},${(py + cy) / 2}`;
      }
      p += ` T ${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`;
      return { path: p, last: pts[pts.length - 1] };
    };
    const main = toPath(data);
    const bench = benchmark ? toPath(benchmark) : null;
    const areaPath = `${main.path} L ${width},${height} L 0,${height} Z`;
    const ticks = 5;
    return {
      mainPath: main.path,
      areaPath,
      benchPath: bench?.path ?? null,
      ticks,
      min,
      max,
    };
  }, [data, benchmark, width, height]);

  const yLabels = Array.from({ length: ticks }, (_, i) => {
    const v = max - ((max - min) * i) / (ticks - 1);
    return v;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      className={className}
      aria-label={ariaLabel}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6ea8ff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#6ea8ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#6ea8ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="line-stroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a8c8ff" />
          <stop offset="50%" stopColor="#6ea8ff" />
          <stop offset="100%" stopColor="#9d7bff" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* horizontal grid */}
      {yLabels.map((v, i) => {
        const y = (height / (ticks - 1)) * i;
        return (
          <g key={i}>
            <line
              x1={0}
              x2={width}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="2 6"
            />
            <text
              x={6}
              y={y - 4}
              fill="rgba(255,255,255,0.35)"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* benchmark */}
      {benchPath && (
        <path
          d={benchPath}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      )}

      <path d={areaPath} fill="url(#area-fill)" />
      <path
        d={mainPath}
        fill="none"
        stroke="url(#line-stroke)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  );
}
