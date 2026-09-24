import type { Metadata } from "next";
import Crest from "@/components/Crest";
import PageHero from "@/components/PageHero";
import { CRESTS } from "@/lib/crests";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Fuentes y créditos · Offside 45" };

export default function CreditsPage() {
  const crests = Object.entries(CRESTS).filter(([id]) => id !== "lomas-academy");

  return (
    <>
      <PageHero eyebrow="Offside 45" title="Fuentes y créditos" />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <section>
          <h2 className="section-title mb-3">Datos</h2>
          <div className="panel space-y-3 p-4 text-sm leading-relaxed text-navy-700">
            <p>
              Los resultados salen de la{" "}
              <a href="https://www.rsssf.org/tablesa/arghist.html" className="text-brand-500 hover:underline">
                Rec.Sport.Soccer Statistics Foundation (RSSSF)
              </a>
              , que publica cada temporada partido por partido a partir de los diarios de la época, y se cruzan con
              Wikipedia. Cada partido indica de qué fuente sale y las diferencias entre fuentes quedan anotadas.
            </p>
          </div>
        </section>

        <section>
          <h2 className="section-title mb-3">Escudos</h2>
          <p className="mb-3 text-sm text-navy-600">
            Los escudos provienen de Wikimedia Commons y son marcas de sus respectivos clubes. Se usan solo para
            identificarlos. Los clubes sin escudo documentado se muestran con sus iniciales.
          </p>
          <ul className="panel divide-y divide-navy-100 text-sm">
            {crests.map(([id, crest]) => {
              const team = getTeam(id);
              if (!team) return null;
              return (
                <li key={id} className="flex items-center gap-3 px-4 py-2">
                  <Crest team={team} size="sm" />
                  <span className="flex-1 font-medium text-navy-800">{team.name}</span>
                  <span className="text-xs text-navy-500">{crest.license}</span>
                  <a href={crest.page} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline">
                    Wikimedia Commons
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
