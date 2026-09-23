export type Team = {
  id: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
};

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
  note?: string;
};

export type HeadToHeadStats = {
  played: number;
  winsA: number;
  winsB: number;
  draws: number;
  goalsA: number;
  goalsB: number;
};
