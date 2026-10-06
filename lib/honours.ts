// Títulos más importantes de un club, para la portada de su página: los mundiales, los continentales, las ligas y la
// copa de su país. Salen de los datos del sitio (temporadas de la liga argentina, copas de la Conmebol, listas de la FIFA
// y campeones de cada competencia), nunca se cargan a mano.
import { championsOf, normName, titlesOf } from "./champions";
import { GROUPS, LIVE_CODE } from "./competitions";
import { CLUB_WORLD_CUP, FIFA_INTERCONTINENTAL, INTERCONTINENTAL, RECOPA, type ClubFinal } from "./data/world-titles";
import { ESPN_IDS } from "./live/espn";
import { CUP_COMPETITIONS, EXTRA_TITLES, INTL_COMPETITIONS, LEAGUE_TITLES, finalRows } from "./seasons";
import { FOREIGN_TEAMS } from "./teams";

export type Honour = { n: number; label: string; years?: number[] };

// Copa nacional de cada liga.
const CUP_OF: Record<string, string> = {
  "premier-league": "fa-cup",
  laliga: "copa-del-rey",
  "serie-a": "coppa-italia",
  bundesliga: "dfb-pokal",
  "ligue-1": "coupe-de-france",
  "primeira-liga": "taca-portugal",
  brasileirao: "copa-do-brasil",
  eredivisie: "copa-paises-bajos",
  "primera-chile": "copa-chile",
  "primera-colombia": "copa-colombia",
};

const COMP_NAME = Object.fromEntries(GROUPS.flatMap((g) => g.competitions.map((c) => [c.id, c.name])));
const CODE_TO_COMP = Object.fromEntries(Object.entries(LIVE_CODE).map(([id, code]) => [code, id]));

const COUNTRY_OF = Object.fromEntries(GROUPS.flatMap((g) => g.competitions.map((c) => [c.id, g.name])));

// Club del sitio (por su número de ESPN, o por su nombre y su país), para las listas que usan nuestros ids. El país
// evita confundir clubes con el mismo nombre: Liverpool de Inglaterra y de Uruguay, Barcelona de España y de Ecuador.
const plain = (name: string) => normName(name.replace(/\s*\([^)]*\)$/, ""));
function siteId(espnId: string, name: string, country?: string) {
  if (ESPN_IDS[espnId]) return ESPN_IDS[espnId];
  const same = FOREIGN_TEAMS.filter((t) => plain(t.name) === normName(name));
  return (country ? same.find((t) => t.country === country) : same.length === 1 ? same[0] : undefined)?.id;
}

const yearsIn = (list: ClubFinal[], id?: string) => (id ? list.filter((f) => f.championId === id).map((f) => f.year) : []);
const intlYears = (name: string, id?: string) => {
  const c = INTL_COMPETITIONS.find((x) => x.name === name);
  return id && c ? finalRows(c.editions).filter((r) => r.champion === id).map((r) => r.year) : [];
};
const cupYears = (name: string, id?: string) => {
  const c = CUP_COMPETITIONS.find((x) => x.name === name);
  return id && c ? finalRows(c.editions).filter((r) => r.champion === id).map((r) => r.year) : [];
};

// `league`: código de ESPN de la liga del club (arg.1, esp.1…).
export function honoursOf(espnId: string, name: string, league?: string): Honour[] {
  const leagueComp = league ? CODE_TO_COMP[league] : undefined;
  const id = siteId(espnId, name, leagueComp ? COUNTRY_OF[leagueComp] : undefined);
  const byList = (comp: string) => (championsOf(comp) ? titlesOf(comp, name) : 0);
  const out: (Honour & { rank: number })[] = [];
  const add = (rank: number, label: string, n: number, years?: number[]) => n > 0 && out.push({ rank, label, n, years });

  // Mundiales: la Intercontinental (1960–2004), el Mundial de Clubes y la Intercontinental de la FIFA (desde 2024).
  const ic = yearsIn(INTERCONTINENTAL, id);
  const cwc = yearsIn(CLUB_WORLD_CUP, id);
  const fic = yearsIn(FIFA_INTERCONTINENTAL, id);
  add(1, ic.length === 1 ? "Copa Intercontinental" : "Copas Intercontinentales", ic.length, ic);
  add(2, cwc.length === 1 ? "Mundial de Clubes" : "Mundiales de Clubes", cwc.length, cwc);
  add(3, "Intercontinental FIFA", fic.length, fic);

  // Continentales.
  const lib = intlYears("Copa Libertadores", id);
  add(4, lib.length === 1 ? "Copa Libertadores" : "Copas Libertadores", lib.length, lib);
  add(4, "Champions League", byList("champions"));
  add(4, "Concachampions", byList("concacaf-champions"));
  add(4, "Champions de Asia", byList("champions-asia"));
  add(4, "Champions de África", byList("champions-africa"));

  // Liga del país.
  if (league === "arg.1" || (id && ESPN_IDS[espnId])) {
    const n = LEAGUE_TITLES.filter((s) => id && s.championIds.includes(id)).length + EXTRA_TITLES.filter((t) => t.championId === id).length;
    add(5, n === 1 ? "Título de Primera" : "Títulos de Primera", n);
  } else if (leagueComp && championsOf(leagueComp)) {
    add(5, COMP_NAME[leagueComp] ?? "Liga", byList(leagueComp));
  }

  const sud = intlYears("Copa Sudamericana", id);
  add(6, sud.length === 1 ? "Copa Sudamericana" : "Copas Sudamericanas", sud.length, sud);
  add(6, "Europa League", byList("europa-league"));
  add(6, "Conference League", byList("conference-league"));
  const rec = yearsIn(RECOPA, id);
  add(7, rec.length === 1 ? "Recopa Sudamericana" : "Recopas Sudamericanas", rec.length, rec);
  add(7, "Supercopa de Europa", byList("supercopa-europa"));

  // Copa del país.
  if (league === "arg.1" || (id && ESPN_IDS[espnId])) {
    const ca = cupYears("Copa Argentina", id);
    add(8, ca.length === 1 ? "Copa Argentina" : "Copas Argentinas", ca.length, ca);
  } else if (leagueComp && CUP_OF[leagueComp]) {
    add(8, COMP_NAME[CUP_OF[leagueComp]] ?? "Copa", byList(CUP_OF[leagueComp]));
  }

  return out.sort((a, b) => a.rank - b.rank).map(({ rank: _rank, ...h }) => h);
}
