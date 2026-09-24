import type { Season } from "../../types";
import { SEASON_1891 } from "./1891";
import { SEASON_1893 } from "./1893";
import { SEASON_1894 } from "./1894";
import { SEASON_1895 } from "./1895";
import { SEASON_1896 } from "./1896";
import { GENERATED_SEASONS } from "./generated";

// Temporadas cargadas y verificadas, en orden cronológico.
// 1891–1896 están escritas a mano; desde 1897 las genera scripts/import/build.ts desde RSSSF.
export const SEASONS: Season[] = [SEASON_1891, SEASON_1893, SEASON_1894, SEASON_1895, SEASON_1896, ...GENERATED_SEASONS].sort(
  (a, b) => a.year - b.year || a.slug.localeCompare(b.slug),
);

// Años sin campeonato de Primera.
export const YEARS_WITHOUT_TOURNAMENT: { year: number; reason: string }[] = [
  {
    year: 1892,
    reason:
      "No se jugó. La liga de 1891 se disolvió y recién en febrero de 1893 Alexander Watson Hutton fundó la nueva Argentine Association Football League.",
  },
];
