"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "@/lib/account";
import { useFollowed } from "@/lib/prefs";
import SearchDialog from "./SearchDialog";

// Botones del encabezado: buscar, calendario, En vivo (con la cantidad de partidos que se están jugando, que se
// actualiza cada minuto), notificaciones (con la cantidad de partidos que sigue el visitante), Historiales y Tu cuenta.
// El interruptor de cuotas está en el menú lateral y en la portada.
export default function HeaderButtons() {
  const pathname = usePathname();
  const [live, setLive] = useState<number | null>(null);
  const following = Object.keys(useFollowed()).length;
  const { account } = useAccount();

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

  const icon = (active: boolean) =>
    `relative flex h-[2.15rem] w-[2.15rem] shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-10 sm:w-10 ${active ? "bg-volt-500" : "bg-white/5"}`;

  return (
    <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
      <SearchDialog />
      <Link href="/calendario" aria-label="Calendario" title="Calendario" aria-current={pathname === "/calendario" ? "page" : undefined} className={icon(pathname === "/calendario")}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      </Link>
      {/* En vivo: en los celulares chicos, el punto y la cantidad de partidos en juego (o "Vivo"). */}
      <Link
        href="/live"
        aria-label={live ? `En vivo: ${live} partidos en juego` : "En vivo: partidos en juego"}
        title="Partidos en juego"
        aria-current={pathname === "/live" ? "page" : undefined}
        className={`flex h-[2.15rem] shrink-0 items-center gap-1 rounded-full px-2 font-display text-sm font-bold uppercase tracking-wide text-white transition sm:h-10 sm:gap-1.5 sm:px-3 ${
          live ? "bg-red-600 hover:bg-red-500" : "bg-white/5 hover:bg-white/15"
        }`}
      >
        <span className={`live-dot-bare ${live ? "bg-white" : "bg-red-500"}`} />
        <span className={live ? "hidden min-[400px]:inline" : ""}>
          <span className="hidden min-[400px]:inline">En </span>vivo
        </span>
        {live ? <span className="rounded-full bg-white px-1.5 text-xs tabular-nums text-red-600">{live}</span> : null}
      </Link>
      <Link
        href="/alertas"
        aria-label={following ? `Notificaciones: seguís ${following} partidos` : "Notificaciones"}
        title="Notificaciones"
        aria-current={pathname === "/alertas" ? "page" : undefined}
        className={icon(pathname === "/alertas")}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={following ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0" />
        </svg>
        {following > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[0.6rem] font-bold text-navy-950">{following}</span>
        )}
      </Link>
      {/* Historiales: "VS" (un equipo contra otro); en la compu, también la palabra. */}
      <Link
        href="/historiales"
        aria-label="Historiales"
        title="Historial entre equipos"
        aria-current={pathname.startsWith("/historiales") ? "page" : undefined}
        className={`${icon(pathname.startsWith("/historiales"))} lg:w-auto lg:gap-1.5 lg:px-3`}
      >
        <span aria-hidden className="font-display text-[0.95rem] font-black italic leading-none tracking-tight">VS</span>
        <span className="hidden font-display text-sm font-bold uppercase tracking-wide lg:inline">Historiales</span>
      </Link>
      {/* Con la sesión abierta, el usuario (y el escudo de su club) en lugar del ícono: así se ve que ya entró. */}
      {account ? (
        <Link
          href="/cuenta"
          aria-label={`Tu cuenta: @${account.username}`}
          title={`@${account.username}`}
          aria-current={pathname === "/cuenta" ? "page" : undefined}
          className={`flex h-[2.15rem] max-w-[6.5rem] shrink-0 items-center gap-1 rounded-full pl-2 pr-2 min-[400px]:pl-1 text-white transition hover:bg-white/15 sm:h-10 sm:max-w-[10rem] sm:gap-1.5 sm:pr-3 ${pathname === "/cuenta" ? "bg-volt-500" : "bg-white/10 ring-1 ring-volt-400/50"}`}
        >
          {account.club.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- escudo del club del censo
            <img src={account.club.logo} alt="" className="logo-img hidden h-6 w-6 shrink-0 object-contain min-[400px]:block sm:h-7 sm:w-7" />
          ) : (
            <span className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-volt-500 font-display text-xs font-bold uppercase min-[400px]:flex">{account.username.charAt(0)}</span>
          )}
          <span className="min-w-0 break-all font-display text-[0.8rem] font-bold leading-none sm:text-sm">{account.username}</span>
        </Link>
      ) : (
        <Link href="/cuenta" aria-label="Tu cuenta" title="Tu cuenta" aria-current={pathname === "/cuenta" ? "page" : undefined} className={icon(pathname === "/cuenta")}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
