import Link from "next/link";
import Crest from "@/components/Crest";
import { ASCENSO_SEASONS } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { Season } from "@/lib/types";

// Historia de la segunda división (Primera B, Primera B Nacional, Primera Nacional): todos los torneos cargados, por década,
// cada uno con su campeón y su página (tabla y partidos). Se va completando de a poco, temporada por temporada.

// "Primera B Nacional 1986/87 · Reducido" → "Primera B Nacional · Reducido".
const label = (s: Season) => s.title.replace(/\s*\d{4}(\/\d{2})?/, "");

export default function AscensoHistory() {
  const seasons = ASCENSO_SEASONS;
  const decades = [...new Set(seasons.map((s) => Math.floor(s.year / 10) * 10))];
  const matches = seasons.reduce((n, s) => n + s.matches.length, 0);
  return (
    <div className="space-y-6">
      <p className="panel px-4 py-3 text-sm text-navy-600">
        Partido por partido, verificado con RSSSF y con Wikipedia. Lo vamos completando de a poco: por ahora hay {seasons.length} torneos y{" "}
        {matches.toLocaleString("es-AR")} partidos. Cada partido también aparece en el{" "}
        <Link href="/historiales" className="font-semibold text-navy-900 underline underline-offset-2">
          historial
        </Link>{" "}
        entre los dos equipos.
      </p>
      {decades.map((d) => (
        <section key={d}>
          <h3 className="mb-2 font-display text-lg font-bold text-navy-700">
            {d}–{d + 9}
          </h3>
          <ul className="panel divide-y divide-navy-100">
            {seasons
              .filter((s) => Math.floor(s.year / 10) * 10 === d)
              .map((s) => (
                <li key={s.slug}>
                  <Link href={`/temporadas/${s.slug}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 px-4 py-2.5 transition hover:bg-volt-500/5">
                    <span className="font-display text-lg font-bold tabular-nums text-navy-900">{s.yearLabel ?? s.year}</span>
                    <span className="min-w-0">
                      <span className="block text-xs text-navy-500">{label(s)}</span>
                      {s.championIds.length ? (
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {s.championIds.map((id) => {
                            const t = getTeam(id);
                            return t ? (
                              <span key={id} className="flex items-center gap-1.5 font-semibold text-navy-950">
                                <Crest team={t} size="xs" /> {t.name}
                              </span>
                            ) : null;
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-navy-500">{s.inProgress ? "En juego" : "Sin campeón"}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
