"use client";

import { useState } from "react";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const pad = (n: number) => String(n).padStart(2, "0");

// Calendario de un mes para elegir una fecha con un toque: botones grandes, el mes con flechas y "Hoy" a mano.
// Las fechas van como yyyymmdd.
export default function MonthPicker({ value, today, onPick }: { value: string; today: string; onPick: (ymd: string) => void }) {
  const [month, setMonth] = useState({ y: +value.slice(0, 4), m: +value.slice(4, 6) - 1 });
  const first = new Date(Date.UTC(month.y, month.m, 1));
  const lead = (first.getUTCDay() + 6) % 7; // lunes primero
  const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const move = (d: number) => setMonth(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }));
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="panel w-full p-3 sm:w-[22rem]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" onClick={() => move(-1)} aria-label="Mes anterior" className="btn-press flex h-11 w-11 items-center justify-center rounded-full text-navy-700 hover:bg-navy-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="font-display text-xl font-bold uppercase tracking-wide text-navy-950">
          {MONTHS[month.m]} {month.y}
        </span>
        <button type="button" onClick={() => move(1)} aria-label="Mes siguiente" className="btn-press flex h-11 w-11 items-center justify-center rounded-full text-navy-700 hover:bg-navy-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <span key={d} className="py-1 font-display text-xs font-bold uppercase text-navy-400">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const k = `${month.y}${pad(month.m + 1)}${pad(d)}`;
          const active = k === value;
          return (
            <button
              key={k}
              type="button"
              onClick={() => onPick(k)}
              aria-pressed={active}
              aria-label={`${d} de ${MONTHS[month.m]} de ${month.y}`}
              className={`btn-press flex h-11 items-center justify-center rounded-xl text-base font-semibold tabular-nums transition ${
                active ? "bg-volt-600 text-white shadow" : k === today ? "bg-red-600/15 text-red-400 ring-1 ring-red-500/50" : "text-navy-800 hover:bg-navy-100"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => {
          setMonth({ y: +today.slice(0, 4), m: +today.slice(4, 6) - 1 });
          onPick(today);
        }}
        className="btn-press mt-3 w-full rounded-full bg-red-600 py-2.5 font-display text-base font-bold uppercase tracking-wide text-white"
      >
        Ir a hoy
      </button>
    </div>
  );
}
