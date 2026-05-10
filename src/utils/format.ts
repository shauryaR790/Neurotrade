export const formatNumber = (n: number, digits = 2) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const formatPct = (n: number, digits = 2) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;

export const formatCurrency = (n: number, digits = 2) =>
  `$${formatNumber(n, digits)}`;

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
