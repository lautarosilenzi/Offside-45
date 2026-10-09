import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompLogo from "@/components/CompLogo";
import HubTabs from "@/components/hub/HubTabs";
import TeamLogo from "@/components/hub/TeamLogo";
import TeamHero from "@/components/team/TeamHero";
import TeamMatches, { MatchCard } from "@/components/team/TeamMatches";
import VENUES from "@/lib/data/venues.generated.json";
import { honoursOf } from "@/lib/honours";
import { currentCoach } from "@/lib/live/coach";
import { findLiveCompetition } from "@/lib/live/competitions";
import { foundedYear } from "@/lib/live/club-info";
import { roster, seasonEvents, teamAllSchedule, teamInfo, type LiveEvent, type RosterPlayer } from "@/lib/live/espn";
import { teamPhotos, type Photo } from "@/lib/live/photos";
import { mergeSquad, wikiSquad, type Line, type TeamPlayer } from "@/lib/live/squad";

export const revalidate = 600;
// La primera vez busca el plantel (Wikipedia) y las fotos (ESPN y Wikimedia): puede tardar bastante más que los 10 s por
// defecto (hasta 28 s probado sin nada guardado).
export const maxDuration = 60;
export const dynamicParams = true;
export const generateStaticParams = () => [];

export async function generateMetadata({ params }: { params: { id: string; team: string } }): Promise<Metadata> {
  const c = findLiveCompetition(params.id);
  // Nombre del club (ESPN), para el título y la vista previa al compartir.
  const name = /^\d+$/.test(params.team)
    ? await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${params.team}`, { next: { revalidate: 86400 } })
        .then((r) => r.json())
        .then((j) => j.team?.displayName as string | undefined)
        .catch(() => undefined)
    : undefined;
  const title = name ? `${name} · Plantel, partidos y estadísticas · 126Goals` : c ? `Equipo · ${c.name} · 126Goals` : "126Goals";
  const description = name ? `${name}: plantel con fotos, próximos partidos, resultados, goleadores y títulos${c ? ` en ${c.name}` : ""}.` : undefined;
  return { title, description, openGraph: { title, description } };
}

const POSITION: Record<string, Line> = { Goalkeeper: "Arquero", Defender: "Defensor", Midfielder: "Mediocampista", Forward: "Delantero" };
const GROUPS: { line: Line; title: string }[] = [
  { line: "Arquero", title: "Arqueros" },
  { line: "Defensor", title: "Defensores" },
  { line: "Mediocampista", title: "Mediocampistas" },
  { line: "Delantero", title: "Delanteros" },
];

export default async function TeamPage({ params }: { params: { id: string; team: string } }) {
  const comp = findLiveCompetition(params.id);
  if (!comp || !/^\d+$/.test(params.team)) notFound();

  const [squad, season, info, coach, photos, wiki, schedule, founded] = await Promise.all([
    roster(comp.code, params.team).catch(() => null),
    seasonEvents(comp.code).catch(() => ({ name: "", label: "", events: [] as LiveEvent[], all: [] as LiveEvent[] })),
    teamInfo(params.team).catch(() => ({ league: undefined, color: undefined })),
    // El DT de ESPN está desactualizado: se usa el que coincide en Wikidata y Wikipedia (lib/live/coach.ts).
    currentCoach(params.team).catch(() => undefined),
    // Fotos del plantel: ESPN o Wikimedia Commons (lib/live/photos.ts).
    teamPhotos(comp.code, params.team).catch(() => ({}) as Record<string, Photo>),
    // El plantel actual (números, posiciones, edades) sale de la Wikipedia: el de ESPN tiene números viejos y jugadores
    // que ya se fueron (lib/live/squad.ts).
    wikiSquad(params.team).catch(() => null),
    // Los partidos de todas las competencias (liga, copas, internacionales).
    teamAllSchedule(params.team).catch(() => ({ played: [], upcoming: [] })),
    foundedYear(params.team).catch(() => undefined),
  ]);
  const matches = season.events.filter((e) => e.home.espnId === params.team || e.away.espnId === params.team);
  const team = squad?.team ?? (matches[0] ? (matches[0].home.espnId === params.team ? matches[0].home : matches[0].away) : undefined);
  if (!team) notFound();

  // Sin plantel en la Wikipedia, el de ESPN tal cual.
  const players: TeamPlayer[] = wiki
    ? mergeSquad(wiki, squad?.players ?? [])
    : (squad?.players ?? []).map((p) => ({ id: p.id, name: p.name, number: p.number, line: POSITION[p.position] ?? "Mediocampista", age: p.age, nationality: p.nationality }));
  const byNumber = (a: TeamPlayer, b: TeamPlayer) => Number(a.number ?? 999) - Number(b.number ?? 999);

  // Si ESPN no da el calendario completo, los partidos del torneo.
  const fallback = (state: (e: LiveEvent) => boolean) => matches.filter(state).map((e) => ({ ...e, league: comp.code }));
  const upcoming = schedule.upcoming.length ? schedule.upcoming : fallback((e) => e.state !== "post");
  const played = schedule.played.length ? schedule.played : fallback((e) => e.state === "post").reverse();
  // Estadísticas del plantel en el torneo en curso (las publica ESPN con el plantel).
  const withStats = (squad?.players ?? []).filter((p) => p.stats && p.stats.apps > 0);
  const tournament = /apertura|clausura/i.test(season.name) ? `Torneo ${/apertura/i.test(season.name) ? "Apertura" : "Clausura"}` : comp.name;
  const honours = honoursOf(params.team, team.name, info.league);
  const ages = players.map((p) => p.age).filter((a): a is number => !!a);
  const avgAge = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1).replace(".", ",") : undefined;
  const venue = (VENUES as Record<string, { name: string; capacity?: number }>)[params.team];
  const form = played.slice(0, 5);

  const statsTab = withStats.length > 0 && (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 className="section-title">Estadísticas del plantel</h2>
        <span className="text-sm text-navy-500">{tournament}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Leaders title="Goleadores" unit="Goles" rows={withStats.filter((p) => p.stats!.goals > 0).sort((x, y) => y.stats!.goals - x.stats!.goals).map((p) => ({ p, value: p.stats!.goals }))} photos={photos} />
        <Leaders title="Asistencias" unit="Asist." rows={withStats.filter((p) => p.stats!.assists > 0).sort((x, y) => y.stats!.assists - x.stats!.assists).map((p) => ({ p, value: p.stats!.assists }))} photos={photos} />
        <Leaders
          title="Tarjetas"
          unit="TA · TR"
          rows={withStats
            .filter((p) => p.stats!.yellow + p.stats!.red > 0)
            .sort((x, y) => y.stats!.red * 3 + y.stats!.yellow - (x.stats!.red * 3 + x.stats!.yellow))
            .map((p) => ({ p, value: p.stats!.yellow, extra: p.stats!.red }))}
          photos={photos}
          cards
        />
      </div>
    </section>
  );

  const summaryTab = (
    <div className="space-y-6">
      <section className="panel overflow-hidden">
        <h2 className="border-b border-navy-100 px-4 py-2.5 font-display text-base font-bold uppercase tracking-wide text-navy-950">Detalles del equipo</h2>
        <dl className="grid grid-cols-2 gap-px bg-navy-100 sm:grid-cols-3">
          <Detail label="Competición">
            <span className="flex items-center justify-center gap-2">
              <CompLogo id={comp.id} size={22} />
              {comp.name}
            </span>
          </Detail>
          {venue && <Detail label="Estadio">{venue.capacity ? `${venue.name} · ${venue.capacity.toLocaleString("es-AR")}` : venue.name}</Detail>}
          {founded && <Detail label="Fundación">{founded}</Detail>}
          {avgAge && <Detail label="Promedio de edad">{avgAge} años</Detail>}
          {honours.length > 0 && <Detail label="Títulos destacados">{honours.reduce((n, h) => n + h.n, 0)}</Detail>}
        </dl>
      </section>

      <div className="grid gap-6 [&>*]:min-w-0 md:grid-cols-2">
        <section>
          <h2 className="section-title mb-3">Próximo partido</h2>
          {upcoming[0] ? <MatchCard m={upcoming[0]} team={params.team} /> : <p className="panel px-6 py-8 text-center text-navy-500">No hay partidos programados.</p>}
        </section>
        <section>
          <h2 className="section-title mb-3">Últimos resultados</h2>
          {form.length ? (
            <div className="panel flex justify-center gap-2 px-4 py-5">
              {form.map((m) => {
                const home = m.home.espnId === params.team;
                const mine = Number((home ? m.home : m.away).score ?? 0);
                const theirs = Number((home ? m.away : m.home).score ?? 0);
                const r = mine > theirs ? "V" : mine < theirs ? "D" : "E";
                return (
                  <Link
                    key={m.id}
                    href={`/partido/${m.league}/${m.id}`}
                    title={`${m.home.name} ${m.home.score}-${m.away.score} ${m.away.name}`}
                    className="flex flex-col items-center gap-1"
                  >
                    <TeamLogo team={home ? m.away : m.home} size={30} />
                    <span className={`w-12 rounded-md py-0.5 text-center font-display text-sm font-bold tabular-nums ${r === "V" ? "bg-emerald-500 text-white" : r === "D" ? "bg-red-500 text-white" : "bg-amber-400 text-navy-950"}`}>
                      {mine}-{theirs}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="panel px-6 py-8 text-center text-navy-500">Todavía no jugó partidos esta temporada.</p>
          )}
        </section>
      </div>
      {statsTab}
    </div>
  );

  const squadTab = (
    <section className="space-y-3">
      {/* El DT, arriba de todo del plantel. */}
      {coach && (
        <div className="panel flex items-center gap-3 px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-950 font-display text-sm font-bold text-white">DT</span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs uppercase tracking-wider text-navy-400">Director técnico</span>
            <span className="block font-semibold text-navy-950">{coach}</span>
          </span>
        </div>
      )}
      {players.length === 0 ? (
        <p className="panel px-6 py-8 text-center text-navy-500">Todavía no está publicado el plantel de este equipo.</p>
      ) : (
        GROUPS.filter((g) => players.some((p) => p.line === g.line)).map((g) => (
          <div key={g.line} className="panel overflow-hidden">
            <h3 className="bg-navy-950 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-white">{g.title}</h3>
            <ul className="divide-y divide-navy-50 text-sm">
              {players
                .filter((p) => p.line === g.line)
                .sort(byNumber)
                .map((p) => {
                  const row = (
                    <>
                      <span className="w-6 text-center font-display font-bold tabular-nums text-navy-400">{p.number ?? "–"}</span>
                      <Face url={p.id ? photos[p.id]?.url : undefined} />
                      <span className="min-w-0 flex-1">
                        <span className="block break-words font-medium leading-snug text-navy-900 group-hover:text-volt-600 group-hover:underline">{p.name}</span>
                        <span className="block break-words text-xs leading-snug text-navy-400">
                          {p.nationality}
                          {p.injured ? " · lesionado" : ""}
                        </span>
                      </span>
                      <span className="w-14 text-right text-xs tabular-nums text-navy-500">{p.age ? `${p.age} años` : ""}</span>
                      <span aria-hidden className={`text-navy-300 group-hover:text-volt-500 ${p.id ? "" : "invisible"}`}>
                        ›
                      </span>
                    </>
                  );
                  return (
                    <li key={p.id ?? p.name}>
                      {/* Cada jugador lleva a su perfil, con sus partidos de la temporada (si ESPN lo tiene). */}
                      {p.id ? (
                        <Link href={`/jugador/${p.id}`} className="group flex items-center gap-2.5 px-3 py-2.5 transition hover:bg-volt-500/5 sm:gap-3 sm:px-4">
                          {row}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4">{row}</div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))
      )}
    </section>
  );

  const matchesTab = (
    <div className="space-y-6">
      <section>
        <h2 className="section-title mb-3">Próximos partidos</h2>
        <TeamMatches matches={upcoming} team={params.team} empty="No hay partidos programados." />
      </section>
      <section>
        <h2 className="section-title mb-3">Resultados</h2>
        <TeamMatches matches={played} team={params.team} empty="Todavía no jugó partidos esta temporada." />
      </section>
    </div>
  );

  return (
    <>
      <TeamHero team={{ ...team, espnId: params.team }} compId={comp.id} compName={comp.name} founded={founded} honours={honours} color={info.color} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <HubTabs
          tabs={[
            { id: "resumen", label: "Resumen", content: summaryTab },
            { id: "partidos", label: "Partidos", content: matchesTab },
            { id: "plantel", label: "Plantel", content: squadTab },
          ]}
        />
      </main>
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-3 py-3 text-center">
      <dd className="font-semibold leading-snug text-navy-950">{children}</dd>
      <dt className="mt-0.5 text-xs text-navy-500">{label}</dt>
    </div>
  );
}

function Face({ url }: { url?: string }) {
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element -- foto de ESPN o de Wikimedia Commons
    <img src={url} alt="" loading="lazy" className="h-8 w-8 shrink-0 rounded-full bg-navy-50 object-cover object-top ring-1 ring-navy-100" />
  ) : (
    <span className="h-8 w-8 shrink-0 rounded-full bg-navy-50 ring-1 ring-navy-100" aria-hidden />
  );
}

type LeaderRow = { p: RosterPlayer; value: number; extra?: number };

// Goleadores, asistidores o tarjetas del plantel: los cinco primeros.
function Leaders({ title, unit, rows, photos, cards }: { title: string; unit: string; rows: LeaderRow[]; photos: Record<string, Photo>; cards?: boolean }) {
  return (
    <div className="panel overflow-hidden">
      <h3 className="flex items-center justify-between bg-navy-950 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-white">
        {title} <span className="text-navy-300">{unit}</span>
      </h3>
      {rows.length === 0 ? (
        <p className="px-4 py-5 text-center text-sm text-navy-500">Sin datos todavía.</p>
      ) : (
        <ol className="divide-y divide-navy-50 text-sm">
          {rows.slice(0, 5).map(({ p, value, extra }) => (
            <li key={p.id}>
              <Link href={`/jugador/${p.id}`} className="flex items-center gap-2.5 px-3 py-2 transition hover:bg-volt-500/5">
                <Face url={photos[p.id]?.url} />
                <span className="min-w-0 flex-1">
                  <span className="block break-words leading-snug font-medium text-navy-900">{p.name}</span>
                  <span className="block text-xs text-navy-400">{p.stats!.apps} partidos</span>
                </span>
                {cards ? (
                  <span className="flex items-center gap-2 font-display font-bold tabular-nums text-navy-950">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3.5 w-2.5 rounded-[2px] bg-amber-400" aria-hidden />
                      {value}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3.5 w-2.5 rounded-[2px] bg-red-600" aria-hidden />
                      {extra ?? 0}
                    </span>
                  </span>
                ) : (
                  <span className="font-display text-xl font-bold tabular-nums text-navy-950">{value}</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

