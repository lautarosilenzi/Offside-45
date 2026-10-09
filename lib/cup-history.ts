import type { FinalRow } from "@/components/TitleBoards";
import { LIBERTADORES_FINALS, RECOPA, type ClubFinal } from "./data/world-titles";
import { CUP_COMPETITIONS, EXTRA_TITLES, INTL_COMPETITIONS, LEAGUE_TITLES, finalRows, isAmateurSeason, sourceOrder, titleLabel } from "./seasons";
import type { Season } from "./types";

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

// Copa Argentina: campeón, finalista y resultado de la final de cada edición (las que no terminaron, con su estado).
const COPA_ARGENTINA = () => CUP_COMPETITIONS.find((c) => c.name === "Copa Argentina")?.editions ?? [];
function finalDetail(s: Season): string | undefined {
  const finals = s.matches.filter((m) => /^final/i.test(m.stage ?? "")).sort(sourceOrder);
  if (!finals.length || !s.championIds[0]) return undefined;
  const champ = s.championIds[0];
  const text = finals.map((m) => {
    const [f, a] = m.homeId === champ ? [m.homeGoals, m.awayGoals] : [m.awayGoals, m.homeGoals];
    const pens = m.advancedId && f === a ? " (por penales)" : "";
    return `${f}-${a}${pens}`;
  });
  return `Final: ${text.join(" y ")}`;
}
export function copaArgentinaFinals(): FinalRow[] {
  return COPA_ARGENTINA().flatMap((s): FinalRow[] => {
    const base = finalRows([s]);
    return base.length
      ? base.map((r) => ({ ...r, yearLabel: s.yearLabel ?? String(s.year), detail: finalDetail(s) }))
      : [{ year: s.year, yearLabel: s.yearLabel ?? String(s.year), status: s.inProgress ? "En juego" : "Sin terminar", href: `/temporadas/${s.slug}` }];
  });
}

// Primera División argentina: un renglón por título (los compartidos, uno por campeón), con su era.
export function leagueFinals(): (FinalRow & { amateur: boolean })[] {
  return [
    ...LEAGUE_TITLES.flatMap((s) =>
      (s.championIds.length ? s.championIds : [undefined]).map((id) => ({
        year: s.year,
        yearLabel: s.yearLabel ?? String(s.year),
        detail: titleLabel(s),
        champion: id,
        status: id ? undefined : "En juego",
        href: `/temporadas/${s.slug}`,
        amateur: isAmateurSeason(s),
      })),
    ),
    ...EXTRA_TITLES.map((t) => ({ year: t.year, yearLabel: String(t.year), champion: t.championId, detail: t.label, href: t.href, amateur: false })),
  ].sort((a, b) => a.year - b.year);
}
