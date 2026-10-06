"use client";

// Preferencias de cada visitante, guardadas en su navegador: si quiere ver las cuotas y qué partidos sigue con qué
// alertas. Son comodidades personales: si el navegador no deja guardar (modo privado), todo funciona igual, solo que no
// se recuerdan. Cuando cambian, se avisa a todos los componentes de la página (y de otras pestañas).
import { useEffect, useState } from "react";

const ODDS_KEY = "o45-cuotas";
const ALERTS_KEY = "o45-alertas";
const EVENT = "o45-prefs";

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function usePref<T>(key: string, fallback: T): T {
  const [v, setV] = useState<T>(fallback);
  useEffect(() => {
    const sync = () => setV(read(key, fallback));
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fallback es un valor fijo
  }, [key]);
  return v;
}

// ── Cuotas ─────────────────────────────────────────────────────────────────────────────────────────────────────────
export const useOddsEnabled = () => usePref<boolean>(ODDS_KEY, false);
export const setOddsEnabled = (on: boolean) => write(ODDS_KEY, on);

// ── Alertas ────────────────────────────────────────────────────────────────────────────────────────────────────────
export const ALERT_TYPES = [
  { id: "goal", label: "Goles" },
  { id: "yellow", label: "Tarjetas amarillas" },
  { id: "red", label: "Tarjetas rojas" },
  { id: "foul", label: "Faltas" },
  { id: "corner", label: "Córners" },
  { id: "sub", label: "Cambios" },
  { id: "penalty", label: "Penales" },
  { id: "var", label: "VAR" },
  { id: "status", label: "Comienzo, entretiempo y final" },
] as const;
export type AlertType = (typeof ALERT_TYPES)[number]["id"];
export const DEFAULT_ALERTS: AlertType[] = ["goal", "red", "penalty", "status"];

export type FollowedMatch = { id: string; league: string; home: string; away: string; date: string; types: AlertType[] };

export const useFollowed = () => usePref<Record<string, FollowedMatch>>(ALERTS_KEY, {});
export const getFollowed = () => read<Record<string, FollowedMatch>>(ALERTS_KEY, {});

export function follow(m: Omit<FollowedMatch, "types">, types: AlertType[] = DEFAULT_ALERTS) {
  const all = getFollowed();
  all[m.id] = { ...m, types: all[m.id]?.types ?? types };
  write(ALERTS_KEY, all);
}

export function setAlertTypes(id: string, types: AlertType[]) {
  const all = getFollowed();
  if (!all[id]) return;
  all[id] = { ...all[id], types };
  write(ALERTS_KEY, all);
}

export function unfollow(id: string) {
  const all = getFollowed();
  delete all[id];
  write(ALERTS_KEY, all);
}

// ── Mi equipo ──────────────────────────────────────────────────────────────────────────────────────────────────────
// El club que eligió el visitante: su competencia en el sitio (para la tabla y el enlace) y su número en ESPN.
const MY_TEAM_KEY = "o45-mi-equipo";
export type MyTeam = { comp: string; id: string; name: string; logo?: string };
export const useMyTeam = () => usePref<MyTeam | null>(MY_TEAM_KEY, null);
export const setMyTeam = (t: MyTeam | null) => write(MY_TEAM_KEY, t);
