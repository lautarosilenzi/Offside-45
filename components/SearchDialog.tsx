"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SearchItem } from "@/lib/search";

const KIND_STYLE: Record<SearchItem["kind"], string> = {
  Sección: "bg-volt-500/15 text-volt-700",
  Competencia: "bg-gold-400/25 text-navy-800",
  Club: "bg-brand-100 text-brand-700",
  Equipo: "bg-navy-100 text-navy-700",
  Jugador: "bg-emerald-100 text-emerald-700",
  Temporada: "bg-navy-50 text-navy-500",
};

// Buscador del encabezado: se abre con el botón de la lupa, con Ctrl+K o con "/". Busca mientras se escribe y se navega
// con las flechas y Enter.
export default function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 30);
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Busca 200 ms después de la última tecla.
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const j = await r.json();
        setResults(j.results ?? []);
        setActive(0);
      } catch {
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const go = (it?: SearchItem) => {
    if (!it) return;
    setOpen(false);
    setQ("");
    router.push(it.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar (Ctrl+K)"
        title="Buscar (Ctrl+K)"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/15"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>

      {/* Portal: el encabezado tiene desenfoque de fondo, que encerraría a un elemento fijo dentro de él. */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy-950/60 px-3 pt-[10vh]" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Buscador">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-navy-100 px-4 py-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-navy-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(results.length - 1, a + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(0, a - 1));
                  } else if (e.key === "Enter") go(results[active]);
                }}
                placeholder="Equipos, torneos, jugadores, temporadas…"
                aria-label="Buscar"
                className="min-w-0 flex-1 bg-transparent text-base text-navy-950 outline-none placeholder:text-navy-400"
              />
              <kbd className="hidden rounded border border-navy-200 px-1.5 text-xs text-navy-400 sm:inline">Esc</kbd>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto py-1" role="listbox">
              {q.trim() && loading && results.length === 0 && <li className="px-4 py-6 text-center text-sm text-navy-500">Buscando…</li>}
              {q.trim() && !loading && results.length === 0 && <li className="px-4 py-6 text-center text-sm text-navy-500">Sin resultados para «{q}».</li>}
              {!q.trim() && <li className="px-4 py-6 text-center text-sm text-navy-500">Probá con «Boca», «Premier», «Messi» o «1986».</li>}
              {results.map((it, i) => (
                <li key={`${it.kind}-${it.href}-${i}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(it)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left transition ${i === active ? "bg-brand-50" : ""}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy-50">
                      {it.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- escudo o foto de la fuente
                        <img src={it.logo} alt="" className="logo-img h-full w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-navy-300" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-navy-950">{it.title}</span>
                      {it.subtitle && <span className="block truncate text-xs text-navy-500">{it.subtitle}</span>}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${KIND_STYLE[it.kind]}`}>{it.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
