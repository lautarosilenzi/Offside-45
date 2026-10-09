import { championsOf } from "./champions";
import { copaArgentinaFinals, leagueFinals, listFinals, recopaFinals, seasonFinals } from "./cup-history";
import { CLUB_WORLD_CUP, FIFA_INTERCONTINENTAL, SUPERCOPA_INTERNACIONAL } from "./data/world-titles";
import { getTeam } from "./teams";
import type { FinalRow } from "@/components/TitleBoards";

export type EditionRow = { season: string; championName: string; runnerUpName?: string; detail?: string };

// Copas con su historia cargada en el sitio (por club): sus filas de campeones.
export const HISTORY_ROWS: Record<string, () => FinalRow[]> = {
  "liga-profesional": leagueFinals,
  "copa-argentina": copaArgentinaFinals,
  libertadores: () => seasonFinals("Copa Libertadores"),
  sudamericana: () => seasonFinals("Copa Sudamericana"),
  recopa: recopaFinals,
  "mundial-clubes": () => listFinals(CLUB_WORLD_CUP, "Mundial de Clubes"),
  "copa-intercontinental": () => listFinals(FIFA_INTERCONTINENTAL, "Copa Intercontinental FIFA"),
  "supercopa-internacional": () => listFinals(SUPERCOPA_INTERNACIONAL, "Supercopa Internacional"),
};

const nameOf = (id?: string) => (id ? (getTeam(id)?.name ?? id) : undefined);

// Ediciones de un torneo con su campeón, de la más nueva a la más vieja ("2024–25", "2018"…).
export function editionRows(compId: string): EditionRow[] {
  // La liga y la Copa Argentina tienen sus temporadas en /temporadas (dos torneos por año, partidos verificados).
  const h = compId === "liga-profesional" || compId === "copa-argentina" ? undefined : HISTORY_ROWS[compId];
  if (h)
    return h()
      .filter((r) => r.champion)
      .map((r) => ({ season: String(r.year), championName: nameOf(r.champion)!, runnerUpName: nameOf(r.runnerUp), detail: r.detail }))
      .reverse();
  return (championsOf(compId)?.rows ?? []).map((r) => ({ season: r.season, championName: r.champion, runnerUpName: r.runnerUp }));
}

// Dirección de la página de una edición: "2024–25" → /torneos/champions/edicion/2024-25. Solo temporadas con año.
export const editionHref = (compId: string, season: string) => {
  const m = season.match(/^(\d{4})(?:[–-](\d{2,4}))?$/);
  return m ? `/torneos/${compId}/edicion/${m[1]}${m[2] ? `-${m[2]}` : ""}` : undefined;
};
