"use client";

import { useMemo, useState } from "react";
import LiveMatches, { type LiveLeague } from "./LiveMatches";

const TZ = "America/Argentina/Buenos_Aires";
const DAY = 86400000;
// Fecha (yyyymmdd) de un día, en la hora de la Argentina.
const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d).replace(/-/g, "");
const fromYmd = (s: string) => new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), 15));
const weekday = (d: Date) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short" }).format(d).replace(".", "");
const dayMonth = (d: Date) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, day: "numeric", month: "short" }).format(d).replace(".", "");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const longDay = (d: Date) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);

export type CalendarFilter = { id: string; label: string; codes: string[] };

// Calendario: una tira de días (con flechas para moverse de a una semana y un selector de fecha) y los partidos del día
// elegido de todas las competencias, o de las de un grupo (Argentina, copas, Europa…). Los de hoy se actualizan solos.
export default function CalendarView({ leagues, filters }: { leagues: LiveLeague[]; filters: CalendarFilter[] }) {
  const today = ymd(new Date());
  const [selected, setSelected] = useState(today);
  const [offset, setOffset] = useState(0); // semanas corridas respecto de hoy
  const [filter, setFilter] = useState(filters[0].id);

  const strip = useMemo(() => {
    const base = fromYmd(today).getTime() + offset * 7 * DAY;
    return Array.from({ length: 9 }, (_, i) => new Date(base + (i - 4) * DAY));
  }, [today, offset]);

  const codes = filters.find((f) => f.id === filter)?.codes;
  const shown = useMemo(() => (codes?.length ? leagues.filter((l) => codes.includes(l.code)) : leagues), [leagues, codes]);
  const rel = (s: string) => {
    const diff = Math.round((fromYmd(s).getTime() - fromYmd(today).getTime()) / DAY);
    return diff === 0 ? "Hoy" : diff === -1 ? "Ayer" : diff === 1 ? "Mañana" : undefined;
  };

  return (
    <div>
      <div className="panel mb-3 flex items-stretch gap-1 p-1.5">
        <Arrow dir="prev" onClick={() => setOffset((o) => o - 1)} />
        <div className="grid flex-1 grid-cols-5 gap-1 sm:grid-cols-9">
          {strip.map((d, i) => {
            const k = ymd(d);
            const active = k === selected;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(k)}
                aria-pressed={active}
                className={`btn-press flex flex-col items-center rounded-xl px-1 py-1.5 transition ${i < 2 || i > 6 ? "hidden sm:flex" : ""} ${
                  active ? "bg-navy-950 text-white shadow" : k === today ? "bg-red-50 text-red-700 hover:bg-red-100" : "text-navy-700 hover:bg-navy-50"
                }`}
              >
                <span className="font-display text-xs font-bold uppercase tracking-wider">{rel(k) ?? weekday(d)}</span>
                <span className="text-xs capitalize opacity-80">{dayMonth(d)}</span>
              </button>
            );
          })}
        </div>
        <Arrow dir="next" onClick={() => setOffset((o) => o + 1)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`btn-press rounded-full px-3.5 py-1.5 font-display text-sm font-semibold uppercase tracking-wide ring-1 transition ${
              filter === f.id ? "bg-volt-500 text-white ring-volt-500" : "bg-white text-navy-700 ring-navy-200 hover:ring-volt-400"
            }`}
          >
            {f.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-navy-600">
          Ir a
          <input
            type="date"
            value={`${selected.slice(0, 4)}-${selected.slice(4, 6)}-${selected.slice(6, 8)}`}
            onChange={(e) => {
              if (!e.target.value) return;
              const s = e.target.value.replace(/-/g, "");
              setSelected(s);
              setOffset(Math.round((fromYmd(s).getTime() - fromYmd(today).getTime()) / DAY / 7));
            }}
            className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-navy-900"
          />
        </label>
      </div>

      <h2 className="section-title mb-3">
        {rel(selected) ? `${rel(selected)} · ` : ""}
        {cap(longDay(fromYmd(selected)))}
      </h2>
      <LiveMatches key={`${selected}-${filter}`} leagues={shown} date={selected} />
    </div>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Semana anterior" : "Semana siguiente"}
      className="btn-press flex w-9 shrink-0 items-center justify-center rounded-xl text-navy-700 transition hover:bg-navy-100"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
