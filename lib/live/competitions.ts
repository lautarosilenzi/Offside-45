import { FEATURED, GROUPS, LIVE_CODE } from "../competitions";

export type LiveCompetition = { id: string; name: string; code: string; country: string; history?: string };

// Secciones del sitio con la historia (y los campeones) de una competencia.
const HISTORY: Record<string, string> = {
  "liga-profesional": "/campeones",
  "copa-argentina": "/copa-argentina",
  libertadores: "/libertadores",
  sudamericana: "/sudamericana",
  recopa: "/recopa",
  "mundial-clubes": "/mundial-de-clubes",
};

// Una competencia con datos en vivo, con su nombre y su país tal como figuran en el menú.
export function findLiveCompetition(id: string): LiveCompetition | undefined {
  const code = LIVE_CODE[id];
  if (!code) return undefined;
  const group = GROUPS.find((g) => g.competitions.some((c) => c.id === id));
  const c = group?.competitions.find((x) => x.id === id) ?? FEATURED.find((x) => x.id === id);
  if (!c) return undefined;
  return { id, name: id === "liga-profesional" ? "Liga Profesional" : c.name, code, country: group?.name ?? "", history: HISTORY[id] };
}
