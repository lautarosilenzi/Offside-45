// Índice del buscador: competencias, secciones, clubes (argentinos, históricos y de todas las ligas con datos en vivo),
// temporadas y jugadores. Se arma en el servidor la primera vez que alguien busca y queda en memoria.
import { FEATURED, GROUPS, LIVE_CODE, compHref } from "./competitions";
import { CRESTS } from "./crests";
import { LEGENDS } from "./data/legends";
import { ESPN_IDS, leagueTeams } from "./live/espn";
import { LEAGUE_SEASONS, seasonTitle } from "./seasons";
import { FOREIGN_TEAMS, HISTORIC_TEAMS, TEAMS } from "./teams";

export type SearchKind = "Competencia" | "Sección" | "Club" | "Equipo" | "Temporada" | "Jugador";
// weight: a igual coincidencia, primero los de menor peso (los clubes de Primera antes que los históricos).
export type SearchItem = { kind: SearchKind; title: string; subtitle?: string; href: string; logo?: string; keywords?: string; weight?: number };

const SECTIONS: SearchItem[] = [
  { kind: "Sección", title: "Live: partidos en juego", href: "/live", keywords: "en vivo ahora directo" },
  { kind: "Sección", title: "Calendario", href: "/calendario", keywords: "fixture partidos hoy mañana ayer programación" },
  { kind: "Sección", title: "Inicio", href: "/", keywords: "portada home partidos de hoy" },
  { kind: "Sección", title: "Historial entre equipos", href: "/historiales", keywords: "cara a cara historiales clasicos" },
  { kind: "Sección", title: "Campeones del fútbol argentino", href: "/campeones", keywords: "titulos" },
  { kind: "Sección", title: "Temporadas de la liga argentina (desde 1891)", href: "/temporadas", keywords: "historia" },
  { kind: "Sección", title: "Descensos", href: "/descensos", keywords: "promedios" },
  { kind: "Sección", title: "Estadísticas", href: "/estadisticas" },
  { kind: "Sección", title: "Copas nacionales", href: "/copas" },
  { kind: "Sección", title: "Clubes argentinos en copas internacionales", href: "/internacionales" },
  { kind: "Sección", title: "Balón de Oro", href: "/balon-de-oro", keywords: "ballon dor premios" },
  { kind: "Sección", title: "Mundiales", href: "/mundiales", keywords: "copa del mundo" },
  { kind: "Sección", title: "Messi vs Cristiano", href: "/messi-vs-cristiano", keywords: "cr7 ronaldo comparacion" },
  { kind: "Sección", title: "Comparador de leyendas", href: "/jugadores", keywords: "jugadores comparar" },
  { kind: "Sección", title: "El foro del hincha", href: "/foro" },
];

// Equipos de ESPN de todas las competencias, una sola vez por equipo (en la primera competencia en que aparece, según
// el orden del menú: primero la liga, después las copas).
async function espnTeams(): Promise<SearchItem[]> {
  // Primero las ligas de cada país y después las copas internacionales y de selecciones: así el Real Madrid queda con
  // LaLiga y no con la Champions, y el Liverpool inglés con la Premier.
  const cups = ["internacional", "selecciones", "femenino"];
  const comps = [...GROUPS.filter((g) => !cups.includes(g.id)), ...GROUPS.filter((g) => cups.includes(g.id))].flatMap((g) =>
    g.competitions.filter((c) => LIVE_CODE[c.id]).map((c) => ({ g, c })),
  );
  const lists = await Promise.all(comps.map(({ c }) => leagueTeams(LIVE_CODE[c.id]).catch(() => [])));
  const seen = new Set<string>();
  const out: SearchItem[] = [];
  lists.forEach((teams, i) => {
    const { g, c } = comps[i];
    for (const t of teams) {
      if (!t.espnId || seen.has(t.espnId) || /^A confirmar$/.test(t.name)) continue;
      seen.add(t.espnId);
      out.push({ kind: "Equipo", title: t.name, subtitle: `${c.name} · ${g.name}`, href: `/torneos/${c.id}/equipo/${t.espnId}`, logo: t.logo, weight: 1 });
    }
  });
  return out;
}

let index: Promise<SearchItem[]> | null = null;
let builtAt = 0;

export function searchIndex(): Promise<SearchItem[]> {
  // Se rehace una vez por día (los planteles de las ligas cambian de temporada a temporada).
  if (!index || Date.now() - builtAt > 86400000) {
    builtAt = Date.now();
    index = (async () => {
      const competitions: SearchItem[] = [
        ...FEATURED.filter((c) => c.href).map((c) => ({ kind: "Competencia" as const, title: c.name, href: c.href!, subtitle: "Destacado" })),
        ...GROUPS.flatMap((g) => g.competitions.map((c) => ({ kind: "Competencia" as const, title: c.name, subtitle: g.name, href: compHref(g, c) }))),
      ];
      const espnOf = Object.fromEntries(Object.entries(ESPN_IDS).map(([espn, ours]) => [ours, espn]));
      const current = new Set(TEAMS.map((t) => t.id));
      const clubs: SearchItem[] = [...TEAMS, ...HISTORIC_TEAMS, ...FOREIGN_TEAMS].map((t) => ({
        kind: "Club",
        weight: current.has(t.id) ? 0 : 3,
        logo: CRESTS[t.id]?.file,
        title: t.name,
        subtitle: espnOf[t.id] ? "Liga Profesional · historial y campaña" : "Historial",
        href: espnOf[t.id] ? `/torneos/liga-profesional/equipo/${espnOf[t.id]}` : `/historiales?a=${t.id}`,
        keywords: [t.fullName, t.shortName].filter(Boolean).join(" "),
      }));
      const seasons: SearchItem[] = LEAGUE_SEASONS.map((s) => ({ kind: "Temporada", title: seasonTitle(s), href: `/temporadas/${s.slug}`, keywords: String(s.year) }));
      const players: SearchItem[] = LEGENDS.map((l) => ({
        kind: "Jugador",
        title: l.name,
        subtitle: `${l.country} · comparador de leyendas`,
        href: l.id === "messi" || l.id === "cristiano" ? `/jugadores?a=messi&b=cristiano` : `/jugadores?a=${l.id}&b=${l.id === "maradona" ? "messi" : "maradona"}`,
        logo: l.photo?.src,
      }));
      const teams = await espnTeams();
      // Sin repetir: si un club argentino ya está, no se suma otra vez desde ESPN.
      const ourNames = new Set(clubs.map((c) => norm(c.title)));
      const all = [...SECTIONS, ...competitions, ...clubs, ...teams.filter((t) => !ourNames.has(norm(t.title))), ...players, ...seasons];
      // Sin repetidos (una competencia está en Destacado y en su país; una sección puede ser también competencia).
      const seen = new Set<string>();
      return all.filter((it) => {
        const k = it.href;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    })();
  }
  return index;
}

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Puntaje: empieza igual > alguna palabra empieza igual > lo contiene; las palabras de la búsqueda tienen que estar todas.
export function search(items: SearchItem[], q: string, limit = 24): SearchItem[] {
  const query = norm(q);
  if (!query) return [];
  const words = query.split(" ");
  const KIND_ORDER: Record<SearchKind, number> = { Sección: 0, Competencia: 1, Club: 2, Equipo: 3, Jugador: 2, Temporada: 5 };
  return items
    .map((it) => {
      const title = norm(it.title);
      const hay = `${title} ${norm(it.keywords ?? "")} ${norm(it.subtitle ?? "")}`;
      if (!words.every((w) => hay.includes(w))) return null;
      const score = title === query ? 0 : title.startsWith(query) ? 1 : title.split(" ").some((w) => w.startsWith(words[0])) ? 2 : 3;
      return { it, score: score * 100 + (it.weight ?? 2) * 10 + KIND_ORDER[it.kind] };
    })
    .filter((x): x is { it: SearchItem; score: number } => !!x)
    .sort((a, b) => a.score - b.score || a.it.title.length - b.it.title.length)
    .slice(0, limit)
    .map((x) => x.it);
}
