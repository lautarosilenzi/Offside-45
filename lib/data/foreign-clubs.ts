import type { Team } from "../types";
import GENERATED from "./foreign-clubs.generated.json";

// Clubes del exterior que jugaron contra clubes argentinos en copas oficiales (nacionales abiertas a otros países
// o internacionales). Formato: [id, nombre, abreviatura, nombre completo, país]. El nombre lleva el país para
// distinguirlos en las listas de partidos (hay un Nacional en Uruguay, en Paraguay…).
const CLUBS: [string, string, string, string, string][] = [
  // Uruguay
  ["albion-uy", "Albion (Uruguay)", "ALB", "Albion Football Club (Montevideo)", "Uruguay"],
  ["curcc-uy", "CURCC (Uruguay)", "CUR", "Central Uruguay Railway Cricket Club (Montevideo)", "Uruguay"],
  ["nacional-uy", "Nacional (Uruguay)", "NAU", "Club Nacional de Football (Montevideo)", "Uruguay"],
  ["deutscher-uy", "Deutscher FK (Uruguay)", "DFK", "Deutscher Fussball Klub (Montevideo)", "Uruguay"],
  ["wanderers-uy", "Montevideo Wanderers (Uruguay)", "MWA", "Montevideo Wanderers Football Club", "Uruguay"],
  ["penarol-uy", "Peñarol (Uruguay)", "PEÑ", "Club Atlético Peñarol (Montevideo)", "Uruguay"],
  ["defensor-uy", "Defensor (Uruguay)", "DEF", "Club Atlético Defensor (Montevideo)", "Uruguay"],
  ["sud-america-uy", "Sud América (Uruguay)", "SUD", "Institución Atlética Sud América (Montevideo)", "Uruguay"],
  ["river-plate-fc-uy", "River Plate FC (Uruguay)", "RPU", "River Plate Football Club (Montevideo, desaparecido en 1929)", "Uruguay"],
  ["bristol-uy", "Bristol (Uruguay)", "BRI", "Bristol Football Club (Montevideo)", "Uruguay"],
  ["universal-uy", "Universal (Uruguay)", "UNI", "Club Atlético Universal (Montevideo)", "Uruguay"],
  ["rampla-uy", "Rampla Juniors (Uruguay)", "RAM", "Rampla Juniors Fútbol Club (Montevideo)", "Uruguay"],
  // Campeonato Sudamericano de Campeones 1948
  ["vasco-br", "Vasco da Gama (Brasil)", "VAS", "Club de Regatas Vasco da Gama (Río de Janeiro)", "Brasil"],
  ["colo-colo-cl", "Colo-Colo (Chile)", "COL", "Club Social y Deportivo Colo-Colo (Santiago)", "Chile"],
  ["emelec-ec", "Emelec (Ecuador)", "EME", "Club Sport Emelec (Guayaquil)", "Ecuador"],
  ["municipal-pe", "Deportivo Municipal (Perú)", "MUN", "Club Centro Deportivo Municipal (Lima)", "Perú"],
  ["litoral-bo", "Litoral (Bolivia)", "LIT", "Club Litoral (La Paz)", "Bolivia"],
];

// Los rivales de las copas de la Conmebol los genera scripts/import/intl/conmebol.ts (foreign-clubs.generated.json).
export const FOREIGN_CLUBS: Team[] = [
  ...CLUBS.map(([id, name, shortName, fullName, country]) => ({ id, name, shortName, fullName, country })),
  ...GENERATED.filter((g) => !CLUBS.some(([id]) => id === g.id)),
].map((c) => ({ ...c, primary: "#64748B", secondary: "#E2E8F0", historic: true }));
