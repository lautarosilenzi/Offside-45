import type { Team } from "./types";

// Clubes que existen hoy.
export const TEAMS: Team[] = [
  { id: "river", name: "River Plate", shortName: "RIV", primary: "#E30613", secondary: "#FFFFFF" },
  { id: "boca", name: "Boca Juniors", shortName: "BOC", primary: "#0B3B8C", secondary: "#FDB913" },
  { id: "racing", name: "Racing Club", shortName: "RAC", primary: "#6CACE4", secondary: "#FFFFFF" },
  { id: "independiente", name: "Independiente", shortName: "IND", primary: "#D5001C", secondary: "#FFFFFF" },
  { id: "sanlorenzo", name: "San Lorenzo", shortName: "SLO", primary: "#1B2A6B", secondary: "#D5001C" },
  { id: "huracan", name: "Huracán", shortName: "HUR", primary: "#FFFFFF", secondary: "#D5001C" },
  { id: "estudiantes", name: "Estudiantes (LP)", shortName: "EST", primary: "#D5001C", secondary: "#FFFFFF" },
  { id: "gimnasia", name: "Gimnasia (LP)", shortName: "GIM", primary: "#FFFFFF", secondary: "#0B2A5B" },
  { id: "velez", name: "Vélez Sarsfield", shortName: "VEL", primary: "#FFFFFF", secondary: "#1D4F9C" },
  { id: "newells", name: "Newell's Old Boys", shortName: "NOB", primary: "#D5001C", secondary: "#111111" },
  { id: "central", name: "Rosario Central", shortName: "CEN", primary: "#1D4F9C", secondary: "#FDB913" },
  { id: "talleres", name: "Talleres (C)", shortName: "TAL", primary: "#0B2A5B", secondary: "#FFFFFF" },
  { id: "belgrano", name: "Belgrano", shortName: "BEL", primary: "#6CACE4", secondary: "#FFFFFF" },
  { id: "lanus", name: "Lanús", shortName: "LAN", primary: "#7A1F2B", secondary: "#FFFFFF" },
  { id: "banfield", name: "Banfield", shortName: "BAN", primary: "#006B3F", secondary: "#FFFFFF" },
  { id: "argentinos", name: "Argentinos Juniors", shortName: "ARG", primary: "#D5001C", secondary: "#FFFFFF" },
  { id: "tigre", name: "Tigre", shortName: "TIG", primary: "#0B2A5B", secondary: "#D5001C" },
  { id: "platense", name: "Platense", shortName: "PLA", primary: "#5B3A29", secondary: "#FFFFFF" },
  { id: "quilmes", name: "Quilmes", shortName: "QUI", primary: "#FFFFFF", secondary: "#0B2A5B" },
];

// Clubes que jugaron en Primera y ya no existen (o dejaron el fútbol de AFA).
// Colores neutros: no inventamos colores que no están documentados.
const historic = (id: string, name: string, shortName: string, fullName: string): Team => ({
  id,
  name,
  shortName,
  fullName,
  primary: "#64748B",
  secondary: "#E2E8F0",
  historic: true,
});

export const HISTORIC_TEAMS: Team[] = [
  historic("saint-andrews", "Saint Andrew's", "STA", "Saint Andrew's Athletic Club"),
  historic("caledonians", "Caledonians", "CAL", "Caledonians Club"),
  historic("ba-rosario-railway", "BA & Rosario Railway", "BAR", "Buenos Aires & Rosario Railway Athletic Club"),
  historic("buenos-aires-fc", "Buenos Aires FC", "BAF", "Buenos Aires Football Club"),
  historic("belgrano-fc", "Belgrano FC", "BFC", "Belgrano Football Club (1891)"),
  historic("hurlingham", "Hurlingham FC", "HGM", "Hurlingham Football Club"),
  historic("lomas-athletic", "Lomas Athletic", "LOM", "Lomas Athletic Club"),
  historic("flores-athletic", "Flores Athletic", "FLO", "Flores Athletic Club"),
  historic("alumni", "Alumni", "ALU", "Alumni Athletic Club (antes English High School)"),
  historic("rosario-athletic", "Rosario Athletic", "RAT", "Rosario Athletic Club (hoy Club Atlético del Rosario)"),
  historic("lobos-athletic", "Lobos Athletic", "LOB", "Lobos Athletic Club"),
  historic("retiro-athletic", "Retiro Athletic", "RET", "Retiro Athletic Club"),
];

const ALL_TEAMS = [...TEAMS, ...HISTORIC_TEAMS];

export const getTeam = (id: string) => ALL_TEAMS.find((t) => t.id === id);

export const CLASICOS: { label: string; a: string; b: string }[] = [
  { label: "Superclásico", a: "river", b: "boca" },
  { label: "Clásico de Avellaneda", a: "racing", b: "independiente" },
  { label: "Clásico porteño", a: "sanlorenzo", b: "huracan" },
];
