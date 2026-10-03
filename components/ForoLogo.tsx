// Logo del foro del hincha: una cruz de trazos rectos, uno grueso y uno fino, al estilo de las redes sociales, con un
// banderín de línea en la punta (el banderín del "offside"). Azul oscuro.
export default function ForoLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#0a1a3f" />
      <path d="M12 11h7.2l17 26H29z" fill="#fff" />
      <path d="M35.2 11 13 37h-2.6L32.6 11z" fill="#fff" />
      <path d="M33 6.5v8" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M33.8 6.6h6.2l-1.7 2.4 1.7 2.4h-6.2z" fill="#3b82f6" />
    </svg>
  );
}
