/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Geist"', '"Inter"', "system-ui", "sans-serif"],
        sans: ['"Inter"', '"Geist"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Geist Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#05060a",
          900: "#0a0c12",
          800: "#0f1219",
          700: "#161a23",
          600: "#1d222e",
          500: "#262c3a",
          400: "#3a4254",
        },
        accent: {
          blue: "#6ea8ff",
          electric: "#5b9bff",
          ice: "#a8c8ff",
          violet: "#9d7bff",
          mist: "#c9b8ff",
          mint: "#7df0c2",
          rose: "#ff7e9b",
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        glass:
          "inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px -20px rgba(0,0,0,0.6)",
        glow: "0 0 40px -8px rgba(110,168,255,0.45)",
        "glow-strong": "0 0 60px -8px rgba(110,168,255,0.7)",
        "inner-line": "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        "scan-line": "scan-line 2.5s ease-in-out infinite",
        ticker: "ticker 60s linear infinite",
      },
    },
  },
  plugins: [],
};
