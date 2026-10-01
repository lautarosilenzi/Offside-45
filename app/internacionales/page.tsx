import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import { EditionRow, HeroStat } from "@/components/CupEditions";
import PageHero from "@/components/PageHero";
import { INTL_COMPETITIONS, INTL_SEASONS } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Copas internacionales · Offside 45" };

// Qué fue cada copa, en una línea.
const ABOUT: Record<string, string> = {
  "Copa Chevallier Boutell":
    "Tie Cup o Copa de Competencia, la primera copa internacional de clubes. Las ediciones 1900–1906 (con clubes de Buenos Aires, Rosario y Montevideo) la AFA las cuenta como copa nacional; desde 1907, final en Buenos Aires entre el ganador argentino y el uruguayo.",
  "Copa de Honor Cusenier":
    "Final en Montevideo entre los ganadores de las Copas de Honor de Argentina y Uruguay (1905–1920). La donó la fábrica de licores Cusenier.",
  "Copa Aldao":
    "Campeonato Rioplatense: el campeón argentino contra el uruguayo (1916–1957), un año en cada país. La donó Ricardo Aldao, presidente de la Federación Argentina.",
  "Copa Escobar-Gerona": "Copa de Confraternidad entre los subcampeones de Argentina y Uruguay (1941–1946).",
  "Copa Libertadores":
    "La copa de clubes de la Conmebol, desde 1960 (hasta 1964, Copa de Campeones de América). De cada edición están todos los partidos de los clubes argentinos, confirmados con una segunda fuente; del resto, el campeón y el finalista.",
  "Supercopa Sudamericana": "La Supercopa Libertadores (1988–1997), entre los campeones de la Copa Libertadores.",
  "Copa Conmebol": "La segunda copa de la Conmebol (1992–1999), para los clubes que no jugaban la Libertadores. La antecesora de la Sudamericana.",
  "Copa Mercosur": "Copa de la Conmebol con clubes de Argentina, Brasil, Chile, Paraguay y Uruguay (1998–2001).",
  "Copa Sudamericana": "La segunda copa de clubes de la Conmebol, desde 2002. De cada edición están todos los partidos de los clubes argentinos.",
  "Recopa Sudamericana": "Entre el campeón de la Copa Libertadores y el de la Supercopa o la Sudamericana (desde 1989).",
  "Copa Intercontinental": "Entre los campeones de Europa y de la Libertadores (1960–2004). La FIFA reconoce a sus ganadores como campeones del mundo.",
  "Copa Interamericana": "Entre los campeones de la Libertadores y de la Concacaf (1968–1998).",
  "Mundial de Clubes": "La copa de la FIFA entre los campeones de cada confederación (desde 2000; desde 2025, con 32 equipos).",
  "Copa Suruga Bank": "Entre el campeón de la Sudamericana y el de la Copa de la Liga japonesa (2008–2019).",
  "Copa Máster de Supercopa": "Entre los campeones de la Supercopa (1992, en Buenos Aires).",
  "Copa de Oro Nicolás Leoz": "Entre los campeones de las copas de la Conmebol de la temporada anterior (1993–1996).",
  "Copa Máster de Conmebol": "Entre los campeones de la Copa Conmebol (1996).",
  "Copa Iberoamericana": "Entre el campeón de la Copa de Oro y el de la Copa del Rey de España (1994).",
  "Recopa Sudamericana de Clubes": "Copa de la Conmebol de 1970 con un club por país; jugó Atlanta.",
  "Campeonato Sudamericano de Campeones":
    "Siete campeones sudamericanos en Santiago de Chile, en 1948: el antecedente de la Copa Libertadores. River fue segundo.",
};

export default function InternationalPage() {
  const competitions = [...INTL_COMPETITIONS].sort((a, b) => a.editions[0].year - b.editions[0].year);
  const argentine = (id: string) => !getTeam(id)?.country;
  const matches = INTL_SEASONS.flatMap((s) => s.matches);
  const derbies = matches.filter((m) => argentine(m.homeId) && argentine(m.awayId)).length;

  // Títulos internacionales de clubes argentinos (sin las ediciones 1900–1906 de la Tie Cup, que son copa nacional).
  const titles = new Map<string, number>();
  for (const s of INTL_SEASONS) for (const id of s.championIds) if (argentine(id)) titles.set(id, (titles.get(id) ?? 0) + 1);
  const ranking = [...titles.entries()].sort((a, b) => b[1] - a[1] || getTeam(a[0])!.name.localeCompare(getTeam(b[0])!.name));

  return (
    <>
      <PageHero eyebrow="Clubes argentinos en el exterior" title="Copas internacionales">
        Todas las copas internacionales oficiales que jugaron los clubes argentinos, edición por edición, con cada partido.
        Los cruces entre dos clubes argentinos suman en el historial.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <HeroStat value={INTL_SEASONS.length} label="Ediciones cargadas" />
          <HeroStat value={matches.length} label="Partidos de clubes argentinos" />
          <HeroStat value={derbies} label="Cruces entre argentinos" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        {ranking.length > 0 && (
          <section>
            <h2 className="section-title mb-3">Títulos de clubes argentinos</h2>
            <ul className="flex flex-wrap gap-2">
              {ranking.map(([id, n]) => {
                const team = getTeam(id)!;
                return (
                  <li key={id} className="panel flex items-center gap-2 px-3 py-1.5 text-sm">
                    <Crest team={team} size="xs" />
                    <span className="font-semibold text-navy-900">{team.name}</span>
                    <span className="rounded-full bg-navy-900 px-2 font-display font-bold text-white">{n}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs text-navy-500">
              Todas las copas internacionales oficiales, incluidas las rioplatenses (Tie Cup desde 1907, Cusenier, Aldao y
              Escobar-Gerona). Las ediciones 1900–1906 de la Copa Chevallier Boutell cuentan como copa nacional.
            </p>
          </section>
        )}

        {competitions.map((c) => (
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
          Están todas las copas internacionales oficiales que jugaron clubes argentinos, de la Tie Cup de 1907 a la Recopa 2026.
          La Copa Libertadores 2026, que se está jugando, se va a sumar cuando termine. De las copas con clubes de otros países solo se cargan los partidos de los
          clubes argentinos. Las ediciones 1900–1906 de la Copa Chevallier Boutell también figuran en{" "}
          <Link href="/copas" className="text-brand-500 hover:underline">
            copas nacionales
          </Link>
          .
        </p>
      </main>
    </>
  );
}
