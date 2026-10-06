"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LiveEvent } from "@/lib/live/espn";

const LEAGUES = "arg.1,arg.copa,conmebol.libertadores,conmebol.sudamericana";
const TZ = "America/Argentina/Buenos_Aires";
const hour = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

// Franja con los partidos de hoy del fútbol argentino y de las copas, bajo el encabezado. Se mueve sola si no entra
// y se actualiza cada minuto. Si no hay partidos, no aparece.
export default function LiveTicker() {
  // Cada partido con su liga, para llevar a su página.
  const [events, setEvents] = useState<(LiveEvent & { league: string })[]>([]);

  useEffect(() => {
    const load = () =>
      fetch(`/api/en-vivo?ligas=${LEAGUES}`)
        .then((r) => r.json())
        .then((j) => setEvents(j.results.flatMap((g: { league: string; events: LiveEvent[] }) => g.events.map((e) => ({ ...e, league: g.league })))))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  if (!events.length) return null;
  // En juego primero, después los que faltan y al final los terminados.
  const order = { in: 0, pre: 1, post: 2 } as const;
  const list = [...events].sort((a, b) => order[a.state] - order[b.state] || a.date.localeCompare(b.date));
  const chips = list.map((e) => (
    <Link
      key={e.id}
      href={`/partido/${e.league}/${e.id}`}
      className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition hover:-translate-y-px ${
        e.state === "in" ? "bg-red-600 text-white ring-red-600" : "bg-white/[0.07] text-navy-100 ring-white/10 hover:bg-white/[0.12] hover:ring-volt-400/60"
      }`}
    >
      <span className="font-display font-bold tabular-nums">
        {e.state === "in" ? (
          <>
            <span className="live-dot-bare mr-1 bg-white" />
            {/half|^HT$/i.test(e.detail) ? "ET" : e.clock}
          </>
        ) : e.state === "post" ? (
          "Final"
        ) : (
          hour(e.date)
        )}
      </span>
      <span className="font-semibold">{e.home.short || e.home.name}</span>
      <span className="font-display font-bold tabular-nums">{e.state === "pre" ? "–" : `${e.home.score}-${e.away.score}`}</span>
      <span className="font-semibold">{e.away.short || e.away.name}</span>
    </Link>
  ));

  return (
    <div className="mx-auto mt-2 w-full min-w-0 max-w-5xl px-3 sm:px-6">
      <div className="ticker group relative flex items-center gap-2 overflow-hidden rounded-full bg-navy-950/80 py-1.5 pl-1.5 pr-1.5 ring-1 ring-white/10 backdrop-blur-md">
        <Link href="/en-vivo" className="z-10 flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-white">
          <span className="live-dot-bare bg-white" /> En vivo
        </Link>
        <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex w-max gap-2">
            {chips}
            <span aria-hidden className="flex gap-2">
              {chips}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
