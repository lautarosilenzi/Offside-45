"use client";
/* eslint-disable @next/next/no-img-element -- escudos de ESPN, sin optimizar */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LiveEvent, LiveTeam } from "@/lib/live/espn";
import { setMyTeam, useMyTeam, type MyTeam } from "@/lib/prefs";

type Data = {
  comp: { id: string; name: string };
  live: LiveEvent | null;
  next: LiveEvent | null;
  last: LiveEvent[];
  standing: { pos: number; points: number; played: number; table: string; size: number } | null;
};

const TZ = "America/Argentina/Buenos_Aires";
const when = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

// "Mi equipo": el club que eligió el visitante (guardado en su navegador), con el partido en juego o el próximo, la
// posición en la tabla y los últimos cinco resultados. Sin equipo elegido, un buscador para elegirlo.
export default function MyTeamCard() {
  const team = useMyTeam();
  const [mounted, setMounted] = useState(false);
  const [changing, setChanging] = useState(false);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!team) return;
    setData(null);
    let alive = true;
    const load = () =>
      fetch(`/api/mi-equipo?comp=${encodeURIComponent(team.comp)}&id=${encodeURIComponent(team.id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => alive && j && setData(j))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo cambia cuando cambia el equipo
  }, [team?.comp, team?.id]);

  // Hasta leer la preferencia, un lugar vacío del mismo alto (así la página no salta).
  if (!mounted) return <div className="h-[5.5rem]" aria-hidden />;

  if (!team || changing)
    return (
      // relative z-20: la lista de resultados queda por encima de los recuadros de abajo.
      <section className="panel relative z-20 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:w-72 sm:shrink-0">
            <Star filled={false} />
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-navy-950">{changing ? "Cambiar mi equipo" : "Elegí tu equipo"}</h2>
              <p className="text-sm text-navy-500">Su próximo partido, la tabla y los últimos resultados, siempre acá.</p>
            </div>
          </div>
          <TeamSearch
            onPick={(t) => {
              setMyTeam(t);
              setChanging(false);
            }}
          />
          {changing && (
            <button type="button" onClick={() => setChanging(false)} className="text-sm font-semibold text-navy-500 hover:text-navy-800">
              Cancelar
            </button>
          )}
        </div>
      </section>
    );

  const href = `/torneos/${team.comp}/equipo/${team.id}`;
  const match = data?.live ?? data?.next;
  return (
    <section className="panel overflow-hidden">
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[1.1fr_1.3fr_1fr] md:items-center [&>*]:min-w-0">
        {/* Equipo y posición */}
        <Link href={href} className="flex min-w-0 items-center gap-3">
          {team.logo ? <img src={team.logo} alt="" className="logo-img h-14 w-14 shrink-0 object-contain" /> : <Star filled />}
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-volt-600">
              <Star filled small /> Mi equipo
            </p>
            <h2 className="truncate font-display text-2xl font-bold uppercase leading-tight tracking-wide text-navy-950">{team.name}</h2>
            <p className="text-sm text-navy-500">
              {data?.standing
                ? `${data.standing.pos}.º${data.standing.table ? ` en ${data.standing.table}` : ""} · ${data.standing.points} pts en ${data.standing.played} PJ`
                : (data?.comp.name ?? " ")}
            </p>
          </div>
        </Link>

        {/* Partido en juego o próximo */}
        <div className="rounded-2xl bg-navy-50 px-4 py-3">
          {!data ? (
            <div className="skeleton h-12 rounded-xl" />
          ) : match ? (
            <>
              <p className="mb-1.5 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-navy-500">
                {data.live ? (
                  <>
                    <span className="live-dot-bare" /> <span className="text-red-600">En juego · {data.live.detail}</span>
                  </>
                ) : (
                  `Próximo · ${when(match.date)}`
                )}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Side t={match.home} mine={match.home.espnId === team.id} />
                <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-display text-base font-bold tabular-nums text-navy-950">
                  {data.live ? `${match.home.score ?? 0} - ${match.away.score ?? 0}` : "vs"}
                </span>
                <Side t={match.away} mine={match.away.espnId === team.id} right />
              </div>
            </>
          ) : (
            <p className="text-sm text-navy-500">Sin partidos programados por ahora.</p>
          )}
        </div>

        {/* Últimos resultados */}
        <div>
          <p className="mb-1.5 font-display text-xs font-bold uppercase tracking-widest text-navy-500">Últimos partidos</p>
          {!data ? (
            <div className="skeleton h-8 rounded-xl" />
          ) : data.last.length ? (
            <ul className="flex gap-1">
              {data.last.map((e) => {
                const mine = e.home.espnId === team.id ? e.home : e.away;
                const rival = e.home.espnId === team.id ? e.away : e.home;
                const a = Number(mine.score ?? 0);
                const b = Number(rival.score ?? 0);
                const r = a > b ? "V" : a < b ? "D" : "E";
                return (
                  <li
                    key={e.id}
                    title={`${e.home.name} ${e.home.score} - ${e.away.score} ${e.away.name}`}
                    className={`flex h-9 w-9 flex-col items-center justify-center rounded-lg font-display font-bold leading-none ${
                      r === "V" ? "bg-emerald-500 text-white" : r === "D" ? "bg-red-500 text-white" : "bg-amber-400 text-navy-950"
                    }`}
                  >
                    <span className="text-sm">{r}</span>
                    <span className="text-[0.6rem] tabular-nums opacity-90">
                      {a}-{b}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-navy-500">Todavía no jugó en esta competencia.</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-navy-100 px-4 py-2 text-sm sm:px-5">
        <Link href={href} className="font-semibold text-volt-600 hover:underline">
          Plantel, partidos y campaña →
        </Link>
        <button type="button" onClick={() => setChanging(true)} className="ml-auto font-semibold text-navy-500 hover:text-navy-800">
          Cambiar
        </button>
        <button type="button" onClick={() => setMyTeam(null)} className="font-semibold text-navy-400 hover:text-red-600">
          Quitar
        </button>
      </div>
    </section>
  );
}

function Side({ t, mine, right }: { t: LiveTeam; mine: boolean; right?: boolean }) {
  return (
    <span className={`flex min-w-0 flex-1 items-center gap-1.5 ${right ? "flex-row-reverse text-right" : ""}`}>
      {t.logo && <img src={t.logo} alt="" className="logo-img h-6 w-6 shrink-0 object-contain" />}
      <span className={`truncate ${mine ? "font-bold text-navy-950" : "text-navy-700"}`}>{t.name}</span>
    </span>
  );
}

function Star({ filled, small }: { filled: boolean; small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "h-3 w-3" : "h-10 w-10 shrink-0 text-gold-500"} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </svg>
  );
}

type Result = { kind: string; title: string; subtitle?: string; href: string; logo?: string };

// Buscador de equipos (usa el buscador del sitio y se queda con los equipos que tienen página).
function TeamSearch({ onPick }: { onPick: (t: MyTeam) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) return setResults([]);
    timer.current = setTimeout(() => {
      fetch(`/api/buscar?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((j) => {
          const seen = new Set<string>();
          setResults(
            (j.results as Result[]).filter((r) => {
              const m = r.href.match(/^\/torneos\/[^/]+\/equipo\/(\d+)$/);
              if (!m || seen.has(m[1])) return false;
              seen.add(m[1]);
              return true;
            }).slice(0, 6),
          );
        })
        .catch(() => {});
    }, 250);
  }, [q]);

  return (
    <div className="relative min-w-0 flex-1">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscá tu club: Boca, River, Real Madrid…"
        aria-label="Buscar equipo"
        className="w-full rounded-full border border-navy-200 bg-white px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-volt-500 focus:outline-none focus:ring-2 focus:ring-volt-400/30"
      />
      {results.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xl">
          {results.map((r) => {
            const [, comp, id] = r.href.match(/^\/torneos\/([^/]+)\/equipo\/(\d+)$/)!;
            return (
              <li key={r.href}>
                <button
                  type="button"
                  onClick={() => onPick({ comp, id, name: r.title, logo: r.logo })}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-navy-50"
                >
                  {r.logo ? <img src={r.logo} alt="" className="logo-img h-7 w-7 shrink-0 object-contain" /> : <span className="h-7 w-7" />}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-navy-900">{r.title}</span>
                    {r.subtitle && <span className="block truncate text-xs text-navy-500">{r.subtitle}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
