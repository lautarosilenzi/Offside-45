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
  // 1904–
  ["estudiantes-ba", "Estudiantes (BA)", "EBA", "Club Atlético Estudiantes (Estudiantes de Buenos Aires)"],
  ["reformer", "Reformer", "REF", "Reformer Athletic Club (Campana)"],
  ["san-martin-athletic", "San Martín Athletic", "SMA", "San Martín Athletic Club"],
  ["san-isidro", "San Isidro", "CAS", "Club Atlético San Isidro"],
  ["argentino-quilmes", "Argentino de Quilmes", "AQU", "Club Atlético Argentino de Quilmes"],
  ["porteno", "Porteño", "POR", "Club Atlético Porteño"],
  ["nacional-floresta", "Nacional (Floresta)", "NAC", "Club Atlético Nacional (Floresta)"],
  ["gimnasia-ba", "Gimnasia y Esgrima (BA)", "GEB", "Club de Gimnasia y Esgrima de Buenos Aires"],
  // 1912–
  ["atlanta", "Atlanta", "ATL", "Club Atlético Atlanta"],
  ["kimberley", "Kimberley", "KIM", "Kimberley Athletic Club"],
  ["sportiva-argentina", "Sportiva Argentina", "SSA", "Sociedad Sportiva Argentina"],
  // 1913–
  ["estudiantil-porteno", "Estudiantil Porteño", "EPO", "Club Atlético Estudiantil Porteño"],
  ["comercio", "Comercio", "COM", "Comercio Foot Ball Club"],
  ["ferro", "Ferro Carril Oeste", "FER", "Club Ferro Carril Oeste"],
  ["ferrocarril-sud", "Ferrocarril Sud", "FCS", "Club Atlético del Ferrocarril Sud (Gran Sud)"],
  ["olivos", "Olivos", "OLI", "Club Atlético Olivos"],
  ["riachuelo", "Riachuelo", "RIA", "Club Atlético Riachuelo"],
  ["columbian", "Columbian", "COL", "Club Columbian (antes Hispano Argentino)"],
  // 1914–
  ["floresta", "Floresta", "FLR", "Club Sportivo Floresta"],
  ["remedios-escalada", "Remedios de Escalada", "RDE", "Remedios de Escalada (Lanús)"],
  // 1915–
  ["defensores-belgrano", "Defensores de Belgrano", "DDB", "Club Atlético Defensores de Belgrano"],
  ["sportivo-barracas", "Sportivo Barracas", "SBA", "Club Sportivo Barracas"],
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
