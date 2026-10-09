// Página de un partido (al estilo de 365Scores): encabezado, línea de tiempo, jugadores clave y estadísticas completas de
// cada equipo y de cada jugador. Fuentes: el resumen del partido de ESPN y sus estadísticas detalladas (goles esperados,
// grandes chances, pases en el último tercio…). ESPN no publica puntajes de los jugadores.
import { espnTeam, matchSummary, type LiveTeam, type MatchSummary, offStatus } from "./espn";
import { teamPhotos, type Photo } from "./photos";
import { competitionOf, countryEs, positionEs } from "./player";
import { phaseLabel } from "./season";

const SITE = "https://site.api.espn.com/apis/site/v2/sports/soccer";
const CORE = "https://sports.core.api.espn.com/v2/sports/soccer";

async function getJson(url: string, revalidate: number) {
  const r = await fetch(url, { next: { revalidate } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

// Estadísticas detalladas (de un equipo o de un jugador en un partido), aplanadas: { expectedGoals: 3.02, … }.
async function coreStats(url: string, revalidate: number): Promise<Record<string, number>> {
  const j = await getJson(url, revalidate);
  const out: Record<string, number> = {};
  for (const c of j.splits?.categories ?? []) for (const s of c.stats ?? []) out[s.name] = Number(s.value ?? 0);
  return out;
}

// ── Colores de los equipos ───────────────────────────────────────────────────────────────────────────────────────
const rgb = (hex: string) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex: string) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const dist = (a: string, b: string) => {
  const [x, y] = [rgb(a), rgb(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};
const valid = (c?: string) => (c && /^[0-9a-f]{6}$/i.test(c) && !/^(ffffff|000000)$/i.test(c) ? c.toLowerCase() : undefined);
// Color de cada equipo para resaltar sus números: el principal; si los dos se parecen, el alternativo del visitante.
function teamColors(home: any, away: any): [string, string] {
  const h = valid(home?.color) ?? valid(home?.alternateColor) ?? "1f6bff";
  let a = valid(away?.color) ?? valid(away?.alternateColor) ?? "d7263d";
  if (dist(h, a) < 120) a = valid(away?.alternateColor) && dist(h, away.alternateColor) >= 120 ? away.alternateColor.toLowerCase() : h === "d7263d" ? "1f6bff" : "d7263d";
  return [`#${h}`, `#${a}`];
}
// Texto legible sobre ese color.
export const inkOn = (hex: string) => (lum(hex.replace("#", "")) > 0.45 ? "#0c1830" : "#ffffff");

// ── Estadísticas de equipo ───────────────────────────────────────────────────────────────────────────────────────
export type StatRow = { label: string; home: string; away: string; hv: number; av: number; better: "home" | "away" | null };
export type StatSection = { title: string; rows: StatRow[] };

type Def = { label: string; v: (s: Record<string, number>) => number | undefined; fmt?: (s: Record<string, number>) => string; lowerIsBetter?: boolean };
const num = (k: string) => (s: Record<string, number>) => s[k];
const ratio = (ok: string, total: string) => (s: Record<string, number>) => (s[total] !== undefined ? `${s[ok] ?? 0}/${s[total]} (${s[total] ? Math.round(((s[ok] ?? 0) / s[total]) * 100) : 0}%)` : "");
const dec = (k: string) => (s: Record<string, number>) => (s[k] !== undefined ? s[k].toFixed(2) : "");

const SECTIONS: { title: string; defs: Def[] }[] = [
  {
    title: "Estadísticas importantes",
    defs: [
      { label: "Posesión", v: num("possessionPct"), fmt: (s) => (s.possessionPct !== undefined ? `${Math.round(s.possessionPct)}%` : "") },
      { label: "Goles esperados", v: num("expectedGoals"), fmt: dec("expectedGoals") },
      { label: "Total remates", v: num("totalShots") },
      { label: "Remates al arco", v: num("shotsOnTarget") },
      { label: "Grandes chances", v: num("bigChanceCreated") },
      { label: "Saques de esquina", v: num("wonCorners") },
      { label: "Fueras de juego", v: num("offsides"), lowerIsBetter: true },
      { label: "Pases completados", v: num("accuratePasses") },
      { label: "Tarjetas amarillas", v: num("yellowCards"), lowerIsBetter: true },
      { label: "Tarjetas rojas", v: num("redCards"), lowerIsBetter: true },
    ],
  },
  {
    title: "Remates",
    defs: [
      { label: "Goles esperados", v: num("expectedGoals"), fmt: dec("expectedGoals") },
      { label: "Total remates", v: num("totalShots") },
      { label: "Remates al arco", v: num("shotsOnTarget") },
      { label: "Goles esperados de remates al arco", v: num("expectedGoalsOnTarget"), fmt: dec("expectedGoalsOnTarget") },
      { label: "Remates afuera", v: num("shotsOffTarget") },
      { label: "Remates desde adentro del área", v: num("attemptsIbox") },
      { label: "Remates desde afuera del área", v: num("attemptsObox") },
      { label: "Remates bloqueados por el rival", v: num("blockedByRival") },
      { label: "Grandes chances", v: num("bigChanceCreated") },
      { label: "Grandes chances falladas", v: num("bigChanceMissed"), lowerIsBetter: true },
    ],
  },
  {
    title: "Pases",
    defs: [
      { label: "Pases completados", v: (s) => s.passPct, fmt: ratio("accuratePasses", "totalPasses") },
      { label: "Pases largos completados", v: (s) => s.longballPct, fmt: ratio("accurateLongBalls", "totalLongBalls") },
      { label: "Centros completados", v: (s) => s.crossPct, fmt: ratio("accurateCrosses", "totalCrosses") },
      { label: "Pases en el último tercio", v: num("successfulFinalThirdPasses") },
      { label: "Entradas al último tercio", v: num("finalThirdEntries") },
      { label: "Entradas al área", v: num("penAreaEntries") },
      { label: "Toques en el área rival", v: num("touchesInOppBox") },
      { label: "Asistencias esperadas", v: num("expectedAssists"), fmt: dec("expectedAssists") },
    ],
  },
  {
    title: "Defensa",
    defs: [
      { label: "Quites", v: num("totalTackles"), fmt: ratio("effectiveTackles", "totalTackles") },
      { label: "Intercepciones", v: num("interceptions") },
      { label: "Despejes", v: num("totalClearance") },
      { label: "Recuperaciones", v: num("ballRecovery") },
      { label: "Remates bloqueados", v: num("blockedShots") },
      { label: "Atajadas", v: num("saves") },
      { label: "Goles evitados por el arquero", v: num("goalsPrevented"), fmt: dec("goalsPrevented") },
    ],
  },
  {
    title: "Duelos",
    defs: [
      { label: "Duelos ganados", v: (s) => s.duelWinPct, fmt: ratio("duelsWon", "duels") },
      { label: "Duelos por abajo ganados", v: num("groundDuelsWon") },
      { label: "Duelos aéreos ganados", v: num("aerialsWon") },
      { label: "Gambetas exitosas", v: num("wonContest"), fmt: ratio("wonContest", "totalContest") },
      { label: "Pérdidas de balón", v: num("dispossessed"), lowerIsBetter: true },
    ],
  },
  {
    title: "Disciplina",
    defs: [
      { label: "Faltas cometidas", v: num("foulsCommitted"), lowerIsBetter: true },
      { label: "Tarjetas amarillas", v: num("yellowCards"), lowerIsBetter: true },
      { label: "Tarjetas rojas", v: num("redCards"), lowerIsBetter: true },
    ],
  },
];

function statSections(h: Record<string, number>, a: Record<string, number>): StatSection[] {
  // Remates del equipo que bloqueó el rival = los "remates bloqueados" del rival.
  h = { ...h, blockedByRival: a.blockedShots };
  a = { ...a, blockedByRival: h.blockedShots };
  return SECTIONS.map((sec) => ({
    title: sec.title,
    rows: sec.defs
      .filter((d) => d.v(h) !== undefined && d.v(a) !== undefined)
      .map((d) => {
        const hv = d.v(h) ?? 0;
        const av = d.v(a) ?? 0;
        const show = (s: Record<string, number>, v: number) => (d.fmt ? d.fmt(s) : String(Math.round(v * 100) / 100));
        const better: StatRow["better"] = hv === av ? null : (hv > av) !== !!d.lowerIsBetter ? "home" : "away";
        return { label: d.label, home: show(h, hv), away: show(a, av), hv, av, better };
      }),
  })).filter((s) => s.rows.length);
}

// ── Jugadores ────────────────────────────────────────────────────────────────────────────────────────────────────
export type MatchPlayer = {
  id: string;
  name: string;
  number?: string;
  position: string; // en castellano
  line: "Arquero" | "Defensor" | "Mediocampista" | "Delantero";
  starter: boolean;
  side: "home" | "away";
  teamId: string;
  played: boolean;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
};

const lineOf = (abbr: string): MatchPlayer["line"] => {
  const p = abbr.toUpperCase();
  if (p === "G" || p === "GK") return "Arquero";
  if (/^(CD|CB|LB|RB|D|SW|LWB|RWB|WB)/.test(p)) return "Defensor";
  if (/^(F|CF|ST|LW|RW|LF|RF|SS)/.test(p)) return "Delantero";
  return "Mediocampista";
};

export type KeyPlayer = MatchPlayer & { stats: Record<string, number>; photo?: string };
export type KeyPlayers = Record<"Delantero" | "Mediocampista" | "Defensor", { home?: KeyPlayer; away?: KeyPlayer }>;

// ── Partido ──────────────────────────────────────────────────────────────────────────────────────────────────────
export type TimelineEvent = {
  minute: string;
  period: number; // 1 y 2: los tiempos; 3 y 4: el alargue
  sort: number; // para ordenar
  kind: "goal" | "own-goal" | "penalty-goal" | "penalty-miss" | "yellow" | "second-yellow" | "red" | "sub" | "var";
  side: "home" | "away";
  player?: { id?: string; name: string };
  other?: { id?: string; name: string }; // asistencia, o el que sale en un cambio
};

export type MatchPage = {
  league: string;
  id: string;
  competition: { id?: string; name: string };
  stage: string;
  date: string;
  venue?: string;
  status: { state: "pre" | "in" | "post"; detail: string; clock?: string };
  home: LiveTeam & { color: string; ink: string; score?: string; record?: string };
  away: LiveTeam & { color: string; ink: string; score?: string; record?: string };
  halftime?: { home: string; away: string };
  shootout?: { home: number; away: number };
  timeline: TimelineEvent[];
  summary: MatchSummary;
  sections: StatSection[];
  players: MatchPlayer[];
  keyPlayers: KeyPlayers;
  photos: Record<string, Photo>; // por número de jugador de ESPN
};

const KIND: [RegExp, TimelineEvent["kind"]][] = [
  [/own goal/i, "own-goal"],
  [/penalty.*(miss|saved)/i, "penalty-miss"],
  [/penalty.*(scored|goal)|goal.*penalty/i, "penalty-goal"],
  [/goal/i, "goal"],
  [/second yellow/i, "second-yellow"],
  [/red card/i, "red"],
  [/yellow/i, "yellow"],
  [/substitution/i, "sub"],
  [/var/i, "var"],
];

export async function matchPage(league: string, id: string): Promise<MatchPage> {
  const [j, summary] = await Promise.all([getJson(`${SITE}/${league}/summary?event=${id}`, 30), matchSummary(league, id)]);
  const comp = j.header?.competitions?.[0] ?? {};
  const cs: any[] = comp.competitors ?? [];
  const H = cs.find((c) => c.homeAway === "home") ?? cs[0];
  const A = cs.find((c) => c.homeAway === "away") ?? cs[1];
  const state = comp.status?.type?.state ?? "pre";
  const [hc, ac] = teamColors(H?.team, A?.team);
  const national = /^(fifa|uefa\.nations|uefa\.euro|conmebol\.america|.*worldq)/.test(league);
  const side = (teamId: unknown): "home" | "away" => (String(teamId) === String(H?.team?.id) ? "home" : "away");
  const mk = (c: any, color: string) => ({
    ...espnTeam(String(c?.team?.id), national ? countryEs(c?.team?.displayName) : (c?.team?.displayName ?? "—"), c?.team?.logos?.[0]?.href ?? c?.team?.logo),
    color,
    ink: inkOn(color),
    score: state === "pre" || offStatus(comp.status?.type?.name) ? undefined : c?.score,
    record: c?.record?.[0]?.displayValue,
  });

  // Estadísticas detalladas de los dos equipos; si no están, las del resumen.
  const revalidate = state === "post" ? 86400 : 30;
  const teamStats = (c: any) => coreStats(`${CORE}/leagues/${league}/events/${id}/competitions/${id}/competitors/${c?.team?.id}/statistics`, revalidate).catch(() => ({}));
  const [hs, as] = state === "pre" ? [{}, {}] : await Promise.all([teamStats(H), teamStats(A)]);
  const box = (sideName: "home" | "away") => Object.fromEntries(summary.stats.map((s) => [s.name, Number(s[sideName]) || 0]));
  const sections = state === "pre" ? [] : statSections({ ...box("home"), ...hs }, { ...box("away"), ...as });

  // Jugadores (con lo que trae el resumen: goles, asistencias y remates).
  const players: MatchPlayer[] = (j.rosters ?? []).flatMap((r: any) =>
    (r.roster ?? []).map((p: any) => {
      const st = Object.fromEntries((p.stats ?? []).map((s: any) => [s.name, Number(s.value ?? 0)]));
      return {
        id: String(p.athlete?.id),
        name: p.athlete?.displayName ?? "—",
        number: p.jersey ?? undefined,
        position: positionEs(p.position?.displayName ?? p.position?.name),
        line: lineOf(p.position?.abbreviation ?? ""),
        starter: !!p.starter,
        side: side(r.team?.id),
        teamId: String(r.team?.id),
        played: !!p.starter || !!p.subbedIn,
        goals: st.totalGoals ?? 0,
        assists: st.goalAssists ?? 0,
        shots: st.totalShots ?? 0,
        shotsOnTarget: st.shotsOnTarget ?? 0,
      } satisfies MatchPlayer;
    }),
  );

  // Fotos de los dos planteles (ESPN o Wikimedia Commons; lib/live/photos.ts).
  const [hPhotos, aPhotos] = await Promise.all([teamPhotos(league, String(H?.team?.id)).catch(() => ({})), teamPhotos(league, String(A?.team?.id)).catch(() => ({}))]);
  const photos: Record<string, Photo> = { ...hPhotos, ...aPhotos };

  // Jugadores clave: el mejor de cada equipo en cada línea (goles, asistencias, remates al arco), con sus estadísticas.
  const keyPlayers = { Delantero: {}, Mediocampista: {}, Defensor: {} } as KeyPlayers;
  if (state !== "pre") {
    const score = (p: MatchPlayer) => p.goals * 10 + p.assists * 6 + p.shotsOnTarget * 2 + p.shots + (p.starter ? 0.5 : 0);
    const picks: { line: keyof KeyPlayers; sideName: "home" | "away"; p: MatchPlayer }[] = [];
    for (const line of ["Delantero", "Mediocampista", "Defensor"] as const)
      for (const sideName of ["home", "away"] as const) {
        const best = players.filter((p) => p.played && p.side === sideName && p.line === line).sort((a, b) => score(b) - score(a))[0];
        if (best) picks.push({ line, sideName, p: best });
      }
    const stats = await Promise.all(picks.map(({ p }) => playerMatchStats(league, id, p.teamId, p.id, revalidate).catch(() => ({}))));
    picks.forEach(({ line, sideName, p }, i) => (keyPlayers[line][sideName] = { ...p, stats: stats[i], photo: photos[p.id]?.url }));
  }

  // Línea de tiempo: goles, tarjetas, cambios y VAR, con los jugadores.
  const timeline: TimelineEvent[] = (j.keyEvents ?? [])
    .map((k: any): TimelineEvent | null => {
      const kind = KIND.find(([re]) => re.test(k.type?.text ?? ""))?.[1];
      if (!kind || !k.team?.id) return null;
      const who = (n: number) => (k.participants?.[n]?.athlete ? { id: String(k.participants[n].athlete.id), name: k.participants[n].athlete.displayName } : undefined);
      const period = Number(k.period?.number ?? 1);
      return { minute: k.clock?.displayValue ?? "", period, sort: period * 100000 + Number(k.clock?.value ?? 0), kind, side: side(k.team.id), player: who(0), other: who(1) };
    })
    .filter(Boolean)
    .sort((a: TimelineEvent, b: TimelineEvent) => a.sort - b.sort);

  const firstHalf = (c: any) => c?.linescores?.[0]?.displayValue;
  const stageSlug = j.header?.season?.slug ? String(j.header.season.slug) : "";
  const phase = phaseLabel(stageSlug.split("---").pop());
  const stage = /apertura|clausura/i.test(j.header?.season?.name ?? "") ? `Torneo ${/apertura/i.test(j.header.season.name) ? "Apertura" : "Clausura"}` : phase;

  return {
    league,
    id,
    competition: competitionOf(league, j.header?.league?.name ?? ""),
    stage,
    date: comp.date,
    venue: j.gameInfo?.venue?.fullName,
    status: { state, detail: comp.status?.type?.shortDetail ?? "", clock: comp.status?.displayClock },
    home: mk(H, hc),
    away: mk(A, ac),
    halftime: firstHalf(H) !== undefined && firstHalf(A) !== undefined && state !== "pre" ? { home: firstHalf(H), away: firstHalf(A) } : undefined,
    shootout: H?.shootoutScore !== undefined && A?.shootoutScore !== undefined ? { home: Number(H.shootoutScore), away: Number(A.shootoutScore) } : undefined,
    timeline,
    summary,
    sections,
    players,
    keyPlayers,
    photos,
  };
}

// Estadísticas de un jugador en un partido.
export async function playerMatchStats(league: string, eventId: string, teamId: string, playerId: string, revalidate = 86400) {
  return coreStats(`${CORE}/leagues/${league}/events/${eventId}/competitions/${eventId}/competitors/${teamId}/roster/${playerId}/statistics/0`, revalidate);
}

// Foto de ESPN, si existe.
export async function headshot(playerId: string) {
  const url = `https://a.espncdn.com/i/headshots/soccer/players/full/${playerId}.png`;
  return fetch(url, { method: "HEAD", next: { revalidate: 86400 } })
    .then((r) => (r.ok ? url : undefined))
    .catch(() => undefined);
}
