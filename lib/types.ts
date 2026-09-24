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
  year: number;
  title: string;
  // Nombre oficial del torneo y quién lo organizó.
  tournament: string;
  organizer: string;
  championIds: string[];
  summary: string;
  pointsPerWin: number;
  sources: { label: string; url: string }[];
  notes: SeasonNote[];
  // Equipos inscriptos que no jugaron ningún partido.
  withdrawn?: string[];
  // Tabla tal como la publica la fuente, para verificar contra la calculada.
  publishedTable: TableRow[];
  matches: Match[];
};

export type Match = {
  id: string;
  date: string; // ISO yyyy-mm-dd
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
