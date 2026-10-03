// Logo del foro del hincha: un pajarito en vuelo, al estilo del viejo logo de Twitter pero dibujado para el sitio
// (no es el logo de la marca), blanco sobre un azul vivo.
export default function ForoLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
      <defs>
        <linearGradient id="foro-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38a9ff" />
          <stop offset="1" stopColor="#0b5fe0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#foro-bg)" />
      {/* Cuerpo, con el pico y la cola */}
      <path
        d="M9.5 29.5C9.6 20 17.6 13.2 27.6 14c4.4.4 7.6 2.6 9.3 5.2l4.8-1.9-2.6 4 3.6.6-4.6 2.2C37.6 32.8 30.4 39.6 20.4 39.6c-4.9 0-8.6-1.4-11.6-3.8 3.9.3 7-.8 9.5-2.9-4-.4-6.6-1.4-8.8-3.4z"
        fill="#fff"
      />
      {/* Ala */}
      <path d="M13.6 21.4c2.9 3.2 7 4.9 11.6 4.9-2.6-2.4-4.5-5.4-5-8.6-3 .4-5.3 1.8-6.6 3.7z" fill="#cfe6ff" />
      {/* Ojo */}
      <circle cx="32.6" cy="19.4" r="1.4" fill="#0b5fe0" />
    </svg>
  );
}
