import { useMemo } from "react";

type Props = {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  strokeWidth?: number;
  showArea?: boolean;
  className?: string;
};

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  positive = true,
  strokeWidth = 1.5,
  showArea = true,
  className = "",
}: Props) {
  const { d, area, minY, maxY } = useMemo(() => {
    if (!data.length) return { d: "", area: "", minY: 0, maxY: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const points = data.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return [x, y] as const;
    });
    let dPath = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [px, py] = points[i - 1];
      const [cx, cy] = points[i];
      const mx = (px + cx) / 2;
      dPath += ` Q ${px},${py} ${mx},${(py + cy) / 2}`;
    }
    dPath += ` T ${points[points.length - 1][0]},${points[points.length - 1][1]}`;
    const aPath = `${dPath} L ${points[points.length - 1][0]},${height} L 0,${height} Z`;
    return { d: dPath, area: aPath, minY: min, maxY: max };
  }, [data, width, height]);

  const stroke = positive ? "url(#spark-up)" : "url(#spark-down)";
  const fill = positive ? "url(#spark-up-fill)" : "url(#spark-down-fill)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="none"
      aria-label={`Sparkline ${minY.toFixed(2)} to ${maxY.toFixed(2)}`}
    >
      <defs>
        <linearGradient id="spark-up" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7df0c2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a8c8ff" />
        </linearGradient>
        <linearGradient id="spark-down" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ff7e9b" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#9d7bff" />
        </linearGradient>
        <linearGradient id="spark-up-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7df0c2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7df0c2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="spark-down-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff7e9b" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#ff7e9b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && <path d={area} fill={fill} />}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
