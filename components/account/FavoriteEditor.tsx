"use client";
/* eslint-disable @next/next/no-img-element -- escudos, logos y fotos */

import { useEffect, useState } from "react";
import { type Favorite, toggleFavorite } from "@/lib/account";

type Result = { kind: string; title: string; subtitle?: string; href: string; logo?: string };

// Un resultado del buscador como favorito: equipos (con su torneo), torneos y jugadores.
function toFavorite(r: Result): Favorite | null {
  const team = r.href.match(/^\/torneos\/([^/]+)\/equipo\/(\d+)/);
  if (team) return { kind: "team", ref: `${team[1]}/${team[2]}`, name: r.title, logo: r.logo };
  const league = r.href.match(/^\/torneos\/([^/#?]+)$/);
  if (league) return { kind: "league", ref: league[1], name: r.title, logo: r.logo };
  const player = r.href.match(/^\/jugador\/(\d+)/);
  if (player) return { kind: "player", ref: player[1], name: r.title, logo: r.logo };
  return null;
}

const KIND_LABEL: Record<Favorite["kind"], string> = { team: "Equipo", league: "Liga", player: "Jugador" };

// "Personalizá tu página": buscar y sumar equipos, ligas y jugadores a seguir, y quitar los que ya no.
export default function FavoriteEditor({ favorites }: { favorites: Favorite[] }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<(Result & { fav: Favorite })[]>([]);

  useEffect(() => {
    const text = q.trim();
    if (text.length < 2) return setResults([]);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/buscar?q=${encodeURIComponent(text)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((j) =>
          setResults(
            (j.results ?? [])
              .map((r: Result) => ({ ...r, fav: toFavorite(r) }))
              .filter((r: { fav: Favorite | null }) => r.fav)
              .slice(0, 8),
          ),
        )
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const isOn = (f: Favorite) => favorites.some((x) => x.kind === f.kind && x.ref === f.ref);

  return (
    <section className="panel space-y-4 p-5">
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-950">Personalizá tu página</h2>
        <p className="text-sm text-navy-500">Elegí qué equipos, ligas y jugadores querés seguir. Aparecen arriba, en Mis favoritos.</p>
      </div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscá un equipo, una liga o un jugador"
        className="h-12 w-full rounded-xl bg-white px-4 text-base text-navy-900 outline-none ring-1 ring-navy-200 focus:ring-2 focus:ring-volt-500"
      />
      {results.length > 0 && (
        <ul className="divide-y divide-navy-100 overflow-hidden rounded-xl ring-1 ring-navy-100">
          {results.map((r) => {
            const on = isOn(r.fav);
            return (
              <li key={r.href} className="flex items-center gap-3 bg-white px-3 py-2.5">
                {r.logo ? <img src={r.logo} alt="" className={`h-9 w-9 object-contain ${r.fav.kind === "player" ? "rounded-full object-cover object-top" : "logo-sm"}`} /> : <span className="h-9 w-9 rounded-full bg-navy-200" />}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-navy-950">{r.title}</span>
                  <span className="block text-xs text-navy-500">{KIND_LABEL[r.fav.kind]}</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(r.fav, !on)}
                  className={`shrink-0 rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide ${on ? "bg-volt-500 text-white" : "ring-1 ring-volt-500 text-volt-600"}`}
                >
                  {on ? "★ Siguiendo" : "☆ Seguir"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {favorites.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-navy-700">Lo que seguís (tocá la cruz para dejar de seguir)</h3>
          <ul className="flex flex-wrap gap-2">
            {favorites.map((f) => (
              <li key={`${f.kind}-${f.ref}`} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1.5 pr-1 ring-1 ring-navy-100">
                {f.logo ? <img src={f.logo} alt="" className={`h-6 w-6 object-contain ${f.kind === "player" ? "rounded-full object-cover object-top" : "logo-sm"}`} /> : null}
                <span className="text-sm font-semibold text-navy-900">{f.name}</span>
                <button type="button" onClick={() => toggleFavorite(f, false)} aria-label={`Dejar de seguir a ${f.name}`} className="flex h-7 w-7 items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 hover:text-red-500">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
