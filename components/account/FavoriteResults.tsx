"use client";
/* eslint-disable @next/next/no-img-element -- escudos y logos */

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Favorite } from "@/lib/account";
import type { LiveEvent } from "@/lib/live/espn";

type TeamData = { live: LiveEvent | null; next: LiveEvent | null; last: LiveEvent[] };

const TZ = "America/Argentina/Buenos_Aires";
const when = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

// Los favoritos de la cuenta con sus resultados: de cada equipo, el partido en juego o el próximo y el último
// resultado; cada liga lleva a su torneo.
export default function FavoriteResults({ favorites }: { favorites: Favorite[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {favorites.map((f) => (
        <li key={`${f.kind}-${f.ref}`}>{f.kind === "team" ? <TeamCard f={f} /> : <LeagueCard f={f} />}</li>
      ))}
    </ul>
  );
}

function LeagueCard({ f }: { f: Favorite }) {
  return (
    <Link href={`/torneos/${f.ref}`} className="panel flex items-center gap-3 px-4 py-4 transition hover:ring-1 hover:ring-volt-400/50">
      {f.logo && <img src={f.logo} alt="" className="logo-img h-10 w-10 object-contain" />}
      <span className="min-w-0 flex-1 font-display text-lg font-bold uppercase text-navy-950">{f.name}</span>
      <span className="text-sm text-volt-600">Fixture y tablas →</span>
    </Link>
  );
}

function TeamCard({ f }: { f: Favorite }) {
  const [comp, id] = f.ref.split("/");
  const [data, setData] = useState<TeamData | null>(null);
  useEffect(() => {
    fetch(`/api/mi-equipo?comp=${comp}&id=${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [comp, id]);
  const shown = data?.live ?? data?.next;
  const last = data?.last?.[0];
  return (
    <div className="panel overflow-hidden">
      <Link href={`/torneos/${comp}/equipo/${id}`} className="flex items-center gap-3 border-b border-navy-100 px-4 py-3">
        {f.logo && <img src={f.logo} alt="" className="logo-img h-10 w-10 object-contain" />}
        <span className="min-w-0 flex-1 font-display text-lg font-bold uppercase text-navy-950">{f.name}</span>
      </Link>
      <div className="space-y-1.5 px-4 py-3 text-sm">
        {!data && <p className="text-navy-500">Cargando…</p>}
        {shown && (
          <p>
            <span className={`mr-1 font-semibold ${data?.live ? "text-red-500" : "text-navy-500"}`}>{data?.live ? "En vivo:" : "Próximo:"}</span>
            {shown.home.name} {data?.live ? `${shown.home.score}-${shown.away.score}` : "vs"} {shown.away.name}
            {!data?.live && <span className="block text-xs text-navy-400 first-letter:uppercase">{when(shown.date)}</span>}
          </p>
        )}
        {last && (
          <p>
            <span className="mr-1 font-semibold text-navy-500">Último:</span>
            {last.home.name} {last.home.score}-{last.away.score} {last.away.name}
          </p>
        )}
      </div>
    </div>
  );
}
