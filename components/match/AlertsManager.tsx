"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ALERT_TYPES, setAlertTypes, unfollow, useFollowed } from "@/lib/prefs";

const TZ = "America/Argentina/Buenos_Aires";
const when = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

// Los partidos que sigue el visitante, con las alertas de cada uno para activar o desactivar.
export default function AlertsManager() {
  const followed = useFollowed();
  const list = Object.values(followed).sort((a, b) => a.date.localeCompare(b.date));
  const [perm, setPerm] = useState<string>("unsupported");
  useEffect(() => setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission), []);

  return (
    <div className="space-y-4">
      {perm !== "granted" && (
        <div className="panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
          <span className="text-2xl">🔔</span>
          <p className="min-w-0 flex-1 text-navy-700">
            {perm === "denied"
              ? "Las notificaciones están bloqueadas en este navegador: las alertas se ven solo como carteles dentro de la página. Podés habilitarlas desde la configuración del sitio en el navegador."
              : perm === "unsupported"
                ? "Este navegador no permite notificaciones: las alertas se ven como carteles dentro de la página."
                : "Activá las notificaciones para que las alertas te lleguen aunque estés en otra pestaña."}
          </p>
          {perm === "default" && (
            <button type="button" onClick={async () => setPerm(await Notification.requestPermission())} className="btn-primary">
              Activar notificaciones
            </button>
          )}
        </div>
      )}

      {list.length === 0 ? (
        <div className="panel px-6 py-10 text-center">
          <p className="font-display text-xl font-bold uppercase tracking-wide text-navy-900">Todavía no seguís ningún partido</p>
          <p className="mt-1 text-sm text-navy-500">
            Tocá un partido en el calendario, en Live o en el fixture de cualquier torneo y apretá la campanita «Alertas».
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/calendario" className="btn-primary">
              Ir al calendario
            </Link>
            <Link href="/live" className="btn-ghost">
              Partidos en juego
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((m) => (
            <li key={m.id} className="panel p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg font-bold uppercase tracking-wide text-navy-950">
                  {m.home} <span className="text-navy-400">vs</span> {m.away}
                </span>
                <span className="text-xs capitalize text-navy-500">{when(m.date)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ALERT_TYPES.map((t) => {
                  const on = m.types.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAlertTypes(m.id, on ? m.types.filter((x) => x !== t.id) : [...m.types, t.id])}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${on ? "bg-volt-500 text-white ring-volt-500" : "bg-white text-navy-600 ring-navy-200 hover:ring-volt-400"}`}
                    >
                      {on ? "✓ " : ""}
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => unfollow(m.id)} className="mt-3 text-xs font-semibold text-red-600 hover:underline">
                Dejar de seguir
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-navy-400">
        Las alertas se revisan cada 30 segundos mientras tengas Offside 45 abierto en alguna pestaña, y se guardan solo en este navegador. Los partidos se
        dejan de seguir solos cuando terminan.
      </p>
    </div>
  );
}
