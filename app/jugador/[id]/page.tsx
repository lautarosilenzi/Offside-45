/* eslint-disable @next/next/no-img-element -- fotos y escudos de ESPN, sin optimizar */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeriesChart from "@/components/charts/SeriesChart";
import TeamLogo from "@/components/hub/TeamLogo";
import { playerBio, playerSeason, type MatchRow } from "@/lib/live/player";

// Se arma en cada visita: lee la temporada elegida (?temporada=), y eso no se puede guardar como página fija (en
// producción daba error). Los datos de ESPN igual quedan en caché: el registro de partidos una hora y el detalle de
// cada partido un día (lib/live/player.ts).
export const dynamic = "force-dynamic";
// La primera vez que se abre un jugador se pide el detalle de cada partido (puede tardar más de los 10 s por defecto).
export const maxDuration = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const bio = /^\d+$/.test(params.id) ? await playerBio(params.id).catch(() => null) : null;
  return { title: bio ? `${bio.name} · Perfil y estadísticas · Offside 45` : "Jugador · Offside 45" };
}

const TZ = "America/Argentina/Buenos_Aires";
const day = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, day: "numeric", month: "numeric", year: "2-digit" }).format(new Date(iso));
const n = (v?: number) => v ?? 0;
// ESPN incluye los partidos en los que quedó en el banco sin entrar: no cuentan como jugados. Si no hay detalle del
// partido, se lo da por jugado.
const playedIn = (m: MatchRow) => !m.detail || n(m.detail.minutes) > 0 || n(m.detail.starts) > 0 || n(m.detail.subIns) > 0;
const pct = (v?: number) => (v === undefined ? "—" : `${Math.round(v * 100)}%`);

export default async function PlayerPage({ params, searchParams }: { params: { id: string }; searchParams: { temporada?: string } }) {
  if (!/^\d+$/.test(params.id)) notFound();
  const season = /^\d{4}$/.test(searchParams.temporada ?? "") ? searchParams.temporada : undefined;
  const [bio, data] = await Promise.all([playerBio(params.id).catch(() => null), playerSeason(params.id, season).catch(() => null)]);
  if (!bio) notFound();

  const all = data?.matches ?? [];
  const matches = all.filter(playedIn);
  const bench = all.length - matches.length;
  const keeper = bio.position === "Arquero";
  const sum = (f: (m: MatchRow) => number) => matches.reduce((t, m) => t + f(m), 0);
  const starts = sum((m) => n(m.detail?.starts));
  const totals = {
    played: matches.length,
    starts,
    minutes: sum((m) => n(m.detail?.minutes)),
    goals: sum((m) => n(m.stats.totalGoals)),
    assists: sum((m) => n(m.stats.goalAssists)),
    yellow: sum((m) => n(m.stats.yellowCards)),
    red: sum((m) => n(m.stats.redCards)),
    saves: sum((m) => n(m.detail?.saves)),
    conceded: sum((m) => n(m.detail?.goalsConceded)),
    clean: sum((m) => n(m.detail?.cleanSheet)),
  };

  // Por competencia, en el orden en que aparecen (la más reciente primero).
  const comps = new Map<string, MatchRow[]>();
  for (const m of matches) comps.set(m.competition.name, [...(comps.get(m.competition.name) ?? []), m]);

  // Liga del club, para el enlace a la página del equipo.
  const clubComp = matches.find((m) => !m.national && m.competition.id)?.competition.id;
  const seasonLabel = data?.seasons.find((s) => s.value === data.season)?.label ?? data?.season ?? "";
  const chrono = [...matches].reverse();

  return (
    <>
      <section className="px-3 pt-4 sm:px-6 sm:pt-5">
        <div className="hero relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] text-white">
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-volt-500/25 blur-3xl" />
          <div className="relative flex flex-col gap-5 px-6 py-8 sm:flex-row sm:items-end sm:px-10 sm:py-10">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/15 sm:h-40 sm:w-40">
              {bio.photo ? (
                <img src={bio.photo} alt={bio.name} className="h-full w-full object-cover object-top" />
              ) : bio.team ? (
                <div className="flex h-full w-full items-center justify-center bg-white">
                  <TeamLogo team={bio.team} size={88} />
                </div>
              ) : null}
              {bio.jersey && (
                <span className="absolute bottom-2 right-2 rounded-lg bg-[#050b1a]/85 px-2 py-0.5 font-display text-lg font-extrabold text-white">{bio.jersey}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 sm:text-sm">{bio.position || "Jugador"}</p>
              <h1 className="hero-title font-display text-[2.4rem] font-extrabold uppercase italic leading-[0.95] tracking-wide sm:text-6xl">{bio.name}</h1>
              {bio.fullName && <p className="mt-1 text-sm text-navy-200">{bio.fullName}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-navy-100">
                {bio.team &&
                  (clubComp && bio.team.espnId ? (
                    <Link href={`/torneos/${clubComp}/equipo/${bio.team.espnId}`} className="flex items-center gap-1.5 font-semibold text-white hover:underline">
                      <TeamLogo team={bio.team} size={20} /> {bio.team.name}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <TeamLogo team={bio.team} size={20} /> {bio.team.name}
                    </span>
                  ))}
                {bio.nationality && (
                  <span className="flex items-center gap-1.5">
                    {bio.flag && <img src={bio.flag} alt="" className="h-4 w-4 object-contain" />}
                    {bio.nationality}
                  </span>
                )}
                {bio.age !== undefined && (
                  <span>
                    {bio.age} años{bio.birthDate ? ` (nació el ${bio.birthDate})` : ""}
                  </span>
                )}
                {bio.heightCm && <span>{(bio.heightCm / 100).toFixed(2).replace(".", ",")} m</span>}
                {bio.weightKg && <span>{bio.weightKg} kg</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        {/* Temporada */}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="section-title mr-2">Temporada {seasonLabel}</h2>
          {data?.seasons.map((s) => (
            <Link
              key={s.value}
              href={`/jugador/${bio.id}${s.value === data.seasons[0]?.value ? "" : `?temporada=${s.value}`}`}
              className={`rounded-full px-3 py-1 font-display text-sm font-bold uppercase tracking-wide transition ${
                s.value === data.season ? "bg-navy-950 text-white" : "bg-white text-navy-600 ring-1 ring-navy-100 hover:ring-volt-400"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {all.length === 0 ? (
          <p className="panel px-6 py-10 text-center text-navy-500">ESPN no tiene partidos de {bio.name} en esta temporada.</p>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Tile label="Partidos" value={totals.played} sub={`${totals.starts} de titular${bench ? ` · ${bench} en el banco sin entrar` : ""}`} />
              <Tile label="Minutos" value={totals.minutes.toLocaleString("es-AR")} sub={totals.played ? `${Math.round(totals.minutes / totals.played)} por partido` : ""} />
              {keeper ? (
                <>
                  <Tile label="Vallas invictas" value={totals.clean} />
                  <Tile label="Atajadas" value={totals.saves} />
                  <Tile label="Goles recibidos" value={totals.conceded} />
                </>
              ) : (
                <>
                  <Tile label="Goles" value={totals.goals} sub={totals.minutes && totals.goals ? `uno cada ${Math.round(totals.minutes / totals.goals)}'` : ""} />
                  <Tile label="Asistencias" value={totals.assists} />
                  <Tile label="Goles + asist." value={totals.goals + totals.assists} />
                </>
              )}
              <Tile
                label="Tarjetas"
                value={
                  <span className="flex items-center justify-center gap-2">
                    <Card color="bg-amber-400" /> {totals.yellow}
                    <Card color="bg-red-600" /> {totals.red}
                  </span>
                }
              />
            </section>

            <section>
              <h2 className="section-title mb-3">Por competencia</h2>
              <div className="panel overflow-x-auto">
                <table className="w-full min-w-[34rem] text-sm">
                  <thead className="bg-navy-50 text-left font-display text-[0.7rem] uppercase tracking-wider text-navy-500">
                    <tr>
                      <th className="px-4 py-2">Competencia</th>
                      <th className="px-2 py-2 text-right">PJ</th>
                      <th className="px-2 py-2 text-right">Tit.</th>
                      <th className="px-2 py-2 text-right">Min.</th>
                      <th className="px-2 py-2 text-right">{keeper ? "Invictas" : "Goles"}</th>
                      <th className="px-2 py-2 text-right">{keeper ? "Atajadas" : "Asist."}</th>
                      <th className="px-2 py-2 text-right">TA</th>
                      <th className="px-4 py-2 text-right">TR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {[...comps].map(([name, ms]) => {
                      const s = (f: (m: MatchRow) => number) => ms.reduce((t, m) => t + f(m), 0);
                      return (
                        <tr key={name}>
                          <td className="px-4 py-2 font-semibold text-navy-900">
                            {name}
                            {ms[0].national && <span className="ml-1.5 text-xs font-normal text-navy-400">(selección)</span>}
                          </td>
                          <td className="px-2 py-2 text-right tabular-nums">{ms.length}</td>
                          <td className="px-2 py-2 text-right tabular-nums">{s((m) => n(m.detail?.starts))}</td>
                          <td className="px-2 py-2 text-right tabular-nums">{s((m) => n(m.detail?.minutes)).toLocaleString("es-AR")}</td>
                          <td className="px-2 py-2 text-right font-semibold tabular-nums">{keeper ? s((m) => n(m.detail?.cleanSheet)) : s((m) => n(m.stats.totalGoals))}</td>
                          <td className="px-2 py-2 text-right tabular-nums">{keeper ? s((m) => n(m.detail?.saves)) : s((m) => n(m.stats.goalAssists))}</td>
                          <td className="px-2 py-2 text-right tabular-nums">{s((m) => n(m.stats.yellowCards))}</td>
                          <td className="px-4 py-2 text-right tabular-nums">{s((m) => n(m.stats.redCards))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel p-4 sm:p-5">
              <h2 className="section-title mb-3">Minutos por partido</h2>
              <SeriesChart
                labels={chrono.map((m) => day(m.date))}
                series={[
                  {
                    name: "Minutos",
                    color: "#1f6bff",
                    values: chrono.map((m) => m.detail?.minutes ?? null),
                    details: chrono.map(
                      (m) => `${m.competition.name} · ${m.home ? "vs" : "en"} ${m.opponent.name} ${m.goalsFor}-${m.goalsAgainst}${m.stats.totalGoals ? ` · ${m.stats.totalGoals} gol${m.stats.totalGoals > 1 ? "es" : ""}` : ""}`,
                    ),
                  },
                ]}
                unit="'"
                height={220}
                ariaLabel={`Minutos jugados por ${bio.name} en cada partido de la temporada`}
              />
            </section>

            <section>
              <h2 className="section-title mb-3">Partido por partido</h2>
              <div className="panel overflow-x-auto">
                <table className="w-full min-w-[52rem] text-sm">
                  <thead className="bg-navy-50 text-left font-display text-[0.7rem] uppercase tracking-wider text-navy-500">
                    <tr>
                      <th className="sticky left-0 bg-navy-50 px-3 py-2">Fecha</th>
                      <th className="px-2 py-2">Rival</th>
                      <th className="px-2 py-2 text-center">Res.</th>
                      <th className="px-2 py-2 text-right" title="Minutos jugados">Min.</th>
                      {keeper ? (
                        <>
                          <th className="px-2 py-2 text-right" title="Atajadas">Ataj.</th>
                          <th className="px-2 py-2 text-right" title="Goles recibidos">GR</th>
                        </>
                      ) : (
                        <>
                          <th className="px-2 py-2 text-right" title="Goles">G</th>
                          <th className="px-2 py-2 text-right" title="Asistencias">A</th>
                          <th className="px-2 py-2 text-right" title="Remates al arco / remates">Rem.</th>
                        </>
                      )}
                      <th className="px-2 py-2 text-right" title="Pases precisos / pases (precisión)">Pases</th>
                      <th className="px-2 py-2 text-right" title="Quites">Quites</th>
                      <th className="px-2 py-2 text-right" title="Duelos ganados / duelos">Duelos</th>
                      <th className="px-2 py-2 text-right" title="Faltas cometidas / recibidas">Faltas</th>
                      <th className="px-3 py-2 text-center" title="Tarjetas">Tarj.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {all.map((m) => (
                      <tr key={`${m.team}-${m.id}`} className={playedIn(m) ? "" : "text-navy-400 [&_td]:opacity-60"}>
                        <td className="sticky left-0 bg-white px-3 py-2">
                          <span className="block tabular-nums text-navy-900">{day(m.date)}</span>
                          <span className="block max-w-[8rem] truncate text-[0.7rem] text-navy-400">{m.competition.name}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 text-xs text-navy-400">{m.home ? "L" : "V"}</span>
                            <TeamLogo team={m.opponent} size={18} />
                            <span className="max-w-[11rem] truncate text-navy-900">{m.opponent.name}</span>
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span
                            className={`inline-block min-w-[2.6rem] rounded px-1.5 font-display font-bold tabular-nums ${
                              m.result === "V" ? "bg-emerald-500 text-white" : m.result === "D" ? "bg-red-500 text-white" : "bg-amber-400 text-navy-950"
                            }`}
                          >
                            {m.goalsFor}-{m.goalsAgainst}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {m.detail && !playedIn(m) ? (
                            <span className="whitespace-nowrap text-xs">No ingresó</span>
                          ) : m.detail ? (
                            <>
                              {m.detail.minutes}&apos;
                              {!m.detail.starts && m.detail.subIns ? <span className="ml-1 text-[0.65rem] text-navy-400" title="Entró desde el banco">↑</span> : null}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        {keeper ? (
                          <>
                            <td className="px-2 py-2 text-right tabular-nums">{m.detail?.saves ?? "—"}</td>
                            <td className="px-2 py-2 text-right tabular-nums">{m.detail?.goalsConceded ?? "—"}</td>
                          </>
                        ) : (
                          <>
                            <td className={`px-2 py-2 text-right tabular-nums ${m.stats.totalGoals ? "font-bold text-navy-950" : "text-navy-400"}`}>{m.stats.totalGoals}</td>
                            <td className={`px-2 py-2 text-right tabular-nums ${m.stats.goalAssists ? "font-bold text-navy-950" : "text-navy-400"}`}>{m.stats.goalAssists}</td>
                            <td className="px-2 py-2 text-right tabular-nums">
                              {n(m.stats.shotsOnTarget)}/{n(m.stats.totalShots)}
                            </td>
                          </>
                        )}
                        <td className="px-2 py-2 text-right tabular-nums">
                          {m.detail?.totalPasses ? (
                            <>
                              {n(m.detail.accuratePasses)}/{m.detail.totalPasses} <span className="text-xs text-navy-400">({pct(m.detail.passPct)})</span>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">{m.detail?.totalTackles ?? "—"}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{m.detail?.duels ? `${n(m.detail.duelsWon)}/${m.detail.duels}` : "—"}</td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {n(m.stats.foulsCommitted)}/{n(m.stats.foulsSuffered)}
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex justify-center gap-0.5">
                            {Array.from({ length: n(m.stats.yellowCards) }, (_, i) => (
                              <Card key={`y${i}`} color="bg-amber-400" />
                            ))}
                            {Array.from({ length: n(m.stats.redCards) }, (_, i) => (
                              <Card key={`r${i}`} color="bg-red-600" />
                            ))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-navy-400">
                L: local · V: visitante · ↑: entró desde el banco · Rem.: al arco / totales · Pases: precisos / totales · Duelos: ganados / totales · Faltas:
                cometidas / recibidas.
              </p>
            </section>
          </>
        )}

        {data && data.teams.length > 0 && (
          <section>
            <h2 className="section-title mb-3">Equipos en su carrera</h2>
            <ul className="flex flex-wrap gap-2">
              {data.teams.map((t) => (
                <li key={t.id} className="panel flex items-center gap-2 px-3 py-2 text-sm font-semibold text-navy-900">
                  <img src={t.logo} alt="" className="logo-img h-6 w-6 object-contain" loading="lazy" />
                  {t.name}
                  {t.national && <span className="text-xs font-normal text-navy-400">(selección)</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-navy-400">Perfil y estadísticas: ESPN. La Copa Argentina no figura en el registro de partidos de ESPN.</p>
      </main>
    </>
  );
}

function Tile({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="panel px-3 py-3 text-center">
      <div className="font-display text-3xl font-bold tabular-nums text-navy-950">{value}</div>
      <div className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-navy-500">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-navy-400">{sub}</div>}
    </div>
  );
}

function Card({ color }: { color: string }) {
  return <span className={`inline-block h-4 w-3 rounded-[2px] ${color}`} aria-hidden />;
}
