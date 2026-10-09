// Fondo animado de las portadas, con la estética del logo de 126Goals: el "126" (el gol número 126) en letras
// condensadas gigantes con el degradé blanco y celeste del logo, un destello que lo recorre, la pelota que hace la
// curva del gol y la red del arco en la esquina. Todo se queda quieto con "reducir movimiento" (globals.css).
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0">
      <svg viewBox="0 0 800 320" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hb-ink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.1" stopColor="#ffffff" />
            <stop offset="0.95" stopColor="#74acdf" />
          </linearGradient>
          <linearGradient id="hb-sweep" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" values="-1 0; 1 0; 1 0" keyTimes="0; 0.55; 1" dur="7s" repeatCount="indefinite" />
          </linearGradient>
          <pattern id="hb-net" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0H16M0 0V16" stroke="#74acdf" strokeWidth="1" />
          </pattern>
          <radialGradient id="hb-fade" cx="1" cy="0" r="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hb-net-mask">
            <rect width="800" height="320" fill="url(#hb-fade)" />
          </mask>
        </defs>

        {/* La red del arco, en la esquina, que se desvanece. */}
        <rect x="560" y="0" width="240" height="190" fill="url(#hb-net)" mask="url(#hb-net-mask)" opacity="0.28" />

        {/* El 126: contorno con el degradé del logo y un destello que lo cruza. */}
        <g fontFamily="var(--font-display), sans-serif" fontWeight="900" fontStyle="italic" fontSize="330" textAnchor="end" letterSpacing="-6">
          <text x="800" y="300" fill="url(#hb-ink)" opacity="0.07">
            126
          </text>
          <text x="800" y="300" fill="none" stroke="url(#hb-ink)" strokeWidth="2" opacity="0.35">
            126
          </text>
          <text className="hb-shine" x="800" y="300" fill="url(#hb-sweep)" opacity="0.35">
            126
          </text>
        </g>

        {/* La curva del gol: punteada, se dibuja y la pelota la recorre hasta la red. */}
        <path className="hb-arc" d="M40 300 Q 330 -20 690 70" fill="none" stroke="#74acdf" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" opacity="0.55" />
        <g className="hb-ball">
          <circle r="7" fill="#ffffff" />
          <circle r="7" fill="none" stroke="#74acdf" strokeWidth="1.5" />
          <path d="M-3 -2 L0 -4.5 L3 -2 L2 2 L-2 2 Z" fill="#0a1834" />
          <animateMotion dur="7s" repeatCount="indefinite" keyPoints="0; 1; 1" keyTimes="0; 0.45; 1" calcMode="spline" keySplines="0.4 0 0.6 1; 0 0 1 1" path="M40 300 Q 330 -20 690 70" rotate="auto" />
          <animate attributeName="opacity" values="0; 1; 1; 0; 0" keyTimes="0; 0.05; 0.42; 0.5; 1" dur="7s" repeatCount="indefinite" />
        </g>
      </svg>
    </div>
  );
}
