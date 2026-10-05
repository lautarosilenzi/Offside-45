"use client";

import { useEffect, useRef, useState } from "react";
import type { MatchSummary } from "@/lib/live/espn";
import { translate } from "@/lib/live/translate";
import { getFollowed, unfollow, useFollowed, type AlertType } from "@/lib/prefs";

type Alert = { id: string; title: string; body: string };

// Qué tipo de alerta es cada incidencia (de las incidencias principales y del relato).
function classify(type: string, text: string): AlertType | null {
  const t = `${type} ${text}`;
  if (/^foul$/i.test(type)) return /^foul by/i.test(text) ? "foul" : null; // "Foul by X" (no el "X wins a free kick" de la misma falta)
  if (/corner/i.test(type)) return "corner";
  if (/\bVAR\b/.test(t)) return "var";
  if (/own goal|goal/i.test(type)) return "goal";
  if (/penalty/i.test(type)) return "penalty";
  if (/red card|second yellow/i.test(type)) return "red";
  if (/yellow/i.test(type)) return "yellow";
  if (/substitution/i.test(type)) return "sub";
  if (/kickoff|halftime|start 2nd half|end regular time|full time|end of game/i.test(type)) return "status";
  return null;
}

const STATUS_TEXT: [RegExp, string][] = [
  [/kickoff/i, "Empezó el partido"],
  [/halftime/i, "Entretiempo"],
  [/start 2nd half/i, "Empezó el segundo tiempo"],
  [/end regular time|full time|end of game/i, "Terminó el partido"],
];
const TITLE: Record<AlertType, string> = {
  goal: "⚽ ¡Gol!",
  yellow: "🟨 Amarilla",
  red: "🟥 Expulsión",
  foul: "Falta",
  corner: "Córner",
  sub: "🔁 Cambio",
  penalty: "Penal",
  var: "📺 VAR",
  status: "⏱️",
};

// Revisa cada 30 segundos los partidos que sigue el visitante y avisa (cartel en la página y notificación del
// navegador, si dio permiso) de lo que eligió. La primera revisión de cada partido solo registra lo que ya pasó.
export default function AlertsWatcher() {
  const followed = useFollowed();
  const seen = useRef<Record<string, Set<string>>>({});
  const [toasts, setToasts] = useState<Alert[]>([]);

  const ids = Object.keys(followed).sort().join(",");
  useEffect(() => {
    if (!ids) return;
    let alive = true;
    const check = async () => {
      const all = getFollowed();
      for (const m of Object.values(all)) {
        // Seis horas después del comienzo el partido ya terminó: se deja de seguir solo.
        if (Date.parse(m.date) < Date.now() - 6 * 3600000) {
          unfollow(m.id);
          continue;
        }
        if (Date.parse(m.date) > Date.now() + 15 * 60000) continue; // todavía falta
        let s: MatchSummary;
        try {
          const r = await fetch(`/api/partido?liga=${m.league}&id=${m.id}`);
          if (!r.ok) continue;
          s = await r.json();
        } catch {
          continue;
        }
        if (!alive) return;
        const items = [
          ...s.keyEvents.map((k) => ({ key: `k|${k.minute}|${k.type}|${k.text}`, minute: k.minute, type: k.type, text: k.text })),
          ...s.commentary.filter((c) => /foul|corner|var/i.test(c.type) || /\bVAR\b/.test(c.text)).map((c) => ({ key: `c|${c.minute}|${c.type}|${c.text}`, minute: c.minute, type: c.type, text: c.text })),
        ];
        const first = !seen.current[m.id];
        const set = (seen.current[m.id] ??= new Set());
        const score = s.score ? `${m.home} ${s.score.home} - ${s.score.away} ${m.away}` : `${m.home} - ${m.away}`;
        for (const it of items) {
          if (set.has(it.key)) continue;
          set.add(it.key);
          if (first) continue;
          const kind = classify(it.type, it.text);
          if (!kind || !m.types.includes(kind)) continue;
          const title = kind === "status" ? `⏱️ ${STATUS_TEXT.find(([re]) => re.test(it.type))?.[1] ?? it.type}` : `${TITLE[kind]} ${it.minute}`;
          notify({ id: it.key, title, body: kind === "status" || kind === "goal" ? `${score}${kind === "goal" && it.text ? ` · ${translate(it.text).slice(0, 120)}` : ""}` : `${score} · ${translate(it.text).slice(0, 140)}` });
        }
      }
    };
    const notify = (a: Alert) => {
      setToasts((t) => [...t.slice(-3), a]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== a.id)), 9000);
      try {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(a.title, { body: a.body, tag: a.id, icon: "/icon.svg" });
      } catch {}
    };
    check();
    const t = setInterval(check, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [ids]);

  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((a) => (
        <div key={a.id} className="pointer-events-auto rounded-2xl bg-navy-950 px-4 py-3 text-white shadow-2xl ring-1 ring-volt-400/40">
          <div className="font-display text-base font-bold uppercase tracking-wide">{a.title}</div>
          <div className="text-sm text-navy-200">{a.body}</div>
        </div>
      ))}
    </div>
  );
}
