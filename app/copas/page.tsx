import type { Metadata } from "next";
import { EditionRow, HeroStat as Stat } from "@/components/CupEditions";
import PageHero from "@/components/PageHero";
import { CUP_COMPETITIONS, CUP_SEASONS } from "@/lib/seasons";

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
  "Copa de Competencia": "Copa de Competencia «Trofeo AFA» de 1952, con equipos de Primera, de la B y campeones del interior. Se abandonó después de la ronda preliminar.",
  "Copa Perón":
    "Campeonato de la Provincia de Buenos Aires 1955, con doble eliminación entre siete equipos bonaerenses. La AFA lo reconoció como título de Primera en 2024.",
  "Copa Suecia": "Copa de 1958 entre los equipos de Primera, en dos grupos, jugada mientras la selección estaba en el Mundial de Suecia.",
  "Campeonato de Campeones":
    "Campeonato de Campeones de la República 1959, entre los campeones de las ligas regionales. La AFA lo reconoció como título de Primera en 2024.",
  "Copa Argentina":
    "La copa de todas las categorías del fútbol argentino. Se jugó en 1969 y 1970 (la de 1970 quedó sin terminar) y volvió en 2011/12, con clubes de Primera, del Ascenso y del Torneo Federal.",
  "Copa Centenario":
    "Copa por los 100 años de la AFA (1993), entre 18 equipos de Primera: series de ida y vuelta y después doble eliminación, con ronda de ganadores y de perdedores.",
  "Supercopa Argentina": "Partido único entre el campeón de Primera y el campeón de la Copa Argentina (desde 2012).",
  "Copa Campeonato": "Final de 2014 entre los ganadores del Inicial 2013 (San Lorenzo) y del Final 2014 (River).",
  "Copa del Bicentenario": "Partido de 2016 por los 200 años de la Independencia, entre los campeones de 2014 (Racing) y 2016 (Lanús).",
  "Trofeo de Campeones": "Partido entre los campeones de los dos torneos de Primera del año (Superliga y Liga Profesional, desde 2019). La edición 2020 quedó sin terminar.",
  "Supercopa Internacional": "Partido entre el ganador del Trofeo de Campeones y el mejor de la tabla anual, a veces jugado en el exterior (desde 2022).",
  "Copa de la Superliga":
    "Copa de los equipos de la Superliga, jugada después del campeonato: en 2019 con series de ida y vuelta; la de 2020 se suspendió por la pandemia después de la primera fecha.",
  "Copa de la Liga":
    "Copa de los equipos de Primera de la Liga Profesional (2020–2024), por zonas y con eliminación directa. La de 2020 se llamó Copa Diego Maradona. La AFA la cuenta como título de Primera.",
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
                {c.name} · {c.editions[0].year}
                {c.editions[c.editions.length - 1].year !== c.editions[0].year && `–${c.editions[c.editions.length - 1].year}`}
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
          Están todas las copas nacionales de Primera que reconoce la AFA hasta el año 2000 (entre 1971 y 2000 solo se jugó la Copa Centenario de 1993),
          y desde 2012 las Supercopas, la Copa Campeonato, la del Bicentenario, los Trofeos de Campeones, la Copa de la Superliga (2019–2020)
          y la Copa de la Liga Profesional (2020–2024), y todas las ediciones de la Copa Argentina desde su vuelta en 2011/12, con
          sus fases preliminares y cientos de clubes del Ascenso y del interior (la de 2026 está en juego).
        </p>
      </main>
    </>
  );
}
