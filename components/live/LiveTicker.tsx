"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LiveEvent } from "@/lib/live/espn";

const LEAGUES = "arg.1,arg.copa,conmebol.libertadores,conmebol.sudamericana";
const TZ = "America/Argentina/Buenos_Aires";
const hour = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d).replace(/-/g, "");
const weekday = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short" }).format(new Date(iso)).replace(".", "");

type Ev = LiveEvent & { league: string };

const load = (date?: string): Promise<Ev[]> =>
  fetch(`/api/en-vivo?ligas=${LEAGUES}${date ? `&fecha=${date}` : ""}`)
    .then((r) => r.json())
    .then((j) => j.results.flatMap((g: { league: string; events: LiveEvent[] }) => g.events.map((e) => ({ ...e, league: g.league }))));

// Dos franjas bajo el encabezado, para el fútbol argentino y las copas: "En vivo", solo con los partidos que se están
// jugando, y "Próximos", con los que faltan hoy (o los de mañana, si hoy ya no queda ninguno). Se mueven solas y se
// actualizan cada minuto. Una franja sin partidos no aparece.
export default function LiveTicker() {
  const [live, setLive] = useState<Ev[]>([]);
  const [next, setNext] = useState<Ev[]>([]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const today = await load();
        setLive(today.filter((e) => e.state === "in"));
        let pre = today.filter((e) => e.state === "pre");
        if (!pre.length) pre = (await load(dayKey(new Date(Date.now() + 86400000)))).filter((e) => e.state === "pre");
        setNext(pre.sort((a, b) => a.date.localeCompare(b.date)));
      } catch {}
    };
    refresh();
    const t = setInterval(refresh, 60000);
    return () => clearInterval(t);
  }, []);

  if (!live.length && !next.length) return null;
  const todayKey = dayKey(new Date());
  return (
    <div className="mx-auto mt-2 w-full min-w-0 max-w-5xl space-y-1.5 px-3 sm:px-6">
      {live.length > 0 && (
        <Strip label={<><span className="live-dot-bare bg-white" /> En vivo</>} href="/en-vivo" tone="live">
          {live.map((e) => (
            <Chip key={e.id} e={e} live>
              <span className="live-dot-bare mr-1 bg-white" />
              {/half|^HT$/i.test(e.detail) ? "ET" : e.clock}
            </Chip>
          ))}
        </Strip>
      )}
      {next.length > 0 && (
        <Strip label="Próximos" href="/calendario" tone="next">
          {next.map((e) => (
            <Chip key={e.id} e={e}>
              {dayKey(new Date(e.date)) !== todayKey && <span className="mr-1 font-sans text-[0.65rem] font-semibold uppercase text-volt-300">{weekday(e.date)}</span>}
              {hour(e.date)}
            </Chip>
          ))}
        </Strip>
      )}
    </div>
  );
}

function Strip({ label, href, tone, children }: { label: React.ReactNode; href: string; tone: "live" | "next"; children: React.ReactNode[] }) {
  return (
    <div className="ticker group relative flex items-center gap-2 overflow-hidden rounded-full bg-navy-950/80 py-1.5 pl-1.5 pr-1.5 ring-1 ring-white/10 backdrop-blur-md">
      <Link
        href={href}
        className={`z-10 flex w-[5.5rem] shrink-0 items-center justify-center gap-1.5 rounded-full px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-white ${
          tone === "live" ? "bg-red-600" : "bg-volt-600"
        }`}
      >
        {label}
      </Link>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex w-max gap-2">
          {children}
          <span aria-hidden className="flex gap-2">
            {children}
          </span>
        </div>
      </div>
    </div>
  );
}

function Chip({ e, live, children }: { e: Ev; live?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={`/partido/${e.league}/${e.id}`}
      className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition hover:-translate-y-px ${
        live ? "bg-red-600/90 text-white ring-red-500" : "bg-white/[0.07] text-navy-100 ring-white/10 hover:bg-white/[0.12] hover:ring-volt-400/60"
      }`}
    >
      <span className="font-display font-bold tabular-nums">{children}</span>
      <span className="font-semibold">{e.home.short || e.home.name}</span>
      <span className="font-display font-bold tabular-nums">{live ? `${e.home.score}-${e.away.score}` : "vs"}</span>
      <span className="font-semibold">{e.away.short || e.away.name}</span>
    </Link>
  );
}
