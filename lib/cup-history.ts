import { LIBERTADORES_FINALS, RECOPA, type ClubFinal } from "./data/world-titles";
import { INTL_COMPETITIONS, finalRows } from "./seasons";

// Ediciones cargadas de una copa internacional, por nombre.
export const editionsOf = (name: string) => INTL_COMPETITIONS.find((c) => c.name === name)?.editions ?? [];

// Campeón y finalista de cada edición de una copa cargada entera (Libertadores, Sudamericana), con la que está en juego.
export function seasonFinals(name: string) {
  const editions = editionsOf(name);
  // Libertadores: con el resultado de la final.
  const detail = (year: number) => (name === "Copa Libertadores" && LIBERTADORES_FINALS[year] ? `Final: ${LIBERTADORES_FINALS[year]}` : undefined);
  return [
    ...finalRows(editions).map((r) => ({ ...r, detail: detail(r.year) })),
    ...editions.filter((s) => s.inProgress).map((s) => ({ year: s.year, status: "En juego", href: `/temporadas/${s.slug}` })),
  ].sort((a, b) => a.year - b.year);
}

// Listas de campeones cargadas a mano (lib/data/world-titles.ts): enlazan a la edición cuando jugó un club argentino.
export function listFinals(list: ClubFinal[], cup: string) {
  const loaded = editionsOf(cup);
  return list.map((f) => {
    const s = loaded.find((e) => e.year === f.year);
    return { year: f.year, champion: f.championId, runnerUp: f.runnerUpId, detail: f.note, href: s ? `/temporadas/${s.slug}` : undefined };
  });
}

export const recopaFinals = () => listFinals(RECOPA, "Recopa Sudamericana");
