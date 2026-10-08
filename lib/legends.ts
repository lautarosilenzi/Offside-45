import { LEGENDS, type Legend, type TitleCat } from "./data/legends";

export { LEGENDS, type Legend };

export const getLegend = (id: string) => LEGENDS.find((l) => l.id === id);

// Nombres de selecciones y clubes en castellano (los datos vienen de Wikipedia en inglés).
const ES: Record<string, string> = {
  Brazil: "Brasil",
  "West Germany": "Alemania Federal",
  Germany: "Alemania",
  Netherlands: "Países Bajos",
  France: "Francia",
  Spain: "España",
  Italy: "Italia",
  Hungary: "Hungría",
  England: "Inglaterra",
  "Soviet Union": "Unión Soviética",
  "Bayern Munich": "Bayern Múnich",
  "Inter Milan": "Inter",
  "AC Milan": "Milan",
  "Paris Saint-Germain": "PSG",
  "Budapest Honvéd": "Honvéd",
  "Hamburger SV": "Hamburgo",
  "Borussia Mönchengladbach": "Borussia Mönchengladbach",
  "Sporting Lourenço Marques": "Sporting de Lourenço Marques",
  "Toronto Metros-Croatia": "Toronto Metros-Croatia",
  "Dynamo Moscow": "Dínamo de Moscú",
  "Atlético Junior": "Junior de Barranquilla",
};
export const es = (name: string) => ES[name] ?? name;

export const CATS: { id: TitleCat; label: string; group: "club" | "sel" | "other" }[] = [
  { id: "liga", label: "Ligas", group: "club" },
  { id: "copa", label: "Copas y supercopas nacionales", group: "club" },
  { id: "intl", label: "Internacionales de clubes", group: "club" },
  { id: "mundial", label: "Copa del Mundo", group: "sel" },
  { id: "continental", label: "Eurocopa / Copa América", group: "sel" },
  { id: "olimpico", label: "Oro olímpico", group: "sel" },
  { id: "selOtros", label: "Otros con la selección", group: "sel" },
  { id: "reg", label: "Estaduales, regionales y otros", group: "other" },
  { id: "juvenil", label: "Juveniles", group: "other" },
];

export const titlesIn = (l: Legend, cats: TitleCat[]) => l.titles.filter((t) => cats.includes(t.cat)).reduce((n, t) => n + t.n, 0);
export const totalTitles = (l: Legend) => l.titles.reduce((n, t) => n + t.n, 0);

export const nationalApps = (l: Legend) => l.national.reduce((n, x) => n + x.apps, 0);
export const nationalGoals = (l: Legend) => l.national.reduce((n, x) => n + x.goals, 0);
export const careerApps = (l: Legend) => l.clubTotal.apps + nationalApps(l);
export const careerGoals = (l: Legend) => l.clubTotal.goals + nationalGoals(l);

export function lifespan(l: Legend) {
  if (!l.born) return "";
  const y = (s: string) => s.slice(0, 4);
  if (l.died) return `${y(l.born)}–${y(l.died)}`;
  const b = new Date(`${l.born}T12:00:00Z`);
  const now = new Date();
  const age = now.getUTCFullYear() - b.getUTCFullYear() - (now < new Date(Date.UTC(now.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate())) ? 1 : 0);
  return `${y(l.born)} · ${age} años`;
}
