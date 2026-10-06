"use client";
/* eslint-disable @next/next/no-img-element -- fotos de ESPN, sin optimizar */

import Link from "next/link";
import { useEffect, useState } from "react";
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

  const s = data?.stats ?? {};
  const keeper = p.line === "Arquero";
  const minutes = s.minutes ?? (p.played ? undefined : 0);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={p.name} onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-white pb-1 pt-2 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-navy-200" />
        </div>
        <div className="relative px-5 pb-4 pt-2 text-center sm:pt-5">
          <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-2 flex h-9 w-9 items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 hover:text-navy-800">
            ✕
          </button>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onMove(index - 1)}
              disabled={index === 0}
              aria-label="Jugador anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-navy-500 hover:bg-navy-50 disabled:opacity-20"
            >
              ‹
            </button>
            <Avatar photo={photo?.url ?? data?.photo} number={p.number} color={color} ink={ink} />
            <button
              type="button"
              onClick={() => onMove(index + 1)}
              disabled={index === players.length - 1}
              aria-label="Jugador siguiente"
              className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-navy-500 hover:bg-navy-50 disabled:opacity-20"
            >
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
          <Big icon="⏱" value={minutes !== undefined ? `${minutes}'` : "—"} label="Min" />
          {keeper ? (
            <>
              <Big icon="🧤" value={data ? String(s.saves ?? 0) : "—"} label="Atajadas" />
              <Big icon="⚽" value={data ? String(s.goalsConceded ?? 0) : "—"} label="Goles recibidos" />
            </>
          ) : (
            <>
              <Big icon="⚽" value={String(data ? (s.totalGoals ?? p.goals) : p.goals)} label="Goles" />
              <Big icon="👟" value={String(data ? (s.goalAssists ?? p.assists) : p.assists)} label="Asistencias" />
            </>
          )}
        </div>

        {!data && !failed && <div className="skeleton m-5 h-48 rounded-2xl" />}
        {failed && <p className="px-5 py-8 text-center text-sm text-navy-500">ESPN no publicó las estadísticas de este jugador en el partido.</p>}
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

function Big({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div>
      <div aria-hidden className="text-xl leading-none">
        {icon}
      </div>
      <div className="mt-1 font-display text-2xl font-bold tabular-nums text-navy-950">{value}</div>
      <div className="text-xs text-navy-500">{label}</div>
    </div>
  );
}
