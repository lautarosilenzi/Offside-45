"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Option = { id: string; name: string; rank: number };

// Elegir los dos jugadores: cambia la dirección (?a=&b=) y la comparación se arma en el servidor.
export default function LegendPicker({ a, b, options }: { a: string; b: string; options: Option[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const go = (na: string, nb: string) => start(() => router.push(`/jugadores?a=${na}&b=${nb}`, { scroll: false }));
  const pick = (side: "a" | "b", id: string) => {
    if (side === "a") go(id, id === b ? a : b);
    else go(id === a ? b : a, id);
  };

  return (
    <div className={`panel flex flex-col items-stretch gap-3 p-4 transition sm:flex-row sm:items-center ${pending ? "opacity-70" : ""}`}>
      <Select label="Jugador 1" value={a} options={options} onChange={(id) => pick("a", id)} color="#3b8fd9" />
      <button
        type="button"
        onClick={() => go(b, a)}
        aria-label="Intercambiar jugadores"
        className="btn-press mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-950 text-white shadow transition hover:bg-volt-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rotate-90 sm:rotate-0" aria-hidden>
          <path d="M13.2 3.3a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-3 3a1 1 0 1 1-1.4-1.4L14.5 8H6a1 1 0 0 1 0-2h8.5l-1.3-1.3a1 1 0 0 1 0-1.4zm-6.4 6a1 1 0 0 1 0 1.4L5.5 12H14a1 1 0 1 1 0 2H5.5l1.3 1.3a1 1 0 1 1-1.4 1.4l-3-3a1 1 0 0 1 0-1.4l3-3a1 1 0 0 1 1.4 0z" />
        </svg>
      </button>
      <Select label="Jugador 2" value={b} options={options} onChange={(id) => pick("b", id)} color="#d7263d" />
    </div>
  );
}

function Select({ label, value, options, onChange, color }: { label: string; value: string; options: Option[]; onChange: (id: string) => void; color: string }) {
  return (
    <label className="flex flex-1 items-center gap-3 rounded-2xl border border-navy-100 bg-white px-3 py-2 focus-within:border-volt-400">
      <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-navy-400">{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full cursor-pointer bg-transparent font-display text-lg font-bold uppercase tracking-wide text-navy-950 outline-none">
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.rank}. {o.name}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
