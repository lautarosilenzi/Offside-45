"use client";

import { useState } from "react";
import type { LiveEvent } from "@/lib/live/espn";
import { ALERT_TYPES, DEFAULT_ALERTS, follow, setAlertTypes, unfollow, useFollowed, type AlertType } from "@/lib/prefs";

// Campanita de un partido: lo sigue (con las alertas por defecto) y abre las opciones para elegir qué avisar.
export default function FollowButton({ league, match }: { league: string; match: LiveEvent }) {
  const followed = useFollowed();
  const current = followed[match.id];
  const [open, setOpen] = useState(false);
  const finished = match.state === "post";

  const toggleFollow = async () => {
    if (current) {
      unfollow(match.id);
      setOpen(false);
      return;
    }
    follow({ id: match.id, league, home: match.home.name, away: match.away.name, date: match.date }, DEFAULT_ALERTS);
    setOpen(true);
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {}
    }
  };

  const toggleType = (t: AlertType) => {
    if (!current) return;
    setAlertTypes(match.id, current.types.includes(t) ? current.types.filter((x) => x !== t) : [...current.types, t]);
  };

  if (finished && !current) return null;

  return (
    <span className="relative inline-flex items-center gap-1">
      <button
        type="button"
        onClick={toggleFollow}
        aria-pressed={!!current}
        title={current ? "Dejar de seguir" : "Seguir el partido con alertas"}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wide ring-1 transition ${
          current ? "bg-gold-400 text-navy-950 ring-gold-400" : "bg-white text-navy-700 ring-navy-200 hover:ring-gold-400"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={current ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0" />
        </svg>
        {current ? "Siguiendo" : "Alertas"}
      </button>
      {current && (
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Elegir alertas" className="rounded-full px-1.5 py-1 text-navy-500 hover:bg-white">
          ⚙
        </button>
      )}
      {open && current && (
        <div className="absolute right-0 top-full z-20 mt-1 w-60 rounded-2xl bg-white p-3 text-left shadow-xl ring-1 ring-navy-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy-500">Avisarme de…</p>
          <ul className="space-y-1">
            {ALERT_TYPES.map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-800">
                  <input type="checkbox" checked={current.types.includes(t.id)} onChange={() => toggleType(t.id)} className="h-4 w-4 accent-volt-500" />
                  {t.label}
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.7rem] leading-snug text-navy-400">
            Las alertas llegan mientras tengas Offside 45 abierto en alguna pestaña. Las editás cuando quieras en Alertas, arriba.
          </p>
        </div>
      )}
    </span>
  );
}
