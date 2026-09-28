// Copas nacionales 1971–2000. Se cargan a mano, partido por partido, desde la página de RSSSF de cada edición,
// cruzada con Wikipedia (las páginas no tienen el formato estándar).
import type { Match } from "../../lib/types";
import type { TournamentConfig } from "./config";

const AFA = "Asociación del Fútbol Argentino";

type Row = [date: string, stage: string, home: string, hg: number, ag: number, away: string, extra?: Partial<Match>];
const rows = (slug: string, list: Row[]) =>
  list.map(([date, stage, homeId, homeGoals, awayGoals, awayId, extra], i) => ({
    id: `${slug}-${String(i + 1).padStart(3, "0")}`,
    date,
    stage,
    phase: "cup" as const,
    homeId,
    awayId,
    homeGoals,
    awayGoals,
    ...extra,
  }));
const en = (city: string, extra?: Partial<Match>) => ({ venue: city, ...extra });

// Primera fase a ida y vuelta: las fuentes dan la ciudad, pero no cuál de los dos partidos jugó cada uno de local.
const IDA = "Primera fase (ida)";
const VUELTA = "Primera fase (vuelta)";
const G = (n: number) => `Ronda de ganadores ${n}`;
const P = (n: number) => `Ronda de perdedores ${n}`;

export const CUP_TOURNAMENTS_90S: TournamentConfig[] = [
  // ───────── Copa Centenario de la AFA 1993 ─────────
  {
    slug: "copa-centenario-1993",
    kind: "cup",
    year: 1993,
    file: "arg-centenario93.html",
    competition: "Copa Centenario de la AFA",
    title: "Copa Centenario 1993",
    tournament: "Copa Centenario de la AFA",
    organizer: AFA,
    championIds: ["gimnasia"],
    runnerUpIds: ["river"],
    skip: () => true,
    reentry: { note: "Doble eliminación: el que perdía en la primera fase o en la ronda de ganadores seguía en la ronda de perdedores." },
    extraMatches: rows("copa-centenario-1993", [
      ["1993-07-03", IDA, "river", 0, 0, "boca", en("Buenos Aires")],
      ["1993-06-26", IDA, "velez", 1, 1, "ferro", en("Buenos Aires", { note: "Wikipedia da como fecha el 3 de junio; RSSSF, el 26." })],
      ["1993-06-26", IDA, "racing", 2, 1, "independiente", en("Avellaneda")],
      ["1993-06-26", IDA, "lanus", 0, 0, "platense", en("Lanús")],
      ["1993-06-26", IDA, "deportivo-mandiyu", 1, 1, "belgrano", en("Corrientes")],
      ["1993-06-26", IDA, "sanlorenzo", 2, 0, "huracan", en("Buenos Aires")],
      ["1993-06-26", IDA, "argentinos", 1, 0, "deportivo-espanol", en("Buenos Aires")],
      ["1993-06-27", IDA, "newells", 2, 0, "central", en("Rosario")],
      ["1993-06-26", IDA, "gimnasia", 1, 0, "estudiantes", en("La Plata", { note: "Así en RSSSF; Wikipedia da este partido 0-0 y el de vuelta 1-0. El global (1-0 para Gimnasia) es el mismo." })],
      ["1993-07-11", VUELTA, "river", 1, 0, "boca", en("Buenos Aires", { note: "Con alargue. River ganó la serie 1-0." })],
      ["1993-07-04", VUELTA, "velez", 1, 0, "ferro", en("Buenos Aires")],
      ["1993-07-02", VUELTA, "racing", 3, 2, "independiente", en("Avellaneda")],
      ["1993-07-04", VUELTA, "platense", 3, 0, "lanus", en("Vicente López")],
      ["1993-07-04", VUELTA, "belgrano", 1, 1, "deportivo-mandiyu", en("Córdoba", { advancedId: "belgrano", note: "Con alargue. 2-2 en el global; Belgrano ganó 5-3 por penales." })],
      ["1993-07-04", VUELTA, "sanlorenzo", 0, 0, "huracan", en("Buenos Aires")],
      ["1993-07-04", VUELTA, "argentinos", 0, 0, "deportivo-espanol", en("Buenos Aires")],
      ["1993-07-04", VUELTA, "newells", 1, 0, "central", en("Rosario")],
      ["1993-07-04", VUELTA, "gimnasia", 0, 0, "estudiantes", en("La Plata")],
      // Ronda de ganadores (River pasó directo a la segunda).
      ["1993-07-11", G(1), "velez", 2, 3, "racing", en("Buenos Aires")],
      ["1993-07-11", G(1), "belgrano", 2, 0, "platense", en("Córdoba")],
      ["1993-07-11", G(1), "argentinos", 1, 0, "sanlorenzo", en("Buenos Aires")],
      ["1993-07-11", G(1), "gimnasia", 1, 0, "newells", en("La Plata")],
      ["1993-07-18", G(2), "argentinos", 1, 2, "gimnasia", en("Buenos Aires", { note: "Wikipedia lo pone en la segunda ronda de ganadores y RSSSF en la tercera." })],
      ["1993-07-25", G(2), "river", 0, 1, "racing", en("Buenos Aires")],
      ["1993-08-01", G(3), "belgrano", 3, 2, "racing", en("Córdoba")],
      ["1993-08-07", "Final de la ronda de ganadores", "belgrano", 2, 2, "gimnasia", en("Córdoba", { advancedId: "gimnasia", note: "Con alargue. Gimnasia ganó 4-3 por penales y llegó a la final con ventaja deportiva." })],
      // Ronda de perdedores (Boca pasó directo a la segunda).
      ["1993-07-11", P(1), "independiente", 3, 0, "ferro", en("Lanús")],
      ["1993-07-11", P(1), "deportivo-mandiyu", 1, 0, "lanus", en("Banfield")],
      ["1993-07-11", P(1), "deportivo-espanol", 2, 1, "huracan", en("Buenos Aires")],
      ["1993-07-10", P(1), "estudiantes", 0, 1, "central", en("La Plata", { note: "RSSSF lo da el 10 de julio; Wikipedia, el 11." })],
      ["1993-07-18", P(2), "independiente", 1, 0, "platense", en("Banfield")],
      ["1993-07-18", P(2), "deportivo-espanol", 2, 1, "newells", en("Vicente López")],
      ["1993-07-18", P(2), "sanlorenzo", 0, 0, "central", en("Buenos Aires", { advancedId: "sanlorenzo", note: "Con alargue. San Lorenzo ganó 6-5 por penales." })],
      ["1993-07-25", P(2), "boca", 1, 0, "velez", en("Buenos Aires")],
      ["1993-07-25", P(3), "deportivo-espanol", 1, 0, "deportivo-mandiyu", en("Buenos Aires")],
      ["1993-08-01", P(3), "argentinos", 1, 0, "boca", en("Buenos Aires")],
      ["1993-08-08", P(3), "river", 3, 0, "independiente", en("Buenos Aires")],
      ["1993-08-14", P(4), "river", 3, 2, "deportivo-espanol", en("Buenos Aires")],
      ["1993-08-16", P(4), "sanlorenzo", 2, 1, "racing", en("Buenos Aires")],
      ["1993-08-27", P(5), "river", 2, 1, "argentinos", en("Buenos Aires")],
      ["1993-12-21", P(6), "river", 3, 2, "sanlorenzo", en("Buenos Aires")],
      ["1994-01-21", "Final de la ronda de perdedores", "river", 2, 1, "belgrano", en("Mendoza")],
      ["1994-01-30", "Final", "gimnasia", 3, 1, "river", {
        venue: "Estadio Juan Carmelo Zerillo (La Plata)",
        note: "Goles: Guerra 44', Fernández 76', Barros Schelotto 89' - Villalba 47'. Árbitro: Javier Castrilli. Gimnasia, ganador de la ronda de ganadores, jugaba de local y le alcanzaba con empatar.",
      }],
    ]),
    summary:
      "Gimnasia y Esgrima La Plata ganó la Copa Centenario: invicto en la ronda de ganadores, le ganó 3-1 la final a River, que había llegado por la ronda de perdedores. Fue el primer título oficial de Gimnasia en el profesionalismo.",
    notes: [
      {
        kind: "formato",
        text: "Copa por los 100 años de la AFA. Jugaron 18 equipos: los de Primera 1992/93 menos Talleres y San Martín de Tucumán, que habían descendido. Primera fase a ida y vuelta, casi siempre entre rivales clásicos (River pasó directo a la ronda de ganadores y Boca a la de perdedores); después, doble eliminación: el que perdía un partido en la ronda de ganadores pasaba a la de perdedores, y el que perdía en la de perdedores quedaba afuera. En la final, el ganador de la ronda de ganadores era local y le alcanzaba con un empate.",
      },
      {
        kind: "dato",
        text: "Resultados de RSSSF, controlados uno por uno con Wikipedia (43 partidos en las dos). RSSSF da la ciudad de cada partido, pero no quién fue local. Cuando la ciudad es la de uno solo de los dos equipos, figura como local ese equipo. En las series y los partidos entre dos equipos de la misma ciudad, o jugados en cancha neutral, se respeta el orden de la fuente.",
      },
    ],
  },
];
