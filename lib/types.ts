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

export type Season = {
  year: number;
  title: string;
  championIds: string[];
  summary: string;
  pointsPerWin: number;
  sources: { label: string; url: string }[];
  notes: string[];
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
  venue: string;
  homeId: string;
  awayId: string;
  homeGoals: number;
  awayGoals: number;
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
