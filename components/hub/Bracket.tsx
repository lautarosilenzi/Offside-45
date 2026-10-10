import type { LiveTeam } from "@/lib/live/espn";
import type { Tie } from "@/lib/live/season";
import TeamLogo from "./TeamLogo";

// Cuadro de eliminación directa, con los cruces lado a lado: una columna por fase, cada llave unida con una línea a la
// fase siguiente, con el global (y los penales); el que pasa, resaltado. Si no entra en la pantalla (en el celular), se
// desliza de costado y cada fase queda entera, sin cortes.
export default function Bracket({ columns }: { columns: { phase: string; label: string; ties: Tie[] }[] }) {
  if (!columns.length) return null;
  return (
    <div className="panel p-3">
      <div className="mb-1 text-center font-display text-lg font-bold uppercase tracking-widest text-navy-950">Cuadro</div>
      {columns.length > 2 && <p className="mb-2 text-center text-xs text-navy-500 sm:hidden">Deslizá hacia el costado para ver hasta la final →</p>}
      <div className="snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:thin]">
        <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(10.5rem, 13rem))` }}>
          {columns.map((c, ci) => (
            <div key={c.phase} className="flex snap-start flex-col">
              <div className="mb-2 rounded-lg bg-navy-950 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-white">{c.label}</div>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {c.ties.map((t, i) => (
                  <div key={i} className={`relative ${ci < columns.length - 1 ? "after:absolute after:left-full after:top-1/2 after:h-0.5 after:w-5 after:bg-volt-500/50" : ""}`}>
                    <TieBox t={t} final={c.phase === "final"} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TieBox({ t, final }: { t: Tie; final: boolean }) {
  const legs = t.legs.length;
  return (
    <div className={`relative overflow-hidden rounded-xl bg-white ring-1 ${final ? "ring-gold-400" : "ring-navy-100"}`}>
      {final && <div className="bg-gold-400 px-2.5 py-0.5 text-center font-display text-[0.7rem] font-bold uppercase tracking-wider text-navy-950">🏆 Final</div>}
      <Row team={t.a} goals={t.aggA} pens={t.penA} win={t.winner === "a"} />
      <div className="flex items-center gap-2 px-2.5 py-0.5">
        <span className="h-px flex-1 bg-navy-100" />
        {legs > 1 && <span className="rounded-full bg-navy-100 px-1.5 text-[0.6rem] font-semibold uppercase text-navy-600">Global</span>}
      </div>
      <Row team={t.b} goals={t.aggB} pens={t.penB} win={t.winner === "b"} />
    </div>
  );
}

function Row({ team, goals, pens, win }: { team: LiveTeam; goals?: number; pens?: number; win: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-2 text-sm ${win ? "bg-gold-400/15" : ""}`}>
      <TeamLogo team={team} size={18} />
      <span className={`min-w-0 flex-1 leading-tight ${win ? "font-bold text-navy-950" : "text-navy-700"}`}>{team.name}</span>
      <span className="shrink-0 pl-1 font-display font-bold tabular-nums text-navy-950">
        {goals ?? ""}
        {pens !== undefined && <span className="ml-0.5 text-xs font-semibold text-navy-500">({pens})</span>}
      </span>
    </div>
  );
}
