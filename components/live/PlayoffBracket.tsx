"use client";

import { useEffect, useState } from "react";
import type { LiveTable, LiveTableRow } from "@/lib/live/espn";
import { getTeam } from "@/lib/teams";
import Crest from "../Crest";

// Octavos del torneo de Liga Profesional con dos zonas (formato de 2026): 1.° de una zona contra 8.° de la otra, etc.
// El orden arma el cuadro: cada par de octavos es un cuarto de final, y cada par de cuartos, una semifinal
// (así se jugó el Apertura 2026).
const OCTAVOS: [string, string][] = [
  ["A1", "B8"], ["B4", "A5"], ["A3", "B6"], ["B2", "A7"],
  ["B1", "A8"], ["A4", "B5"], ["B3", "A6"], ["A2", "B7"],
];

type Seed = { key: string; row?: LiveTableRow };

// Cuadro de cruces "si el torneo terminara hoy", con la tabla en vivo.
export default function PlayoffBracket({ code }: { code: string }) {
  const [tables, setTables] = useState<LiveTable[] | null>(null);

  useEffect(() => {
    fetch(`/api/tabla?liga=${code}`)
      .then((r) => r.json())
      .then((j) => setTables(j.tables ?? []))
      .catch(() => setTables([]));
  }, [code]);

  if (tables === null) return <div className="skeleton h-96 rounded-3xl" />;
  const zoneA = tables.find((t) => /A$/.test(t.name));
  const zoneB = tables.find((t) => /B$/.test(t.name));
  if (!zoneA || !zoneB) return null;
  const seed = (key: string): Seed => ({ key, row: (key[0] === "A" ? zoneA : zoneB).rows.find((r) => r.pos === Number(key.slice(1))) });

  const round = (n: number) => Array.from({ length: n }, (_, i) => i);
  return (
    <div className="panel overflow-x-auto p-4">
      <div className="grid min-w-[56rem] grid-cols-[1.25fr_1fr_1fr_1fr] gap-x-6">
        {["Octavos", "Cuartos", "Semifinales", "Final"].map((t) => (
          <p key={t} className="mb-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-navy-400">
            {t}
          </p>
        ))}
        <div className="flex flex-col justify-around gap-2">
          {OCTAVOS.map(([a, b], i) => (
            <MatchBox key={i} top={seed(a)} bottom={seed(b)} />
          ))}
        </div>
        <div className="flex flex-col justify-around gap-2">
          {round(4).map((i) => (
            <Placeholder key={i} text={`Ganadores de ${OCTAVOS[i * 2].join("-")} y ${OCTAVOS[i * 2 + 1].join("-")}`} />
          ))}
        </div>
        <div className="flex flex-col justify-around gap-2">
          {round(2).map((i) => (
            <Placeholder key={i} text={`Semifinal ${i + 1}`} />
          ))}
        </div>
        <div className="flex flex-col justify-around">
          <Placeholder text="Final" trophy />
        </div>
      </div>
      <p className="mt-3 text-xs text-navy-500">
        Así quedarían los cruces si el torneo terminara hoy, con la tabla en vivo (A1 = primero de la Zona A). Clasifican los ocho
        primeros de cada zona; octavos, cuartos, semifinales y final a un partido, como en el Apertura 2026.
      </p>
    </div>
  );
}

function MatchBox({ top, bottom }: { top: Seed; bottom: Seed }) {
  return (
    <div className="bracket-box overflow-hidden rounded-2xl bg-white ring-1 ring-navy-100">
      <SeedRow s={top} />
      <div className="h-px bg-navy-100" />
      <SeedRow s={bottom} />
    </div>
  );
}

function SeedRow({ s }: { s: Seed }) {
  const ours = s.row?.team.teamId ? getTeam(s.row.team.teamId) : undefined;
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 text-sm">
      <span className="w-6 shrink-0 rounded bg-navy-900 text-center font-display text-[0.65rem] font-bold text-white">{s.key}</span>
      {ours ? (
        <Crest team={ours} size="xs" />
      ) : s.row?.team.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- escudo de la fuente en vivo
        <img src={s.row.team.logo} alt="" className="h-5 w-5 object-contain" />
      ) : null}
      <span className="min-w-0 flex-1 truncate font-semibold text-navy-900">{s.row?.team.name ?? "—"}</span>
      <span className="font-display text-xs font-bold tabular-nums text-navy-400">{s.row ? `${s.row.points} pts` : ""}</span>
    </div>
  );
}

function Placeholder({ text, trophy }: { text: string; trophy?: boolean }) {
  return (
    <div className={`rounded-2xl border border-dashed px-3 py-3 text-center text-xs ${trophy ? "border-gold-400 bg-gold-400/10 font-semibold text-navy-800" : "border-navy-200 text-navy-400"}`}>
      {trophy && <span className="mb-1 block text-2xl">🏆</span>}
      {text}
    </div>
  );
}
