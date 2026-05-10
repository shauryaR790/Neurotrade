/**
 * Page-wide cinematic backdrop — sleek pure black.
 * Just a whisper of film grain so large dark areas don't feel flat.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      {/* Very subtle film grain — adds analog warmth on pure black */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Soft top-edge glow — barely there, gives the page a horizon */}
      <div
        className="absolute inset-x-0 top-0 h-[700px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(110,168,255,0.08), transparent 65%)",
        }}
      />
    </div>
  );
}
