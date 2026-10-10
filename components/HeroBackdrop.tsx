// Fondo animado de las portadas: un estadio de noche. La cancha en perspectiva (mitad de cancha, círculo central, área y
// arco), dos reflectores que barren despacio y una pelota que hace la comba y entra en el arco: la red se infla con el
// gol. Colores del logo (blanco y celeste) muy suaves, para que el texto se lea. Con "reducir movimiento", todo quieto.
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0">
      <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hb-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#74acdf" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hb-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#74acdf" stopOpacity="0" />
            <stop offset="1" stopColor="#74acdf" stopOpacity="0.14" />
          </linearGradient>
          <pattern id="hb-net" width="7" height="7" patternUnits="userSpaceOnUse">
            <path d="M0 0H7M0 0V7" stroke="#ffffff" strokeWidth="0.6" opacity="0.55" />
          </pattern>
        </defs>

        {/* Reflectores: dos haces de luz desde las torres, que barren de a poco. */}
        <polygon className="hb-beam-l" points="70,-10 90,-10 330,330 120,330" fill="url(#hb-beam)" />
        <polygon className="hb-beam-r" points="710,-10 730,-10 680,330 470,330" fill="url(#hb-beam)" />
        <circle cx="80" cy="-6" r="14" fill="#ffffff" opacity="0.35" />
        <circle cx="720" cy="-6" r="14" fill="#ffffff" opacity="0.35" />

        {/* La cancha en perspectiva. */}
        <path d="M-60 330 L250 112 L550 112 L860 330 Z" fill="url(#hb-grass)" />
        <g fill="none" stroke="#9fc8ef" strokeWidth="1.4" opacity="0.32">
          <path d="M-60 330 L250 112 L550 112 L860 330" />
          <path d="M60 246 L740 246" />
          <ellipse cx="400" cy="300" rx="150" ry="38" />
          <path d="M305 112 L292 146 L508 146 L495 112" />
          <path d="M360 146 Q400 160 440 146" />
        </g>

        {/* El arco con su red; la red se infla cuando entra la pelota. */}
        <g className="hb-goal">
          <rect className="hb-net" x="365" y="88" width="70" height="24" fill="url(#hb-net)" opacity="0.6" />
          <path d="M365 112 V88 H435 V112" fill="none" stroke="#ffffff" strokeWidth="2.2" opacity="0.7" />
        </g>

        {/* La comba: la estela punteada y la pelota que la recorre hasta la red. */}
        <path className="hb-arc" d="M170 296 Q 230 120 402 102" fill="none" stroke="#9fc8ef" strokeWidth="1.6" strokeDasharray="2 9" strokeLinecap="round" opacity="0.4" />
        <g className="hb-ball">
          <circle r="7" fill="#ffffff" />
          <path d="M-3 -2 L0 -4.5 L3 -2 L2 2 L-2 2 Z" fill="#0a1834" />
          <animateMotion dur="7s" repeatCount="indefinite" keyPoints="0; 1; 1" keyTimes="0; 0.5; 1" calcMode="spline" keySplines="0.3 0 0.7 1; 0 0 1 1" path="M170 296 Q 230 120 402 102" />
          <animateTransform attributeName="transform" type="scale" values="1.25; 0.6; 0.6" keyTimes="0; 0.5; 1" dur="7s" repeatCount="indefinite" additive="sum" />
          <animate attributeName="opacity" values="0; 1; 1; 0; 0" keyTimes="0; 0.05; 0.5; 0.58; 1" dur="7s" repeatCount="indefinite" />
        </g>
      </svg>
    </div>
  );
}
