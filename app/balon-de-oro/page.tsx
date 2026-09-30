import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { BALLON_DOR, type BallonDor } from "@/lib/data/ballon-dor";

export const metadata: Metadata = { title: "Balón de Oro · Offside 45" };

// Ganadores nacidos en la Argentina, aunque hayan jugado para otra selección (Di Stéfano por España, Sívori por Italia).
const BORN_IN_ARGENTINA: Record<string, string> = {
  "Alfredo Di Stéfano": "Nacido en Buenos Aires; surgido en River. Lo ganó con la nacionalidad española.",
  "Omar Sívori": "Nacido en San Nicolás; surgido en River. Lo ganó con la nacionalidad italiana.",
  "Lionel Messi": "Nacido en Rosario; surgido en Newell's.",
};

export default function BallonDorPage() {
  const winners = [...BALLON_DOR].reverse();
  const wins = new Map<string, number>();
  for (const b of BALLON_DOR) wins.set(b.name, (wins.get(b.name) ?? 0) + 1);
  // Balones ganados por nacidos en la Argentina (Messi, Di Stéfano y Sívori).
  const argentine = BALLON_DOR.filter((b) => BORN_IN_ARGENTINA[b.name]).length;
  const top = [...wins.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHero eyebrow="France Football · desde 1956" title="Balón de Oro">
        Todos los ganadores del Balón de Oro año por año, con el podio de cada votación. Entre 2010 y 2015 se entregó
        junto con la FIFA (FIFA Balón de Oro) y en 2020 no se entregó por la pandemia.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={BALLON_DOR.length} label="Ediciones" />
          <Stat value={wins.size} label="Ganadores" />
          <Stat value={argentine} label="Ganados por argentinos" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <h2 className="section-title mb-3">Más de un Balón de Oro</h2>
          <ul className="flex flex-wrap gap-2">
            {top.map(([name, n]) => (
              <li key={name} className="panel flex items-center gap-2 px-3 py-1.5 text-sm">
                <span className="font-semibold text-navy-900">{name}</span>
                <span className="rounded-full bg-gold-500 px-2 font-display font-bold text-white">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3">Año por año</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {winners.map((b) => (
              <WinnerCard key={b.year} b={b} count={BALLON_DOR.filter((x) => x.name === b.name && x.year <= b.year).length} />
            ))}
          </ul>
          <p className="mt-4 text-xs text-navy-500">
            Hasta 1994 solo podían recibirlo jugadores europeos; desde 1995, cualquier jugador de un club europeo, y desde
            2007, de cualquier club del mundo. Datos de Wikipedia; fotos de Wikimedia Commons (autor y licencia en cada
            foto y en <a href="/creditos" className="text-brand-500 hover:underline">Fuentes y créditos</a>). La edición 2026 se entrega el 26 de octubre.
          </p>
        </section>
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

function WinnerCard({ b, count }: { b: BallonDor; count: number }) {
  const argentina = BORN_IN_ARGENTINA[b.name];
  return (
    <li className="panel flex flex-col overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- foto de Wikimedia Commons, sin optimizar */}
        <img
          src={b.photo.src}
          alt={`${b.name}, Balón de Oro ${b.year}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/95 via-navy-950/60 to-transparent px-4 pb-3 pt-16 text-white">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="font-display text-4xl font-bold leading-none text-gold-400">{b.year}</div>
              <div className="mt-1 truncate font-display text-2xl font-bold uppercase leading-tight tracking-wide">{b.name}</div>
              <div className="truncate text-sm text-navy-200">
                {b.country} · {b.club}
              </div>
            </div>
            {count > 1 && (
              <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 font-display text-sm font-bold" title={`Su Balón de Oro n.º ${count}`}>
                ×{count}
              </span>
            )}
          </div>
        </div>
        {b.award !== "Balón de Oro" && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 font-display text-xs font-semibold uppercase tracking-wide text-navy-900">
            {b.award}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-sm">
        {argentina && <p className="rounded-xl bg-brand-50 px-3 py-1.5 text-xs text-brand-700">🇦🇷 {argentina}</p>}
        <ol className="space-y-1 text-navy-700">
          {b.podium.map((p) => (
            <li key={p.name} className="flex gap-2">
              <span className="w-6 shrink-0 font-display font-bold text-navy-400">{p.rank}.º</span>
              <span className="min-w-0">
                <span className="font-medium text-navy-900">{p.name}</span>{" "}
                <span className="text-xs text-navy-500">
                  {p.country} · {p.club}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-auto pt-1 text-[0.7rem] text-navy-400">
          Foto:{" "}
          <a
            href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(b.photo.file)}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {b.photo.author}
          </a>{" "}
          · {b.photo.license}
        </p>
      </div>
    </li>
  );
}
