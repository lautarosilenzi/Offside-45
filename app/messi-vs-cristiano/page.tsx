import type { Metadata } from "next";
import Flag from "@/components/Flag";
import MessiRonaldo from "@/components/mvc/MessiRonaldo";
import PageHero from "@/components/PageHero";
import { BALLON_DOR } from "@/lib/data/ballon-dor";
import { CAREER, H2H_MATCHES, PROFILES, SOURCES, TITLES_CONTESTED, UPDATED, type PlayerKey } from "@/lib/data/messi-ronaldo";

export const metadata: Metadata = {
  title: "Messi vs Cristiano Ronaldo · Offside 45",
  description: "La comparación más completa entre Messi y Cristiano Ronaldo: goles, asistencias, títulos, finales, Copa del Mundo, Champions y cara a cara.",
};

// Foto más reciente de cada uno en las fichas del Balón de Oro (Wikimedia Commons, con autor y licencia).
const photoOf = (name: string) => [...BALLON_DOR].reverse().find((b) => b.name === name)!.photo;

// Edad al día de los datos.
function age(born: string) {
  const ref = new Date("2026-09-29T12:00:00Z");
  const b = new Date(`${born}T12:00:00Z`);
  return ref.getUTCFullYear() - b.getUTCFullYear() - (ref < new Date(Date.UTC(ref.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate())) ? 1 : 0);
}

export default function MessiVsCristianoPage() {
  return (
    <>
      <PageHero eyebrow="El duelo del siglo" title="Messi vs Cristiano">
        Veinte años de rivalidad en números: goles, asistencias, títulos, finales, Copas del Mundo, Champions y los {H2H_MATCHES.length} partidos en que se enfrentaron. Datos al{" "}
        {UPDATED}, cruzados entre varias fuentes.
      </PageHero>
      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {(["messi", "ronaldo"] as PlayerKey[]).map((p) => (
            <PlayerCard key={p} p={p} />
          ))}
        </div>
        <MessiRonaldo />
        <a href="/jugadores?a=messi&b=cristiano" className="panel panel-hover flex items-center justify-between gap-4 px-5 py-4">
          <span>
            <span className="block font-display text-lg font-bold uppercase tracking-wide text-navy-950">Comparador de leyendas</span>
            <span className="text-sm text-navy-500">Compará a Messi y a Cristiano con Maradona, Pelé, Cruyff y otras 20 leyendas.</span>
          </span>
          <span className="btn-ghost shrink-0">Comparar</span>
        </a>
        <section className="rounded-2xl border-l-4 border-brand-500 bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy-600">
          <p>
            Partidos oficiales de clubes y selección mayor, al {UPDATED}. Las tablas por temporada y por año suman exactamente los totales de las otras fuentes, y
            el cara a cara coincide partido por partido. Cuando dos fuentes cuentan distinto (por ejemplo, las finales de ida y vuelta) se usa la que cuenta
            finales y se aclara.
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

function PlayerCard({ p }: { p: PlayerKey }) {
  const prof = PROFILES[p];
  const photo = photoOf(prof.name);
  const c = CAREER[p];
  return (
    <div className="panel overflow-hidden">
      <div className="relative h-44 bg-navy-900 sm:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element -- foto de Wikimedia Commons */}
        <img src={photo.src} alt={prof.name} referrerPolicy="no-referrer" className="h-full w-full object-cover object-top" style={photo.position ? { objectPosition: photo.position } : undefined} />
        <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: prof.color }} />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <Flag code={prof.flag} size={12} /> {prof.country}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <h2 className="font-display text-xl font-extrabold uppercase italic leading-none tracking-wide text-navy-950 sm:text-3xl">{prof.name}</h2>
        <p className="mt-1 text-xs text-navy-500">
          {age(prof.born)} años · {prof.birthplace} · {prof.foot}
        </p>
        <p className="mt-0.5 hidden text-xs text-navy-400 sm:block">{prof.clubs}</p>
        <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { l: "Partidos", v: c.apps },
            { l: "Goles", v: c.goals },
            { l: "Asist.", v: c.assists },
            { l: "Títulos", v: TITLES_CONTESTED[p].won },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-navy-50 px-2 py-1.5 text-center">
              <dd className="font-display text-lg font-bold tabular-nums text-navy-950 sm:text-2xl">{s.v.toLocaleString("es-AR")}</dd>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-navy-500">{s.l}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[0.65rem] text-navy-400">
          Foto{photo.year ? ` (${photo.year})` : ""}:{" "}
          <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.file)}`} target="_blank" rel="noreferrer" className="hover:underline">
            {photo.author}
          </a>{" "}
          · {photo.license}
        </p>
      </div>
    </div>
  );
}
