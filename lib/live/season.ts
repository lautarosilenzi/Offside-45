// Arma la temporada a partir de los partidos de ESPN: fechas (ESPN no las numera), racha de cada equipo, llaves de
// eliminación directa (ida, vuelta, global y penales) y el cuadro ordenado como un árbol.
import type { LiveEvent, LiveTeam } from "./espn";

export const PHASE_LABEL: Record<string, string> = {
  "first-stage": "Primera fase",
  "second-stage": "Segunda fase",
  "third-stage": "Tercera fase",
  "qualifying-round": "Fase previa",
  "preliminary-round": "Fase previa",
  "playoff-round": "Repechaje",
  "knockout-round-playoffs": "Playoffs",
  "knockout-playoffs": "Playoffs",
  "group-stage": "Fase de grupos",
  "league-phase": "Fase de liga",
  "round-of-64": "Treintaidosavos de final",
  "round-of-32": "Dieciseisavos de final",
  "round-of-16": "Octavos de final",
  quarterfinals: "Cuartos de final",
  semifinals: "Semifinales",
  "third-place": "Tercer puesto",
  final: "Final",
  "first-round": "Primera ronda",
  "second-round": "Segunda ronda",
  "final-round": "Ronda final",
  "group-a": "Grupo A",
};

// Fases del cuadro, en orden.
const BRACKET = ["round-of-64", "round-of-32", "round-of-16", "quarterfinals", "semifinals", "final"];
const KNOCKOUT = /^(first-stage|second-stage|third-stage|qualifying-round|preliminary-round|playoff-round|knockout-round-playoffs|knockout-playoffs|round-of-\d+|quarterfinals|semifinals|third-place|final)$/;
export const isKnockout = (phase?: string) => !!phase && KNOCKOUT.test(phase);
export const phaseLabel = (phase?: string) => (phase ? PHASE_LABEL[phase] ?? phase.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "");

const key = (t: LiveTeam) => t.espnId ?? t.name;
const DAY = 86400000;

export type Round = { key: string; label: string; phase?: string; matches: LiveEvent[]; partial?: boolean };

// Fases en el orden en que se juegan.
function phases(events: LiveEvent[]) {
  const first = new Map<string, string>();
  for (const e of events) if (!first.has(e.round ?? "")) first.set(e.round ?? "", e.date);
  return [...first.keys()];
}

// Fechas de una fase "de liga" o de grupos: cada partido va a la fecha (de hasta 5 días) en la que todavía no jugó
// ninguno de los dos equipos. Los reprogramados, que caen lejos de su fecha, quedan aparte.
function leagueRounds(events: LiveEvent[]) {
  const rounds: { start: number; teams: Set<string>; matches: LiveEvent[] }[] = [];
  for (const e of events) {
    const t = Date.parse(e.date);
    const h = key(e.home);
    const a = key(e.away);
    let r = [...rounds].reverse().find((x) => t - x.start <= 5 * DAY && !x.teams.has(h) && !x.teams.has(a));
    if (!r) {
      r = { start: t, teams: new Set(), matches: [] };
      rounds.push(r);
    }
    r.teams.add(h);
    r.teams.add(a);
    r.matches.push(e);
  }
  const sizes = rounds.map((r) => r.matches.length).sort((x, y) => x - y);
  const typical = sizes[Math.floor(sizes.length * 0.75)] ?? 1;
  return rounds.map((r) => ({ ...r, partial: r.matches.length < typical * 0.4 }));
}

export function buildRounds(events: LiveEvent[]): Round[] {
  const out: Round[] = [];
  const multi = phases(events).length > 1;
  for (const phase of phases(events)) {
    const evs = events.filter((e) => (e.round ?? "") === phase);
    if (isKnockout(phase)) {
      out.push({ key: phase, label: phaseLabel(phase), phase, matches: evs });
      continue;
    }
    let n = 0;
    for (const r of leagueRounds(evs)) {
      const d = new Date(r.start);
      const prefix = multi && phase ? `${phaseLabel(phase)} · ` : "";
      if (r.partial) {
        out.push({ key: `${phase}-r${d.getTime()}`, label: `${prefix}Reprogramados (${d.getUTCDate()}/${d.getUTCMonth() + 1})`, phase, matches: r.matches, partial: true });
      } else {
        n++;
        out.push({ key: `${phase}-${n}`, label: `${prefix}Fecha ${n}`, phase, matches: r.matches });
      }
    }
  }
  return out;
}

// La fecha a mostrar primero: la que se está jugando o la próxima; si terminó todo, la última.
export function currentRound(rounds: Round[]) {
  const i = rounds.findIndex((r) => !r.partial && r.matches.some((m) => m.state !== "post"));
  return i >= 0 ? i : Math.max(0, rounds.length - 1);
}

export type Result = "V" | "E" | "D";

// Últimos resultados de cada equipo, del más reciente al más viejo (como los muestran los sitios de resultados), en los
// partidos que no son de eliminación directa.
export function formByTeam(events: LiveEvent[], last = 5) {
  const form = new Map<string, Result[]>();
  for (const e of events) {
    if (e.state !== "post" || isKnockout(e.round)) continue;
    const hs = Number(e.home.score ?? 0);
    const as = Number(e.away.score ?? 0);
    const push = (t: LiveTeam, r: Result) => form.set(key(t), [...(form.get(key(t)) ?? []), r].slice(-last));
    push(e.home, hs > as ? "V" : hs < as ? "D" : "E");
    push(e.away, as > hs ? "V" : as < hs ? "D" : "E");
  }
  for (const [k, v] of form) form.set(k, [...v].reverse());
  return form;
}
export const teamKey = key;

export type Tie = {
  phase: string;
  a: LiveTeam;
  b: LiveTeam;
  legs: LiveEvent[];
  aggA?: number;
  aggB?: number;
  penA?: number;
  penB?: number;
  winner?: "a" | "b";
  done: boolean;
};

// Equipos todavía no definidos ("TBD Home", "TBD Away"…).
export const tbd = (t: LiveTeam) => /^TBD\b|to be determined|^A confirmar$/i.test(t.name);

// Llaves de una fase: se juntan los partidos entre los mismos dos equipos (ida y vuelta).
export function ties(events: LiveEvent[], phase: string): Tie[] {
  const map = new Map<string, Tie>();
  for (const e of events.filter((x) => x.round === phase)) {
    const k = tbd(e.home) || tbd(e.away) ? e.id : [key(e.home), key(e.away)].sort().join("|");
    const t = map.get(k) ?? { phase, a: e.home, b: e.away, legs: [], done: false };
    t.legs.push(e);
    map.set(k, t);
  }
  return [...map.values()].map((t) => {
    const played = t.legs.filter((l) => l.state !== "pre");
    let aggA = 0;
    let aggB = 0;
    for (const l of played) {
      const homeIsA = key(l.home) === key(t.a);
      aggA += Number((homeIsA ? l.home : l.away).score ?? 0);
      aggB += Number((homeIsA ? l.away : l.home).score ?? 0);
    }
    const lastLeg = t.legs[t.legs.length - 1];
    const done = t.legs.every((l) => l.state === "post");
    const lastHomeIsA = key(lastLeg.home) === key(t.a);
    const la = lastHomeIsA ? lastLeg.home : lastLeg.away;
    const lb = lastHomeIsA ? lastLeg.away : lastLeg.home;
    // ESPN marca al ganador del partido, no de la llave: manda el global y, si hay empate, los penales.
    let winner: Tie["winner"];
    if (done) {
      if (aggA !== aggB) winner = aggA > aggB ? "a" : "b";
      else if (la.shootout !== undefined && lb.shootout !== undefined && la.shootout !== lb.shootout) winner = la.shootout > lb.shootout ? "a" : "b";
      else winner = la.winner ? "a" : lb.winner ? "b" : undefined;
    }
    return {
      ...t,
      a: tbd(t.a) ? { ...t.a, name: "A confirmar" } : t.a,
      b: tbd(t.b) ? { ...t.b, name: "A confirmar" } : t.b,
      aggA: played.length ? aggA : undefined,
      aggB: played.length ? aggB : undefined,
      penA: la.shootout,
      penB: lb.shootout,
      winner,
      done,
    };
  });
}

// Cuadro: las fases desde la primera ronda de eliminación del cuadro hasta la final, con las llaves ordenadas para que
// cada par lleve a la llave siguiente (como un árbol).
export function bracket(events: LiveEvent[]): { phase: string; label: string; ties: Tie[] }[] {
  const present = BRACKET.filter((p) => events.some((e) => e.round === p));
  if (!present.length) return [];
  const cols = present.map((p) => ({ phase: p, label: phaseLabel(p), ties: ties(events, p) }));
  // De la final hacia atrás: los dos cruces de los que salió cada llave quedan juntos y en orden.
  for (let i = cols.length - 2; i >= 0; i--) {
    const next = cols[i + 1].ties;
    const pool = [...cols[i].ties];
    const ordered: Tie[] = [];
    const takeFor = (t: LiveTeam) => {
      const j = pool.findIndex((x) => x.winner && key(x.winner === "a" ? x.a : x.b) === key(t));
      if (j >= 0) ordered.push(...pool.splice(j, 1));
    };
    for (const n of next) {
      takeFor(n.a);
      takeFor(n.b);
    }
    cols[i].ties = [...ordered, ...pool];
  }
  return cols;
}
