import Link from "next/link";
import Crest from "@/components/Crest";
import { LEAGUE_SEASONS, isAmateurSeason, titleLabel } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";

// Pestaña "Historia" de la Liga Profesional: todos los torneos de Primera desde 1891, por era y por década, cada uno
// con su campeón y su página (tabla y partidos). Abajo, las otras secciones de la historia del fútbol argentino.
const MORE = [
  { href: "/campeones", title: "Todos los campeones", text: "Ligas, copas nacionales y títulos internacionales, año por año." },
  { href: "/historiales", title: "Historial entre equipos", text: "Todos los partidos oficiales entre dos clubes." },
  { href: "/estadisticas", title: "Estadísticas históricas", text: "Tabla histórica, goleadas, rachas y más." },
  { href: "/descensos", title: "Descensos", text: "Todos los descensos de Primera, temporada por temporada." },
  { href: "/copas", title: "Copas nacionales", text: "Las copas oficiales de la AFA, desde 1900." },
];

export default function LeagueHistory() {
  const seasons = [...LEAGUE_SEASONS].reverse();
  const eras = [
    { id: "profesional", title: "Era profesional", sub: "Desde 1931", list: seasons.filter((s) => !isAmateurSeason(s)) },
    { id: "amateur", title: "Era amateur", sub: "1891–1934", list: seasons.filter((s) => isAmateurSeason(s)) },
  ];
  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2">
        {MORE.map((m) => (
          <Link key={m.href} href={m.href} className="panel block px-4 py-3 transition hover:ring-1 hover:ring-volt-400/50">
            <span className="block font-display text-lg font-bold uppercase tracking-wide text-navy-950">{m.title} →</span>
            <span className="text-sm text-navy-500">{m.text}</span>
          </Link>
        ))}
      </section>
      {eras.map((era) => {
        const decades = [...new Set(era.list.map((s) => Math.floor(s.year / 10) * 10))];
        return (
          <section key={era.id}>
            <div className="on-dark mb-3 rounded-3xl bg-navy-950 px-5 py-4 text-white">
              <h2 className="font-display text-2xl font-black uppercase italic leading-none">{era.title}</h2>
              <p className="mt-1 text-sm text-navy-200">
                {era.sub} · {era.list.length} torneos
              </p>
            </div>
            <div className="space-y-4">
              {decades.map((d) => (
                <div key={d}>
                  <h3 className="mb-2 font-display text-lg font-bold text-navy-700">
                    {d}–{d + 9}
                  </h3>
                  <ul className="panel divide-y divide-navy-100">
                    {era.list
                      .filter((s) => Math.floor(s.year / 10) * 10 === d)
                      .map((s) => (
                        <li key={s.slug}>
                          <Link href={`/temporadas/${s.slug}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 px-4 py-2.5 transition hover:bg-volt-500/5">
                            <span className="font-display text-lg font-bold tabular-nums text-navy-900">{s.yearLabel ?? s.year}</span>
                            <span className="min-w-0">
                              <span className="block text-xs text-navy-500">{titleLabel(s)}</span>
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
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
