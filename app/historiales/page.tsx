import EraDiff from "@/components/EraDiff";
import MatchList from "@/components/MatchList";
import PageHero from "@/components/PageHero";
import StatsCard from "@/components/StatsCard";
import TeamPicker from "@/components/TeamPicker";
import { TEAM_IDS_WITH_MATCHES, computeStats, eraOf, getHeadToHead, isCounted } from "@/lib/matches";
import { SEASONS } from "@/lib/seasons";
import { FOREIGN_TEAMS, HISTORIC_TEAMS, TEAMS, getTeam } from "@/lib/teams";

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "es");
const option = (t: { id: string; name: string }) => ({ id: t.id, name: t.name });
const CURRENT = [...TEAMS].sort(byName).map(option);
const OTHERS = HISTORIC_TEAMS.filter((t) => TEAM_IDS_WITH_MATCHES.has(t.id)).sort(byName).map(option);
const FOREIGN = FOREIGN_TEAMS.filter((t) => TEAM_IDS_WITH_MATCHES.has(t.id)).sort(byName).map(option);

// El historial se calcula en el servidor: el navegador recibe solo los partidos del cruce elegido.
export default function Home({ searchParams }: { searchParams: { a?: string; b?: string } }) {
  const a = getTeam(searchParams.a ?? "") ?? getTeam("river")!;
  let b = getTeam(searchParams.b ?? "") ?? getTeam("boca")!;
  if (b.id === a.id) b = getTeam(a.id === "boca" ? "river" : "boca")!;

  const matches = getHeadToHead(a.id, b.id);
  const stats = computeStats(matches, a.id);
  const eraRows = [
    { label: "Total", detail: "Todos los partidos oficiales", stats },
    { label: "Era profesional", detail: "Desde 1931", stats: computeStats(matches.filter((m) => eraOf(m) === "profesional"), a.id) },
    { label: "Era amateur", detail: "Hasta 1930 y ligas amateurs 1931–1934", stats: computeStats(matches.filter((m) => eraOf(m) === "amateur"), a.id) },
  ];
  const annulledCount = matches.length - matches.filter(isCounted).length;
  const first = SEASONS[0].year;
  const last = SEASONS[SEASONS.length - 1].year;

  return (
    <>
      <PageHero eyebrow="Cara a cara" title="Historial entre equipos">
        Elegí dos equipos y mirá todos sus enfrentamientos oficiales, resultados y estadísticas.
      </PageHero>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <TeamPicker a={a} b={b} current={CURRENT} others={OTHERS} foreign={FOREIGN} />

        {matches.length === 0 ? (
          <div className="panel px-6 py-14 text-center">
            <p className="font-display text-xl font-bold uppercase tracking-wide text-navy-800">Sin partidos registrados</p>
            <p className="mt-1 text-sm text-navy-500">
              No hay partidos entre {a.name} y {b.name} en las temporadas cargadas ({first}–{last}).
            </p>
          </div>
        ) : (
          <>
            <StatsCard a={a} b={b} stats={stats} />
            <EraDiff a={a} b={b} rows={eraRows} />
            <p className="rounded-2xl border-l-4 border-brand-500 bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy-600">
              Todos los partidos oficiales de Primera entre {first} y {last}, verificados uno por uno. Incluye las
              copas nacionales oficiales y los cruces en copas internacionales. Goles: {a.name} {stats.goalsA}, {b.name}{" "}
              {stats.goalsB} ({stats.goalsA + stats.goalsB} en total).
              {annulledCount > 0 &&
                ` ${annulledCount === 1 ? "Hay 1 partido" : `Hay ${annulledCount} partidos`} anulado${annulledCount === 1 ? "" : "s"} o sin jugar que se muestra${annulledCount === 1 ? "" : "n"} pero no suma${annulledCount === 1 ? "" : "n"}.`}
            </p>
            <section>
              <h2 className="section-title mb-3">Partidos ({matches.length})</h2>
              <MatchList matches={matches} />
            </section>
          </>
        )}
      </main>
    </>
  );
}
