// Bandera chica (public/flags, ver scripts/flags.ts). Sin código, no muestra nada.
export default function Flag({ code, size = 18, title }: { code?: string; size?: number; title?: string }) {
  if (!code) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG estático, no hace falta optimizarlo
    <img
      src={`/flags/${code}.svg`}
      alt=""
      title={title}
      width={Math.round(size * 1.4)}
      height={size}
      className="inline-block shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(12,24,48,0.12)]"
      style={{ width: Math.round(size * 1.4), height: size }}
    />
  );
}
