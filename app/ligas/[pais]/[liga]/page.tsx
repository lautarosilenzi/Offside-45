import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompLogo from "@/components/CompLogo";
import PageHero from "@/components/PageHero";
import LiveMatches from "@/components/live/LiveMatches";
import LiveTable from "@/components/live/LiveTable";
import { GROUPS, LIVE_CODE, PENDING, compHref } from "@/lib/competitions";
import { liveLeagues } from "@/lib/live/leagues";

export const dynamicParams = false;
export const generateStaticParams = () => PENDING.map(({ group, comp }) => ({ pais: group.id, liga: comp.id }));

const find = (pais: string, liga: string) => PENDING.find((p) => p.group.id === pais && p.comp.id === liga);

export function generateMetadata({ params }: { params: { pais: string; liga: string } }): Metadata {
  const p = find(params.pais, params.liga);
  return { title: p ? `${p.comp.name} · Offside 45` : "Offside 45" };
}

// Competencias sin historia cargada: partidos y tabla en vivo (lib/live); las que no tienen fuente en vivo esperan una.
export default function PendingLeaguePage({ params }: { params: { pais: string; liga: string } }) {
  const p = find(params.pais, params.liga);
  if (!p) notFound();
  const { group, comp } = p;
  const others = GROUPS.find((g) => g.id === group.id)!.competitions.filter((c) => c.id !== comp.id);

  return (
    <>
      <PageHero eyebrow={group.name} title={comp.name}>
        Partidos, resultados en vivo y tabla de posiciones, actualizados solos.
      </PageHero>
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        {LIVE_CODE[comp.id] ? (
          <>
            <section>
              <h2 className="section-title mb-3 flex items-center gap-2">
                <CompLogo id={comp.id} size={28} /> Partidos
              </h2>
              <LiveMatches leagues={liveLeagues([comp.id])} />
            </section>
            <section>
              <h2 className="section-title mb-3">Tabla de posiciones</h2>
              <LiveTable code={LIVE_CODE[comp.id]} />
            </section>
          </>
        ) : (
          <div className="panel flex flex-col items-center gap-4 px-6 py-12 text-center">
            <CompLogo id={comp.id} size={96} />
            <p className="font-display text-2xl font-bold uppercase tracking-wide text-navy-900">Muy pronto, en vivo</p>
            <p className="max-w-lg text-navy-600">
              Las tablas y los resultados de {comp.name} se van a actualizar solos, al momento, cuando conectemos la fuente de datos
              en vivo. Mientras tanto, no mostramos números que no podamos garantizar.
            </p>
          </div>
        )}
        {others.length > 0 && (
          <section>
            <h2 className="section-title mb-3">Más de {group.name}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((c) => (
                <li key={c.id}>
                  <Link href={compHref(group, c)} className="panel flex items-center gap-3 px-4 py-3 transition hover:-translate-y-0.5">
                    <CompLogo id={c.id} size={32} />
                    <span className="font-semibold text-navy-900">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
