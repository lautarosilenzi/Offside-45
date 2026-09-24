import type { Match } from "../types";

// Era amateur (hasta 1930). Cada partido fue cruzado entre RSSSF (resultados partido por partido)
// y Wikipedia. Los desacuerdos entre fuentes quedan explicados en `note`.
//
// No incluidos todavía:
// - Racing vs Independiente, Segunda División 1910 (2 partidos): solo aparecen en Wikipedia ES, sin fecha del segundo.
// - Amistosos (ej. Boca 2-1 River en 1908, Huracán 3-1 San Lorenzo en 1915).
// - 1929: no hubo clásicos; River, Racing y Huracán jugaron en la Zona Impar y Boca, Independiente y San Lorenzo en la Par.
// - 1920-1926: River y San Lorenzo jugaron en la Asociación Amateurs y Boca y Huracán en la Asociación Argentina (cisma).

const LIGA = "Primera División";
const CC_JOCKEY = "Copa de Competencia Jockey Club";
const CC_AAM = "Copa de Competencia (Asociación Amateurs)";
const HONOR = "Copa de Honor MCBA";

const CANCHA_RACING = "Cancha de Racing (Avellaneda)";
const CANCHA_INDEPENDIENTE = "Cancha de Independiente (Avellaneda)";
const CANCHA_FERRO = "Cancha de Ferro Carril Oeste (Caballito)";
const BRANDSEN = "Brandsen y Del Crucero (Boca)";
const GASOMETRO = "Gasómetro (San Lorenzo)";
const HURACAN_CHICLANA = "Cancha de Huracán (Chiclana y Alagón)";
const HURACAN_NEWBERY = "Estadio Jorge Newbery (Huracán)";

const BOTH: Match["sources"] = ["rsssf", "wikipedia-es"];

export const AMATEUR_MATCHES: Match[] = [
  // ───────────── River Plate vs Boca Juniors ─────────────
  { id: "rb-1913-08-24", date: "1913-08-24", competition: LIGA, stage: "Campeonato 1913 (AAF)", venue: CANCHA_RACING, homeId: "boca", awayId: "river", homeGoals: 1, awayGoals: 2, note: "Primer Superclásico oficial. Goles: Mayer; C. García y Ameal Pereyra.", sources: BOTH },
  { id: "rb-1914-10-25", date: "1914-10-25", competition: LIGA, stage: "Campeonato 1914", venue: CANCHA_FERRO, homeId: "river", awayId: "boca", homeGoals: 0, awayGoals: 0, sources: BOTH },
  { id: "rb-1915-05-02", date: "1915-05-02", competition: CC_JOCKEY, stage: "Primera fase", venue: "Cancha de Boca (Wilde)", homeId: "boca", awayId: "river", homeGoals: 1, awayGoals: 1, note: "Duró 150 minutos (con alargue). Hubo desempate.", sources: BOTH },
  { id: "rb-1915-05-09", date: "1915-05-09", competition: CC_JOCKEY, stage: "Primera fase, desempate", venue: "GEBA (Palermo)", homeId: "river", awayId: "boca", homeGoals: 4, awayGoals: 2, sources: BOTH },
  { id: "rb-1915-06-20", date: "1915-06-20", competition: LIGA, stage: "Campeonato 1915", venue: "Cancha de Boca (Wilde)", homeId: "boca", awayId: "river", homeGoals: 0, awayGoals: 2, note: "Dos goles de Penney.", sources: BOTH },
  { id: "rb-1916-12-10", date: "1916-12-10", competition: LIGA, stage: "Campeonato 1916", venue: CANCHA_RACING, homeId: "river", awayId: "boca", homeGoals: 2, awayGoals: 1, sources: BOTH },
  { id: "rb-1917-06-24", date: "1917-06-24", competition: LIGA, stage: "Campeonato 1917", venue: CANCHA_RACING, homeId: "river", awayId: "boca", homeGoals: 2, awayGoals: 2, sources: BOTH },
  { id: "rb-1918-08-30", date: "1918-08-30", competition: CC_JOCKEY, stage: "Octavos de final", venue: CANCHA_RACING, homeId: "boca", awayId: "river", homeGoals: 0, awayGoals: 1, sources: BOTH },
  { id: "rb-1918-09-18", date: "1918-09-18", competition: LIGA, stage: "Campeonato 1918", venue: CANCHA_RACING, homeId: "river", awayId: "boca", homeGoals: 0, awayGoals: 1, sources: BOTH },
  { id: "rb-1919-07-27", date: "1919-07-27", competition: LIGA, stage: "Campeonato 1919 (AAF)", venue: "Ministro Brin y Senguel (Boca)", homeId: "boca", awayId: "river", homeGoals: 0, awayGoals: 0, status: "annulled", note: "El campeonato de la AAF se anuló tras la desafiliación de River y otros clubes. No suma en el historial.", sources: BOTH },
  { id: "rb-1927-12-04", date: "1927-12-04", competition: LIGA, stage: "Campeonato 1927", venue: BRANDSEN, homeId: "boca", awayId: "river", homeGoals: 1, awayGoals: 0, note: "Primer Superclásico tras la reunificación de 1927.", sources: BOTH },
  { id: "rb-1928-12-23", date: "1928-12-23", competition: LIGA, stage: "Campeonato 1928", venue: BRANDSEN, homeId: "boca", awayId: "river", homeGoals: 6, awayGoals: 0, note: "La mayor goleada del Superclásico. River terminó con jugadores de menos por lesiones.", sources: BOTH },
  { id: "rb-1930-05-04", date: "1930-05-04", competition: LIGA, stage: "Campeonato 1930", venue: "Alvear y Tagle (River)", homeId: "river", awayId: "boca", homeGoals: 3, awayGoals: 2, note: "Último Superclásico del amateurismo.", sources: BOTH },

  // ───────────── Racing Club vs Independiente ─────────────
  { id: "ri-1915-12-12", date: "1915-12-12", competition: LIGA, stage: "Campeonato 1915", venue: "Sin confirmar", homeId: "racing", awayId: "independiente", homeGoals: 1, awayGoals: 2, awardedTo: "racing", note: "Independiente ganó 2-1 en la cancha pero perdió los puntos, que se le dieron a Racing. Las fuentes no coinciden sobre el estadio.", sources: ["rsssf", "wikipedia-es", "wikipedia-en"] },
  { id: "ri-1916-07-30", date: "1916-07-30", competition: LIGA, stage: "Campeonato 1916", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 1, sources: BOTH },
  { id: "ri-1917-04-22", date: "1917-04-22", competition: CC_JOCKEY, stage: "Eliminatoria", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 1, awayGoals: 1, note: "Duró 135 minutos. Hubo desempates.", sources: BOTH },
  { id: "ri-1917-05-06", date: "1917-05-06", competition: CC_JOCKEY, stage: "Eliminatoria, desempate", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 0, note: "Con alargue.", sources: BOTH },
  { id: "ri-1917-05-13", date: "1917-05-13", competition: CC_JOCKEY, stage: "Eliminatoria, segundo desempate", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 0, awayGoals: 1, note: "Independiente fue campeón de esa Copa de Competencia.", sources: BOTH },
  { id: "ri-1917-07-22", date: "1917-07-22", competition: HONOR, venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 1, awayGoals: 3, note: "Con alargue.", sources: BOTH },
  { id: "ri-1917-12-30", date: "1917-12-30", competition: LIGA, stage: "Campeonato 1917", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 1, awayGoals: 0, sources: BOTH },
  { id: "ri-1918-06-16", date: "1918-06-16", competition: LIGA, stage: "Campeonato 1918", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 2, note: "Dos goles de Perinetti.", sources: BOTH },
  { id: "ri-1918-07-14", date: "1918-07-14", competition: HONOR, venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 2, awayGoals: 1, note: "RSSSF lo fecha el domingo 14/7; Wikipedia EN, el 9/7.", sources: ["rsssf", "wikipedia-en"] },
  { id: "ri-1919-06-22", date: "1919-06-22", competition: LIGA, stage: "Campeonato 1919 (AAF)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 1, awayGoals: 1, status: "annulled", note: "El campeonato de la AAF se anuló tras la desafiliación de ambos clubes. No suma en el historial.", sources: ["rsssf"] },
  { id: "ri-1919-12-07", date: "1919-12-07", competition: LIGA, stage: "Campeonato 1919 (Asociación Amateurs)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 1, sources: BOTH },
  { id: "ri-1920-08-01", date: "1920-08-01", competition: LIGA, stage: "Campeonato 1920 (Asociación Amateurs)", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 1, awayGoals: 0, sources: BOTH },
  { id: "ri-1920-10-17", date: "1920-10-17", competition: LIGA, stage: "Campeonato 1920 (Asociación Amateurs)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 2, awayGoals: 1, sources: BOTH },
  { id: "ri-1921-04-03", date: "1921-04-03", competition: LIGA, stage: "Campeonato 1921 (Asociación Amateurs)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 1, awayGoals: 1, note: "Se suspendió en el entretiempo (0-1) y se completó el 3/7/1921.", sources: BOTH },
  { id: "ri-1921-08-21", date: "1921-08-21", competition: LIGA, stage: "Campeonato 1921 (Asociación Amateurs)", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 1, awayGoals: 0, sources: BOTH },
  { id: "ri-1922-06-04", date: "1922-06-04", competition: LIGA, stage: "Campeonato 1922 (Asociación Amateurs)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 2, awayGoals: 3, sources: BOTH },
  { id: "ri-1922-12-10", date: "1922-12-10", competition: LIGA, stage: "Campeonato 1922 (Asociación Amateurs)", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 2, awayGoals: 4, sources: BOTH },
  { id: "ri-1923-08-05", date: "1923-08-05", competition: LIGA, stage: "Campeonato 1923 (Asociación Amateurs)", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 0, awayGoals: 1, sources: BOTH },
  { id: "ri-1924-04-20", date: "1924-04-20", competition: LIGA, stage: "Campeonato 1924 (Asociación Amateurs)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 1, sources: BOTH },
  { id: "ri-1925-01-18", date: "1925-01-18", competition: CC_AAM, stage: "Edición 1924", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 0, awayGoals: 0, sources: BOTH },
  { id: "ri-1925-01-25", date: "1925-01-25", competition: CC_AAM, stage: "Edición 1924, desempate", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 0, awayGoals: 0, sources: BOTH },
  { id: "ri-1925-02-01", date: "1925-02-01", competition: CC_AAM, stage: "Edición 1924, segundo desempate", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 0, note: "Racing se retiró antes del cuarto partido (8/2) y la serie fue para Independiente.", sources: ["rsssf"] },
  { id: "ri-1925-08-09", date: "1925-08-09", competition: LIGA, stage: "Campeonato 1925 (Asociación Amateurs)", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 0, sources: BOTH },
  { id: "ri-1926-05-13", date: "1926-05-13", competition: CC_AAM, stage: "Edición 1926", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 0, awayGoals: 2, note: "Goles de Seoane y Orsi.", sources: BOTH },
  { id: "ri-1926-09-12", date: "1926-09-12", competition: LIGA, stage: "Campeonato 1926 (Asociación Amateurs)", venue: CANCHA_RACING, homeId: "racing", awayId: "independiente", homeGoals: 1, awayGoals: 3, sources: BOTH },
  { id: "ri-1927-12-18", date: "1927-12-18", competition: LIGA, stage: "Campeonato 1927", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 7, awayGoals: 4, note: "Hat-trick de Seoane. Wikipedia ES lo fecha el 18/11, pero ese día fue viernes; RSSSF indica el domingo 18/12 (fecha postergada).", sources: BOTH },
  { id: "ri-1928-09-16", date: "1928-09-16", competition: LIGA, stage: "Campeonato 1928", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 2, awayGoals: 1, sources: BOTH },
  { id: "ri-1930-04-13", date: "1930-04-13", competition: LIGA, stage: "Campeonato 1930", venue: CANCHA_INDEPENDIENTE, homeId: "independiente", awayId: "racing", homeGoals: 3, awayGoals: 1, sources: BOTH },

  // ───────────── San Lorenzo vs Huracán ─────────────
  { id: "sh-1915-10-24", date: "1915-10-24", competition: LIGA, stage: "Campeonato 1915", venue: CANCHA_FERRO, homeId: "sanlorenzo", awayId: "huracan", homeGoals: 3, awayGoals: 1, note: "Primer clásico oficial. Huracán terminó con dos expulsados.", sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1916-07-30", date: "1916-07-30", competition: LIGA, stage: "Campeonato 1916", venue: HURACAN_CHICLANA, homeId: "huracan", awayId: "sanlorenzo", homeGoals: 0, awayGoals: 1, sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1917-05-13", date: "1917-05-13", competition: LIGA, stage: "Campeonato 1917", venue: GASOMETRO, homeId: "sanlorenzo", awayId: "huracan", homeGoals: 0, awayGoals: 0, sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1918-05-05", date: "1918-05-05", competition: HONOR, venue: GASOMETRO, homeId: "sanlorenzo", awayId: "huracan", homeGoals: 0, awayGoals: 2, note: "Primera victoria oficial de Huracán en el clásico.", sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1918-05-09", date: "1918-05-09", competition: LIGA, stage: "Campeonato 1918", venue: HURACAN_CHICLANA, homeId: "huracan", awayId: "sanlorenzo", homeGoals: 0, awayGoals: 0, sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1927-05-08", date: "1927-05-08", competition: LIGA, stage: "Campeonato 1927", venue: HURACAN_NEWBERY, homeId: "huracan", awayId: "sanlorenzo", homeGoals: 1, awayGoals: 2, sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1929-03-03", date: "1929-03-03", competition: LIGA, stage: "Campeonato 1928", venue: HURACAN_NEWBERY, homeId: "huracan", awayId: "sanlorenzo", homeGoals: 1, awayGoals: 2, note: "Partido del torneo 1928 jugado en marzo de 1929.", sources: ["rsssf", "wikipedia-en"] },
  { id: "sh-1930-12-21", date: "1930-12-21", competition: LIGA, stage: "Campeonato 1930", venue: GASOMETRO, homeId: "sanlorenzo", awayId: "huracan", homeGoals: 3, awayGoals: 1, sources: ["rsssf", "wikipedia-en"] },
];
