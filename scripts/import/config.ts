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
  tableIncludesPlayoffs?: boolean;
  tableNote?: string;
  knownTableDiffs?: { keys: string[]; explanation: string };
  // Correcciones puntuales, por partido ("AAAA-MM-DD local visitante"): "skip" o campos a pisar.
  overrides?: Record<string, "skip" | Partial<Match>>;
  skip?: (m: RawMatch) => boolean;
  // Diferencias con Wikipedia ya revisadas (texto del problema → explicación). Se explican en las notas.
  wikiErrata?: Record<string, string>;
  // Nombres que en este torneo corresponden a otro club que en el resto del año (nombre → id).
  aliases?: Record<string, string>;
  extraMatches?: Partial<Match>[];
};

const AAFL = "Argentine Association Football League";
const AAF = "Asociación Argentina de Football";
const FAF = "Federación Argentina de Football";
const fafWiki = (y: number) => `Campeonato de Primera División ${y} de la FAF (Argentina)`;
const AFA_1903 = "Argentine Football Association";
const wikiTitle = (y: number) => `Campeonato de Primera División ${y} (Argentina)`;
const rr2 = (teams: number, extra = "") =>
  ({ kind: "formato", text: `Todos contra todos a dos ruedas entre ${teams} equipos, 2 puntos por victoria.${extra}` }) as const;

// Temporadas de la Argentine Football Association (1903–1911): mismo formato de liga única.
const afa = (year: number, file: string, rest: Omit<TournamentConfig, "slug" | "year" | "file" | "wiki" | "competition" | "organizer" | "title">): TournamentConfig => ({
  slug: String(year),
  year,
  file,
  wiki: wikiTitle(year),
  competition: AFA_1903,
  organizer: AFA_1903,
  title: `Campeonato ${year}`,
  ...rest,
});

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
  afa(1903, "arg1903.html", {
    tournament: "Copa Campeonato 1903",
    championIds: ["alumni"],
    summary:
      "Primer torneo con la liga ya rebautizada Argentine Football Association. Alumni ganó su cuarto título seguido (quinto contando el de English High School): nueve victorias en diez partidos y apenas cuatro goles en contra. Flores Athletic perdió todos sus partidos y fue desafiliado al final.",
    notes: [
      rr2(6),
      { kind: "descalificacion", text: "Al terminar el torneo Flores Athletic fue desafiliado; lo reemplazó Estudiantes (BA) en 1904." },
      {
        kind: "fuentes",
        text: "Wikipedia no publica los resultados de este torneo. Su tabla le da a Alumni un gol más a favor (40) y a Lomas Athletic uno más en contra (17) que RSSSF, así que probablemente difieren en uno de los dos Alumni–Lomas (2-0 y 4-2 según RSSSF). Se usan los resultados de RSSSF, que cierran con su tabla.",
      },
    ],
  }),
  afa(1904, "arg1904.html", {
    tournament: "Copa Campeonato 1904",
    championIds: ["belgrano-athletic"],
    summary: "Belgrano Athletic cortó la racha de Alumni y ganó su segundo título. Debutó Estudiantes, el actual Estudiantes de Buenos Aires.",
    notes: [rr2(6), { kind: "identidad", text: "Estudiantes (BA) es el Club Atlético Estudiantes, hoy con sede en Caseros; no tiene relación con Estudiantes de La Plata." }],
  }),
  afa(1905, "arg1905.html", {
    tournament: "Copa Campeonato 1905",
    championIds: ["alumni"],
    summary: "Alumni recuperó el título, el quinto de su historia (sexto contando el de English High School). Debutó Reformer, de Campana.",
    notes: [
      rr2(7),
      {
        kind: "walkover",
        text: "Belgrano Athletic–Quilmes (28 de mayo) se suspendió a los 85 minutos con 3-0 para Belgrano; la liga después le dio el partido a Quilmes. Barracas Athletic–Lomas Athletic también se resolvió por escritorio, a favor de Lomas.",
      },
    ],
  }),
  afa(1906, "arg1906.html", {
    tournament: "Copa Campeonato 1906",
    championIds: ["alumni"],
    summary:
      "Por primera vez el campeonato se jugó en dos grupos: Lomas Athletic ganó el Grupo A y Alumni el Grupo B. En la final, jugada el 7 de octubre en la cancha de Porteño, Alumni goleó 4-0 y fue campeón. Debutaron San Martín Athletic, San Isidro, Argentino de Quilmes y el segundo equipo de Belgrano Athletic.",
    tableIncludesPlayoffs: true,
    tableNote: "Tabla combinada no oficial de RSSSF: suma los dos grupos y la final.",
    skip: (m) => /uruguay|argentin(e|a)\b|argentine fa/i.test(`${m.home} ${m.away}`) && !/quilmes/i.test(`${m.home} ${m.away}`),
    pointAdjustments: [{ teamId: "barracas-athletic", points: -2, reason: "Por incluir a un jugador no habilitado ante San Isidro (resolución del 4 de septiembre)." }],
    overrides: {
      "1906-07-01 barracas-athletic san-isidro": { note: "El 4 de septiembre le descontaron 2 puntos a Barracas Athletic por incluir a un jugador no habilitado en este partido." },
      "1906-07-01 estudiantes-ba san-martin-athletic": {
        note: "El acta se firmó con 2-1, aunque varios medios informaron 2-2. San Martín y el árbitro quisieron corregirla, pero la liga no lo aceptó y el 3 de octubre confirmó el 2-1: se anuló el gol de Minvielle.",
      },
    },
    notes: [
      { kind: "formato", text: "Dos grupos (A, de 6 equipos, y B, de 5) a dos ruedas; los ganadores jugaron una final a partido único. 2 puntos por victoria." },
      { kind: "puntos", text: "Final (7/10, cancha de Porteño): Alumni 4-0 Lomas Athletic, con goles de Lett, Eliseo Brown (2) y uno en contra de Campbell." },
      { kind: "puntos", text: "A Barracas Athletic le descontaron 2 puntos por incluir a un jugador no habilitado ante San Isidro." },
      { kind: "identidad", text: "\"Belgrano Extra\" era el segundo equipo del Belgrano Athletic Club." },
    ],
  }),
  afa(1907, "arg1907.html", {
    tournament: "Copa Campeonato 1907",
    championIds: ["alumni"],
    summary:
      "Alumni ganó su séptimo título. Fue el primer torneo con ascensos y descensos: el primer descendido tenía que ser Barracas Athletic, que abandonó el campeonato y terminó desafiliado.",
    wikiErrata: { "argentino-quilmes 2-1 barracas-athletic": "la tabla de la propia Wikipedia coincide con el 2-1 de RSSSF." },
    notes: [
      rr2(11),
      { kind: "retiro", text: "Barracas Athletic jugó 7 partidos, no se presentó a otros 3 y abandonó el campeonato; sus partidos restantes se dieron por ganados a los rivales." },
      { kind: "walkover", text: "Hubo varios partidos no jugados por no presentación (Lomas Athletic, San Martín Athletic, Reformer, Belgrano Athletic y Barracas Athletic); se dieron por ganados al rival." },
      { kind: "anulado", text: "Lomas Athletic–Belgrano Athletic (0-2) se anuló y se reprogramó; Lomas no se presentó a la revancha y los puntos fueron para Belgrano." },
      { kind: "fuentes", text: "Wikipedia da Argentino de Quilmes 2-0 Barracas Athletic, pero su propia tabla coincide con el 2-1 de RSSSF." },
    ],
  }),
  afa(1908, "arg1908.html", {
    tournament: "Copa Campeonato 1908",
    championIds: ["belgrano-athletic"],
    summary:
      "Belgrano Athletic fue campeón por tercera vez. El recién ascendido Nacional fue desafiliado después de jugar dos partidos por no tener una cancha en condiciones, y San Martín Athletic bajó a Segunda.",
    pointAdjustments: [
      { teamId: "san-martin-athletic", points: -2, reason: "Sanción: además de perder el partido con Porteño por escritorio." },
      { teamId: "estudiantes-ba", points: -2, reason: "Sanción: además de perder el partido con Belgrano Athletic por escritorio." },
    ],
    overrides: {
      "1908-05-10 san-martin-athletic porteno": { awardedTo: "porteno", note: "San Martín Athletic ganó 3-2 en la cancha, pero después la liga le dio el partido a Porteño y le descontó 2 puntos a San Martín." },
      "1908-08-23 estudiantes-ba belgrano-athletic": { awardedTo: "belgrano-athletic", note: "La liga le dio después el partido a Belgrano Athletic y le descontó 2 puntos a Estudiantes." },
    },
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 11 equipos y terminaron 10." },
      { kind: "descalificacion", text: "Nacional fue desafiliado después de jugar dos partidos (ganó 3-1 a Reformer y 3-0 a Lomas); esos resultados se anularon." },
      {
        kind: "puntos",
        text: "San Martín Athletic y Estudiantes perdieron cada uno un partido por escritorio (con Porteño y con Belgrano Athletic) y además se les descontaron 2 puntos.",
      },
      { kind: "walkover", text: "Hubo varios partidos no jugados porque uno de los equipos no se presentó (Reformer, San Martín Athletic, Lomas Athletic, Estudiantes y Quilmes); se dieron por ganados al rival." },
      {
        kind: "fuentes",
        text: "La tabla de Wikipedia no cuenta los goles de los dos partidos definidos por escritorio (San Martín 3-2 Porteño y Estudiantes 2-2 Belgrano); RSSSF sí los cuenta. Se sigue a RSSSF: los puntos y posiciones son iguales en ambas.",
      },
    ],
  }),
  afa(1909, "arg1909.html", {
    tournament: "Copa Campeonato 1909",
    championIds: ["alumni"],
    summary:
      "Alumni ganó su octavo título con 8 puntos de ventaja sobre River Plate, que debutaba en Primera. Descendieron Reformer y Lomas Athletic, el primer gran campeón del fútbol argentino, que se despidió de la liga.",
    knownTableDiffs: {
      keys: ["argentino-quilmes:goalsFor", "lomas-athletic:goalsAgainst"],
      explanation:
        "Los resultados partido por partido de RSSSF le dan a Argentino de Quilmes un gol más a favor y a Lomas Athletic uno más en contra que la tabla que publican tanto RSSSF como Wikipedia. Los puntos coinciden y no hay fuente para saber qué partido está mal, así que se dejan los resultados tal como figuran.",
    },
    notes: [
      rr2(10),
      { kind: "identidad", text: "Debutó River Plate, que había ascendido en 1908." },
      { kind: "walkover", text: "Varios partidos del final del torneo no se jugaron porque Reformer, San Isidro, Argentino de Quilmes y Porteño no se presentaron." },
    ],
  }),
  afa(1910, "arg10.html", {
    tournament: "Copa Campeonato 1910",
    championIds: ["alumni"],
    summary: "Alumni ganó su noveno título. Argentino de Quilmes terminó último y descendió; en su lugar ascendió Racing Club.",
    knownTableDiffs: {
      keys: ["estudiantes-ba:goalsFor", "estudiantes-ba:goalsAgainst", "quilmes:goalsFor", "quilmes:goalsAgainst"],
      explanation:
        "La tabla publicada (RSSSF y Wikipedia) tiene un gol más a favor y uno más en contra para Estudiantes y para Quilmes que la suma de los resultados. Coincide con que uno de sus dos partidos entre sí (3-3 y 3-0 según RSSSF) haya tenido un gol más por lado, pero no hay fuente para saber cuál, así que se dejan los resultados tal como figuran.",
    },
    notes: [rr2(9)],
  }),
  afa(1911, "arg11.html", {
    tournament: "Copa Campeonato 1911",
    championIds: ["alumni"],
    summary:
      "Último título de Alumni, el décimo de su historia, tras ganarle un desempate a Porteño. Debutó Racing Club. Fue el último torneo con el nombre en inglés de la liga, en medio de la \"fuga\" de clubes que al año siguiente derivó en el primer cisma.",
    notes: [rr2(9), { kind: "puntos", text: "Alumni y Porteño terminaron igualados en el primer puesto y jugaron un desempate." }],
  }),

  // ───────── Primer cisma: Asociación Argentina (AAF, oficial) y Federación Argentina (FAF, disidente) ─────────
  {
    slug: "1912",
    year: 1912,
    league: "AAF",
    file: "arg12.html",
    section: /Asociación Argentina/,
    wiki: wikiTitle(1912),
    competition: AAF,
    organizer: `${AAF} (la entidad oficial, que ese año castellanizó su nombre)`,
    title: "Campeonato 1912 · Asociación Argentina",
    tournament: "Copa Campeonato 1912 (Asociación Argentina de Football)",
    championIds: ["quilmes"],
    summary:
      "Quilmes ganó su primer título y, junto con el de Porteño en la Federación, marcó el fin de la hegemonía de los clubes \"ingleses\". Empezaron diez equipos pero terminaron seis: Alumni no se presentó a sus tres primeros partidos y fue desafiliado, y Estudiantes de La Plata, Gimnasia y Esgrima de Buenos Aires y Porteño se fueron a la disidente Federación Argentina de Football.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 10 equipos y terminaron 6." },
      { kind: "descalificacion", text: "Alumni no se presentó a sus tres primeros partidos y fue desafiliado; nunca volvió a jugar. Los partidos que le dieron por perdidos se anularon." },
      {
        kind: "anulado",
        text: "El 17 de julio, al desafiliarse Estudiantes de La Plata, Gimnasia y Esgrima de Buenos Aires y Porteño para pasar a la Federación, la Asociación anuló todos los partidos que habían jugado.",
      },
      { kind: "dato", text: "Estudiantes (BA)–San Isidro no se jugó: los dos capitanes decidieron no jugar, y el partido figura como no disputado (por eso esos dos equipos tienen 9 partidos)." },
    ],
  },
  {
    slug: "1912-faf",
    year: 1912,
    league: "FAF",
    file: "arg12.html",
    section: /Federación Argentina/,
    wiki: fafWiki(1912),
    competition: FAF,
    organizer: `${FAF} (entidad disidente, no reconocida entonces por la FIFA)`,
    title: "Campeonato 1912 · Federación Argentina",
    tournament: "Campeonato de Primera División 1912 de la Federación Argentina de Football",
    championIds: ["porteno"],
    summary:
      "Primer torneo de la Federación Argentina de Football, que se jugó en paralelo al de la Asociación. Porteño y Independiente terminaron igualados; el desempate se interrumpió a los 87 minutos porque Independiente abandonó la cancha tras tres expulsiones, y no se presentó a la revancha. Porteño fue campeón por primera vez.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 8 equipos, 2 puntos por victoria." },
      {
        kind: "puntos",
        text: "Según el reglamento, Independiente era campeón por diferencia de gol, pero como en la última fecha había goleado 5-0 a un Argentino de Quilmes con un equipo diezmado, ofreció jugar un desempate. Ese partido se terminó a los 87 minutos cuando los jugadores de Independiente se retiraron reclamando un gol, después de tres expulsiones. Independiente no se presentó a la revancha del día siguiente y Porteño quedó campeón.",
      },
      { kind: "identidad", text: "La Federación se formó con clubes que dejaron la Asociación (Porteño, Estudiantes de La Plata y Gimnasia y Esgrima de Buenos Aires) y equipos promovidos de la división Intermedia." },
    ],
  },
  {
    slug: "1913",
    year: 1913,
    league: "AAF",
    file: "arg13.html",
    section: /Asociación Argentina/,
    wiki: wikiTitle(1913),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1913 · Asociación Argentina",
    tournament: "Copa Campeonato 1913 (Asociación Argentina de Football)",
    championIds: ["racing"],
    summary:
      "Racing ganó su primer título, el comienzo de sus siete campeonatos seguidos, al vencer 2-0 a San Isidro en la final. Como la Asociación sumó muchos equipos nuevos (llegó a 15) y no alcanzaba el tiempo para dos ruedas completas, a mitad de año reorganizó el torneo en grupos. Ese año debutaron Boca Juniors, Platense, Ferro Carril Oeste y Estudiantil Porteño, y se jugó el primer Superclásico oficial (Boca 1-2 River, 24 de agosto).",
    tableIncludesPlayoffs: true,
    tableNote: "Tabla combinada no oficial de RSSSF: suma todas las fases, desempate y final.",
    notes: [
      {
        kind: "formato",
        text: "Estaba previsto a dos ruedas entre 15 equipos, pero por falta de tiempo el 8 de octubre la Asociación lo reorganizó: se mantuvieron los puntos de la primera rueda, los 11 primeros se dividieron en los grupos A y B (con partidos de vuelta solo dentro del grupo) y los últimos cuatro jugaron el Grupo C para evitar el descenso. Los ganadores de los grupos A y B jugaron la final.",
      },
      { kind: "puntos", text: "Racing y River empataron el Grupo A y jugaron un desempate (Racing 3-0). En la final, Racing le ganó 2-0 a San Isidro." },
      { kind: "anulado", text: "Comercio–Banfield (1-1, 5 de octubre) se anuló por la reorganización del torneo." },
      { kind: "retiro", text: "Belgrano Athletic se retiró del torneo en octubre; sus partidos restantes se dieron por perdidos." },
      { kind: "descalificacion", text: "Olivos y Riachuelo descendieron desde el Grupo C." },
    ],
  },
  {
    slug: "1913-faf",
    year: 1913,
    league: "FAF",
    file: "arg13.html",
    section: /Federación Argentina/,
    tableIndex: 1,
    wiki: fafWiki(1913),
    competition: FAF,
    organizer: `${FAF} (entidad disidente)`,
    title: "Campeonato 1913 · Federación Argentina",
    tournament: "Campeonato de Primera División 1913 de la Federación Argentina de Football",
    championIds: ["estudiantes"],
    aliases: { "CA Estudiantes": "estudiantes", "Club Atlético Estudiantes": "estudiantes", Estudiantes: "estudiantes" },
    overrides: {
      "1913-07-27 kimberley porteno": {
        status: "official",
        venue: "Cancha de Kimberley",
        note: "El primer partido (en cancha de Argentino de Quilmes) se suspendió a los 75 minutos con 0-0 y se anuló. Este 3-1 es el de la revancha, jugada el 15 de agosto.",
      },
      "1913-09-21 sportiva-argentina kimberley": { note: "No se jugó oficialmente: Sportiva Argentina perdió los puntos y el partido se jugó como amistoso (0-4, 60 minutos)." },
    },
    summary: "Estudiantes de La Plata ganó su primer título en el segundo torneo de la Federación, con tres puntos de ventaja sobre Gimnasia y Esgrima de Buenos Aires. Debutó Tigre.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 10 equipos, 2 puntos por victoria." },
      { kind: "identidad", text: "Hispano Argentino figura en Wikipedia como antecesor del Club Columbian." },
      { kind: "descalificacion", text: "Sociedad Sportiva Argentina terminó último sin ganar un partido y descendió." },
      { kind: "fuentes", text: "La tabla de Wikipedia le da a Estudiantes un gol más a favor (64) y a Sportiva Argentina uno más en contra (52): difieren en uno de sus dos partidos. Se usan los resultados de RSSSF, que cierran con su tabla." },
    ],
  },
  {
    slug: "1914",
    year: 1914,
    league: "AAF",
    file: "arg14.html",
    section: /Copa Campeonato 1914/,
    wiki: wikiTitle(1914),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1914 · Asociación Argentina",
    tournament: "Copa Campeonato 1914 (Asociación Argentina de Football)",
    championIds: ["racing"],
    summary: "Racing ganó su segundo título seguido con 11 victorias y un empate en 12 partidos. Debutó Huracán. Fue el último torneo del primer cisma: en 1915 las dos ligas se unificaron.",
    notes: [{ kind: "formato", text: "Todos contra todos a una rueda entre 13 equipos, 2 puntos por victoria." }],
  },
  {
    slug: "1914-faf",
    year: 1914,
    league: "FAF",
    file: "arg14.html",
    section: /Primera División 1914/,
    wiki: fafWiki(1914),
    competition: FAF,
    organizer: `${FAF} (entidad disidente)`,
    title: "Campeonato 1914 · Federación Argentina",
    tournament: "Campeonato de Primera División 1914 de la Federación Argentina de Football",
    championIds: ["porteno"],
    aliases: { Estudiantes: "estudiantes" },
    summary:
      "Porteño ganó su segundo título, invicto, en el último torneo de la Federación. Empezaron diez equipos y terminaron ocho: Tigre fue expulsado y Argentino de Quilmes perdió la afiliación, y se anularon sus partidos.",
    withdrawn: ["tigre", "argentino-quilmes"],
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 10 equipos y terminaron 8." },
      { kind: "descalificacion", text: "Tigre fue expulsado después de jugar 14 partidos y Argentino de Quilmes perdió la afiliación después de 7; todos sus partidos se anularon." },
    ],
  },
];
