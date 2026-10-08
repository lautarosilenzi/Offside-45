import { FEATURED, GROUPS, LIVE_CODE, LIVE_ORDER, compHref } from "../competitions";
import LOGOS from "../data/comps.generated.json";

export type LiveLeagueInfo = { id: string; name: string; code: string; logo?: string; href?: string };

// Competencias con datos en vivo, con nombre, logo y página del sitio, en el orden de la página En vivo.
export function liveLeagues(ids: string[] = LIVE_ORDER): LiveLeagueInfo[] {
  const all = [...FEATURED.map((c) => ({ c, g: undefined })), ...GROUPS.flatMap((g) => g.competitions.map((c) => ({ c, g })))];
  return ids
    .filter((id) => LIVE_CODE[id])
    .map((id) => {
      const found = all.find((x) => x.c.id === id)!;
      // Las ligas de otros países llevan el país ("Primera División · Uruguay"); hay varias con el mismo nombre.
      const country = found.g && !["argentina", "internacional", "selecciones", "femenino"].includes(found.g.id) ? found.g.name : undefined;
      const name = id === "liga-profesional" ? "Liga Profesional de Fútbol" : country ? `${found.c.name} · ${country}` : found.c.name;
      return {
        id,
        name,
        code: LIVE_CODE[id],
        logo: (LOGOS as Record<string, { file: string }>)[id]?.file,
        href: found.g ? compHref(found.g, found.c) : found.c.href,
      };
    });
}
