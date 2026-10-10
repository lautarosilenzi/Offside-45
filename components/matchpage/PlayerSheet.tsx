"use client";
/* eslint-disable @next/next/no-img-element -- fotos de ESPN, sin optimizar */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MatchPlayer } from "@/lib/live/match";
import { playerSections } from "@/lib/live/player-match";

type Data = { stats: Record<string, number>; photo?: string };

// Ficha de un jugador en el partido (como la de 365Scores): foto, número y posición, minutos, goles y asistencias, y
// sus estadísticas por sección. Las flechas pasan al jugador anterior o siguiente de su equipo; "Detalles del
// jugador" lleva a su perfil con toda la temporada.
export default function PlayerSheet({
  players,
  index,
  league,
  eventId,
  live,
  photo,
  photos,
  color,
  ink,
  onClose,
  onMove,
}: {
  players: MatchPlayer[];
  index: number;
  league: string;
  eventId: string;
  live: boolean;
  photo?: { url: string; credit?: string }; // la del plantel (ESPN o Wikimedia Commons)
  photos?: Record<string, { url: string }>; // las del resto del plantel (para el anterior y el siguiente)
  color: string; // color del equipo (y el del texto encima)
  ink: string;
  onClose: () => void;
  onMove: (i: number) => void;
}) {
  const p = players[index];
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null);
    setFailed(false);
    fetch(`/api/partido/jugador?liga=${league}&id=${eventId}&equipo=${p.teamId}&jugador=${p.id}${live ? "&vivo=1" : ""}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => alive && setData(j))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [league, eventId, p.teamId, p.id, live]);

  // Escape cierra; las flechas del teclado pasan de jugador.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onMove(index - 1);
      if (e.key === "ArrowRight" && index < players.length - 1) onMove(index + 1);
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [index, players.length, onClose, onMove]);

  // Deslizar hacia abajo cierra la ficha (como en las apps): se arrastra desde arriba de todo.
  const sheet = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);
  const onTouchStart = (e: React.TouchEvent) => {
    start.current = (sheet.current?.scrollTop ?? 0) <= 0 ? e.touches[0].clientY : null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (start.current === null) return;
    setDrag(Math.max(0, e.touches[0].clientY - start.current));
  };
  const onTouchEnd = () => {
    if (drag > 90) onClose();
    start.current = null;
    setDrag(0);
  };
  const prev = players[index - 1];
  const next = players[index + 1];

  const s = data?.stats ?? {};
  const keeper = p.line === "Arquero";
  const minutes = s.minutes ?? (p.played ? undefined : 0);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={p.name} onClick={onClose}>
      <div
        ref={sheet}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        style={{ transform: drag ? `translateY(${drag}px)` : undefined, transition: drag ? "none" : "transform 0.2s" }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-white pb-1 pt-2 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-navy-300" aria-label="Deslizá hacia abajo para cerrar" />
        </div>
        <div className="relative px-5 pb-4 pt-2 text-center sm:pt-5">
          <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-2 hidden h-9 w-9 items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 hover:text-navy-800 sm:flex">
            ✕
          </button>
          {/* Como en 365: el anterior y el siguiente a los costados, chiquitos; tocarlos pasa a ese jugador. */}
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => onMove(index - 1)} disabled={!prev} aria-label="Jugador anterior" className="flex h-9 w-7 items-center justify-center text-2xl text-navy-500 disabled:opacity-20">
              ‹
            </button>
            <button type="button" onClick={() => prev && onMove(index - 1)} disabled={!prev} aria-hidden tabIndex={-1} className="opacity-70 disabled:invisible">
              {prev && <Avatar photo={photos?.[prev.id]?.url} number={prev.number} color={color} ink={ink} size={44} />}
            </button>
            <Avatar photo={photo?.url ?? data?.photo} number={p.number} color={color} ink={ink} />
            <button type="button" onClick={() => next && onMove(index + 1)} disabled={!next} aria-hidden tabIndex={-1} className="opacity-70 disabled:invisible">
              {next && <Avatar photo={photos?.[next.id]?.url} number={next.number} color={color} ink={ink} size={44} />}
            </button>
            <button type="button" onClick={() => onMove(index + 1)} disabled={!next} aria-label="Jugador siguiente" className="flex h-9 w-7 items-center justify-center text-2xl text-navy-500 disabled:opacity-20">
              ›
            </button>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-950">{p.name}</h2>
          {photo?.credit && <p className="mt-1 text-[0.65rem] text-navy-400">Foto: {photo.credit} (Wikimedia Commons)</p>}
          <p className="text-sm text-navy-500">
            {p.number ? `#${p.number}, ` : ""}
            {p.position || p.line}
            {!p.starter && p.played ? " · entró desde el banco" : ""}
            {!p.played ? " · no jugó" : ""}
          </p>
        </div>

        <div className="grid grid-cols-3 border-y border-navy-100 py-4 text-center">
          <Big icon="clock" value={minutes !== undefined ? `${minutes}'` : "—"} label="Min" />
          {keeper ? (
            <>
              <Big icon="glove" value={data ? String(s.saves ?? 0) : "—"} label="Atajadas" />
              <Big icon="ball" value={data ? String(s.goalsConceded ?? 0) : "—"} label="Goles recibidos" />
            </>
          ) : (
            <>
              <Big icon="ball" value={String(data ? (s.totalGoals ?? p.goals) : p.goals)} label="Goles" />
              <Big icon="boot" value={String(data ? (s.goalAssists ?? p.assists) : p.assists)} label="Asistencias" />
            </>
          )}
        </div>

        {!data && !failed && <div className="skeleton m-5 h-48 rounded-2xl" />}
        {failed && <p className="px-5 py-8 text-center text-sm text-navy-500">Todavía no hay estadísticas de este jugador en el partido.</p>}
        {data && !p.played && <p className="px-5 py-8 text-center text-sm text-navy-500">Estuvo en el banco y no entró.</p>}
        {data &&
          p.played &&
          playerSections(s, keeper).map((sec) => (
            <section key={sec.title} className="border-b border-navy-100 px-5 py-3 last:border-0">
              <h3 className="mb-1 font-display text-base font-bold uppercase tracking-wide text-navy-950">{sec.title}</h3>
              <dl>
                {sec.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                    <dt className="text-navy-700">{r.label}</dt>
                    <dd className="font-semibold tabular-nums text-navy-950">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

        {data && p.played && (s.yellowCards || s.redCards) ? (
          <p className="px-5 py-3 text-sm text-navy-700">
            Tarjetas: {s.yellowCards ? "🟨".repeat(Math.round(s.yellowCards)) : ""}
            {s.redCards ? "🟥" : ""}
          </p>
        ) : null}

        <Link href={`/jugador/${p.id}`} className="sticky bottom-0 block border-t border-navy-100 bg-white py-3.5 text-center font-semibold text-volt-600 hover:bg-navy-50">
          Detalles del jugador
        </Link>
      </div>
    </div>,
    document.body,
  );
}

export function Avatar({ photo, number, color, ink, size = 96 }: { photo?: string; number?: string; color: string; ink: string; size?: number }) {
  return photo ? (
    <img src={photo} alt="" className="shrink-0 rounded-full bg-navy-50 object-cover object-top ring-4 ring-navy-50" style={{ width: size, height: size }} />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-display font-extrabold ring-4 ring-navy-50"
      style={{ background: color, color: ink, width: size, height: size, fontSize: size * 0.4 }}
    >
      {number ?? ""}
    </span>
  );
}

// Íconos de las estadísticas principales (trazo, como en 365).
const ICONS: Record<string, React.ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  ball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l4 2.9-1.5 4.7h-5L8 10.4z" />
    </>
  ),
  boot: <path d="M4 7h6l1 4 6 2c2 .6 3 1.6 3 3v1H4z" />,
  glove: <path d="M7 21v-8l-2-3V6a1.5 1.5 0 0 1 3 0v4m0-5a1.5 1.5 0 0 1 3 0v5m0-6a1.5 1.5 0 0 1 3 0v6m0-4a1.5 1.5 0 0 1 3 0v8l-2 4v3" />,
};

function Big({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-navy-900" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {ICONS[icon]}
      </svg>
      <div className="mt-1 font-display text-2xl font-bold tabular-nums text-navy-950">{value}</div>
      <div className="text-xs text-navy-500">{label}</div>
    </div>
  );
}
