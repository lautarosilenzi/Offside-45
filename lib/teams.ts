import { HISTORIC_CLUBS } from "./data/clubs";
import { FOREIGN_CLUBS } from "./data/foreign-clubs";
import type { Team } from "./types";

// Clubes de la Primera División actual (más Quilmes, uno de los fundadores de la liga).
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

// Clubes que no están hoy en Primera (desaparecidos o de otras categorías).
export const HISTORIC_TEAMS: Team[] = HISTORIC_CLUBS;

// Clubes del exterior: rivales de los argentinos en las copas internacionales.
export const FOREIGN_TEAMS: Team[] = FOREIGN_CLUBS;

const ALL_TEAMS = [...TEAMS, ...HISTORIC_TEAMS, ...FOREIGN_TEAMS];

export const getTeam = (id: string) => ALL_TEAMS.find((t) => t.id === id);

export const CLASICOS: { label: string; a: string; b: string }[] = [
  { label: "Superclásico", a: "river", b: "boca" },
  { label: "Clásico de Avellaneda", a: "racing", b: "independiente" },
  { label: "Clásico porteño", a: "sanlorenzo", b: "huracan" },
];
