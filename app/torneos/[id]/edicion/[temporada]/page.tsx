import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Bracket from "@/components/hub/Bracket";
import TeamLogo from "@/components/hub/TeamLogo";
import TournamentHero from "@/components/hub/TournamentHero";
import { editionRows } from "@/lib/editions";
import { findLiveCompetition } from "@/lib/live/competitions";
import { editionEvents, type LiveEvent, type LiveTeam } from "@/lib/live/espn";
import { bracket, buildRounds } from "@/lib/live/season";

// Una edición de un torneo: el campeón, el cuadro, los goleadores, los números y todos los partidos. Los partidos
// salen de ESPN, que los tiene más o menos desde 2003 (Champions) y 2008 (Libertadores y Sudamericana); de las
// ediciones más viejas se muestra solo lo bien documentado: campeón, finalista y resultado de la final.
// Una temporada terminada no cambia: se arma una vez y se guarda un día.
export const revalidate = 86400;
export const maxDuration = 30;
export const dynamicParams = true;
export const generateStaticParams = () => [];

const TZ = "America/Argentina/Buenos_Aires";
const day = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)).replace(".", "");

// "2024-25" → "2024–25" (como figura en la lista de campeones).
const seasonLabel = (slug: string) => slug.replace("-", "–");

export function generateMetadata({ params }: { params: { id: string; temporada: string } }): Metadata {
  const c = findLiveCompetition(params.id);
  if (!c) return { title: "126Goals" };
  const title = `${c.name} ${seasonLabel(params.temporada)} · Campeón, cuadro, goleadores y partidos · 126Goals`;
  const description = `${c.name} ${seasonLabel(params.temporada)}: el campeón, el cuadro, los goleadores y todos los partidos de la edición.`;
  return { title, description, openGraph: { title, description } };
}

export default async function EditionPage({ params }: { params: { id: string; temporada: string } }) {
  const comp = findLiveCompetition(params.id);
  if (!comp || !/^\d{4}(-\d{2,4})?$/.test(params.temporada)) notFound();
  const label = seasonLabel(params.temporada);
  const row = editionRows(comp.id).find((r) => r.season === label);
  const events = (await editionEvents(comp.code, label).catch(() => [] as LiveEvent[])).filter((e) => e.state === "post" || e.state === "in");
  if (!row && !events.length) notFound();

  const cols = bracket(events);
  const rounds = buildRounds(events);
  const scorers = topScorers(events).slice(0, 15);
  const goals = events.reduce((n, e) => n + Number(e.home.score ?? 0) + Number(e.away.score ?? 0), 0);
  const all = editionRows(comp.id);
  const i = all.findIndex((r) => r.season === label);
  const newer = i > 0 ? all[i - 1] : undefined;
  const older = i >= 0 && i < all.length - 1 ? all[i + 1] : undefined;

  return (
    <>
      <TournamentHero id={comp.id} name={`${comp.name} ${label}`} country={comp.country}>
        <Link href={`/torneos/${comp.id}#campeones`} className="underline-offset-2 hover:underline">
          ← Todos los campeones
        </Link>
      </TournamentHero>
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
        {row && (
          <section className="panel overflow-hidden">
            <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-gold-400/20 to-transparent px-4 py-6 text-center">
              <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-gold-500">🏆 Campeón</span>
              <span className="font-display text-4xl font-black uppercase italic leading-none text-navy-950 sm:text-5xl">{row.championName}</span>
              {row.runnerUpName && <span className="text-sm text-navy-500">Finalista: {row.runnerUpName}</span>}
              {row.detail && <span className="text-sm text-navy-500">{row.detail}</span>}
            </div>
          </section>
        )}

        {events.length > 0 ? (
          <>
            <section className="grid grid-cols-3 gap-3">
              <Number_ value={events.length} label="Partidos" />
              <Number_ value={goals} label="Goles" />
              <Number_ value={(goals / events.length).toFixed(2).replace(".", ",")} label="Goles por partido" />
            </section>

            {cols.length > 0 && <Bracket columns={cols} />}

            {scorers.length > 0 && (
              <section>
                <h2 className="section-title mb-3">Goleadores</h2>
                <ol className="panel divide-y divide-navy-100 text-sm">
                  {scorers.map((s, k) => (
                    <li key={s.name + s.team.name} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-6 tabular-nums text-navy-400">{k > 0 && scorers[k - 1].goals === s.goals ? "" : k + 1}</span>
                      <TeamLogo team={s.team} size={20} />
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="font-semibold text-navy-900">{s.name}</span>
                        <span className="block text-xs text-navy-400">{s.team.name}</span>
                      </span>
                      <span className="font-display text-lg font-bold tabular-nums text-navy-950">{s.goals}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-2 text-xs text-navy-400">Goles en los partidos de esta edición (sin goles en contra).</p>
              </section>
            )}

            <section>
              <h2 className="section-title mb-3">Partido por partido</h2>
              <div className="space-y-4">
                {[...rounds].reverse().map((r) => (
                  <div key={r.key} className="panel overflow-hidden">
                    <h3 className="bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">{r.label}</h3>
                    <ul className="divide-y divide-navy-100">
                      {r.matches.map((m) => (
                        <li key={m.id}>
                          <Link href={`/partido/${comp.code}/${m.id}`} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-3 text-sm transition hover:bg-volt-500/5 sm:px-4">
                            <Side team={m.home} />
                            <span className="flex flex-col items-center">
                              <span className="rounded-lg bg-navy-900 px-2.5 py-1 font-display text-base font-bold tabular-nums text-white">
                                {m.home.score === undefined ? "vs" : `${m.home.score} - ${m.away.score}`}
                              </span>
                              <span className="mt-1 text-[0.7rem] text-navy-400">{day(m.date)}</span>
                            </span>
                            <Side team={m.away} right />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="panel px-6 py-8 text-center text-navy-500">De esta edición no hay registro partido por partido confiable: se muestran el campeón y la final.</p>
        )}

        <nav className="grid grid-cols-2 gap-4">
          {older ? (
            <Link href={`/torneos/${comp.id}/edicion/${older.season.replace("–", "-")}`} className="panel px-4 py-3 text-center transition hover:border-navy-300">
              <div className="text-xs uppercase tracking-wider text-navy-400">Anterior</div>
              <div className="font-display text-xl font-bold text-navy-900">← {older.season}</div>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/torneos/${comp.id}/edicion/${newer.season.replace("–", "-")}`} className="panel px-4 py-3 text-center transition hover:border-navy-300">
              <div className="text-xs uppercase tracking-wider text-navy-400">Siguiente</div>
              <div className="font-display text-xl font-bold text-navy-900">{newer.season} →</div>
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}

function Number_({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="panel px-2 py-4 text-center">
      <div className="font-display text-3xl font-black tabular-nums text-navy-950">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-navy-500">{label}</div>
    </div>
  );
}

function Side({ team, right }: { team: LiveTeam; right?: boolean }) {
  return (
    <span className={`flex min-w-0 items-center gap-2 ${right ? "flex-row-reverse text-right" : ""}`}>
      <TeamLogo team={team} size={22} />
      <span className={`min-w-0 leading-tight ${team.winner ? "font-bold text-navy-950" : "text-navy-700"}`}>{team.name}</span>
    </span>
  );
}

// Goleadores de la edición, contando los goles de cada partido (los en contra no suman).
function topScorers(events: LiveEvent[]) {
  const map = new Map<string, { name: string; team: LiveTeam; goals: number }>();
  for (const e of events)
    for (const i of e.incidents ?? []) {
      if (i.type !== "goal" && i.type !== "penalty") continue;
      const team = i.side === "home" ? e.home : e.away;
      const k = `${i.player}|${team.name}`;
      const s = map.get(k) ?? { name: i.player, team, goals: 0 };
      s.goals++;
      map.set(k, s);
    }
  return [...map.values()].filter((s) => s.name).sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));
}

