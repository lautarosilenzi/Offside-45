import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompLogo from "@/components/CompLogo";
import TournamentHero from "@/components/hub/TournamentHero";
import Bracket from "@/components/hub/Bracket";
import Fixture from "@/components/hub/Fixture";
import HubTabs from "@/components/hub/HubTabs";
import StandingsTable, { type Mark } from "@/components/hub/StandingsTable";
import PromediosTable from "@/components/hub/PromediosTable";
import Switch from "@/components/hub/Switch";
import ChampionsList from "@/components/hub/ChampionsList";
import TeamsAndStats from "@/components/hub/TeamsAndStats";
import { championsOf, titlesByClub, titlesOf } from "@/lib/champions";
import { annualTable, promedios } from "@/lib/live/argentina";
import { findLiveCompetition } from "@/lib/live/competitions";
import { leaders, rosterLeaders, seasonEvents, standings, type LiveEvent, type LiveTable, type LiveTeam } from "@/lib/live/espn";
import { bracket, buildRounds, currentRound, formByTeam, isKnockout, tbd, teamKey, type Result } from "@/lib/live/season";

// Se arma la primera vez que alguien la pide y se renueva cada 5 minutos (los partidos de hoy se actualizan solos en el navegador).
export const revalidate = 300;
// En la Liga Profesional los goleadores salen de los 30 planteles: la primera vez puede pasar los 10 s por defecto.
export const maxDuration = 30;
export const dynamicParams = true;
export const generateStaticParams = () => [];

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const c = findLiveCompetition(params.id);
  return { title: c ? `${c.name} · Fixture, tablas y estadísticas · Offside 45` : "Offside 45" };
}

// Zonas que ESPN no informa, solo donde el reglamento es claro.
const MARKS: Record<string, Mark[]> = {
  "liga-profesional": [{ from: 1, to: 8, color: "#81D6AC", label: "Clasifican a octavos de final" }],
  libertadores: [
    { from: 1, to: 2, color: "#81D6AC", label: "Clasifican a octavos de final" },
    { from: 3, to: 3, color: "#b9d4ff", label: "Pasan a los playoffs de la Sudamericana" },
  ],
  sudamericana: [
    { from: 1, to: 1, color: "#81D6AC", label: "Clasifica a octavos de final" },
    { from: 2, to: 2, color: "#b9d4ff", label: "Juega los playoffs de octavos" },
  ],
};

export default async function TournamentPage({ params }: { params: { id: string } }) {
  const comp = findLiveCompetition(params.id);
  if (!comp) notFound();

  const [season, tables] = await Promise.all([
    seasonEvents(comp.code).catch(() => ({ name: "", label: "", events: [], all: [] })),
    standings(comp.code).catch((): LiveTable[] => []),
  ]);
  // Con dos torneos por año (Apertura y Clausura), los goleadores salen de los planteles: la tabla de ESPN es la del
  // primer torneo (lib/live/espn.ts).
  const stats = await (/apertura|clausura/i.test(season.name) ? rosterLeaders(comp.code) : leaders(comp.code)).catch(() => ({ goals: [], assists: [] }));
  const rounds = buildRounds(season.events);
  const form = Object.fromEntries(formByTeam(season.events));
  const cols = bracket(season.events);
  const teamHref = (espnId: string) => `/torneos/${comp.id}/equipo/${espnId}`;

  // Equipos: los de la tabla; en las copas sin tabla, los que aparecen en los partidos.
  const teamMap = new Map<string, LiveTeam>();
  for (const t of tables) for (const r of t.rows) teamMap.set(teamKey(r.team), r.team);
  if (!teamMap.size) for (const e of season.events) for (const t of [e.home, e.away]) if (t.espnId && !tbd(t)) teamMap.set(teamKey(t), t);
  const teams = [...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const hasKnockout = season.events.some((e) => isKnockout(e.round));
  const live = season.events.some((e) => e.state === "in");
  // La fuente todavía no publicó la temporada en curso: se muestra la última que tiene, avisando.
  const stale = season.events.length > 0 && !season.events.some((e) => Date.parse(e.date) > Date.now() - 45 * 86400000);

  const fixtureTab = (
    <div className="space-y-6">
      {cols.length > 0 && <Bracket columns={cols} />}
      {/* min-w-0: las tablas anchas se desplazan dentro de su recuadro en vez de estirar la página en el celular. */}
      <div className={`grid gap-6 [&>*]:min-w-0 ${tables.length ? "lg:grid-cols-[3fr_2fr]" : ""}`}>
        {tables.length > 0 &&
          (comp.id === "liga-profesional" ? (
            <ArgentineTables tables={tables} form={form} all={season.all} teamHref={teamHref} />
          ) : (
            <StandingsTable
              tables={tables}
              form={form}
              marks={MARKS[comp.id]}
              teamHref={teamHref}
              title={hasKnockout && tables.length === 1 ? "Fase regular" : season.name ? `Tabla · ${translateStage(season.name)}` : undefined}
            />
          ))}
        <div>
          <Fixture code={comp.code} rounds={rounds} initial={currentRound(rounds)} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TournamentHero id={comp.id} name={comp.name} country={comp.country} live={live}>
        {season.name ? `${translateStage(season.name)}. ` : ""}Fixture, tablas, cuadro, equipos y estadísticas, con los resultados al instante.
      </TournamentHero>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {stale && (
          <p className="mb-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-navy-700">
            La fuente de datos todavía no publicó la temporada en curso de {comp.name}: se muestra la última disponible ({season.label}).
          </p>
        )}
        <HubTabs
          tabs={[
            { id: "fixture", label: "Fixture y tablas", content: fixtureTab },
            {
              id: "equipos",
              label: "Equipos y estadísticas",
              content: (
                <TeamsAndStats
                  teams={teams}
                  teamHref={teamHref}
                  goals={stats.goals}
                  assists={stats.assists}
                  titles={Object.fromEntries(teams.map((t) => [t.espnId ?? "", titlesOf(comp.id, t.name)]))}
                />
              ),
            },
            {
              id: "campeones",
              label: "Campeones",
              content: championsOf(comp.id) ? (
                <ChampionsList rows={championsOf(comp.id).rows} ranking={titlesByClub(comp.id)} source={championsOf(comp.id).source} />
              ) : (
                <Champions compId={comp.id} name={comp.name} history={comp.history} />
              ),
            },
          ]}
        />
        <p className="mt-6 text-xs text-navy-400">
          Resultados, tablas y estadísticas en vivo: ESPN. Las fechas se arman con los partidos de cada fin de semana; los partidos reprogramados figuran
          aparte.
        </p>
      </main>
    </>
  );
}

// Liga Profesional: las zonas del torneo en curso, la tabla anual (que define un descenso, las copas y el "Campeón de
// Liga") y los promedios.
function ArgentineTables({ tables, form, all, teamHref }: { tables: LiveTable[]; form: Record<string, Result[]>; all: LiveEvent[]; teamHref: (id: string) => string }) {
  const annual = annualTable(all);
  const yearForm = Object.fromEntries(formByTeam(all));
  return (
    <Switch
      views={[
        { id: "zonas", label: "Zonas", content: <StandingsTable tables={tables} form={form} marks={MARKS["liga-profesional"]} teamHref={teamHref} /> },
        {
          id: "anual",
          label: "Tabla anual",
          content: (
            <StandingsTable
              tables={[annual]}
              form={yearForm}
              title="Tabla anual 2026 (Apertura + Clausura)"
              marks={[
                { from: 1, to: 1, color: "#f5d36b", label: "Campeón de Liga si termina primero" },
                { from: annual.rows.length, to: annual.rows.length, color: "#FF7F84", label: "Desciende por la tabla anual" },
              ]}
              teamHref={teamHref}
            />
          ),
        },
        { id: "promedios", label: "Promedios", content: <PromediosTable rows={promedios(annual)} teamHref={teamHref} /> },
      ]}
    />
  );
}

function Champions({ compId, name, history }: { compId: string; name: string; history?: string }) {
  return (
    <div className="panel flex flex-col items-center gap-4 px-6 py-10 text-center">
      <CompLogo id={compId} size={80} />
      {history ? (
        <>
          <p className="max-w-lg text-navy-600">La historia completa de {name}, con todos los campeones y sus partidos, está en su sección.</p>
          <Link href={history} className="btn-primary">
            Ver campeones e historia
          </Link>
        </>
      ) : (
        <>
          <p className="max-w-lg text-navy-600">
            {compId === "eliminatorias"
              ? "Las Eliminatorias no tienen campeón: reparten los lugares para el Mundial. La historia de los Mundiales está en su sección."
              : `Estamos cargando y verificando la lista de campeones de ${name}.`}
          </p>
          {compId === "eliminatorias" && (
            <Link href="/mundiales" className="btn-primary">
              Ver los Mundiales
            </Link>
          )}
        </>
      )}
    </div>
  );
}

// Nombres de torneo que vienen en inglés.
function translateStage(s: string) {
  return s
    .replace(/^Torneo /, "Torneo ")
    .replace(/Regular Season/i, "Temporada regular")
    .replace(/Semifinals/i, "Semifinales")
    .replace(/Quarterfinals/i, "Cuartos de final")
    .replace(/Round of 16/i, "Octavos de final")
    .replace(/Final$/i, "Final")
    .replace(/Group Stage/i, "Fase de grupos")
    .replace(/League Phase/i, "Fase de liga");
}
