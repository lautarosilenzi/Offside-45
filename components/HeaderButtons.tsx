"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFollowed } from "@/lib/prefs";
import OddsToggle from "./OddsToggle";
import SearchDialog from "./SearchDialog";
import ThemeToggle from "./ThemeToggle";

// Botones del encabezado: buscar, calendario, Live (con la cantidad de partidos que se están jugando, que se actualiza
// cada minuto), alertas (con la cantidad de partidos que sigue el visitante) y cuotas (en las pantallas chicas, el
// interruptor de cuotas está en el menú lateral).
export default function HeaderButtons() {
  const pathname = usePathname();
  const [live, setLive] = useState<number | null>(null);
  const following = Object.keys(useFollowed()).length;

  useEffect(() => {
    const load = () =>
      fetch("/api/en-vivo/ahora")
        .then((r) => r.json())
        .then((j) => setLive(j.live ?? 0))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <SearchDialog />
      <Link
        href="/calendario"
        aria-label="Calendario"
        title="Calendario"
        aria-current={pathname === "/calendario" ? "page" : undefined}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15 ${pathname === "/calendario" ? "bg-volt-500" : "bg-white/5"}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      </Link>
      <Link
        href="/live"
        aria-label={live ? `Live: ${live} partidos en juego` : "Live: partidos en juego"}
        title="Partidos en juego"
        aria-current={pathname === "/live" ? "page" : undefined}
        className={`flex h-10 items-center gap-1.5 rounded-full px-3 font-display text-sm font-bold uppercase tracking-wide text-white transition ${
          live ? "bg-red-600 hover:bg-red-500" : "bg-white/5 hover:bg-white/15"
        }`}
      >
        <span className={`live-dot-bare ${live ? "bg-white" : "bg-red-500"}`} />
        Live
        {live ? <span className="rounded-full bg-white px-1.5 text-xs tabular-nums text-red-600">{live}</span> : null}
      </Link>
      <Link
        href="/alertas"
        aria-label={following ? `Alertas: seguís ${following} partidos` : "Alertas"}
        title="Alertas"
        aria-current={pathname === "/alertas" ? "page" : undefined}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15 ${pathname === "/alertas" ? "bg-volt-500" : "bg-white/5"}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={following ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0" />
        </svg>
        {following > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[0.6rem] font-bold text-navy-950">{following}</span>
        )}
      </Link>
      <span className="hidden sm:inline-flex">
        <ThemeToggle />
      </span>
      <span className="hidden lg:inline-flex">
        <OddsToggle />
      </span>
    </div>
  );
}
