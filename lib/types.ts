export type Team = {
  id: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
};

export type Source = "rsssf" | "wikipedia-es" | "wikipedia-en";

export type Match = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  competition: string;
  stage?: string;
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
