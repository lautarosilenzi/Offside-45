// Resultados en vivo y tablas desde la API pública de ESPN (site.api.espn.com): gratis y sin clave, pero no es oficial
// y puede cambiar sin aviso. Sirve para arrancar; más adelante se puede pasar a API-Football con una clave propia
// (las páginas solo usan los tipos de acá).
import { getTeam } from "../teams";

export type LiveTeam = { name: string; short: string; logo?: string; teamId?: string; score?: string; winner?: boolean };
export type LiveEvent = {
  id: string;
  date: string; // ISO
  state: "pre" | "in" | "post";
  detail: string; // "FT", "45'+2'", "Halftime", "Scheduled"…
  clock?: string;
  home: LiveTeam;
  away: LiveTeam;
  venue?: string;
  round?: string;
  incidents: { minute: string; type: "goal" | "own-goal" | "penalty" | "yellow" | "red"; player: string; side: "home" | "away" }[];
};
export type LiveTableRow = { pos: number; team: LiveTeam; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number };
export type LiveTable = { name: string; rows: LiveTableRow[] };

const BASE = "https://site.api.espn.com/apis";

// Equipos argentinos de ESPN → club del sitio (para usar nuestros escudos y enlazar el historial).
const ESPN_IDS: Record<string, string> = {
  "3": "argentinos", "4": "belgrano", "5": "boca", "8": "estudiantes", "9": "gimnasia", "10": "huracan", "11": "independiente",
  "12": "lanus", "14": "newells", "15": "racing", "16": "river", "17": "central", "18": "sanlorenzo", "19": "talleres",
  "20": "union-santa-fe", "21": "velez", "235": "banfield", "2975": "instituto", "7764": "platense", "7767": "tigre",
  "8950": "defensa-y-justicia", "9739": "aldosivi", "9744": "independiente-rivadavia", "9785": "atletico-tucuman",
  "10060": "barracas-central", "10158": "sarmiento-junin", "11972": "gimnasia-mendoza", "11989": "central-cordoba-sde",
  "17702": "deportivo-riestra", "19685": "estudiantes-rio-cuarto",
};

function team(t: any, score?: string, winner?: boolean): LiveTeam {
  const teamId = ESPN_IDS[t?.id];
  const ours = teamId ? getTeam(teamId) : undefined;
  return {
    name: ours?.name ?? t?.displayName ?? t?.name ?? "—",
    short: ours?.shortName ?? t?.abbreviation ?? "",
    logo: t?.logo ?? t?.logos?.[0]?.href,
    teamId,
    score,
    winner,
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

// Partidos de una competencia en una fecha (yyyymmdd; sin fecha, los de hoy según ESPN).
export async function scoreboard(league: string, date?: string): Promise<LiveEvent[]> {
  const j = await getJson(`${BASE}/site/v2/sports/soccer/${league}/scoreboard${date ? `?dates=${date}` : ""}`, 30);
  return (j.events ?? []).map((e: any): LiveEvent => {
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
      home: team(h?.team, state === "pre" ? undefined : h?.score, h?.winner),
      away: team(a?.team, state === "pre" ? undefined : a?.score, a?.winner),
      venue: c.venue?.fullName,
      round: e.season?.slug ?? undefined,
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
  });
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
        };
      });
      rows.sort((a, b) => a.pos - b.pos || b.points - a.points);
      return { name: (g.name ?? "").replace(/^Group /, "Zona "), rows };
    })
    .filter((t) => t.rows.length);
}
