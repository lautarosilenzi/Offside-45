import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditionView from "@/components/EditionView";
import Flag from "@/components/Flag";
import PageHero from "@/components/PageHero";
import { TOP_SCORER_BY_YEAR } from "@/lib/data/world-cup-stats";
import { WORLD_CUPS } from "@/lib/data/world-titles";
import { NATIONS, flagOf } from "@/lib/data/nations";
import { editionEvents, type LiveEvent } from "@/lib/live/espn";

// Una Copa del Mundo: el campeón y la final, la sede, el goleador (dato oficial), los números, el cuadro, los goleadores
// y todos los partidos (ESPN los tiene completos desde 1930). Se arma una vez y se guarda un día.
export const revalidate = 86400;
export const maxDuration = 30;
export const dynamicParams = true;
export const generateStaticParams = () => [];

const cupOf = (anio: string) => WORLD_CUPS.find((w) => String(w.year) === anio);

export function generateMetadata({ params }: { params: { anio: string } }): Metadata {
  const w = cupOf(params.anio);
  if (!w) return { title: "Copa del Mundo · 126Goals" };
  const title = `Copa del Mundo ${w.year} · ${w.host} · 126Goals`;
  const description = `Copa del Mundo ${w.year} en ${w.host}: campeón ${w.champion}, la final, los goleadores, el cuadro y todos los partidos.`;
  return { title, description, openGraph: { title, description } };
}

export default async function WorldCupEdition({ params }: { params: { anio: string } }) {
  const w = cupOf(params.anio);
  if (!w) notFound();
  const i = WORLD_CUPS.indexOf(w);
  const events = (await editionEvents("fifa.world", String(w.year)).catch(() => [] as LiveEvent[])).filter((e) => e.state === "post");
  const scorer = TOP_SCORER_BY_YEAR.find((s) => s.year === w.year);
  const prev = WORLD_CUPS[i - 1];
  const next = WORLD_CUPS[i + 1];

  return (
    <>
      <PageHero eyebrow={`Copa del Mundo · ${w.host}`} title={`Copa del Mundo ${w.year}`}>
        <Link href="/mundiales" className="underline-offset-2 hover:underline">
          ← Todas las Copas del Mundo
        </Link>
      </PageHero>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <EditionView
          code="fifa.world"
          champion={w.champion}
          runnerUp={w.runnerUp}
          detail={w.year === 1950 ? `Partido decisivo del cuadrangular final: ${w.score}` : `Final: ${w.score}`}
          events={events}
          extra={
            <section className="panel grid gap-px overflow-hidden bg-navy-100 sm:grid-cols-2">
              <div className="bg-white px-4 py-3 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 font-semibold text-navy-950">
                  {w.host.split(/, | y /).map((h) => (
                    <span key={h} className="flex items-center gap-1.5">
                      <Flag code={flagOf(h)} size={16} /> {h}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-navy-500">Sede</div>
              </div>
              {scorer && (
                <div className="bg-white px-4 py-3 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-x-2 font-semibold text-navy-950">
                    {scorer.players.map((p) => (
                      <span key={p.name} className="flex items-center gap-1.5">
                        <Flag code={NATIONS[p.code]?.flag} size={16} /> {p.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-navy-500">
                    Goleador ({scorer.goals} goles{scorer.players.length > 1 ? " cada uno" : ""})
                  </div>
                </div>
              )}
            </section>
          }
          older={prev ? { label: String(prev.year), href: `/mundiales/${prev.year}` } : undefined}
          newer={next ? { label: String(next.year), href: `/mundiales/${next.year}` } : undefined}
        />
      </main>
    </>
  );
}
