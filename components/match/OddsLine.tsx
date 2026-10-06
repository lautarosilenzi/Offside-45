import { fmtOdd, type Odds } from "@/lib/live/odds";

// Cuotas debajo de un partido por jugarse, cuando el visitante las activó. Usa la misma grilla que la fila del partido
// (`grid`: columnas, espacios y márgenes): el 1 queda debajo del local, la X debajo del resultado y el 2 debajo del
// visitante.
export default function OddsLine({ odds, grid }: { odds: Odds; grid: string }) {
  // Si ESPN no publica las tres (a veces llega solo la X y el 2, con valores sin sentido), no se muestran.
  if (!odds.home || !odds.draw || !odds.away) return null;
  const pill = (l: string, v?: number) => (
    <span className="inline-flex items-center gap-1 rounded-md bg-gold-400/15 px-2 py-0.5 text-xs ring-1 ring-gold-400/40">
      <b className="text-navy-500">{l}</b>
      <span className="font-display font-bold tabular-nums text-navy-950">{fmtOdd(v)}</span>
    </span>
  );
  return (
    <div className={`grid items-center pb-2.5 ${grid}`}>
      <span />
      <span className="flex justify-end">{pill("1", odds.home)}</span>
      <span className="flex justify-center">{pill("X", odds.draw)}</span>
      <span className="flex justify-start">{pill("2", odds.away)}</span>
    </div>
  );
}
