// Copas internacionales oficiales entre clubes de Argentina y Uruguay (1905–1957) y el Campeonato Sudamericano de
// Campeones de 1948. Cargadas a mano desde RSSSF (sacups/argurucuptie, arguruhonor, aldao, escobargerona, copa48)
// y cruzadas con los artículos de Wikipedia de cada copa. Solo llevan los partidos de los clubes argentinos.
import type { Match, SeasonNote } from "../../lib/types";
import type { TournamentConfig } from "./config";

const ARG_URU = "Asociaciones de fútbol de Argentina y Uruguay";

type Row = [date: string, stage: string, home: string, hg: number, ag: number, away: string, venue: string, extra?: Partial<Match>];

const intl = (
  key: string,
  year: number,
  name: string,
  file: string,
  sacups: string,
  wiki: string,
  list: Row[],
  championIds: string[],
  runnerUpIds: string[] | undefined,
  summary: string,
  notes: SeasonNote[],
  more: Partial<TournamentConfig> = {},
): TournamentConfig => {
  const slug = `${key}-${year}`;
  return {
    slug,
    kind: "cup",
    international: true,
    year,
    file,
    sourceLinks: [
      { label: `RSSSF – ${name}`, url: `https://www.rsssf.org/sacups/${sacups}` },
      { label: `Wikipedia – ${wiki}`, url: `https://es.wikipedia.org/wiki/${encodeURIComponent(wiki.replace(/ /g, "_"))}` },
    ],
    competition: name,
    title: `${name} ${year}`,
    tournament: `${name} ${year}`,
    organizer: ARG_URU,
    championIds,
    runnerUpIds,
    skip: () => true,
    extraMatches: list.map(([date, stage, homeId, homeGoals, awayGoals, awayId, venue, extra], i) => ({
      id: `${slug}-${String(i + 1).padStart(3, "0")}`,
      date,
      stage,
      phase: "cup" as const,
      venue,
      homeId,
      awayId,
      homeGoals,
      awayGoals,
      sources: ["rsssf", "wikipedia-es"],
      ...extra,
    })),
    summary,
    notes,
    ...more,
  };
};

// ───────── Tie Cup (Copa de Competencia Chevallier Boutell), finales internacionales 1907–1919 ─────────
// Las ediciones 1900–1906 (con clubes de Montevideo y Rosario) la AFA las cuenta como copa nacional y ya están
// cargadas; desde 1907 la fase argentina fue la Copa de Competencia Jockey Club y la final se jugó contra el
// campeón uruguayo, siempre en Buenos Aires.
const TIE = "Copa Chevallier Boutell";
const TIE_FILE = "argurucuptie.html";
const TIE_SACUPS = "argurucuptie.html";
const TIE_WIKI = "Cup Tie Competition";
const TIE_FORMATO: SeasonNote = {
  kind: "formato",
  text: "Final a un partido en Buenos Aires entre el ganador de la fase argentina (la Copa de Competencia Jockey Club) y el ganador de la Copa de Competencia uruguaya.",
};
const tie = (year: number, list: Row[], champ: string | undefined, ru: string | undefined, summary: string, notes: SeasonNote[] = [], more: Partial<TournamentConfig> = {}) =>
  intl("chevallier-boutell", year, TIE, TIE_FILE, TIE_SACUPS, TIE_WIKI, list, champ ? [champ] : [], ru ? [ru] : undefined, summary, [TIE_FORMATO, ...notes], more);

const GEBA = "GEBA (Palermo, Buenos Aires)";
const RACING = "Racing Club (Avellaneda)";
const FERRO = "Ferro Carril Oeste (Caballito, Buenos Aires)";

const TIE_CUP: TournamentConfig[] = [
  tie(1907, [["1907-09-29", "Final", "alumni", 3, 1, "curcc-uy", FERRO]], "alumni", "curcc-uy", "Alumni le ganó 3-1 a CURCC en la primera final internacional de la copa."),
  tie(1908, [["1908-09-06", "Final", "alumni", 4, 0, "wanderers-uy", "Belgrano Athletic (Belgrano, Buenos Aires)"]], "alumni", "wanderers-uy", "Alumni le ganó 4-0 a Montevideo Wanderers."),
  tie(1909, [["1909-09-05", "Final", "alumni", 4, 0, "curcc-uy", GEBA]], "alumni", "curcc-uy", "Alumni le ganó 4-0 a CURCC y ganó su tercera final seguida."),
  tie(
    1910,
    [["1910-08-07", "Final", "estudiantes-ba", 2, 2, "curcc-uy", GEBA, { status: "annulled", note: "Se jugaron 61 minutos. El desempate nunca se jugó." }]],
    undefined,
    undefined,
    "La final entre Estudiantes (BA) y CURCC se interrumpió 2-2 a los 61 minutos y el desempate no se jugó: el 25 de abril de 1911 la copa se declaró desierta.",
    [{ kind: "anulado", text: "El partido no se completó y la copa quedó sin campeón: se muestra pero no suma en las estadísticas." }],
    { abandoned: true },
  ),
  tie(1911, [["1911-10-01", "Final", "san-isidro", 0, 2, "wanderers-uy", GEBA]], "wanderers-uy", "san-isidro", "Montevideo Wanderers le ganó 2-0 a San Isidro: primera Tie Cup para un club uruguayo."),
  tie(1912, [["1912-11-17", "Final", "san-isidro", 1, 0, "nacional-uy", RACING]], "san-isidro", "nacional-uy", "San Isidro le ganó 1-0 a Nacional de Montevideo."),
  tie(1913, [["1913-10-19", "Final", "san-isidro", 0, 1, "nacional-uy", RACING]], "nacional-uy", "san-isidro", "Nacional de Montevideo le ganó 1-0 a San Isidro."),
  tie(
    1914,
    [
      ["1914-08-30", "Rosario · Ronda preliminar", "rosario-athletic", 1, 2, "gimnasia-rosario", "Atlético del Rosario (Plaza Jewell, Rosario)", { sources: ["rsssf"] }],
      ["1914-08-30", "Rosario · Ronda preliminar", "newells", 3, 0, "provincial-rosario", "Newell's Old Boys (Barrio Vila, Rosario)", { sources: ["rsssf"] }],
      ["1914-11-08", "Rosario · Final", "gimnasia-rosario", 1, 2, "newells", "Argentino (Parque de la Independencia, Rosario)", { sources: ["rsssf"] }],
      ["1914-11-15", "Argentina · Final", "river", 4, 0, "newells", RACING],
      ["1914-12-20", "Final", "river", 1, 0, "bristol-uy", FERRO],
    ],
    "river",
    "bristol-uy",
    "River le ganó 1-0 a Bristol en la final: su primer título internacional. Antes le había ganado 4-0 a Newell's, ganador del cuadro rosarino, en la final argentina.",
    [
      {
        kind: "formato",
        text: "En 1914 la fase argentina tuvo dos cuadros: el de Buenos Aires (la Copa Jockey Club, que ganó River) y el de Rosario (que ganó Newell's). Los dos ganadores jugaron la final argentina.",
      },
      {
        kind: "fuentes",
        text: "RSSSF ubica el River 4-0 Newell's del 15 de noviembre en esta copa (final argentina); Wikipedia en inglés lo cuenta como final de la Copa Jockey Club 1914. Los partidos del cuadro rosarino salen solo de RSSSF.",
      },
      {
        kind: "identidad",
        text: "Bristol jugó la final invitado: Nacional, campeón de la copa uruguaya, no aceptaba el reglamento de las dos asociaciones por la ruptura de ese año entre la Liga Uruguaya y la Asociación Argentina.",
      },
    ],
  ),
  tie(1915, [["1915-10-31", "Final", "porteno", 0, 2, "nacional-uy", GEBA]], "nacional-uy", "porteno", "Nacional de Montevideo le ganó 2-0 a Porteño."),
  tie(1916, [["1916-12-24", "Final", "central", 0, 3, "penarol-uy", RACING]], "penarol-uy", "central", "Peñarol le ganó 3-0 a Rosario Central."),
  tie(
    1917,
    [["1918-04-21", "Final", "independiente", 0, 4, "wanderers-uy", GEBA, { note: "Suspendido a los 86 minutos; el 23 de abril quedó el resultado." }]],
    "wanderers-uy",
    "independiente",
    "Montevideo Wanderers le ganó 4-0 a Independiente en abril de 1918. El partido se suspendió a los 86 minutos y quedó ese resultado.",
  ),
  tie(1918, [["1918-12-01", "Final", "porteno", 1, 2, "wanderers-uy", GEBA]], "wanderers-uy", "porteno", "Montevideo Wanderers le ganó 2-1 a Porteño."),
  tie(
    1919,
    [["1920-05-25", "Final", "boca", 2, 0, "nacional-uy", "Sportivo Barracas (Barracas, Buenos Aires)"]],
    "boca",
    "nacional-uy",
    "Boca le ganó 2-0 a Nacional de Montevideo en mayo de 1920, en la última edición de la copa: su primer título internacional.",
  ),
];

// ───────── Copa de Honor Cusenier (1905–1920) ─────────
// La jugaban el ganador de la Copa de Honor argentina y el de la uruguaya; la final siempre en Montevideo.
const CUS = "Copa de Honor Cusenier";
const CUS_FORMATO: SeasonNote = {
  kind: "formato",
  text: "Final a un partido en Montevideo entre el ganador de la Copa de Honor argentina y el de la Copa de Honor uruguaya. Si había empate, desempate en otra fecha.",
};
const cus = (year: number, list: Row[], champ: string, ru: string, summary: string, notes: SeasonNote[] = []) =>
  intl("copa-cusenier", year, CUS, "arguruhonor.html", "arguruhonor.html", "Copa de Honor Cusenier", list, [champ], [ru], summary, [CUS_FORMATO, ...notes]);
const PARQUE_CENTRAL = "Gran Parque Central (Montevideo)";

const CUSENIER: TournamentConfig[] = [
  cus(1905, [["1905-09-10", "Final", "nacional-uy", 3, 2, "alumni", "Montevideo"]], "nacional-uy", "alumni", "Nacional le ganó 3-2 a Alumni en la primera edición."),
  cus(
    1906,
    [
      ["1906-09-16", "Final", "nacional-uy", 2, 2, "alumni", "Montevideo"],
      ["1906-10-14", "Final (desempate)", "nacional-uy", 1, 3, "alumni", "Montevideo"],
    ],
    "alumni",
    "nacional-uy",
    "Alumni le ganó 3-1 a Nacional en el desempate, después de un 2-2.",
  ),
  cus(1907, [["1907-10-20", "Final", "curcc-uy", 1, 2, "belgrano-athletic", "Montevideo", { note: "Con alargue." }]], "belgrano-athletic", "curcc-uy", "Belgrano Athletic le ganó 2-1 a CURCC en el alargue."),
  cus(1908, [["1908-10-11", "Final", "wanderers-uy", 2, 0, "quilmes", "Montevideo"]], "wanderers-uy", "quilmes", "Montevideo Wanderers le ganó 2-0 a Quilmes.", [
    { kind: "fuentes", text: "RSSSF marca por error a Quilmes como uruguayo; era el ganador de la Copa de Honor argentina 1908." },
  ]),
  cus(1909, [["1909-10-17", "Final", "curcc-uy", 4, 2, "san-isidro", PARQUE_CENTRAL]], "curcc-uy", "san-isidro", "CURCC le ganó 4-2 a San Isidro."),
  cus(1911, [["1911-11-05", "Final", "curcc-uy", 2, 0, "newells", "Montevideo"]], "curcc-uy", "newells", "CURCC le ganó 2-0 a Newell's Old Boys.", [
    { kind: "dato", text: "En 1910 la copa no se jugó." },
  ]),
  cus(1912, [["1912-12-08", "Final", "river-plate-fc-uy", 2, 1, "racing", PARQUE_CENTRAL]], "river-plate-fc-uy", "racing", "River Plate FC de Montevideo le ganó 2-1 a Racing."),
  cus(
    1913,
    [
      ["1913-11-16", "Final", "nacional-uy", 1, 1, "racing", PARQUE_CENTRAL, { note: "Con alargue." }],
      ["1913-12-08", "Final (desempate)", "nacional-uy", 2, 3, "racing", PARQUE_CENTRAL],
    ],
    "racing",
    "nacional-uy",
    "Racing le ganó 3-2 a Nacional en el desempate, después de un 1-1 con alargue.",
    [
      {
        kind: "fuentes",
        text: "Wikipedia en español y el sitio de Racing fechan el primer partido el 6 de noviembre; RSSSF y Wikipedia en inglés, el 16. Se toma el 16: Racing jugó la final de la Copa de Honor argentina el 9 de noviembre.",
      },
    ],
  ),
  cus(1915, [["1915-11-14", "Final", "nacional-uy", 2, 0, "racing", PARQUE_CENTRAL]], "nacional-uy", "racing", "Nacional le ganó 2-0 a Racing.", [
    { kind: "dato", text: "En 1914 la copa la jugaron solo equipos uruguayos." },
  ]),
  cus(1916, [["1916-12-10", "Final", "nacional-uy", 6, 1, "central", PARQUE_CENTRAL]], "nacional-uy", "central", "Nacional le ganó 6-1 a Rosario Central."),
  cus(1917, [["1918-04-21", "Final", "nacional-uy", 3, 1, "racing", "Parque Pereira (Montevideo)"]], "nacional-uy", "racing", "Nacional le ganó 3-1 a Racing en abril de 1918.", [
    { kind: "fuentes", text: "RSSSF da como fecha un inexistente 31 de abril de 1918; Wikipedia y las estadísticas de Nacional (atilio.uy) dan el 21 de abril." },
  ]),
  cus(1918, [["1918-12-01", "Final", "penarol-uy", 4, 0, "independiente", "Montevideo"]], "penarol-uy", "independiente", "Peñarol le ganó 4-0 a Independiente."),
  cus(1920, [["1923-09-20", "Final", "universal-uy", 0, 2, "boca", "Montevideo"]], "boca", "universal-uy", "Boca le ganó 2-0 a Universal en septiembre de 1923, en la última edición.", [
    {
      kind: "identidad",
      text: "Jugó Boca, finalista de la Copa de Honor 1920, porque Banfield (el campeón) se había desafiliado de la Asociación Argentina. En 1919 la copa no se jugó.",
    },
  ]),
];

// ───────── Copa Aldao (Campeonato Rioplatense), 1913–1957 ─────────
// Entre los campeones de las ligas de Argentina y Uruguay.
const ALD = "Copa Aldao";
const ALD_FORMATO: SeasonNote = { kind: "formato", text: "Partido entre los campeones de Argentina y Uruguay, un año en cada país." };
const ALD_IDA_VUELTA: SeasonNote = {
  kind: "formato",
  text: "Entre los campeones de Argentina y Uruguay, a dos partidos. Con igualdad de puntos, el título era compartido.",
};
const ald = (year: number, list: Row[], champ: string | undefined, ru: string | undefined, summary: string, notes: SeasonNote[], more: Partial<TournamentConfig> = {}) =>
  intl("copa-aldao", year, ALD, "aldao.html", "aldao.html", "Copa Aldao", list, champ ? [champ] : [], ru ? [ru] : undefined, summary, notes, more);
const CENTENARIO = "Estadio Centenario (Montevideo)";
const GASOMETRO = "Gasómetro (Boedo, Buenos Aires)";

const ALDAO: TournamentConfig[] = [
  ald(1916, [["1916-12-03", "Final", "racing", 1, 2, "nacional-uy", GEBA]], "nacional-uy", "racing", "Nacional le ganó 2-1 a Racing en la primera edición que se jugó.", [
    ALD_FORMATO,
    { kind: "dato", text: "La de 1913 (Estudiantes de La Plata, campeón de la Federación, contra River Plate FC) se suspendió por lluvia y nunca se jugó." },
  ]),
  ald(
    1917,
    [
      ["1918-04-19", "Final (ida)", "nacional-uy", 2, 2, "racing", "Parque Pereira (Montevideo)"],
      ["1918-07-09", "Final (vuelta)", "racing", 2, 1, "nacional-uy", GEBA],
    ],
    "racing",
    "nacional-uy",
    "Racing empató 2-2 en Montevideo y ganó 2-1 en Buenos Aires.",
    [ALD_IDA_VUELTA],
  ),
  ald(1918, [["1919-01-05", "Final", "racing", 2, 1, "penarol-uy", GEBA]], "racing", "penarol-uy", "Racing le ganó 2-1 a Peñarol en enero de 1919.", [ALD_FORMATO]),
  ald(1919, [["1920-05-16", "Final", "nacional-uy", 3, 0, "boca", PARQUE_CENTRAL]], "nacional-uy", "boca", "Nacional le ganó 3-0 a Boca en mayo de 1920.", [ALD_FORMATO]),
  ald(1920, [["1921-11-20", "Final", "boca", 1, 2, "nacional-uy", "Sportivo Barracas (Barracas, Buenos Aires)"]], "nacional-uy", "boca", "Nacional le ganó 2-1 a Boca en Buenos Aires, en noviembre de 1921.", [
    ALD_FORMATO,
    {
      kind: "dato",
      text: "Entre 1921 y 1926 no se jugó entre las asociaciones oficiales. En 1923 San Lorenzo (Asociación Amateurs) le ganó 1-0 a Atlético Wanderers (Federación Uruguaya), ambos de ligas disidentes, por otra copa: la Copa Campeonato del Río de la Plata.",
    },
  ]),
  ald(1927, [["1928-12-30", "Final", "rampla-uy", 0, 1, "sanlorenzo", PARQUE_CENTRAL]], "sanlorenzo", "rampla-uy", "San Lorenzo le ganó 1-0 a Rampla Juniors en Montevideo.", [ALD_FORMATO]),
  ald(1928, [["1929-10-26", "Final", "huracan", 0, 3, "penarol-uy", "River Plate (Buenos Aires)"]], "penarol-uy", "huracan", "Peñarol le ganó 3-0 a Huracán en Buenos Aires.", [ALD_FORMATO]),
  ald(1936, [["1937-03-20", "Final", "penarol-uy", 1, 5, "river", CENTENARIO]], "river", "penarol-uy", "River le ganó 5-1 a Peñarol en el Centenario.", [ALD_FORMATO]),
  ald(1937, [["1938-01-15", "Final", "river", 5, 2, "penarol-uy", GASOMETRO]], "river", "penarol-uy", "River le ganó 5-2 a Peñarol.", [ALD_FORMATO]),
  ald(1938, [["1938-12-29", "Final", "penarol-uy", 1, 3, "independiente", CENTENARIO]], "independiente", "penarol-uy", "Independiente le ganó 3-1 a Peñarol en el Centenario.", [ALD_FORMATO]),
  ald(1939, [["1940-07-09", "Final", "independiente", 5, 0, "nacional-uy", GASOMETRO]], "independiente", "nacional-uy", "Independiente le ganó 5-0 a Nacional.", [ALD_FORMATO]),
  ald(
    1940,
    [["1940-12-28", "Partido por la copa", "nacional-uy", 2, 2, "boca", CENTENARIO, { note: "Boca se retiró antes del alargue." }]],
    undefined,
    undefined,
    "Nacional y Boca empataron 2-2 y Boca se retiró antes del alargue. La copa se le dio primero a Nacional, pero las asociaciones nunca definieron el título.",
    [ALD_FORMATO],
    { abandoned: true },
  ),
  ald(
    1941,
    [
      ["1942-03-29", "Final (ida)", "river", 6, 1, "nacional-uy", GASOMETRO],
      ["1942-12-05", "Final (vuelta)", "nacional-uy", 1, 1, "river", CENTENARIO, { advancedId: "river" }],
    ],
    "river",
    "nacional-uy",
    "River le ganó 6-1 a Nacional en Buenos Aires y empató 1-1 en Montevideo.",
    [ALD_IDA_VUELTA],
  ),
  ald(
    1942,
    [["1942-12-08", "Final (ida)", "nacional-uy", 4, 0, "river", CENTENARIO]],
    undefined,
    undefined,
    "Nacional le ganó 4-0 a River en la ida, pero la vuelta no se jugó y el título no se proclamó.",
    [ALD_IDA_VUELTA],
    { abandoned: true },
  ),
  ald(
    1945,
    [
      ["1945-12-06", "Final (ida)", "penarol-uy", 1, 2, "river", CENTENARIO],
      ["1945-12-12", "Final (vuelta)", "river", 3, 2, "penarol-uy", GASOMETRO],
    ],
    "river",
    "penarol-uy",
    "River le ganó los dos partidos a Peñarol: 2-1 en Montevideo y 3-2 en Buenos Aires.",
    [ALD_IDA_VUELTA, { kind: "dato", text: "La de 1946 (San Lorenzo contra Nacional, en 1948) fueron dos amistosos: no cuenta como Copa Aldao." }],
  ),
  ald(
    1947,
    [
      ["1947-11-19", "Final (ida)", "nacional-uy", 3, 4, "river", CENTENARIO],
      ["1947-11-23", "Final (vuelta)", "river", 3, 1, "nacional-uy", GASOMETRO],
    ],
    "river",
    "nacional-uy",
    "River le ganó 4-3 a Nacional en Montevideo y 3-1 en Buenos Aires.",
    [ALD_IDA_VUELTA],
  ),
  ald(
    1957,
    [["1959-04-11", "Final (ida)", "nacional-uy", 1, 2, "river", CENTENARIO]],
    undefined,
    undefined,
    "River le ganó 2-1 a Nacional en Montevideo (abril de 1959), pero Nacional no jugó la vuelta y el título no se proclamó.",
    [ALD_IDA_VUELTA],
    { abandoned: true },
  ),
];

// ───────── Copa de Confraternidad Escobar-Gerona (1941–1946) ─────────
// Entre los subcampeones de Argentina y Uruguay.
const EG = "Copa Escobar-Gerona";
const EG_FORMATO: SeasonNote = { kind: "formato", text: "Entre los subcampeones de Argentina y Uruguay, a dos partidos." };
const eg = (year: number, list: Row[], champ: string | undefined, ru: string | undefined, summary: string, notes: SeasonNote[] = [], more: Partial<TournamentConfig> = {}) =>
  intl("copa-escobar-gerona", year, EG, "escobargerona.html", "escobargerona.html", "Copa de Confraternidad Escobar-Gerona", list, champ ? [champ] : [], ru ? [ru] : undefined, summary, [EG_FORMATO, ...notes], more);
const PROCLAMADO: SeasonNote = {
  kind: "fuentes",
  text: "Según RSSSF las asociaciones no llegaron a proclamar al ganador; Wikipedia y el palmarés de Boca cuentan el título para Boca, como se muestra acá.",
};

const ESCOBAR_GERONA: TournamentConfig[] = [
  eg(1941, [["1942-03-29", "Final (ida)", "penarol-uy", 1, 2, "sanlorenzo", CENTENARIO]], undefined, undefined, "San Lorenzo le ganó 2-1 a Peñarol en la ida; la vuelta no se jugó y la copa quedó desierta.", [], { abandoned: true }),
  eg(1942, [["1943-08-25", "Final (ida)", "penarol-uy", 4, 1, "sanlorenzo", CENTENARIO]], undefined, undefined, "Peñarol le ganó 4-1 a San Lorenzo en la ida; la vuelta no se jugó y la copa quedó desierta.", [], { abandoned: true }),
  eg(
    1945,
    [
      ["1945-12-05", "Final (ida)", "boca", 1, 2, "nacional-uy", GASOMETRO],
      ["1945-12-22", "Final (vuelta)", "nacional-uy", 2, 3, "boca", CENTENARIO],
    ],
    "boca",
    "nacional-uy",
    "Nacional ganó 2-1 en Buenos Aires y Boca 3-2 en Montevideo: igualdad de puntos y de goles. Boca se quedó con la copa por los goles de visitante.",
    [PROCLAMADO],
  ),
  eg(
    1946,
    [
      ["1946-12-21", "Final (ida)", "penarol-uy", 2, 3, "boca", CENTENARIO],
      ["1946-12-28", "Final (vuelta)", "boca", 6, 3, "penarol-uy", GASOMETRO],
    ],
    "boca",
    "penarol-uy",
    "Boca le ganó 3-2 a Peñarol en Montevideo y 6-3 en Buenos Aires.",
    [PROCLAMADO],
  ),
];

// ───────── Campeonato Sudamericano de Campeones 1948 (Santiago de Chile) ─────────
const ESTADIO_NACIONAL = "Estadio Nacional (Santiago de Chile)";
const SUDAMERICANO_1948: TournamentConfig = {
  ...intl(
    "sudamericano-campeones",
    1948,
    "Campeonato Sudamericano de Campeones",
    "copa48.html",
    "copa48.html",
    "Campeonato Sudamericano de Campeones",
    [
      ["1948-02-18", "Fecha 2", "river", 4, 0, "emelec-ec", ESTADIO_NACIONAL],
      ["1948-02-21", "Fecha 3", "river", 2, 0, "municipal-pe", ESTADIO_NACIONAL],
      ["1948-03-03", "Fecha 5", "nacional-uy", 3, 0, "river", ESTADIO_NACIONAL],
      ["1948-03-09", "Fecha 6", "river", 5, 1, "litoral-bo", ESTADIO_NACIONAL],
      ["1948-03-14", "Fecha 7", "vasco-br", 0, 0, "river", ESTADIO_NACIONAL],
      ["1948-03-17", "Fecha 8", "river", 1, 0, "colo-colo-cl", ESTADIO_NACIONAL],
    ],
    ["vasco-br"],
    ["river"],
    "River, campeón argentino de 1947, fue segundo a un punto de Vasco da Gama, con el que empató 0-0 en la última fecha. Es el antecedente de la Copa Libertadores.",
    [
      { kind: "formato", text: "Todos contra todos a una rueda entre siete campeones sudamericanos, en Santiago de Chile." },
      {
        kind: "dato",
        text: "Tabla final: Vasco da Gama 10 puntos, River 9, Nacional 8, Municipal y Colo-Colo 6, Litoral 2, Emelec 1. River: 4 ganados, 1 empatado y 1 perdido, 12 goles a favor y 4 en contra.",
      },
    ],
  ),
  organizer: "Colo-Colo, con el aval de la Confederación Sudamericana de Fútbol",
  tournament: "Campeonato Sudamericano de Campeones 1948",
  noFinal: true,
  noEliminationCheck: true,
};

export const CUP_TOURNAMENTS_INTL_AMATEUR: TournamentConfig[] = [...TIE_CUP, ...CUSENIER, ...ALDAO, ...ESCOBAR_GERONA, SUDAMERICANO_1948];
