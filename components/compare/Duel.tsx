const fmt = (v: number, decimals = 0) => v.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Fila enfrentada: el valor de cada uno con su barra hacia afuera; el mayor (o el menor, si lower) queda resaltado.
// null = sin dato (se muestra "—" y no se compara).
export default function Duel({
  label,
  a,
  b,
  colorA,
  colorB,
  decimals = 0,
  suffix = "",
  lower = false,
  note,
}: {
  label: string;
  a: number | null;
  b: number | null;
  colorA: string;
  colorB: string;
  decimals?: number;
  suffix?: string;
  lower?: boolean;
  note?: string;
}) {
  const max = Math.max(a ?? 0, b ?? 0) || 1;
  const winA = a !== null && b !== null && (lower ? a < b : a > b);
  const winB = a !== null && b !== null && (lower ? b < a : b > a);
  const show = (v: number | null) => (v === null ? "—" : `${fmt(v, decimals)}${suffix}`);
  return (
    <div className="px-4 py-2.5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3">
        <span className={`font-display text-xl tabular-nums sm:text-2xl ${winA ? "font-extrabold text-navy-950" : "font-semibold text-navy-500"}`}>{show(a)}</span>
        <span className="text-center text-xs font-semibold uppercase tracking-wider text-navy-500">
          {label}
          {note && <span className="block font-normal normal-case tracking-normal text-navy-400">{note}</span>}
        </span>
        <span className={`text-right font-display text-xl tabular-nums sm:text-2xl ${winB ? "font-extrabold text-navy-950" : "font-semibold text-navy-500"}`}>{show(b)}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        <div className="flex justify-end rounded-l-full bg-navy-50">
          <div className="h-2 rounded-l-full transition-[width] duration-500" style={{ width: `${((a ?? 0) / max) * 100}%`, background: colorA, opacity: winA || !winB ? 1 : 0.45 }} />
        </div>
        <div className="rounded-r-full bg-navy-50">
          <div className="h-2 rounded-r-full transition-[width] duration-500" style={{ width: `${((b ?? 0) / max) * 100}%`, background: colorB, opacity: winB || !winA ? 1 : 0.45 }} />
        </div>
      </div>
    </div>
  );
}
