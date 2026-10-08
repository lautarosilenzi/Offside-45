import type { Metadata } from "next";
import Crest from "@/components/Crest";
import PageHero from "@/components/PageHero";
import { CRESTS } from "@/lib/crests";
import { BALLON_DOR } from "@/lib/data/ballon-dor";
import LOGOS from "@/lib/data/comps.generated.json";
import { FEATURED, GROUPS } from "@/lib/competitions";
import CompLogo from "@/components/CompLogo";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Fuentes y créditos · 126Goals" };

export default function CreditsPage() {
  const crests = Object.entries(CRESTS).filter(([id]) => id !== "lomas-academy");
  // Una foto por jugador (la misma se repite en cada año que ganó).
  const photos = BALLON_DOR.filter((b, i) => BALLON_DOR.findIndex((x) => x.photo.file === b.photo.file) === i);

  return (
    <>
      <PageHero eyebrow="126Goals" title="Fuentes y créditos" />
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
            Los escudos provienen de Wikimedia Commons y, los que no tienen una versión libre, de la Wikipedia en inglés. Son
            marcas de sus respectivos clubes y se usan solo para identificarlos. Cada escudo se buscó en el artículo del club y se
            revisó a mano. Los clubes sin escudo documentado se muestran con sus iniciales.
          </p>
          <ul className="panel divide-y divide-navy-100 text-sm">
            {crests.map(([id, crest]) => {
              const team = getTeam(id);
              if (!team) return null;
              return (
                <li key={id} className="flex items-center gap-3 px-4 py-2">
                  <Crest team={team} size="sm" />
                  <span className="min-w-0 flex-1 truncate font-medium text-navy-800">{team.name}</span>
                  <span className="hidden max-w-[16rem] truncate text-xs text-navy-500 sm:inline">{crest.license}</span>
                  <a href={crest.page} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline">
                    {crest.page.includes("commons.") ? "Wikimedia Commons" : "Wikipedia"}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3">Logos de las competencias y banderas</h2>
          <p className="mb-3 text-sm text-navy-600">
            Los logos salen de los artículos de Wikipedia de cada competencia (en Commons o, si no hay versión libre, en la Wikipedia en
            inglés) y son marcas de sus organizadores; se usan solo para identificarlas. Las banderas son de flagcdn.com y, las de países
            que ya no existen, de Wikimedia Commons (dominio público).
          </p>
          <ul className="panel grid gap-x-4 divide-y divide-navy-100 text-sm sm:grid-cols-2 sm:divide-y-0">
            {Object.entries(LOGOS as Record<string, { license: string; page: string }>).map(([id, logo]) => {
              const comp = [...FEATURED, ...GROUPS.flatMap((g) => g.competitions)].find((c) => c.id === id);
              return (
                <li key={id} className="flex items-center gap-3 px-4 py-2">
                  <CompLogo id={id} size={24} />
                  <span className="min-w-0 flex-1 truncate font-medium text-navy-800">{comp?.name ?? id}</span>
                  <a href={logo.page} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline">
                    {logo.page.includes("commons.") ? "Commons" : "Wikipedia"}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3">Fotos del Balón de Oro</h2>
          <p className="mb-3 text-sm text-navy-600">
            La lista de ganadores sale de Wikipedia. Las fotos son de Wikimedia Commons, con licencia libre; se muestran desde
            Commons y cada una lleva a su página con el autor y la licencia.
          </p>
          <ul className="panel divide-y divide-navy-100 text-sm">
            {photos.map((b) => (
              <li key={b.photo.file} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 px-4 py-2">
                <span className="flex-1 font-medium text-navy-800">{b.name}</span>
                <span className="text-xs text-navy-500">
                  {b.photo.author} · {b.photo.license}
                </span>
                <a
                  href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(b.photo.file)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-500 hover:underline"
                >
                  Wikimedia Commons
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
