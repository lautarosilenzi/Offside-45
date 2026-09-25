import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import PageHero from "@/components/PageHero";
import { CUP_COMPETITIONS, CUP_SEASONS, seasonNameOf, sourceOrder } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { Season } from "@/lib/types";

export const metadata: Metadata = { title: "Copas nacionales · Offside 45" };

// Qué fue cada copa, en una línea.
const ABOUT: Record<string, string> = {
  "Copa Chevallier Boutell":
    "Copa de Competencia Chevallier Boutell (Tie Cup). Cuadros de Buenos Aires, Rosario y Montevideo; la AFA reconoce como copa nacional las ediciones 1900–1906.",
  "Copa Jockey Club":
    "Copa de Competencia Jockey Club. Hasta 1912 fue la fase argentina de la Tie Cup; desde 1913, copa nacional abierta también a equipos de Intermedia y Segunda.",
  "Copa de Honor":
    "Copa de Honor Municipalidad de Buenos Aires. Eliminación directa entre los equipos de Primera; desde 1913, con un cuadro de Buenos Aires y otro de Rosario.",
  "Copa La Nación":
    "Copa de Competencia «La Nación» de la Federación Argentina de Football, la liga disidente de 1912–1914. Abierta a equipos de Primera y de Segunda.",
  "Copa Ibarguren":
    "Copa Dr. Carlos Ibarguren: el campeón argentino contra el campeón de la Liga Rosarina (en 1913 también participó el de Santa Fe). Desde 1942, contra la selección de liga ganadora del Campeonato Argentino.",
  "Copa de Competencia de la Asociación Amateurs":
    "Copa de la Asociación Amateurs de Football, la liga disidente de 1919–1926. Desde 1924 con fase de grupos.",
  "Copa Estímulo": "Copa de la Asociación Argentina de Football, por zonas o grupos y con clubes de Primera de ese momento.",
  "Copa de Competencia de la Liga Argentina":
    "Copa de la Liga Argentina de Football, la primera liga profesional (1932–1933). En 1933, con doble eliminación en las primeras rondas.",
  "Copa Beccar Varela":
    "Copa de Honor «Adrián Beccar Varela» de la liga profesional. En 1933 se sumaron clubes de Rosario, Santa Fe, Córdoba y Uruguay.",
  "Copa de Oro": "Final de 1936 entre los ganadores de la Copa de Honor y de la Copa Campeonato. La AFA la cuenta como título de Primera.",
  "Copa Escobar":
    "Copa Adrián C. Escobar, entre los siete primeros del campeonato, jugada en uno o dos días con partidos cortos y empates definidos por córners.",
  "Copa Británica":
    "Copa de Competencia Británica «Jorge VI», donada por el embajador británico. Eliminación directa entre los equipos de Primera; la de 1948 quedó sin terminar.",
  "Copa de la República":
    "Campeonato de la República: el primer torneo con clubes de todo el país. Los equipos del interior jugaban por zonas y los ganadores cruzaban con equipos de Primera.",
  "Campeonato Porteño": "Partido entre los campeones de 1926 de la Asociación Argentina y de la Asociación Amateurs, antes de la unificación. Quedó sin definir.",
};

export default function CupsPage() {
  const matchCount = CUP_SEASONS.reduce((n, s) => n + s.matches.length, 0);
  const clubs = new Set(CUP_SEASONS.flatMap((s) => s.matches.flatMap((m) => [m.homeId, m.awayId])));

  return (
    <>
      <PageHero eyebrow="Copas nacionales oficiales" title="Copas">
        Todos los partidos de las copas nacionales reconocidas por la AFA, edición por edición y con todos los clubes que
        las jugaron.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={CUP_SEASONS.length} label="Ediciones cargadas" />
          <Stat value={matchCount} label="Partidos" />
          <Stat value={clubs.size} label="Clubes" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        {CUP_COMPETITIONS.map((c) => (
          <section key={c.name}>
            <div className="mb-3">
              <h2 className="section-title">
                {c.name} · {c.editions[0].year}–{c.editions[c.editions.length - 1].year}
              </h2>
              {ABOUT[c.name] && <p className="mt-1 text-sm text-navy-500">{ABOUT[c.name]}</p>}
            </div>
            <ul className="panel divide-y divide-navy-100">
              {c.editions.map((s) => (
                <EditionRow key={s.slug} season={s} />
              ))}
            </ul>
          </section>
        ))}
        <p className="text-sm text-navy-400">
          Están todas las copas nacionales de Primera que reconoce la AFA hasta 1950. Las siguientes se cargan junto con sus
          temporadas.
        </p>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}

function EditionRow({ season }: { season: Season }) {
  const champion = season.championIds[0] ? getTeam(season.championIds[0]) : undefined;
  const runnerUp = season.runnerUpIds?.[0] ? getTeam(season.runnerUpIds[0]) : undefined;
  const final = season.matches
    .filter((m) => /^Final\b/.test(m.stage ?? "") && m.status !== "annulled")
    .sort(sourceOrder)
    .pop();
  // Resultado de la final visto desde el campeón.
  const score = !final
    ? null
    : final.walkover
      ? "W.O."
      : final.homeId === champion?.id
        ? `${final.homeGoals}-${final.awayGoals}`
        : `${final.awayGoals}-${final.homeGoals}`;
  const teams = new Set(season.matches.flatMap((m) => [m.homeId, m.awayId])).size;

  return (
    <li>
      <Link
        href={`/temporadas/${season.slug}`}
        className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3 transition hover:bg-navy-50 sm:grid-cols-[4rem_1fr_auto_1fr_7rem]"
      >
        <span className="row-span-2 font-display text-2xl font-bold text-navy-900 sm:row-span-1">{season.year}</span>
        {champion ? (
          <span className="flex min-w-0 items-center gap-2">
            <Crest team={champion} size="sm" />
            <span className="truncate font-bold text-navy-950">{seasonNameOf(season, champion.id) ?? champion.name}</span>
          </span>
        ) : (
          <span className="text-sm text-navy-500">Sin campeón · suspendida</span>
        )}
        {score ? (
          <span className="rounded-sm bg-navy-900 px-2 py-0.5 text-center font-display text-base font-bold tabular-nums text-white">
            {score}
          </span>
        ) : (
          <span />
        )}
        {runnerUp ? (
          <span className="col-start-2 flex min-w-0 items-center gap-2 text-sm text-navy-600 sm:col-start-auto">
            <span className="text-xs uppercase tracking-wider text-navy-400 sm:hidden">Final vs.</span>
            <Crest team={runnerUp} size="xs" />
            <span className="truncate">{seasonNameOf(season, runnerUp.id) ?? runnerUp.name}</span>
          </span>
        ) : (
          <span className="hidden sm:block" />
        )}
        <span className="col-start-3 row-start-2 text-right text-xs text-navy-400 sm:col-start-auto sm:row-start-auto">
          {teams} equipos · {season.matches.length} partidos
        </span>
      </Link>
    </li>
  );
}
