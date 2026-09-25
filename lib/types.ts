export type Team = {
  id: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
  // Clubes que ya no existen o no juegan más al fútbol en AFA.
  historic?: boolean;
  fullName?: string;
};

export type Source = "rsssf" | "wikipedia-es" | "wikipedia-en";

// "league": suma en la tabla del torneo. "playoff": desempate o final. "cup": copa nacional.
export type Phase = "league" | "playoff" | "cup";

export type TableRow = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type NoteKind =
  | "formato"
  | "descalificacion"
  | "retiro"
  | "anulado"
  | "walkover"
  | "puntos"
  | "fuentes"
  | "identidad"
  | "dato";

export type SeasonNote = { kind: NoteKind; text: string };

export type Season = {
  // Identificador en la URL: el año, o año + liga cuando hubo dos campeonatos (ej. "1919-aam").
  slug: string;
  // "cup": copa nacional (eliminación directa o grupos + eliminación). Por defecto, liga.
  kind?: "league" | "cup";
  // Copas: finalista (subcampeón).
  runnerUpIds?: string[];
  year: number;
  title: string;
  // Nombre corto de la liga cuando ese año hubo más de una (ej. "AAF", "AAm").
  league?: string;
  // Nombre oficial del torneo y quién lo organizó.
  tournament: string;
  organizer: string;
  championIds: string[];
  summary: string;
  pointsPerWin: number;
  sources: { label: string; url: string }[];
  notes: SeasonNote[];
  // Equipos inscriptos que se retiraron o fueron excluidos y no figuran en la tabla.
  withdrawn?: string[];
  // Puntos quitados (o dados) por la liga fuera de los partidos.
  pointAdjustments?: { teamId: string; points: number; reason: string }[];
  // Tabla tal como la publica la fuente, para verificar contra la calculada.
  publishedTable: TableRow[];
  // La tabla publicada suma también desempates y finales (ej. 1906: tabla combinada de grupos y final).
  tableIncludesPlayoffs?: boolean;
  // Torneos por zonas (ej. 1929): la tabla se muestra separada por zona.
  groups?: { name: string; teamIds: string[] }[];
  // Aclaración sobre la tabla (ej. "Tabla combinada no oficial").
  tableNote?: string;
  // Diferencias revisadas entre la tabla calculada y la publicada que no se pueden resolver con las fuentes
  // (ej. un gol de diferencia en la suma de la tabla). Claves "equipo:campo".
  knownTableDiffs?: { keys: string[]; explanation: string };
  matches: Match[];
};

export type Match = {
  id: string;
  date: string; // ISO yyyy-mm-dd; solo "yyyy" cuando la fuente no da el día (algunas copas viejas)
  competition: string;
  stage?: string;
  phase?: Phase;
  venue?: string;
  homeId: string;
  awayId: string;
  // Nombre con el que jugó ese día, si era distinto al actual (ej. English High School → Alumni).
  homeAs?: string;
  awayAs?: string;
  homeGoals: number;
  awayGoals: number;
  // No se jugó: los puntos se dieron por no presentación (ver awardedTo).
  walkover?: boolean;
  // No se jugó y la liga se lo dio por perdido a los dos equipos (ninguno suma puntos).
  bothLost?: boolean;
  // Se jugó pero el resultado no quedó registrado; solo se sabe quién ganó (winnerId, o empate si falta).
  // Los goles de estos partidos no suman en ninguna estadística.
  scoreUnknown?: boolean;
  winnerId?: string;
  // "annulled": se jugó pero el torneo fue anulado; se muestra pero no suma en las estadísticas.
  status?: "official" | "annulled";
  // Cuando el resultado de la cancha no fue el que quedó oficialmente (puntos quitados, etc.).
  awardedTo?: string;
  note?: string;
  sources: Source[];
};

export type HeadToHeadStats = {
  played: number;
  winsA: number;
  winsB: number;
  draws: number;
  goalsA: number;
  goalsB: number;
};
