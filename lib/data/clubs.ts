import type { Team } from "../types";

// Clubes que jugaron en Primera y hoy no están en la Primera División: desaparecidos, que dejaron el fútbol
// o que juegan en otras categorías. Formato: [id, nombre, abreviatura, nombre completo / aclaración].
const OTHER_CLUBS: [string, string, string, string][] = [
  // 1891–1896
  ["saint-andrews", "Saint Andrew's", "STA", "Saint Andrew's Athletic Club"],
  ["caledonians", "Caledonians", "CAL", "Caledonians Club"],
  ["ba-rosario-railway", "BA & Rosario Railway", "BAR", "Buenos Aires & Rosario Railway Athletic Club"],
  ["buenos-aires-fc", "Buenos Aires FC", "BAF", "Buenos Aires Football Club"],
  ["belgrano-fc", "Belgrano FC", "BFC", "Belgrano Football Club (1891)"],
  ["hurlingham", "Hurlingham FC", "HGM", "Hurlingham Football Club"],
  ["lomas-athletic", "Lomas Athletic", "LOM", "Lomas Athletic Club"],
  ["flores-athletic", "Flores Athletic", "FLO", "Flores Athletic Club"],
  ["alumni", "Alumni", "ALU", "Alumni Athletic Club (antes English High School)"],
  ["rosario-athletic", "Rosario Athletic", "RAT", "Rosario Athletic Club (hoy Club Atlético del Rosario)"],
  ["lobos-athletic", "Lobos Athletic", "LOB", "Lobos Athletic Club"],
  ["retiro-athletic", "Retiro Athletic", "RET", "Retiro Athletic Club"],
  ["lomas-academy", "Lomas Academy", "LAC", "Lomas Academy (segundo equipo del Lomas Athletic Club)"],
  ["belgrano-athletic", "Belgrano Athletic", "BEA", "Belgrano Athletic Club"],
  // 1897–
  ["belgrano-athletic-b", 'Belgrano "B"', "BEB", "Belgrano Athletic Club (segundo equipo)"],
  ["lanus-athletic", "Lanús Athletic", "LAT", "Lanús Athletic Club (sin relación con el actual Club Atlético Lanús)"],
  ["palermo-athletic", "Palermo Athletic", "PAL", "Palermo Athletic Club"],
  ["united-banks", "United Banks", "UNB", "United Banks"],
  ["barracas-athletic", "Barracas Athletic", "BRA", "Barracas Athletic Club"],
];

export const HISTORIC_CLUBS: Team[] = OTHER_CLUBS.map(([id, name, shortName, fullName]) => ({
  id,
  name,
  shortName,
  fullName,
  primary: "#64748B",
  secondary: "#E2E8F0",
  historic: true,
}));
