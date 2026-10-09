"use client";
/* eslint-disable @next/next/no-img-element -- escudos, logos y fotos de ESPN y del sitio */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Result = { kind: string; title: string; subtitle?: string; href: string; logo?: string };

// Grupos, en el orden en que se muestran (con nombres que entiende cualquiera).
const GROUPS: { title: string; kinds: string[] }[] = [
  { title: "Equipos", kinds: ["Club", "Equipo"] },
  { title: "Jugadores", kinds: ["Jugador"] },
  { title: "Torneos", kinds: ["Competencia"] },
  { title: "Secciones", kinds: ["Sección"] },
  { title: "Temporadas", kinds: ["Temporada"] },
];

// Buscador grande de la portada: equipos, jugadores (en actividad y leyendas), torneos y secciones. Los resultados
// aparecen debajo, grandes y agrupados; Enter abre el primero y las flechas recorren la lista.
export default function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const text = q.trim();
    if (text.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/buscar?q=${encodeURIComponent(text)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((j) => {
          setResults(j.results ?? []);
          setActive(0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  // La lista en el orden en que se ve (para las flechas y Enter).
  const groups = useMemo(
    () => GROUPS.map((g) => ({ ...g, items: (results ?? []).filter((r) => g.kinds.includes(r.kind)).slice(0, g.title === "Temporadas" ? 3 : 6) })).filter((g) => g.items.length),
    [results],
  );
  const flat = groups.flatMap((g) => g.items);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(flat.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    else if (e.key === "Enter" && flat[active]) router.push(flat[active].href);
    else if (e.key === "Escape") setQ("");
  };

  let index = -1;
  return (
    <section aria-label="Buscador" className="search-hero relative">
      <label htmlFor="home-search" className="mb-2 block font-display text-2xl font-black uppercase italic tracking-wide text-navy-950 sm:text-3xl">
        ¿Qué querés ver?
      </label>
      <div className="relative">
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2 text-volt-400" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          ref={input}
          id="home-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Equipo, jugador o liga"
          autoComplete="off"
          enterKeyHint="search"
          aria-controls="home-search-results"
          className="search-input h-16 w-full rounded-2xl border-2 border-navy-200 bg-white pl-[3.75rem] pr-12 text-lg text-navy-950 placeholder:text-navy-400 focus:border-volt-500 focus:outline-none sm:h-[4.5rem] sm:text-xl"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              input.current?.focus();
            }}
            aria-label="Borrar la búsqueda"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-navy-400 hover:bg-navy-50 hover:text-navy-800"
          >
            ✕
          </button>
        )}
      </div>

      <div id="home-search-results" aria-live="polite">
        {results && (
          <div className="panel mt-3 overflow-hidden">
            {loading && !flat.length ? (
              <p className="px-5 py-6 text-center text-navy-500">Buscando…</p>
            ) : flat.length === 0 ? (
              <p className="px-5 py-6 text-center text-navy-500">No encontramos nada con «{q.trim()}». Probá con otro nombre.</p>
            ) : (
              groups.map((g) => (
                <div key={g.title}>
                  <h3 className="bg-navy-950 px-5 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">{g.title}</h3>
                  <ul className="divide-y divide-navy-50">
                    {g.items.map((r) => {
                      index++;
                      const i = index;
                      return (
                        <li key={r.href + r.title}>
                          <Link
                            href={r.href}
                            onMouseEnter={() => setActive(i)}
                            className={`flex items-center gap-4 px-5 py-3.5 transition ${active === i ? "bg-volt-500/10" : "hover:bg-volt-500/5"}`}
                          >
                            <span className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ${r.kind === "Jugador" ? "bg-navy-100" : ""}`}>
                              {r.logo ? (
                                <img src={r.logo} alt="" loading="lazy" referrerPolicy="no-referrer" className={r.kind === "Jugador" ? "h-full w-full object-cover object-top" : "logo-img h-9 w-9 object-contain"} />
                              ) : (
                                <span className="font-display text-lg font-bold text-navy-400">{r.title.charAt(0)}</span>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block break-words leading-snug text-base font-semibold text-navy-950 sm:text-lg">{r.title}</span>
                              {r.subtitle && <span className="block break-words leading-snug text-sm text-navy-500">{r.subtitle}</span>}
                            </span>
                            <span aria-hidden className="text-2xl text-navy-300">
                              ›
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
