import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { positions } from "@/lib/rank";
import { BALLON_DOR, type BallonDor } from "@/lib/data/ballon-dor";

export const metadata: Metadata = { title: "Balón de Oro · 126Goals" };

// Ganadores nacidos en la Argentina, aunque hayan jugado para otra selección (Di Stéfano por España, Sívori por Italia).
const BORN_IN_ARGENTINA: Record<string, string> = {
  "Alfredo Di Stéfano": "Nacido en Buenos Aires; surgido en River. Lo ganó con la nacionalidad española.",
  "Omar Sívori": "Nacido en San Nicolás; surgido en River. Lo ganó con la nacionalidad italiana.",
};

export default function BallonDorPage() {
  const winners = [...BALLON_DOR].reverse();
  const wins = new Map<string, number>();
  for (const b of BALLON_DOR) wins.set(b.name, (wins.get(b.name) ?? 0) + 1);
  // Balones ganados por nacidos en la Argentina (Messi, Di Stéfano y Sívori).
  const argentine = BALLON_DOR.filter((b) => b.country === "Argentina" || BORN_IN_ARGENTINA[b.name]).length;
  // Tablas de ganadores y de países: con igual cantidad, primero el que llegó antes.
  const players = tally(BALLON_DOR.map((b) => ({ key: b.name, sub: b.country, year: b.year })));
  const countries = tally(BALLON_DOR.map((b) => ({ key: b.country, year: b.year })));

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
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <section>
            <h2 className="section-title mb-3">Ganadores</h2>
            <Tally rows={players} label="Jugador" />
          </section>
          <section>
            <h2 className="section-title mb-3">Por país</h2>
            <Tally rows={countries} label="País" />
          </section>
        </div>

        <section>
          <h2 className="section-title mb-3">Año por año</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {winners.map((b) => (
              <WinnerCard key={b.year} b={b} count={BALLON_DOR.filter((x) => x.name === b.name && x.year <= b.year).length} />
            ))}
          </ul>
          <p className="mt-4 text-xs text-navy-500">
            Hasta 1994 solo podían recibirlo jugadores europeos; desde 1995, cualquier jugador de un club europeo, y desde
            2007, de cualquier club del mundo. Datos de Wikipedia; fotos de Wikimedia Commons, del año en que ganó o del más cercano que hay con licencia libre (el año de la foto figura debajo de cada una; autor y licencia en cada
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
      <div className="stat-value text-3xl font-bold italic text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}

type TallyRow = { key: string; sub?: string; count: number; years: number[] };

function tally(items: { key: string; sub?: string; year: number }[]): TallyRow[] {
  const map = new Map<string, TallyRow>();
  for (const it of items) {
    const r = map.get(it.key) ?? { key: it.key, sub: it.sub, count: 0, years: [] };
    r.count++;
    r.years.push(it.year);
    map.set(it.key, r);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.years[a.count - 1] - b.years[b.count - 1]);
}

function Tally({ rows, label }: { rows: TallyRow[]; label: string }) {
  const pos = positions(rows, (r) => r.count);
  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
            <th className="w-10 py-2 pl-4 text-left">#</th>
            <th className="py-2 text-left">{label}</th>
            <th className="w-12 py-2 text-right">Bal.</th>
            <th className="py-2 pl-4 pr-4 text-left">Años</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {rows.map((r, i) => (
            <tr key={r.key}>
              <td className="py-1.5 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
              <td className="py-1.5">
                <span className="font-semibold text-navy-900">{r.key}</span>
                {r.sub && <span className="ml-1.5 text-xs text-navy-400">{r.sub}</span>}
              </td>
              <td className="py-1.5 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.count}</td>
              <td className="py-1.5 pl-4 pr-4 text-xs tabular-nums text-navy-500">{r.years.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WinnerCard({ b, count }: { b: BallonDor; count: number }) {
  const argentina = BORN_IN_ARGENTINA[b.name];
  return (
    <li className="panel flex flex-col gap-2 p-3">
      <div className="flex gap-3">
        <div className="relative h-28 w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-navy-900">
          {/* eslint-disable-next-line @next/next/no-img-element -- foto de Wikimedia Commons, sin optimizar */}
          <img
            src={b.photo.src}
            alt={`${b.name}${b.photo.year ? ` en ${b.photo.year}` : ""}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-top"
            style={b.photo.position ? { objectPosition: b.photo.position } : undefined}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span data-confetti className="cursor-pointer font-display text-3xl font-bold leading-none text-gold-500">{b.year}</span>
            {count > 1 && (
              <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 font-display text-xs font-bold text-white" title={`Su Balón de Oro n.º ${count}`}>
                ×{count}
              </span>
            )}
          </div>
          <div className="mt-1 font-display text-lg font-bold uppercase leading-tight tracking-wide text-navy-950">{b.name}</div>
          <div className="text-xs text-navy-500">
            {b.country} · {b.club}
          </div>
          {b.award !== "Balón de Oro" && (
            <span className="mt-1 inline-block rounded-full bg-navy-100 px-2 py-0.5 font-display text-[0.65rem] font-semibold uppercase tracking-wide text-navy-700">
              {b.award}
            </span>
          )}
        </div>
      </div>
      {argentina && <p className="rounded-xl bg-brand-50 px-3 py-1 text-xs text-brand-700">🇦🇷 {argentina}</p>}
      <ol className="space-y-0.5 text-xs text-navy-700">
        {b.podium.map((p) => (
          <li key={p.name} className="flex gap-2">
            <span className="w-5 shrink-0 font-display font-bold text-navy-400">{p.rank}.º</span>
            <span className="min-w-0 truncate">
              <span className="font-medium text-navy-900">{p.name}</span> <span className="text-navy-500">· {p.club}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-auto text-[0.65rem] text-navy-400">
        Foto{b.photo.year ? ` (${b.photo.year})` : ""}:{" "}
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
    </li>
  );
}
