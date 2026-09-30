// Copas de la Conmebol: una temporada por edición con los partidos de los clubes argentinos. Los datos los arma
// scripts/import/intl/conmebol.ts (RSSSF por club + RSSSF por edición + Wikipedia) en scripts/import/data/<copa>.json.
import { readFileSync } from "fs";
import { join } from "path";
import { getTeam } from "../../lib/teams";
import type { Match, SeasonNote } from "../../lib/types";
import type { TournamentConfig } from "./config";
import type { IntlEdition } from "./intl/conmebol";

const CONMEBOL = "Confederación Sudamericana de Fútbol (Conmebol)";

type Series = {
  key: string;
  name: string; // nombre de la serie en el sitio (título sin el año)
  officialName: (year: number) => string;
  clubPage: string;
  editionPage: (year: number) => string | null; // página de RSSSF de la edición (en .cache/rsssf/sacups)
  wiki: (year: number) => string;
  formato: (year: number) => string;
};

// Orden de las fases: para saber hasta dónde llegó cada club.
const ROUNDS = [
  "Fase previa",
  "Fase previa (segunda ronda)",
  "Fase previa (tercera ronda)",
  "Primera ronda",
  "Segunda ronda",
  "Fase de grupos",
  "Desempate por el segundo puesto del grupo",
  "Desempate por el primer puesto del grupo",
  "Playoffs de octavos",
  "Octavos de final",
  "Cuartos de final",
  "Semifinal",
  "Semifinal (desempate)",
  "Final",
];
const REACHED: Record<string, string> = {
  "Fase previa": "fase previa",
  "Fase previa (segunda ronda)": "fase previa",
  "Fase previa (tercera ronda)": "fase previa",
  "Primera ronda": "primera ronda",
  "Segunda ronda": "segunda ronda",
  "Playoffs de octavos": "playoffs de octavos",
  "Fase de grupos": "fase de grupos",
  "Desempate por el segundo puesto del grupo": "fase de grupos",
  "Desempate por el primer puesto del grupo": "fase de grupos",
  "Octavos de final": "octavos",
  "Cuartos de final": "cuartos",
  "Semifinal": "semifinal",
  "Semifinal (desempate)": "semifinal",
  Final: "final",
};

const nameOf = (id: string) => getTeam(id)?.name ?? id;
const isArg = (id: string) => !!getTeam(id) && !getTeam(id)!.country;

function editions(series: Series): TournamentConfig[] {
  const data: IntlEdition[] = JSON.parse(readFileSync(join(process.cwd(), "scripts", "import", "data", `${series.key}.json`), "utf8"));
  return data.map((e) => {
    const slug = `${series.key}-${e.year}`;
    const finals = e.matches.filter((m) => m.stage === "Final").sort((a, b) => a.date.localeCompare(b.date));
    const finalStage = (i: number) => (finals.length === 1 ? "Final" : ["Final (ida)", "Final (vuelta)", "Final (desempate)"][i] ?? "Final (desempate)");
    const matches: Match[] = e.matches.map((m) => {
      const fi = finals.indexOf(m);
      const out: Match = {
        id: m.id.replace(`${series.key}-`, `${slug}-`).replace(`${slug}-${e.year}-`, `${slug}-`),
        date: m.date,
        competition: series.name,
        stage: fi >= 0 ? finalStage(fi) : m.stage,
        phase: "cup",
        venue: m.venue,
        homeId: m.homeId,
        awayId: m.awayId,
        homeGoals: m.homeGoals,
        awayGoals: m.awayGoals,
        ...(m.advancedId && { advancedId: m.advancedId }),
        ...(m.awardedTo && { awardedTo: m.awardedTo, goalsVoid: true }),
        ...(m.note && { note: m.note }),
        ...(m.suspended && { status: "annulled" as const }),
        sources: m.check === "wikipedia" ? ["rsssf", "wikipedia-es"] : ["rsssf"],
      };
      return out;
    });
    // En la última final, quién se llevó la copa (por global, desempate o penales).
    const lastFinal = matches.filter((m) => /^Final/.test(m.stage ?? "")).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    if (lastFinal && !lastFinal.awardedTo) {
      const w = lastFinal.homeGoals > lastFinal.awayGoals ? lastFinal.homeId : lastFinal.awayGoals > lastFinal.homeGoals ? lastFinal.awayId : null;
      if (w !== e.championId) lastFinal.advancedId = e.championId;
    }

    // Hasta dónde llegó cada club argentino.
    const reached = new Map<string, number>();
    for (const m of matches)
      for (const id of [m.homeId, m.awayId].filter(isArg)) {
        const r = ROUNDS.indexOf((m.stage ?? "").replace(/ \((ida|vuelta|desempate)\)$/, ""));
        reached.set(id, Math.max(reached.get(id) ?? -1, r));
      }
    const clubs = [...reached.entries()]
      .sort((a, b) => b[1] - a[1] || +(b[0] === e.championId) - +(a[0] === e.championId) || nameOf(a[0]).localeCompare(nameOf(b[0])))
      .map(([id, r]) => {
        const where = id === e.championId ? "campeón" : id === e.runnerUpId ? "finalista" : REACHED[ROUNDS[r]] ?? "fase de grupos";
        return `${nameOf(id)} (${where})`;
      });
    const champ = nameOf(e.championId);
    const summary = `${isArg(e.championId) ? "Campeón argentino: " : "Campeón: "}${champ}; finalista: ${nameOf(e.runnerUpId)}. Clubes argentinos: ${clubs.join(", ")}.`;

    const notes: SeasonNote[] = [
      { kind: "formato", text: series.formato(e.year) },
      {
        kind: "fuentes",
        text: "Solo están los partidos de los clubes argentinos. Salen de la página de RSSSF de los clubes argentinos en la copa y se controlan contra la página de RSSSF de la edición (que además dice quién fue local) y contra Wikipedia.",
      },
    ];
    const page = series.editionPage(e.year);
    return {
      slug,
      kind: "cup",
      international: true,
      year: e.year,
      file: `sacups/${page ?? series.clubPage}`,
      competition: series.name,
      title: `${series.name} ${e.year}`,
      tournament: `${series.officialName(e.year)} ${e.year}`,
      organizer: CONMEBOL,
      championIds: [e.championId],
      runnerUpIds: [e.runnerUpId],
      skip: () => true,
      extraMatches: matches,
      summary,
      notes,
      sourceLinks: [
        ...(page ? [{ label: `RSSSF – ${series.name} ${e.year}`, url: `https://www.rsssf.org/sacups/${page}` }] : []),
        { label: `RSSSF – Clubes argentinos en la ${series.name}`, url: `https://www.rsssf.org/sacups/${series.clubPage}` },
        { label: `Wikipedia – ${series.wiki(e.year)}`, url: `https://es.wikipedia.org/wiki/${encodeURIComponent(series.wiki(e.year).replace(/ /g, "_"))}` },
      ],
      manualOnly: true,
      noFinal: !finals.length,
      noEliminationCheck: true,
    };
  });
}

const LIBERTADORES: Series = {
  key: "libertadores",
  name: "Copa Libertadores",
  officialName: (y) => (y <= 1964 ? "Copa de Campeones de América" : "Copa Libertadores de América"),
  clubPage: "copalibarg.html",
  editionPage: (y) => (y > 2024 ? null : y < 2010 ? `copa${String(y).slice(2)}.html` : `copa${y}.html`),
  wiki: (y) => (y <= 1964 ? `Copa de Campeones de América ${y}` : `Copa Libertadores ${y}`),
  formato: (y) =>
    y <= 1961
      ? "Eliminación directa a dos partidos entre los campeones de cada país, con desempate en cancha neutral."
      : y <= 1987
        ? "Grupos por países y después semifinales en grupos de tres; final a dos partidos, con desempate en cancha neutral si cada uno ganaba uno."
        : y <= 2007
          ? "Fase de grupos y eliminación directa a dos partidos; los empates en la serie se definían por penales."
          : y <= 2018
            ? "Fase previa, fase de grupos y eliminación directa a dos partidos, con penales si la serie terminaba igualada."
            : "Fases previas, fase de grupos y eliminación directa a dos partidos; desde 2019, final a partido único en cancha neutral.",
};

const SUDAMERICANA: Series = {
  key: "sudamericana",
  name: "Copa Sudamericana",
  officialName: () => "Copa Sudamericana",
  clubPage: "sudamcup-arg.html",
  editionPage: (y) => (y > 2024 ? null : y < 2010 ? `sudamcup${String(y).slice(2)}.html` : `sudamcup${y}.html`),
  wiki: (y) => `Copa Sudamericana ${y}`,
  formato: (y) =>
    y <= 2016
      ? "Eliminación directa a dos partidos desde la primera ronda, con penales si la serie terminaba igualada."
      : y <= 2020
        ? "Eliminación directa a dos partidos desde la primera fase, con penales si la serie terminaba igualada."
        : "Primera fase, fase de grupos, playoffs de octavos (con los terceros de la Libertadores) y eliminación directa; final a partido único en cancha neutral.",
};

const SUPERCOPA: Series = {
  key: "supercopa",
  name: "Supercopa Sudamericana",
  officialName: () => "Supercopa Libertadores (Supercopa Sudamericana)",
  clubPage: "supcopa-arg.html",
  editionPage: (y) => `supcopa${String(y).slice(2)}.html`,
  wiki: (y) => `Supercopa Sudamericana ${y}`,
  formato: () => "Entre los campeones de la Copa Libertadores, a eliminación directa en partidos de ida y vuelta (1988–1997).",
};

const CONMEBOL_CUP: Series = {
  key: "conmebol",
  name: "Copa Conmebol",
  officialName: () => "Copa Conmebol",
  clubPage: "conmebol-arg.html",
  editionPage: (y) => `conmebol${String(y).slice(2)}.html`,
  wiki: (y) => `Copa Conmebol ${y}`,
  formato: () => "Eliminación directa a dos partidos entre clubes que no jugaban la Libertadores (1992–1999), con penales si la serie terminaba igualada.",
};

const MERCOSUR: Series = {
  key: "mercosur",
  name: "Copa Mercosur",
  officialName: () => "Copa Mercosur",
  clubPage: "mercosur-arg.html",
  editionPage: (y) => `mercosur${String(y).slice(2)}.html`,
  wiki: (y) => `Copa Mercosur ${y}`,
  formato: () => "Fase de grupos y eliminación directa entre clubes de Argentina, Brasil, Chile, Paraguay y Uruguay (1998–2001).",
};

export const CUP_TOURNAMENTS_CONMEBOL: TournamentConfig[] = [
  ...editions(LIBERTADORES),
  ...editions(SUDAMERICANA),
  ...editions(SUPERCOPA),
  ...editions(CONMEBOL_CUP),
  ...editions(MERCOSUR),
];
