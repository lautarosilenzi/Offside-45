import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import TeamLogo from "@/components/hub/TeamLogo";
import { findLiveCompetition } from "@/lib/live/competitions";
import { roster, seasonEvents, standings, type LiveEvent, type LiveTable } from "@/lib/live/espn";
import { formByTeam, phaseLabel, isKnockout } from "@/lib/live/season";

export const revalidate = 600;
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

  const [squad, season, tables] = await Promise.all([
    roster(comp.code, params.team).catch(() => null),
    seasonEvents(comp.code).catch(() => ({ name: "", label: "", events: [] as LiveEvent[], all: [] as LiveEvent[] })),
    standings(comp.code).catch((): LiveTable[] => []),
  ]);
  const matches = season.events.filter((e) => e.home.espnId === params.team || e.away.espnId === params.team);
  const team = squad?.team ?? (matches[0] ? (matches[0].home.espnId === params.team ? matches[0].home : matches[0].away) : undefined);
  if (!team) notFound();

  const table = tables.find((t) => t.rows.some((r) => r.team.espnId === params.team));
  const row = table?.rows.find((r) => r.team.espnId === params.team);
  const form = formByTeam(season.events).get(params.team) ?? [];

  const groups = new Map<string, NonNullable<typeof squad>["players"]>();
  for (const p of squad?.players ?? []) {
    const g = POSITION[p.position] ?? "Otros";
    groups.set(g, [...(groups.get(g) ?? []), p]);
  }

  const played = matches.filter((m) => m.state === "post");
  const next = matches.filter((m) => m.state !== "post");
  const results = { V: 0, E: 0, D: 0 };
  for (const m of played) {
    const mine = m.home.espnId === params.team ? m.home : m.away;
    const theirs = m.home.espnId === params.team ? m.away : m.home;
    const a = Number(mine.score ?? 0);
    const b = Number(theirs.score ?? 0);
    results[a > b ? "V" : a < b ? "D" : "E"]++;
  }

  return (
    <>
      <PageHero
        eyebrow={
          <Link href={`/torneos/${comp.id}#equipos`} className="hover:text-white">
            ← {comp.name}
          </Link>
        }
        title={
          <span className="flex items-center gap-3">
            <TeamLogo team={team} size={56} />
            {team.name}
          </span>
        }
      >
        {squad?.coach ? `Director técnico: ${squad.coach}. ` : ""}Plantel, partidos y campaña en {comp.name}.
      </PageHero>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={table && table.name ? `Posición · ${table.name}` : "Posición"} value={row ? `${row.pos}.º` : "—"} />
          <Stat label="Puntos" value={row ? row.points : "—"} />
          <Stat label="Ganados · empatados · perdidos" value={`${results.V} · ${results.E} · ${results.D}`} />
          <Stat
            label="Últimos partidos"
            value={
              form.length ? (
                <span className="flex justify-center gap-0.5">
                  {form.map((r, i) => (
                    <span key={i} className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${r === "V" ? "bg-emerald-500 text-white" : r === "E" ? "bg-amber-400" : "bg-red-500 text-white"}`}>
                      {r}
                    </span>
                  ))}
                </span>
              ) : (
                "—"
              )
            }
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
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
                        <li key={p.id} className="flex items-center gap-3 px-4 py-1.5">
                          <span className="w-7 text-center font-display font-bold tabular-nums text-navy-400">{p.number ?? ""}</span>
                          <span className="min-w-0 flex-1 truncate font-medium text-navy-900">{p.name}</span>
                          <span className="hidden text-xs text-navy-400 sm:inline">{p.nationality}</span>
                          <span className="w-14 text-right text-xs tabular-nums text-navy-500">{p.age ? `${p.age} años` : ""}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <MatchList title="Próximos partidos" matches={next} team={params.team} />
            <MatchList title="Resultados" matches={[...played].reverse()} team={params.team} />
          </section>
        </div>
        <p className="text-xs text-navy-400">Plantel, partidos y tabla: ESPN.</p>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="panel px-3 py-3 text-center">
      <div className="font-display text-2xl font-bold tabular-nums text-navy-950">{value}</div>
      <div className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-navy-500">{label}</div>
    </div>
  );
}

function MatchList({ title, matches, team }: { title: string; matches: LiveEvent[]; team: string }) {
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
              <li key={m.id} className="flex items-center gap-2 px-3 py-1.5">
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
