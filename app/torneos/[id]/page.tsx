import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TournamentHero from "@/components/hub/TournamentHero";
import Bracket from "@/components/hub/Bracket";
import Fixture from "@/components/hub/Fixture";
import HubTabs from "@/components/hub/HubTabs";
import LeagueHistory from "@/components/hub/LeagueHistory";
import AscensoHistory from "@/components/hub/AscensoHistory";
import StandingsTable, { type Mark } from "@/components/hub/StandingsTable";
import PromediosTable from "@/components/hub/PromediosTable";
import Switch from "@/components/hub/Switch";
import ChampionsList from "@/components/hub/ChampionsList";
import TeamsAndStats from "@/components/hub/TeamsAndStats";
import { RankTable, YearList } from "@/components/TitleBoards";
import { championsOf, titlesByClub, titlesOf } from "@/lib/champions";
import { leagueFinals, listFinals } from "@/lib/cup-history";
import { INTERCONTINENTAL } from "@/lib/data/world-titles";
import { HISTORY_ROWS, editionHref } from "@/lib/editions";
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
  if (!c) return { title: "126Goals" };
  const title = `${c.name} · Fixture, tablas y estadísticas · 126Goals`;
  const description = `${c.name}: resultados en vivo, fixture, tablas, goleadores, equipos y todos los campeones.`;
  return { title, description, openGraph: { title, description } };
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

  const champions = comp.id === "amistosos" ? null : championsTab(comp.id);
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
      <TournamentHero id={comp.id} name={comp.name} country={comp.country} live={live} follow>
        {seasonTitle(season.name, season.label)}
      </TournamentHero>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {stale && (
          <p className="mb-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-navy-700">
            Todavía no empezó la nueva temporada de {comp.name}: se muestra la última ({seasonTitle(season.name, season.label)}).
          </p>
        )}
        <HubTabs
          tabs={[
            { id: "fixture", label: "Fixture y tablas", short: "Partidos", content: fixtureTab },
            // Los amistosos no tienen tabla de equipos, estadísticas ni campeón: solo los partidos.
            ...(comp.id === "amistosos"
              ? []
              : [
                  {
              id: "equipos",
              label: "Estadísticas y equipos",
              short: "Estadísticas",
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
                ]),
            ...(champions ? [{ id: "campeones", label: "Campeones", content: champions }] : []),
            // La Liga Profesional suma su historia completa desde 1891.
            ...(comp.id === "liga-profesional" ? [{ id: "historia", label: "Historia", content: <LeagueHistory /> }] : []),
            // La Primera Nacional, la historia del ascenso (segunda división).
            ...(comp.id === "primera-nacional" ? [{ id: "historia", label: "Historia", content: <AscensoHistory /> }] : []),
          ]}
        />
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

// Copas de selecciones: la tabla por país (no hay escudos ni subcampeones de clubes).
const NATIONS = new Set(["copa-america", "eurocopa", "finalissima", "nations-league", "mundial-sub20", "mundial-sub17", "juegos-olimpicos", "copa-oro", "nations-league-concacaf", "copa-africana", "copa-asiatica", "mundial-femenino", "copa-america-femenina"]);

// Pestaña "Campeones": la lista completa, a la vista. Sin datos verificados, no aparece.
function championsTab(id: string): React.ReactNode | null {
  if (id === "eliminatorias")
    return (
      <div className="panel flex flex-col items-center gap-4 px-6 py-10 text-center">
        <p className="max-w-lg text-navy-600">Las Eliminatorias no tienen campeón: reparten los lugares para la Copa del Mundo, que tiene su propia sección con toda la historia.</p>
        <Link href="/mundiales" className="btn-primary">
          Ver la Copa del Mundo
        </Link>
      </div>
    );
  // Cada año lleva a su edición (cuadro, goleadores y partidos); las ediciones viejas de las copas sudamericanas, a su
  // temporada en el sitio, con los partidos de los clubes argentinos verificados.
  const rows = HISTORY_ROWS[id]?.().map((r) =>
    id === "liga-profesional" || id === "copa-argentina" || (r.href && r.year < 2008) ? r : { ...r, href: r.champion ? editionHref(id, String(r.year)) : r.href },
  );
  if (rows) {
    const amateur = id === "liga-profesional" ? new Set(leagueFinals().filter((r) => r.amateur).map((r) => r.href + (r.champion ?? ""))) : undefined;
    return (
      <div className="space-y-8">
        <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[2fr_3fr]">
          <section>
            <h2 className="section-title mb-3">Más ganadores</h2>
            <RankTable rows={rows} />
          </section>
          <section>
            <h2 className="section-title mb-3">Año por año</h2>
            <YearList rows={rows} era={amateur ? (r) => (amateur.has(r.href + (r.champion ?? "")) ? "Era amateur (1891–1934)" : "Era profesional (desde 1931)") : undefined} />
          </section>
        </div>
        {id === "copa-intercontinental" && (
          <section>
            <h2 className="section-title mb-1">Anexo · Copa Intercontinental (1960–2004)</h2>
            <p className="mb-3 text-sm text-navy-500">La copa vieja entre el campeón de la Libertadores y el de Europa. Es otro torneo: sus títulos se cuentan aparte.</p>
            <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[2fr_3fr]">
              <RankTable rows={listFinals(INTERCONTINENTAL, "Copa Intercontinental")} />
              <YearList rows={listFinals(INTERCONTINENTAL, "Copa Intercontinental")} />
            </div>
          </section>
        )}
      </div>
    );
  }
  const data = championsOf(id);
  if (!data) return null;
  return <ChampionsList rows={data.rows} ranking={titlesByClub(id)} label={NATIONS.has(id) ? "Selección" : "Club"} compId={id} />;
}

// Subtítulo de la temporada, corto y en castellano: "Torneo Clausura 2026", "Fase de grupos · 2026" o "Temporada 2025".
// ESPN a veces da el nombre en inglés y largo ("2025 Argentine Trofeo de Campeones - Final"): ahí, solo el año.
function seasonTitle(name: string, label: string) {
  const year = (name.match(/\b(19|20)\d\d(?:[-–/]\d{2,4})?\b/) ?? label.match(/\b(19|20)\d\d(?:[-–/]\d{2,4})?\b/))?.[0];
  const torneo = name.match(/\b(apertura|clausura)\b/i)?.[1];
  if (torneo) return `Torneo ${torneo.charAt(0).toUpperCase()}${torneo.slice(1).toLowerCase()}${year ? ` ${year}` : ""}`;
  const stage = translateStage(name);
  if (stage && !/\b(argentine|league|cup|season|trofeo|copa)\b/i.test(stage) && !/\d{4}/.test(stage)) return year ? `${stage} · ${year}` : stage;
  return year ? `Temporada ${year}` : label;
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
