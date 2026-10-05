import { fmtOdd, type Odds } from "@/lib/live/odds";

// Cuotas debajo de un partido por jugarse (1 · X · 2), cuando el visitante las activó.
export default function OddsLine({ odds }: { odds: Odds }) {
  return (
    <div className="flex items-center justify-center gap-1.5 px-3 pb-2 text-xs">
      {[
        { l: "1", v: odds.home },
        { l: "X", v: odds.draw },
        { l: "2", v: odds.away },
      ].map((o) => (
        <span key={o.l} className="flex items-center gap-1 rounded-md bg-gold-400/20 px-2 py-0.5 ring-1 ring-gold-400/40">
          <b className="text-navy-500">{o.l}</b>
          <span className="font-display font-bold tabular-nums text-navy-950">{fmtOdd(o.v)}</span>
        </span>
      ))}
    </div>
  );
}
