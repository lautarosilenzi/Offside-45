import type { LiveEvent } from "@/lib/live/espn";
import { fmtOdd } from "@/lib/live/odds";

// Cuotas 1-X-2 (y más/menos goles) de un partido, para la pestaña "Cuotas" de la página del partido.
export function OddsBox({ odds, home, away }: { odds: NonNullable<LiveEvent["odds"]>; home: string; away: string }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: `1 · ${home}`, v: odds.home },
          { l: "X · Empate", v: odds.draw },
          { l: `2 · ${away}`, v: odds.away },
        ].map((o) => (
          <div key={o.l} className="rounded-xl bg-white px-2 py-2 ring-1 ring-navy-100">
            <div className="break-words leading-snug text-[0.65rem] font-semibold uppercase tracking-wider text-navy-500">{o.l}</div>
            <div className="font-display text-xl font-bold tabular-nums text-navy-950">{fmtOdd(o.v)}</div>
          </div>
        ))}
      </div>
      {odds.total !== undefined && (odds.over || odds.under) && (
        <p className="mt-2 text-center text-xs text-navy-600">
          Más de {odds.total.toLocaleString("es-AR")} goles: <b>{fmtOdd(odds.over)}</b> · Menos: <b>{fmtOdd(odds.under)}</b>
        </p>
      )}
      <p className="mt-2 text-center text-[0.7rem] text-navy-400">
        Cuotas de {odds.provider || "la casa de apuestas"} publicadas por ESPN, en formato decimal; pueden cambiar. Solo para mayores de 18 años. Jugá con
        responsabilidad.
      </p>
    </div>
  );
}
