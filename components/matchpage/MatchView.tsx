"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import TeamLogo from "@/components/hub/TeamLogo";
import Formation from "@/components/match/Formation";
import FollowButton from "@/components/match/FollowButton";
import { OddsBox } from "@/components/match/OddsBox";
import type { LiveEvent } from "@/lib/live/espn";
import { OFF_LABELS } from "@/lib/live/status";
import type { MatchPage, MatchPlayer } from "@/lib/live/match";
import { translate } from "@/lib/live/translate";
import { useOddsEnabled } from "@/lib/prefs";
import KeyPlayers from "./KeyPlayers";
import PlayerSheet from "./PlayerSheet";
import StatsCompare, { Section } from "./StatsCompare";
import Timeline from "./Timeline";

type Tab = "resumen" | "alineaciones" | "estadisticas" | "posiciones" | "relato" | "cuotas";
const TZ = "America/Argentina/Buenos_Aires";

// Página de un partido, al estilo de 365Scores. Mientras se juega, se actualiza sola cada 30 segundos.
export default function MatchView({ m, standings }: { m: MatchPage; standings?: React.ReactNode }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("resumen");
  const [sheet, setSheet] = useState<{ side: "home" | "away"; index: number } | null>(null);
  const oddsOn = useOddsEnabled();

  useEffect(() => {
    if (m.status.state !== "in") return;
    const t = setInterval(() => router.refresh(), 30000);
    return () => clearInterval(t);
  }, [m.status.state, router]);

  // Jugadores de cada equipo en el orden de la ficha: titulares, los que entraron y los que no jugaron.
  const byTeam = useMemo(() => {
    const order = (p: MatchPlayer) => (p.starter ? 0 : p.played ? 1 : 2);
    const list = (side: "home" | "away") => m.players.filter((p) => p.side === side).sort((a, b) => order(a) - order(b));
    return { home: list("home"), away: list("away") };
  }, [m.players]);
  const open = useCallback(
    (id: string) => {
      for (const side of ["home", "away"] as const) {
        const index = byTeam[side].findIndex((p) => p.id === id);
        if (index >= 0) return setSheet({ side, index });
      }
    },
    [byTeam],
  );
  const close = useCallback(() => setSheet(null), []);
  const move = useCallback((index: number) => setSheet((s) => (s ? { ...s, index } : s)), []);

  const side = { home: { color: m.home.color, ink: m.home.ink }, away: { color: m.away.color, ink: m.away.ink } };
  const odds = m.summary.odds;
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "resumen", label: "Resumen", show: true },
    { id: "alineaciones", label: "Alineaciones", show: true },
    { id: "estadisticas", label: "Estadísticas", show: m.sections.length > 0 },
    { id: "posiciones", label: "Posiciones", show: !!standings },
    { id: "relato", label: "Relato", show: m.summary.commentary.length > 0 },
    { id: "cuotas", label: "Cuotas", show: oddsOn && !!odds },
  ];
  // Para la campanita de alertas: el partido como lo usan las listas.
  const asEvent: LiveEvent = {
    id: m.id,
    date: m.date,
    state: m.status.state,
    detail: m.status.detail,
    home: m.home,
    away: m.away,
    incidents: [],
  };

  return (
    <>
      <Header m={m} />
      <div className="mx-auto max-w-3xl px-3 sm:px-6">
        <nav className="mt-3 flex flex-wrap justify-center gap-1.5 py-2 sm:justify-start">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={tab === t.id}
                className={`shrink-0 rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide ring-1 transition ${
                  tab === t.id ? "bg-navy-950 text-white ring-navy-950 dark:bg-volt-600 dark:ring-volt-600" : "bg-white text-navy-600 ring-navy-100 hover:ring-volt-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          <span className="ml-auto shrink-0 self-center">
            <FollowButton league={m.league} match={asEvent} />
          </span>
        </nav>

        <main className="space-y-4 pb-10 pt-2">
          {tab === "resumen" && (
            <>
              <Timeline
                events={m.timeline}
                state={m.status.state}
                detail={m.status.detail}
                halftime={m.halftime}
                final={m.home.score !== undefined && m.away.score !== undefined ? { home: m.home.score, away: m.away.score } : undefined}
                shootout={m.shootout}
                onPlayer={open}
              />
              <KeyPlayers players={m.keyPlayers} home={side.home} away={side.away} onPlayer={open} />
              {m.sections[0] && <Section section={m.sections[0]} home={side.home} away={side.away} limit={6} />}
              <Info m={m} />
            </>
          )}

          {tab === "alineaciones" &&
            (m.summary.lineups.some((l) => l.starters.length) ? (
              <div className="grid gap-4 md:grid-cols-2">
                {(["home", "away"] as const).map((s) => {
                  const l = m.summary.lineups.find((x) => x.side === s);
                  return l ? (
                    <div key={s} className="panel p-3">
                      <Formation lineup={l} color={side[s].color} ink={side[s].ink} photos={m.photos} onPlayer={open} />
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="panel px-6 py-8 text-center text-navy-500">
                {m.status.state === "pre" ? "Las formaciones se confirman alrededor de una hora antes del partido." : "Todavía no se publicaron las formaciones de este partido."}
              </p>
            ))}

          {tab === "estadisticas" && <StatsCompare sections={m.sections} home={side.home} away={side.away} />}

          {tab === "posiciones" && standings}

          {tab === "relato" && (
            <ul className="panel divide-y divide-navy-50">
              {[...m.summary.commentary].reverse().map((c, i) => (
                <li key={i} className="flex gap-3 px-4 py-2 text-sm">
                  <span className="w-11 shrink-0 font-display font-bold tabular-nums text-navy-500">{c.minute}</span>
                  <span className="text-navy-800">{translate(c.text)}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === "cuotas" && oddsOn && odds && (
            <div className="panel p-4">
              <OddsBox odds={odds} home={m.home.name} away={m.away.name} />
            </div>
          )}
        </main>
      </div>

      {sheet && (
        <PlayerSheet
          players={byTeam[sheet.side]}
          index={sheet.index}
          league={m.league}
          eventId={m.id}
          live={m.status.state === "in"}
          photo={m.photos[byTeam[sheet.side][sheet.index]?.id]}
          color={side[sheet.side].color}
          ink={side[sheet.side].ink}
          onClose={close}
          onMove={move}
        />
      )}
    </>
  );
}

function statusText(m: MatchPage) {
  const d = m.status.detail;
  if (OFF_LABELS.includes(d)) return d;
  if (m.status.state === "pre") return new Intl.DateTimeFormat("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(m.date));
  if (m.status.state === "in") return /^HT$|half/i.test(d) ? "Entretiempo" : d;
  if (/pen/i.test(d)) return "Final (penales)";
  if (/AET|extra/i.test(d)) return "Final (alargue)";
  return "Final";
}

function Header({ m }: { m: MatchPage }) {
  const share = async () => {
    const data = { title: `${m.home.name} vs ${m.away.name}`, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(location.href);
    } catch {}
  };
  const day = new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" }).format(new Date(m.date));
  return (
    <section className="px-3 pt-4 sm:px-6 sm:pt-5">
      <div
        className="hero relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] text-white"
        style={{
          background: `radial-gradient(28rem 16rem at 0% 0%, ${m.home.color}66, transparent 70%), radial-gradient(28rem 16rem at 100% 0%, ${m.away.color}66, transparent 70%), linear-gradient(180deg, #0a1328, #050b1a)`,
        }}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <button type="button" onClick={() => history.back()} aria-label="Volver" className="flex h-9 w-9 items-center justify-center rounded-full text-2xl hover:bg-white/10">
            ‹
          </button>
          <div className="min-w-0 text-center">
            <p className="break-words leading-snug text-sm font-semibold">{m.competition.name}</p>
            {m.stage && <p className="break-words leading-snug text-xs text-navy-200">{m.stage}</p>}
          </div>
          <button type="button" onClick={share} aria-label="Compartir" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 pb-6 pt-3 sm:px-8">
          <Team t={m.home} />
          <div className="text-center">
            <p className="text-sm capitalize text-navy-200">{day}</p>
            <p className="my-1 font-display text-5xl font-extrabold tabular-nums tracking-wide sm:text-6xl">
              {m.status.state === "pre" || m.home.score === undefined ? "vs" : `${m.home.score} - ${m.away.score ?? 0}`}
            </p>
            <p className={`text-sm font-semibold ${m.status.state === "in" ? "text-red-400" : "text-navy-200"}`}>
              {m.status.state === "in" && <span className="live-dot-bare mr-1.5" />}
              {statusText(m)}
            </p>
            {m.shootout && (
              <p className="mt-0.5 text-xs text-navy-200">
                Penales {m.shootout.home} - {m.shootout.away}
              </p>
            )}
          </div>
          <Team t={m.away} />
        </div>
      </div>
    </section>
  );
}

function Team({ t }: { t: MatchPage["home"] }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <span className="logo-plate">
        <TeamLogo team={t} size={64} />
      </span>
      <span className="line-clamp-2 font-display text-lg font-bold leading-tight sm:text-xl">{t.name}</span>
      {t.record && <span className="text-[0.7rem] text-navy-300">{t.record} (G-E-P)</span>}
    </div>
  );
}

function Info({ m }: { m: MatchPage }) {
  const when = new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(m.date));
  return (
    <section className="panel px-4 py-3 text-sm text-navy-700">
      <p>
        <span className="text-navy-400">Fecha:</span> <span className="inline-block first-letter:uppercase">{when}</span>
      </p>
      {m.venue && (
        <p>
          <span className="text-navy-400">Estadio:</span> {m.venue}
        </p>
      )}
    </section>
  );
}
