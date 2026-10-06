// Perfil de un jugador y sus partidos de una temporada (ESPN). El registro de partidos sale de la ficha del jugador
// (una consulta por competencia, de su club y de su selección); el detalle de cada partido (minutos, titular, pases,
// quites…) de las estadísticas del partido, que ya no cambian una vez jugado.
import { GROUPS, LIVE_CODE } from "../competitions";
import { espnTeam, type LiveTeam } from "./espn";

const WEB = "https://site.web.api.espn.com/apis/common/v3/sports/soccer";
const CORE = "https://sports.core.api.espn.com/v2/sports/soccer";

async function getJson(url: string, revalidate: number) {
  const r = await fetch(url, { next: { revalidate } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

// Varias consultas a la vez, de a `n`.
async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

const POSITION: Record<string, string> = {
  Goalkeeper: "Arquero",
  Defender: "Defensor",
  Midfielder: "Mediocampista",
  Forward: "Delantero",
  "Center Back": "Defensor central",
  "Left Back": "Lateral izquierdo",
  "Right Back": "Lateral derecho",
  "Defensive Midfielder": "Mediocampista defensivo",
  "Center Midfielder": "Mediocampista central",
  "Attacking Midfielder": "Mediocampista ofensivo",
  "Left Midfielder": "Mediocampista por izquierda",
  "Right Midfielder": "Mediocampista por derecha",
  "Left Winger": "Extremo izquierdo",
  "Right Winger": "Extremo derecho",
  Striker: "Centrodelantero",
  "Center Forward": "Centrodelantero",
};
export const positionEs = (p?: string) => (p ? (POSITION[p] ?? p) : "");

const COUNTRY: Record<string, string> = {
  Argentina: "Argentina", Brazil: "Brasil", Uruguay: "Uruguay", Paraguay: "Paraguay", Chile: "Chile", Colombia: "Colombia", Peru: "Perú",
  Ecuador: "Ecuador", Bolivia: "Bolivia", Venezuela: "Venezuela", Mexico: "México", "United States": "Estados Unidos", Spain: "España",
  Italy: "Italia", Germany: "Alemania", France: "Francia", England: "Inglaterra", Portugal: "Portugal", Netherlands: "Países Bajos",
  Belgium: "Bélgica", Croatia: "Croacia", Morocco: "Marruecos", Japan: "Japón", Norway: "Noruega", Poland: "Polonia", Senegal: "Senegal",
  Nigeria: "Nigeria", Ghana: "Ghana", "Ivory Coast": "Costa de Marfil", Cameroon: "Camerún", Egypt: "Egipto", Turkey: "Turquía",
  Switzerland: "Suiza", Austria: "Austria", Denmark: "Dinamarca", Sweden: "Suecia", Scotland: "Escocia", Wales: "Gales", Serbia: "Serbia",
  Ukraine: "Ucrania", "South Korea": "Corea del Sur", Canada: "Canadá", "Saudi Arabia": "Arabia Saudita", Algeria: "Argelia", Greece: "Grecia",
  "Czech Republic": "Chequia", Czechia: "Chequia", Hungary: "Hungría", Romania: "Rumania", Slovenia: "Eslovenia", Slovakia: "Eslovaquia",
  Ireland: "Irlanda", "Republic of Ireland": "Irlanda", Australia: "Australia", "Costa Rica": "Costa Rica", Panama: "Panamá", Honduras: "Honduras",
  Jamaica: "Jamaica", Georgia: "Georgia", Albania: "Albania", Iran: "Irán", Tunisia: "Túnez", Mali: "Malí", "DR Congo": "RD del Congo",
};
export const countryEs = (c?: string) => (c ? (COUNTRY[c] ?? c) : "");

// Nombre de la competencia como figura en el menú del sitio; si no está, el de ESPN.
const COMP_NAME = new Map<string, { id: string; name: string }>();
for (const g of GROUPS) for (const c of g.competitions) if (LIVE_CODE[c.id] && !COMP_NAME.has(LIVE_CODE[c.id])) COMP_NAME.set(LIVE_CODE[c.id], { id: c.id, name: c.name });
const LEAGUE_ES: Record<string, string> = { "fifa.world": "Mundial", "fifa.friendly": "Amistosos", "conmebol.america": "Copa América", "fifa.worldq.conmebol": "Eliminatorias" };
export const competitionOf = (slug: string, fallback: string) => ({ id: COMP_NAME.get(slug)?.id, name: LEAGUE_ES[slug] ?? COMP_NAME.get(slug)?.name ?? fallback });

export type PlayerBio = {
  id: string;
  name: string;
  fullName?: string;
  position: string;
  jersey?: string;
  age?: number;
  birthDate?: string; // "29/6/1994"
  nationality: string;
  flag?: string;
  heightCm?: number;
  weightKg?: number;
  team?: LiveTeam;
  photo?: string;
  active: boolean;
};

// 5' 11" → 180 cm; 161 lbs → 73 kg.
const cm = (s?: string) => {
  const m = s?.match(/(\d+)'\s*(\d+)?/);
  return m ? Math.round(Number(m[1]) * 30.48 + Number(m[2] ?? 0) * 2.54) : undefined;
};
const kg = (s?: string) => {
  const m = s?.match(/([\d.]+)\s*lbs/);
  return m ? Math.round(Number(m[1]) * 0.4536) : undefined;
};

export async function playerBio(id: string): Promise<PlayerBio> {
  const a = (await getJson(`${WEB}/athletes/${id}`, 21600)).athlete;
  if (!a) throw new Error("Jugador desconocido");
  // ESPN no tiene foto de todos: se usa solo si existe.
  const photoUrl = `https://a.espncdn.com/i/headshots/soccer/players/full/${id}.png`;
  const photo = await fetch(photoUrl, { method: "HEAD", next: { revalidate: 86400 } })
    .then((r) => (r.ok ? photoUrl : undefined))
    .catch(() => undefined);
  return {
    id,
    name: a.displayName,
    fullName: a.fullName !== a.displayName ? a.fullName : undefined,
    position: positionEs(a.position?.displayName ?? a.position?.name),
    jersey: a.jersey ?? undefined,
    age: a.age ?? undefined,
    birthDate: a.displayDOB ?? undefined,
    nationality: countryEs(a.citizenship),
    flag: a.flag?.href,
    heightCm: cm(a.displayHeight),
    weightKg: kg(a.displayWeight),
    team: a.team ? espnTeam(String(a.team.id), a.team.displayName ?? a.team.name, a.team.logos?.[0]?.href) : undefined,
    photo,
    active: a.active !== false,
  };
}

export type MatchRow = {
  id: string;
  date: string;
  league: string; // slug de ESPN
  competition: { id?: string; name: string };
  team: string; // número de ESPN del equipo con el que jugó (club o selección)
  national: boolean;
  opponent: LiveTeam;
  home: boolean;
  goalsFor: number;
  goalsAgainst: number;
  result: "V" | "E" | "D";
  stats: Record<string, number>; // del registro: goles, asistencias, remates, tarjetas…
  detail?: Record<string, number>; // del partido: minutos, titular, pases…
};

export type PlayerSeason = {
  season: string;
  seasons: { value: string; label: string }[];
  teams: { id: string; name: string; logo: string; national: boolean }[];
  matches: MatchRow[];
};

type Gamelog = {
  filters?: { name: string; value: string; options: { value: string; displayValue: string }[] }[];
  names?: string[];
  events?: Record<string, any>;
  seasonTypes?: { categories?: { events?: { eventId: string; stats: string[] }[] }[] }[];
};

const logo = (teamId: string) => `https://a.espncdn.com/i/teamlogos/soccer/500/${teamId}.png`;

// Partidos del registro de una competencia.
function rows(g: Gamelog, league: string, team: string, national: boolean): MatchRow[] {
  const names = g.names ?? [];
  const out: MatchRow[] = [];
  for (const st of g.seasonTypes ?? [])
    for (const cat of st.categories ?? [])
      for (const ev of cat.events ?? []) {
        const e = g.events?.[ev.eventId];
        if (!e) continue;
        const home = String(e.homeTeamId) === team;
        const hs = Number(e.homeTeamScore ?? 0);
        const as = Number(e.awayTeamScore ?? 0);
        const gf = home ? hs : as;
        const ga = home ? as : hs;
        out.push({
          id: String(ev.eventId),
          date: e.gameDate,
          league,
          competition: competitionOf(league, e.leagueShortName ?? e.leagueName ?? league),
          team,
          national,
          opponent: espnTeam(String(e.opponent?.id), national ? countryEs(e.opponent?.displayName) : (e.opponent?.displayName ?? "—"), e.opponent?.logo),
          home,
          goalsFor: gf,
          goalsAgainst: ga,
          // El resultado de ESPN considera los penales; el marcador, no.
          result: e.gameResult === "W" ? "V" : e.gameResult === "L" ? "D" : gf > ga ? "V" : gf < ga ? "D" : "E",
          stats: Object.fromEntries(names.map((n, i) => [n, Number(ev.stats[i] ?? 0)])),
        });
      }
  return out;
}

// Estadísticas de un partido: minutos, titular, pases, quites, duelos, atajadas…
const DETAIL = [
  "minutes", "starts", "subIns", "totalPasses", "accuratePasses", "passPct", "totalTackles", "interceptions", "duelsWon", "duels",
  "touches", "expectedGoals", "expectedAssists", "saves", "goalsConceded", "cleanSheet", "shotsOnTarget", "totalShots", "bigChanceCreated",
  "ballRecovery", "accurateCrosses", "totalCrosses", "wonContest", "totalContest",
];
async function matchDetail(r: MatchRow, playerId: string): Promise<Record<string, number> | undefined> {
  try {
    const j = await getJson(`${CORE}/leagues/${r.league}/events/${r.id}/competitions/${r.id}/competitors/${r.team}/roster/${playerId}/statistics/0`, 86400);
    const all: Record<string, number> = {};
    for (const c of j.splits?.categories ?? []) for (const s of c.stats ?? []) all[s.name] = Number(s.value ?? 0);
    return Object.fromEntries(DETAIL.filter((k) => k in all).map((k) => [k, all[k]]));
  } catch {
    return undefined;
  }
}

export async function playerSeason(id: string, season?: string): Promise<PlayerSeason> {
  const q = season ? `?season=${season}` : "";
  const first: Gamelog = await getJson(`${WEB}/athletes/${id}/gamelog${q}`, 3600);
  const f = (name: string) => first.filters?.find((x) => x.name === name);
  const seasonValue = f("season")?.value ?? season ?? "";
  const club = f("team")?.value ?? "";
  const teamOptions = f("team")?.options ?? [];

  // Selección: la opción de equipo que es un país (su nombre está en la lista de países conocidos).
  const nationOption = teamOptions.find((o) => o.value !== club && COUNTRY[o.displayValue]);
  const fetchAll = async (team: string, national: boolean, base?: Gamelog) => {
    const g = base ?? ((await getJson(`${WEB}/athletes/${id}/gamelog?season=${seasonValue}&team=${team}`, 3600).catch(() => ({}))) as Gamelog);
    const leagues = g.filters?.find((x) => x.name === "league");
    const defaultLeague = leagues?.value ?? "";
    const others = (leagues?.options ?? []).map((o) => o.value).filter((v) => v !== defaultLeague);
    const more = await Promise.all(
      others.map((lg) => getJson(`${WEB}/athletes/${id}/gamelog?season=${seasonValue}&team=${team}&league=${lg}`, 3600).catch(() => ({})) as Promise<Gamelog>),
    );
    return [rows(g, defaultLeague, team, national), ...more.map((m, i) => rows(m, others[i], team, national))].flat();
  };
  const [clubRows, nationRows] = await Promise.all([fetchAll(club, false, first), nationOption ? fetchAll(nationOption.value, true) : Promise.resolve([])]);

  // La selección se cuenta por año calendario y los clubes europeos por temporada (2026-27 empieza en agosto): de la
  // selección van solo los partidos desde que empezó la temporada del club.
  const start = clubRows.reduce((d, r) => (r.date < d ? r.date : d), "9999");
  const from = start === "9999" ? "" : new Date(Date.parse(start) - 30 * 86400000).toISOString();
  // Sin repetir y del más reciente al más viejo.
  const byId = new Map<string, MatchRow>();
  for (const r of [...clubRows, ...nationRows.filter((r) => r.date >= from)]) byId.set(`${r.team}-${r.id}`, r);
  const matches = [...byId.values()].sort((a, b) => b.date.localeCompare(a.date));
  const details = await pool(matches, 16, (r) => matchDetail(r, id));
  matches.forEach((r, i) => (r.detail = details[i]));

  return {
    season: seasonValue,
    seasons: (f("season")?.options ?? []).slice(0, 4).map((o) => ({ value: o.value, label: o.displayValue })),
    teams: teamOptions.map((o) => ({ id: o.value, name: COUNTRY[o.displayValue] ?? o.displayValue, logo: logo(o.value), national: !!COUNTRY[o.displayValue] })),
    matches,
  };
}
