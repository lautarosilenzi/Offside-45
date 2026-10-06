import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TeamLogo from "@/components/hub/TeamLogo";
import TeamHero from "@/components/team/TeamHero";
import { honoursOf } from "@/lib/honours";
import { currentCoach } from "@/lib/live/coach";
import { findLiveCompetition } from "@/lib/live/competitions";
import { roster, seasonEvents, teamInfo, type LiveEvent, type RosterPlayer } from "@/lib/live/espn";
import { teamPhotos, type Photo } from "@/lib/live/photos";
import { phaseLabel, isKnockout } from "@/lib/live/season";

export const revalidate = 600;
// La primera vez busca las fotos del plantel (ESPN y Wikimedia): puede pasar los 10 s por defecto.
export const maxDuration = 30;
export const dynamicParams = true;
export const generateStaticParams = () => [];

export function generateMetadata({ params }: { params: { id: string; team: string } }): Metadata {
  const c = findLiveCompetition(params.id);
  return { title: c ? `Equipo · ${c.name} · Offside 45` : "Offside 45" };
}

const POSITION: Record<string, string> = { Goalkeeper: "Arqueros", Defender: "Defensores", Midfielder: "Mediocampistas", Forward: "Delanteros" };
const ORDER = ["Arqueros", "Defensores", "Mediocampistas", "Delanteros", "Otros"];
const TZ = "America/Argentina/Buenos_Aires";
const when = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

export default async function TeamPage({ params }: { params: { id: string; team: string } }) {
  const comp = findLiveCompetition(params.id);
  if (!comp || !/^\d+$/.test(params.team)) notFound();

  const [squad, season, info, coach, photos] = await Promise.all([
    roster(comp.code, params.team).catch(() => null),
    seasonEvents(comp.code).catch(() => ({ name: "", label: "", events: [] as LiveEvent[], all: [] as LiveEvent[] })),
    teamInfo(params.team).catch(() => ({ league: undefined, color: undefined })),
    // El DT de ESPN está desactualizado: se usa el que coincide en Wikidata y Wikipedia (lib/live/coach.ts).
    currentCoach(params.team).catch(() => undefined),
    // Fotos del plantel: ESPN o Wikimedia Commons (lib/live/photos.ts).
    teamPhotos(comp.code, params.team).catch(() => ({}) as Record<string, Photo>),
  ]);
  const matches = season.events.filter((e) => e.home.espnId === params.team || e.away.espnId === params.team);
  const team = squad?.team ?? (matches[0] ? (matches[0].home.espnId === params.team ? matches[0].home : matches[0].away) : undefined);
  if (!team) notFound();


  const groups = new Map<string, NonNullable<typeof squad>["players"]>();
  for (const p of squad?.players ?? []) {
    const g = POSITION[p.position] ?? "Otros";
    groups.set(g, [...(groups.get(g) ?? []), p]);
  }

  const played = matches.filter((m) => m.state === "post");
  const next = matches.filter((m) => m.state !== "post");
  // Estadísticas del plantel en el torneo en curso (las publica ESPN con el plantel).
  const withStats = (squad?.players ?? []).filter((p) => p.stats && p.stats.apps > 0);
  const tournament = /apertura|clausura/i.test(season.name) ? `Torneo ${/apertura/i.test(season.name) ? "Apertura" : "Clausura"}` : comp.name;

  return (
    <>
      <TeamHero
        team={{ ...team, espnId: params.team }}
        compId={comp.id}
        compName={comp.name}
        coach={coach}
        honours={honoursOf(params.team, team.name, info.league)}
        color={info.color}
      />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        {withStats.length > 0 && (
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
        )}

        <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
          <section>
            <h2 className="section-title mb-3">Plantel</h2>
            {groups.size === 0 ? (
              <p className="panel px-6 py-8 text-center text-navy-500">La fuente todavía no publicó el plantel de este equipo.</p>
            ) : (
              <div className="space-y-3">
                {ORDER.filter((g) => groups.has(g)).map((g) => (
                  <div key={g} className="panel overflow-hidden">
                    <h3 className="bg-navy-950 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-white">{g}</h3>
                    <ul className="divide-y divide-navy-50 text-sm">
                      {groups.get(g)!.map((p) => (
                        <li key={p.id}>
                          {/* Cada jugador lleva a su perfil, con sus partidos de la temporada. */}
                          <Link href={`/jugador/${p.id}`} className="group flex items-center gap-2.5 px-3 py-1.5 transition hover:bg-volt-500/5 sm:gap-3 sm:px-4">
                            <span className="w-6 text-center font-display font-bold tabular-nums text-navy-400">{p.number ?? ""}</span>
                            <Face url={photos[p.id]?.url} />
                            <span className="min-w-0 flex-1 truncate font-medium text-navy-900 group-hover:text-volt-600 group-hover:underline">{p.name}</span>
                            <span className="hidden text-xs text-navy-400 sm:inline">{p.nationality}</span>
                            <span className="w-14 text-right text-xs tabular-nums text-navy-500">{p.age ? `${p.age} años` : ""}</span>
                            <span aria-hidden className="text-navy-300 group-hover:text-volt-500">›</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <MatchList title="Próximos partidos" matches={next} team={params.team} league={comp.code} />
            <MatchList title="Resultados" matches={[...played].reverse()} team={params.team} league={comp.code} />
          </section>
        </div>
        <p className="text-xs text-navy-400">Plantel, partidos y tabla: ESPN.</p>
      </main>
    </>
  );
}

// Foto chica del jugador (o un círculo vacío, para que los nombres queden alineados).
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
      <h3 className="flex items-center justify-between bg-navy-950 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-white">
        {title} <span className="text-navy-300">{unit}</span>
      </h3>
      {rows.length === 0 ? (
        <p className="px-4 py-5 text-center text-sm text-navy-500">Sin datos todavía.</p>
      ) : (
        <ol className="divide-y divide-navy-50 text-sm">
          {rows.slice(0, 5).map(({ p, value, extra }) => (
            <li key={p.id}>
              <Link href={`/jugador/${p.id}`} className="flex items-center gap-2.5 px-3 py-1.5 transition hover:bg-volt-500/5">
                <Face url={photos[p.id]?.url} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-navy-900">{p.name}</span>
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

function MatchList({ title, matches, team, league }: { title: string; matches: LiveEvent[]; team: string; league: string }) {
  return (
    <div className="panel overflow-hidden">
      <h3 className="bg-navy-950 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-white">{title}</h3>
      {matches.length === 0 ? (
        <p className="px-4 py-5 text-center text-sm text-navy-500">No hay partidos.</p>
      ) : (
        <ul className="divide-y divide-navy-50 text-sm">
          {matches.map((m) => {
            const home = m.home.espnId === team;
            const rival = home ? m.away : m.home;
            const mine = Number((home ? m.home : m.away).score ?? 0);
            const theirs = Number(rival.score ?? 0);
            const res = m.state === "post" ? (mine > theirs ? "V" : mine < theirs ? "D" : "E") : undefined;
            return (
              <li key={m.id}>
                <Link href={`/partido/${league}/${m.id}`} className="flex items-center gap-2 px-3 py-1.5 transition hover:bg-volt-500/5">
                <span className="w-24 shrink-0 text-xs capitalize text-navy-400">{when(m.date)}</span>
                <span className="text-xs text-navy-400">{home ? "L" : "V"}</span>
                <TeamLogo team={rival} size={18} />
                <span className="min-w-0 flex-1 truncate text-navy-900">
                  {rival.name}
                  {isKnockout(m.round) && <span className="ml-1 text-xs text-navy-400">· {phaseLabel(m.round)}</span>}
                </span>
                {res ? (
                  <span className={`rounded px-1.5 font-display font-bold tabular-nums ${res === "V" ? "bg-emerald-500 text-white" : res === "E" ? "bg-amber-400 text-navy-950" : "bg-red-500 text-white"}`}>
                    {mine}-{theirs}
                  </span>
                ) : m.state === "in" ? (
                  <span className="rounded bg-red-600 px-1.5 font-display font-bold text-white">
                    {mine}-{theirs}
                  </span>
                ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
