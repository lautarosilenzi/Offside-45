import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditionView from "@/components/EditionView";
import TournamentHero from "@/components/hub/TournamentHero";
import { editionHref, editionRows } from "@/lib/editions";
import { findLiveCompetition } from "@/lib/live/competitions";
import { editionEvents, type LiveEvent } from "@/lib/live/espn";

// Una edición de un torneo: el campeón, el cuadro, los goleadores, los números y todos los partidos. Los partidos
// salen de ESPN, que los tiene más o menos desde 2003 (Champions) y 2008 (Libertadores y Sudamericana); de las
// ediciones más viejas se muestra solo lo bien documentado: campeón, finalista y resultado de la final.
// Una temporada terminada no cambia: se arma una vez y se guarda un día.
export const revalidate = 86400;
export const maxDuration = 30;
export const dynamicParams = true;
export const generateStaticParams = () => [];

// "2024-25" → "2024–25" (como figura en la lista de campeones).
const seasonLabel = (slug: string) => slug.replace("-", "–");

export function generateMetadata({ params }: { params: { id: string; temporada: string } }): Metadata {
  const c = findLiveCompetition(params.id);
  if (!c) return { title: "126Goals" };
  const title = `${c.name} ${seasonLabel(params.temporada)} · Campeón, cuadro, goleadores y partidos · 126Goals`;
  const description = `${c.name} ${seasonLabel(params.temporada)}: el campeón, el cuadro, los goleadores y todos los partidos de la edición.`;
  return { title, description, openGraph: { title, description } };
}

export default async function EditionPage({ params }: { params: { id: string; temporada: string } }) {
  const comp = findLiveCompetition(params.id);
  if (!comp || !/^\d{4}(-\d{2,4})?$/.test(params.temporada)) notFound();
  const label = seasonLabel(params.temporada);
  const all = editionRows(comp.id);
  const i = all.findIndex((r) => r.season === label);
  const row = all[i];
  const events = (await editionEvents(comp.code, label).catch(() => [] as LiveEvent[])).filter((e) => e.state === "post" || e.state === "in");
  if (!row && !events.length) notFound();
  const nav = (r?: (typeof all)[number]) => (r && editionHref(comp.id, r.season) ? { label: r.season, href: editionHref(comp.id, r.season)! } : undefined);

  return (
    <>
      <TournamentHero id={comp.id} name={`${comp.name} ${label}`} country={comp.country}>
        <Link href={`/torneos/${comp.id}#campeones`} className="underline-offset-2 hover:underline">
          ← Todos los campeones
        </Link>
      </TournamentHero>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <EditionView
          code={comp.code}
          champion={row?.championName}
          runnerUp={row?.runnerUpName}
          detail={row?.detail}
          events={events}
          older={i >= 0 ? nav(all[i + 1]) : undefined}
          newer={i > 0 ? nav(all[i - 1]) : undefined}
        />
      </main>
    </>
  );
}
