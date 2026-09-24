// Configuración de cada torneo importado desde RSSSF: de dónde sale, qué es cada cosa y las notas en español.
import type { Match, SeasonNote, TableRow } from "../../lib/types";
import type { RawMatch } from "./rsssf-parse";

export type TournamentConfig = {
  slug: string;
  year: number;
  league?: string;
  file: string;
  // Sección de la página (por título) o índice. Por defecto, la primera con partidos.
  section?: RegExp | number;
  tableIndex?: number;
  wiki?: string;
  competition: string;
  title: string;
  tournament: string;
  organizer: string;
  championIds: string[];
  summary: string;
  pointsPerWin?: number;
  notes: SeasonNote[];
  withdrawn?: string[];
  pointAdjustments?: { teamId: string; points: number; reason: string }[];
  publishedTable?: TableRow[];
  // Por número de línea de la página: "skip" o campos a pisar.
  overrides?: Record<number, "skip" | Partial<Match>>;
  skip?: (m: RawMatch) => boolean;
  // Diferencias con Wikipedia ya revisadas (texto del problema → explicación). Se explican en las notas.
  wikiErrata?: Record<string, string>;
  extraMatches?: Partial<Match>[];
};

const AAFL = "Argentine Association Football League";
const wikiTitle = (y: number) => `Campeonato de Primera División ${y} (Argentina)`;

export const TOURNAMENTS: TournamentConfig[] = [
  {
    slug: "1897",
    year: 1897,
    file: "arg1897.html",
    wiki: wikiTitle(1897),
    competition: AAFL,
    title: "Campeonato 1897",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["lomas-athletic"],
    summary:
      "Lomas Athletic y Lanús Athletic terminaron igualados en 20 puntos y por primera vez el título se definió con desempates: hicieron falta tres partidos (1-1, 0-0 y 1-0). Fue el cuarto campeonato de Lomas Athletic en cinco ediciones y el quinto seguido de la institución, contando el de Lomas Academy. Debutaron Banfield, Lanús Athletic y Palermo Athletic.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 7 equipos, 2 puntos por victoria. El empate en el primer puesto se resolvió con desempates." },
      { kind: "puntos", text: "Desempates por el título entre Lomas Athletic y Lanús Athletic: 1-1 (8/9, con alargue), 0-0 (12/9, con alargue) y 1-0 para Lomas (19/9). Los desempates no suman en la tabla." },
      { kind: "identidad", text: "Banfield Athletic Club es el actual Club Atlético Banfield. Lanús Athletic no tiene relación con el Club Atlético Lanús, que se fundó en 1915. Belgrano \"B\" era el segundo equipo del Belgrano Athletic Club, el último equipo alternativo que jugó el campeonato." },
      { kind: "descalificacion", text: "Al terminar el torneo Belgrano \"B\" se disolvió y Flores Athletic fue desafiliado (según Wikipedia)." },
    ],
  },
  {
    slug: "1898",
    year: 1898,
    file: "arg1898.html",
    wiki: wikiTitle(1898),
    competition: AAFL,
    title: "Campeonato 1898",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["lomas-athletic"],
    summary:
      "Lomas Athletic y Lobos Athletic terminaron igualados en 20 puntos y otra vez hubo desempate. El primero (1-0 para Lomas) se anuló y se volvió a jugar: Lomas ganó 2-1 con dos goles de James Anderson y consiguió su último título, el sexto de la institución. Banfield perdió los doce partidos: se retiró a mitad de año y sus partidos restantes se le dieron por perdidos.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 7 equipos, 2 puntos por victoria. El empate en el primer puesto se resolvió con un desempate." },
      { kind: "puntos", text: "Desempate por el título entre Lomas Athletic y Lobos Athletic: el 28/8 ganó Lomas 1-0, pero el partido se anuló; el 11/9 Lomas ganó 2-1 en el Barker Memorial School." },
      { kind: "walkover", text: "Banfield no se presentó a sus últimos partidos: seis se le dieron por perdidos (dos antes del 3/7 y cuatro después, con fecha desconocida)." },
      { kind: "descalificacion", text: "Al terminar el torneo United Banks y Palermo Athletic se desafiliaron y Banfield pasó voluntariamente a la recién creada Segunda División (según Wikipedia)." },
    ],
  },
  {
    slug: "1899",
    year: 1899,
    file: "arg1899.html",
    wiki: wikiTitle(1899),
    competition: AAFL,
    title: "Campeonato 1899",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["belgrano-athletic"],
    summary:
      "Solo cuatro equipos, el torneo con menos participantes de la historia junto a los de 1900 y 1901. Belgrano Athletic fue campeón invicto. Lanús Athletic jugó apenas dos partidos: los otros cuatro se le dieron por perdidos. Ese año se jugó por primera vez un campeonato de Segunda División.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 4 equipos, 2 puntos por victoria." },
      { kind: "walkover", text: "Lanús Athletic no se presentó a cuatro partidos, que se dieron por ganados a sus rivales. El Lomas–Lobos también se le adjudicó a Lobos." },
      {
        kind: "fuentes",
        text: "RSSSF publica dos tablas con goles distintos (Belgrano 10-2 o 8-2; Lanús 1-5 o 1-3). La que se usa acá es la que cierra con los resultados partido por partido; las posiciones y los puntos son iguales en las dos.",
      },
      { kind: "descalificacion", text: "Al terminar el torneo Lobos quedó afuera por la distancia y Lanús Athletic fue desafiliado (según Wikipedia)." },
    ],
  },
  {
    slug: "1900",
    year: 1900,
    file: "arg1900.html",
    wiki: wikiTitle(1900),
    competition: AAFL,
    title: "Campeonato 1900",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["alumni"],
    summary:
      "Campeón invicto English High School Athletic Club, el equipo del colegio de Alexander Watson Hutton que al año siguiente pasó a llamarse Alumni. Aseguró el título una fecha antes del final con un 5-0 a Quilmes. Fue el comienzo de la época dorada de Alumni.",
    wikiErrata: { "lomas-athletic 4-0 quilmes": "la tabla de la propia Wikipedia (Lomas 9-9, Quilmes 9-19) solo cierra con el 4-0." },
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 4 equipos, 2 puntos por victoria." },
      { kind: "identidad", text: "English High School Athletic Club es el antecesor directo de Alumni, que adoptó ese nombre en 1901. Quilmes volvió a Primera." },
      {
        kind: "fuentes",
        text: "Wikipedia da Lomas 6-0 Quilmes en el fixture, pero su propia tabla (Lomas 9 goles a favor, Quilmes 19 en contra) solo cierra con el 4-0 de RSSSF, que es el que se usa.",
      },
    ],
  },
  {
    slug: "1901",
    year: 1901,
    file: "arg1901.html",
    wiki: wikiTitle(1901),
    competition: AAFL,
    title: "Campeonato 1901",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["alumni"],
    summary: "Alumni, ya con su nombre definitivo, ganó los seis partidos y fue campeón por segunda vez seguida, recibiendo un solo gol en todo el torneo. Jugaron los mismos cuatro equipos que en 1900.",
    notes: [{ kind: "formato", text: "Todos contra todos a dos ruedas entre 4 equipos, 2 puntos por victoria." }],
  },
  {
    slug: "1902",
    year: 1902,
    file: "arg1902.html",
    wiki: wikiTitle(1902),
    competition: AAFL,
    title: "Campeonato 1902",
    tournament: "Copa Campeonato de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["alumni"],
    summary:
      "Alumni fue campeón invicto por tercera vez, con goleadas como el 10-0 a Belgrano Athletic y el 8-1 a Barracas Athletic, el debutante que terminó segundo. Fue el último torneo organizado bajo el nombre de Argentine Association Football League. Jorge Brown, de Alumni, fue el goleador con 7 goles.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 5 equipos, 2 puntos por victoria." },
      { kind: "walkover", text: "Cinco partidos se resolvieron por escritorio, sin jugarse: Lomas Athletic perdió tres y Quilmes y Belgrano Athletic uno cada uno." },
    ],
  },
];
