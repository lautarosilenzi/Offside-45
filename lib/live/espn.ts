// Resultados en vivo y tablas desde la API pública de ESPN (site.api.espn.com): gratis y sin clave, pero no es oficial
// y puede cambiar sin aviso. Sirve para arrancar; más adelante se puede pasar a API-Football con una clave propia
// (las páginas solo usan los tipos de acá).
import { getTeam } from "../teams";
import { parseOdds, type Odds } from "./odds";

// espnId: id del equipo en ESPN (para la ficha del equipo); teamId: club del sitio, si es argentino.
export type LiveTeam = { name: string; short: string; logo?: string; teamId?: string; espnId?: string; score?: string; winner?: boolean; shootout?: number };
export type LiveEvent = {
  id: string;
  date: string; // ISO
  state: "pre" | "in" | "post";
  detail: string; // "FT", "45'+2'", "Halftime", "Scheduled"…
  clock?: string;
  home: LiveTeam;
  away: LiveTeam;
  venue?: string;
  round?: string; // fase, como la publica ESPN ("group-stage", "round-of-16", "torneo-clausura"…)
  stage?: string; // torneo dentro de la temporada ("torneo-clausura", "clausura"…), como lo publica ESPN
  group?: string; // zona o grupo ("Group A")
  odds?: Odds; // cuotas, si la fuente las publica (partidos por jugarse)
  incidents: { minute: string; type: "goal" | "own-goal" | "penalty" | "yellow" | "red"; player: string; side: "home" | "away" }[];
};
export type LiveTableRow = {
  pos: number;
  team: LiveTeam;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  // Zona de la tabla (clasificación, descenso…) con su color, cuando la fuente la informa.
  note?: { color: string; description: string };
};
export type LiveTable = { name: string; rows: LiveTableRow[] };

const BASE = "https://site.api.espn.com/apis";

// Equipos argentinos de ESPN → club del sitio (para usar nuestros escudos y enlazar el historial).
export const ESPN_IDS: Record<string, string> = {
  "3": "argentinos", "4": "belgrano", "5": "boca", "8": "estudiantes", "9": "gimnasia", "10": "huracan", "11": "independiente",
  "12": "lanus", "14": "newells", "15": "racing", "16": "river", "17": "central", "18": "sanlorenzo", "19": "talleres",
  "20": "union-santa-fe", "21": "velez", "235": "banfield", "2975": "instituto", "7764": "platense", "7767": "tigre",
  "8950": "defensa-y-justicia", "9739": "aldosivi", "9744": "independiente-rivadavia", "9785": "atletico-tucuman",
  "10060": "barracas-central", "10158": "sarmiento-junin", "11972": "gimnasia-mendoza", "11989": "central-cordoba-sde",
  "17702": "deportivo-riestra", "19685": "estudiantes-rio-cuarto",
};

function team(t: any, score?: string, winner?: boolean, shootout?: number): LiveTeam {
  const teamId = ESPN_IDS[t?.id];
  const ours = teamId ? getTeam(teamId) : undefined;
  return {
    // Los cruces todavía sin definir llegan como "TBD Home" / "TBD Away".
    name: ours?.name ?? (/^TBD/i.test(t?.displayName ?? "") ? "A confirmar" : t?.displayName ?? t?.name ?? "—"),
    short: ours?.shortName ?? t?.abbreviation ?? "",
    logo: t?.logo ?? t?.logos?.[0]?.href,
    teamId,
    espnId: t?.id ? String(t.id) : undefined,
    score,
    winner,
    shootout,
  };
}

function incidentType(text: string, d: any): LiveEvent["incidents"][number]["type"] | null {
  if (d.ownGoal) return "own-goal";
  if (d.penaltyKick && d.scoringPlay) return "penalty";
  if (d.scoringPlay) return "goal";
  if (d.redCard) return "red";
  if (d.yellowCard) return "yellow";
  if (/goal/i.test(text)) return "goal";
  return null;
}

async function getJson(url: string, revalidate: number) {
  const r = await fetch(url, { next: { revalidate } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

const shoot = (x: any) => (x?.shootoutScore === undefined || x?.shootoutScore === null ? undefined : Number(x.shootoutScore));

function toEvent(e: any): LiveEvent {
  const c = e.competitions?.[0] ?? {};
  const comps: any[] = c.competitors ?? [];
  const h = comps.find((x) => x.homeAway === "home") ?? comps[0];
  const a = comps.find((x) => x.homeAway === "away") ?? comps[1];
  const state = e.status?.type?.state ?? "pre";
  return {
    id: String(e.id),
    date: e.date,
    state,
    detail: e.status?.type?.shortDetail ?? "",
    clock: e.status?.displayClock,
    home: team(h?.team, state === "pre" ? undefined : h?.score, h?.winner, shoot(h)),
    away: team(a?.team, state === "pre" ? undefined : a?.score, a?.winner, shoot(a)),
    venue: c.venue?.fullName,
    // "apertura---round-of-16" → "round-of-16": la fase sin el nombre del torneo.
    round: e.season?.slug ? String(e.season.slug).split("---").pop() : undefined,
    stage: e.season?.slug ? String(e.season.slug).split("---")[0] : undefined,
    group: c.group?.name ? String(c.group.name).replace(/^Group /, "Zona ") : undefined,
    odds: state === "pre" ? parseOdds(c.odds?.[0]) : undefined,
    incidents: (c.details ?? [])
        .map((d: any) => {
          const type = incidentType(d.type?.text ?? "", d);
          if (!type) return null;
          return {
            minute: d.clock?.displayValue ?? "",
            type,
            player: (d.athletesInvolved ?? []).map((p: any) => p.displayName).join(", "),
            side: d.team?.id === h?.team?.id ? "home" : "away",
          };
        })
        .filter(Boolean),
  };
}

// Partidos de una competencia en una fecha (yyyymmdd; sin fecha, los de hoy según ESPN).
export async function scoreboard(league: string, date?: string): Promise<LiveEvent[]> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/scoreboard${date ? `?dates=${date}` : ""}`, 30);
  return (j.events ?? []).map(toEvent);
}

// Todos los partidos de la temporada en curso. ESPN no acepta rangos de días, pero sí meses (yyyymm): se pide cada mes
// entre la primera y la última fecha del calendario de la temporada. Se refresca cada 5 minutos.
// En la Argentina el año tiene dos torneos (Apertura y Clausura) bajo la misma temporada: `events` trae solo el que se está
// jugando (con sus playoffs) y `all`, los del año entero (para la tabla anual).
export async function seasonEvents(league: string): Promise<{ name: string; label: string; events: LiveEvent[]; all: LiveEvent[] }> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/scoreboard`, 300);
  const lg = j.leagues?.[0] ?? {};
  // El calendario es una lista de días o, en las copas, de etapas con su comienzo y su fin.
  const days: string[] = (lg.calendar ?? []).flatMap((d: any) => (typeof d === "string" ? [d] : [d?.startDate, d?.endDate])).filter(Boolean).sort();
  const start = new Date(lg.calendarStartDate ?? days[0] ?? lg.season?.startDate ?? Date.now());
  const end = new Date(lg.calendarEndDate ?? days[days.length - 1] ?? lg.season?.endDate ?? Date.now());
  const months: string[] = [];
  for (let d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)); d <= end && months.length < 14; d.setUTCMonth(d.getUTCMonth() + 1)) {
    months.push(`${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  const pages = await Promise.all(months.map((m) => getJson(`${BASE}/site/v2/sports/soccer/${league}/scoreboard?dates=${m}`, 300).catch(() => ({ events: [] }))));
  const byId = new Map<string, LiveEvent>();
  for (const p of pages) for (const e of p.events ?? []) byId.set(String(e.id), toEvent(e));
  const all = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
  const stage = String(lg.season?.type?.name ?? "").toLowerCase().match(/apertura|clausura/)?.[0];
  const events = stage && all.some((e) => e.stage?.includes(stage)) ? all.filter((e) => e.stage?.includes(stage)) : all;
  return { name: lg.season?.type?.name ?? lg.season?.displayName ?? "", label: lg.season?.displayName ?? "", events, all };
}

export type Leader = { name: string; team: LiveTeam; matches: number; value: number };

// Goleadores y asistidores de la temporada.
export async function leaders(league: string): Promise<{ goals: Leader[]; assists: Leader[] }> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/statistics`, 3600);
  const pick = (name: string): Leader[] =>
    ((j.stats ?? []).find((s: any) => s.name === name)?.leaders ?? []).map((l: any) => ({
      name: l.athlete?.displayName ?? "—",
      team: team(l.athlete?.team ?? l.team),
      matches: Number((String(l.displayValue).match(/Matches:\s*(\d+)/) ?? [])[1] ?? 0),
      value: Number(l.value ?? 0),
    }));
  return { goals: pick("goalsLeaders"), assists: pick("assistsLeaders") };
}

export type RosterPlayer = { id: string; name: string; number?: string; position: string; age?: number; nationality?: string; photo?: string };

// Plantel de un equipo (puede venir vacío para algunas ligas).
export async function roster(league: string, espnTeamId: string): Promise<{ team: LiveTeam; coach?: string; players: RosterPlayer[] }> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/teams/${espnTeamId}/roster`, 21600);
  const coach = j.coach?.[0];
  return {
    team: team(j.team),
    coach: coach ? [coach.firstName, coach.lastName].filter(Boolean).join(" ") : undefined,
    players: (j.athletes ?? []).map((a: any) => ({
      id: String(a.id),
      name: a.displayName ?? a.fullName ?? "—",
      number: a.jersey ?? undefined,
      position: a.position?.displayName ?? a.position?.name ?? "",
      age: a.age ?? undefined,
      nationality: a.citizenship ?? a.birthPlace?.country ?? undefined,
      photo: a.headshot?.href ?? undefined,
    })),
  };
}

// Tabla (o tablas, si hay zonas) de una competencia.
export async function standings(league: string): Promise<LiveTable[]> {
  const j = await getJson(`${BASE}/v2/sports/soccer/${league}/standings`, 120);
  const groups: any[] = j.children?.length ? j.children : j.standings ? [j] : [];
  return groups
    .map((g) => {
      const rows: LiveTableRow[] = (g.standings?.entries ?? []).map((e: any) => {
        const s = Object.fromEntries((e.stats ?? []).map((x: any) => [x.name, Number(x.value ?? x.displayValue)]));
        return {
          pos: s.rank || 0,
          team: team(e.team),
          played: s.gamesPlayed || 0,
          won: s.wins || 0,
          drawn: s.ties || 0,
          lost: s.losses || 0,
          gf: s.pointsFor || 0,
          ga: s.pointsAgainst || 0,
          points: s.points || 0,
          note: e.note?.color ? { color: `#${String(e.note.color).replace(/^#+/, "")}`, description: e.note.description ?? "" } : undefined,
        };
      });
      rows.sort((a, b) => a.pos - b.pos || b.points - a.points);
      return { name: (g.name ?? "").replace(/^Group /, "Zona "), rows };
    })
    .filter((t) => t.rows.length);
}

// Equipos de una competencia (para el buscador). Se refresca una vez por día.
export async function leagueTeams(league: string): Promise<LiveTeam[]> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/teams`, 86400);
  return (j.sports?.[0]?.leagues?.[0]?.teams ?? []).map((x: any) => team(x.team));
}

// Detalle de un partido: formaciones, incidencias, estadísticas, relato y cuotas.
export type LineupPlayer = { name: string; number?: string; position: string; place?: number; subbedIn?: boolean; subbedOut?: boolean };
export type Lineup = { team: LiveTeam; side: "home" | "away"; formation?: string; starters: LineupPlayer[]; subs: LineupPlayer[] };
export type KeyEvent = { minute: string; type: string; text: string; side?: "home" | "away" };
export type MatchSummary = {
  lineups: Lineup[];
  keyEvents: KeyEvent[];
  stats: { name: string; home: string; away: string }[];
  commentary: { minute: string; text: string; type: string }[];
  odds?: Odds;
  status: { state: "pre" | "in" | "post"; detail: string; clock?: string };
  score?: { home: string; away: string };
};

export async function matchSummary(league: string, eventId: string): Promise<MatchSummary> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/summary?event=${eventId}`, 30);
  const comp = j.header?.competitions?.[0] ?? {};
  const homeId = String(comp.competitors?.find((c: any) => c.homeAway === "home")?.team?.id ?? "");
  const sideOf = (teamId?: unknown) => (teamId === undefined ? undefined : String(teamId) === homeId ? "home" : "away");
  const player = (p: any): LineupPlayer => ({
    name: p.athlete?.displayName ?? "—",
    number: p.jersey ?? undefined,
    position: p.position?.abbreviation ?? "",
    place: p.formationPlace ? Number(p.formationPlace) : undefined,
    subbedIn: !!p.subbedIn,
    subbedOut: !!p.subbedOut,
  });
  const box: any[] = j.boxscore?.teams ?? [];
  const boxHome = box.find((t) => String(t.team?.id) === homeId) ?? box[0];
  const boxAway = box.find((t) => t !== boxHome);
  const stat = (t: any, name: string) => t?.statistics?.find((s: any) => s.name === name)?.displayValue ?? "";
  const competitor = (side: string) => comp.competitors?.find((c: any) => c.homeAway === side);
  return {
    lineups: (j.rosters ?? []).map((r: any) => ({
      team: team(r.team),
      side: sideOf(r.team?.id) ?? "home",
      formation: r.formation ?? undefined,
      starters: (r.roster ?? []).filter((p: any) => p.starter).map(player),
      subs: (r.roster ?? []).filter((p: any) => !p.starter).map(player),
    })),
    keyEvents: (j.keyEvents ?? []).map((k: any) => ({
      minute: k.clock?.displayValue ?? "",
      type: k.type?.text ?? "",
      text: k.text ?? "",
      side: sideOf(k.team?.id),
    })),
    stats: boxHome && boxAway ? (boxHome.statistics ?? []).map((s: any) => ({ name: s.name, home: s.displayValue, away: stat(boxAway, s.name) })) : [],
    commentary: (j.commentary ?? []).map((c: any) => ({ minute: c.time?.displayValue ?? "", text: c.text ?? "", type: c.play?.type?.text ?? "" })),
    odds: parseOdds((j.pickcenter ?? [])[0] ?? (j.odds ?? [])[0]),
    status: { state: comp.status?.type?.state ?? "pre", detail: comp.status?.type?.shortDetail ?? "", clock: comp.status?.displayClock },
    score: competitor("home") ? { home: competitor("home")?.score ?? "", away: competitor("away")?.score ?? "" } : undefined,
  };
}
