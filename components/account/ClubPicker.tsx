"use client";
/* eslint-disable @next/next/no-img-element -- escudos de ESPN y del sitio */

import { useEffect, useState } from "react";
import type { FanClub } from "@/lib/account";

type Result = { kind: string; title: string; subtitle?: string; href: string; logo?: string };

// Número del club a partir del link del buscador: los clubes con datos en vivo, por su número de ESPN; los históricos
// del sitio, por su nombre en el sitio.
function clubId(href: string) {
  const espn = href.match(/\/equipo\/(\d+)/)?.[1];
  if (espn) return `espn:${espn}`;
  const site = href.match(/[?&]a=([a-z0-9-]+)/)?.[1];
  return site ? `site:${site}` : href;
}

// Censo del Hincha: el visitante busca y elige su club, de cualquier país. Solo uno, el de verdad.
export default function ClubPicker({ value, onChange, error }: { value?: FanClub; onChange: (c: FanClub) => void; error?: string }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const text = q.trim();
    if (text.length < 2) return setResults([]);
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/buscar?q=${encodeURIComponent(text)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((j) => setResults((j.results ?? []).filter((r: Result) => r.kind === "Club" || r.kind === "Equipo").slice(0, 8)))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  return (
    <fieldset className="rounded-2xl p-4 ring-1 ring-gold-400/40">
      <legend className="px-1 font-display text-xl font-black uppercase italic tracking-wide text-gold-500">Censo del Hincha</legend>
      <p className="mb-3 text-sm text-navy-600">¿De qué club sos hincha? Elegí uno solo, el tuyo de verdad. Sirve cualquier club del mundo.</p>
      {value ? (
        <div className="flex items-center gap-3 rounded-xl bg-gold-400/10 px-3 py-2.5 ring-1 ring-gold-400/40">
          {value.logo ? <img src={value.logo} alt="" className="logo-img h-10 w-10 object-contain" /> : <span className="h-10 w-10 rounded-full bg-navy-200" />}
          <span className="min-w-0 flex-1 font-display text-lg font-bold uppercase text-navy-950">{value.name}</span>
          <button type="button" onClick={() => onChange(undefined as unknown as FanClub)} className="text-sm text-navy-500 hover:underline">
            Cambiar
          </button>
        </div>
      ) : (
        <>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Escribí el nombre de tu club"
            className="h-12 w-full rounded-xl bg-white px-4 text-base text-navy-900 outline-none ring-1 ring-navy-200 focus:ring-2 focus:ring-volt-500"
          />
          {loading && <p className="mt-2 text-sm text-navy-500">Buscando…</p>}
          {results.length > 0 && (
            <ul className="mt-2 divide-y divide-navy-100 overflow-hidden rounded-xl ring-1 ring-navy-100">
              {results.map((r) => (
                <li key={r.href}>
                  <button
                    type="button"
                    onClick={() => onChange({ id: clubId(r.href), name: r.title, logo: r.logo })}
                    className="flex w-full items-center gap-3 bg-white px-3 py-2.5 text-left transition hover:bg-volt-500/5"
                  >
                    {r.logo ? <img src={r.logo} alt="" className="logo-img h-8 w-8 object-contain" /> : <span className="h-8 w-8 rounded-full bg-navy-200" />}
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-navy-950">{r.title}</span>
                      {r.subtitle && <span className="block text-xs text-navy-500">{r.subtitle}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </fieldset>
  );
}
