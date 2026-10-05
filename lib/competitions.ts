// Competencias del menú lateral, agrupadas como en el menú. Cada una tiene su logo (public/comps, ver scripts/comps) y una
// página: las que ya tienen datos van a su sección; el resto, a /ligas/<país>/<id>, que espera la conexión con los
// resultados en vivo.
export type Competition = {
  id: string;
  name: string;
  // Artículo de Wikipedia del que sale el logo ("es:Título" o "en:Título"); vacío = sin logo (secciones del sitio).
  wiki: string;
  // Página propia del sitio, si ya tiene datos.
  href?: string;
};

export type CountryGroup = { id: string; name: string; flag: string; competitions: Competition[] };

const c = (id: string, name: string, wiki: string, href?: string): Competition => ({ id, name, wiki, href });

// Destacado: lo mismo que destacan los sitios de resultados. Las que tienen datos en vivo van a su página de torneo
// (/torneos/<id>: fixture, tablas, equipos y estadísticas); la historia de cada una sigue en su sección.
export const FEATURED: Competition[] = [
  c("en-vivo", "En vivo", "", "/en-vivo"),
  c("liga-profesional", "Liga Profesional", "es:Primera División de Argentina", "/torneos/liga-profesional"),
  c("primera-nacional", "Primera Nacional", "en:Primera Nacional", "/torneos/primera-nacional"),
  c("libertadores", "Libertadores", "en:Copa Libertadores", "/torneos/libertadores"),
  c("sudamericana", "Sudamericana", "en:Copa Sudamericana", "/torneos/sudamericana"),
  c("copa-argentina", "Copa Argentina", "en:Copa Argentina", "/torneos/copa-argentina"),
  c("champions", "Champions", "es:Liga de Campeones de la UEFA", "/torneos/champions"),
  c("eliminatorias", "Eliminatorias Conmebol", "", "/torneos/eliminatorias"),
  c("mundial", "Mundiales", "en:FIFA World Cup Trophy" /* logo: ilustración de Commons, cargada a mano */, "/mundiales"),
  c("messi-vs-cristiano", "Messi vs Cristiano", "", "/messi-vs-cristiano"),
];

export const GROUPS: CountryGroup[] = [
  {
    id: "argentina",
    name: "Argentina",
    flag: "ar",
    competitions: [
      c("liga-profesional", "Liga Profesional", "es:Primera División de Argentina", "/temporadas"),
      c("primera-nacional", "Primera Nacional", "en:Primera Nacional"),
      c("copa-argentina", "Copa Argentina", "en:Copa Argentina", "/copa-argentina"),
      c("trofeo-campeones", "Trofeo de Campeones", ""),
      c("supercopa-argentina", "Supercopa Argentina", ""),
      c("primera-b-metro", "Primera B Metro", "en:Primera B Metropolitana"),
      c("federal-a", "Federal A", "es:Torneo Federal A"),
      c("primera-c", "Primera C", "en:Primera C"),
      c("promocional-amateur", "Promocional Amateur", ""),
      c("reserva", "Liga Profesional · Reserva", ""),
      c("liga-femenina", "Liga Femenina", ""),
      c("futsal", "Futsal", ""),
      c("copas-nacionales", "Copas Nacionales (historia)", "", "/copas"),
      c("descensos", "Descensos", "", "/descensos"),
      c("campeones", "Campeones", "", "/campeones"),
      c("estadisticas", "Estadísticas", "", "/estadisticas"),
      c("historia-liga", "Historia de la liga desde 1891", "", "/temporadas"),
    ],
  },
  {
    id: "internacional",
    name: "Internacional",
    flag: "un",
    competitions: [
      c("libertadores", "Copa Libertadores", "en:Copa Libertadores", "/libertadores"),
      c("sudamericana", "Copa Sudamericana", "en:Copa Sudamericana", "/sudamericana"),
      c("champions", "Champions League", "es:Liga de Campeones de la UEFA"),
      c("copa-intercontinental", "Copa Intercontinental", ""),
      c("europa-league", "Europa League", "es:Liga Europa de la UEFA"),
      c("conference-league", "Conference League", "en:UEFA Conference League"),
      c("mundial-clubes", "Intercontinental y Mundial de Clubes", "es:Copa Mundial de Clubes de la FIFA", "/mundial-de-clubes"),
      c("concacaf-champions", "Concacaf Champions Cup", "es:Copa de Campeones de la Concacaf"),
      c("recopa", "Recopa Sudamericana", "es:Recopa Sudamericana", "/recopa"),
      c("internacionales", "Clubes argentinos en copas internacionales", "", "/internacionales"),
    ],
  },
  { id: "inglaterra", name: "Inglaterra", flag: "gb-eng", competitions: [c("premier-league", "Premier League", "es:Premier League"), c("championship", "Championship", "es:EFL Championship"), c("fa-cup", "FA Cup", "en:FA Cup")] },
  { id: "espana", name: "España", flag: "es", competitions: [c("laliga", "LaLiga", "es:Primera División de España"), c("segunda-espana", "Segunda División", "es:Segunda División de España"), c("copa-del-rey", "Copa del Rey", "es:Copa del Rey")] },
  { id: "italia", name: "Italia", flag: "it", competitions: [c("serie-a", "Serie A", "es:Serie A (Italia)"), c("serie-b", "Serie B", "es:Serie B (Italia)"), c("coppa-italia", "Copa Italia", "es:Copa Italia")] },
  { id: "alemania", name: "Alemania", flag: "de", competitions: [c("bundesliga", "Bundesliga", "en:Bundesliga"), c("2-bundesliga", "2. Bundesliga", "es:2. Bundesliga"), c("dfb-pokal", "Copa de Alemania", "es:Copa de Alemania")] },
  { id: "portugal", name: "Portugal", flag: "pt", competitions: [c("primeira-liga", "Primeira Liga", "es:Primeira Liga"), c("taca-portugal", "Copa de Portugal", "en:Taça de Portugal")] },
  { id: "francia", name: "Francia", flag: "fr", competitions: [c("ligue-1", "Ligue 1", "es:Ligue 1"), c("ligue-2", "Ligue 2", "es:Ligue 2"), c("coupe-de-france", "Copa de Francia", "en:Coupe de France")] },
  { id: "brasil", name: "Brasil", flag: "br", competitions: [c("brasileirao", "Brasileirão Serie A", "es:Campeonato Brasileño de Serie A"), c("brasileirao-b", "Brasileirão Serie B", "es:Campeonato Brasileño de Serie B"), c("copa-do-brasil", "Copa de Brasil", "es:Copa de Brasil")] },
  { id: "uruguay", name: "Uruguay", flag: "uy", competitions: [c("primera-uruguay", "Primera División", "es:Primera División de Uruguay")] },
  { id: "paraguay", name: "Paraguay", flag: "py", competitions: [c("primera-paraguay", "Primera División", "es:Primera División de Paraguay")] },
  { id: "colombia", name: "Colombia", flag: "co", competitions: [c("primera-colombia", "Primera A", "es:Categoría Primera A")] },
  { id: "chile", name: "Chile", flag: "cl", competitions: [c("primera-chile", "Primera División", "en:Chilean Primera División")] },
  { id: "mexico", name: "México", flag: "mx", competitions: [c("liga-mx", "Liga MX", "es:Primera División de México")] },
  { id: "eeuu", name: "Estados Unidos", flag: "us", competitions: [c("mls", "MLS", "es:Major League Soccer")] },
  {
    id: "jugadores",
    name: "Jugadores",
    flag: "un",
    competitions: [
      c("messi-vs-cristiano", "Messi vs Cristiano", "", "/messi-vs-cristiano"),
      c("comparador", "Comparador de leyendas", "", "/jugadores"),
    ],
  },
  {
    id: "selecciones",
    name: "Selecciones",
    flag: "un",
    competitions: [
      c("mundial", "Mundiales", "en:FIFA World Cup Trophy" /* logo: ilustración de Commons, cargada a mano */, "/mundiales"),
      c("balon-de-oro", "Balón de Oro", "en:Ballon d'Or", "/balon-de-oro"),
      c("copa-america", "Copa América", "es:Copa América"),
      c("eliminatorias", "Eliminatorias Conmebol", ""),
      c("eurocopa", "Eurocopa", "en:UEFA European Championship"),
    ],
  },
];

// Página de una competencia: la propia si tiene datos, o la que espera los resultados en vivo.
// Las competencias con datos en vivo van a su página de torneo (la historia queda en la pestaña Campeones).
export const compHref = (group: CountryGroup, comp: Competition) => (LIVE_CODE[comp.id] ? `/torneos/${comp.id}` : comp.href ?? `/ligas/${group.id}/${comp.id}`);


// Código de cada competencia en la API de resultados en vivo (lib/live/espn.ts).
export const LIVE_CODE: Record<string, string> = {
  "liga-profesional": "arg.1",
  "copa-argentina": "arg.copa",
  "trofeo-campeones": "arg.trofeo_de_la_campeones",
  "supercopa-argentina": "arg.supercopa",
  "copa-intercontinental": "fifa.intercontinental_cup",
  "primera-nacional": "arg.2",
  "primera-b-metro": "arg.3",
  "primera-c": "arg.4",
  libertadores: "conmebol.libertadores",
  sudamericana: "conmebol.sudamericana",
  recopa: "conmebol.recopa",
  champions: "uefa.champions",
  "europa-league": "uefa.europa",
  "conference-league": "uefa.europa.conf",
  "concacaf-champions": "concacaf.champions",
  "premier-league": "eng.1",
  championship: "eng.2",
  "fa-cup": "eng.fa",
  laliga: "esp.1",
  "segunda-espana": "esp.2",
  "copa-del-rey": "esp.copa_del_rey",
  "serie-a": "ita.1",
  "serie-b": "ita.2",
  "coppa-italia": "ita.coppa_italia",
  bundesliga: "ger.1",
  "2-bundesliga": "ger.2",
  "dfb-pokal": "ger.dfb_pokal",
  "primeira-liga": "por.1",
  "taca-portugal": "por.taca.portugal",
  "ligue-1": "fra.1",
  "ligue-2": "fra.2",
  "coupe-de-france": "fra.coupe_de_france",
  brasileirao: "bra.1",
  "brasileirao-b": "bra.2",
  "copa-do-brasil": "bra.copa_do_brazil",
  "primera-uruguay": "uru.1",
  "primera-paraguay": "par.1",
  "primera-colombia": "col.1",
  "primera-chile": "chi.1",
  "liga-mx": "mex.1",
  mls: "usa.1",
  "copa-america": "conmebol.america",
  eliminatorias: "fifa.worldq.conmebol",
  eurocopa: "uefa.euro",
};

// Competencias sin página propia ni datos en vivo: esperan una fuente (/ligas/<país>/<id>).
export const PENDING = GROUPS.flatMap((g) => g.competitions.filter((comp) => !comp.href && !LIVE_CODE[comp.id]).map((comp) => ({ group: g, comp })));

// Orden de la página En vivo: primero lo argentino y lo sudamericano.
export const LIVE_ORDER = [
  "liga-profesional", "copa-argentina", "trofeo-campeones", "supercopa-argentina", "libertadores", "sudamericana",
  "primera-nacional", "primera-b-metro", "primera-c", "eliminatorias", "copa-intercontinental", "champions", "premier-league", "laliga", "serie-a", "bundesliga", "ligue-1", "primeira-liga", "brasileirao",
  "primera-uruguay", "primera-paraguay", "primera-colombia", "primera-chile", "liga-mx", "mls", "europa-league",
  "conference-league", "championship", "segunda-espana", "serie-b", "2-bundesliga", "ligue-2", "brasileirao-b", "copa-do-brasil",
  "copa-del-rey", "coppa-italia", "dfb-pokal", "coupe-de-france", "fa-cup", "taca-portugal", "recopa", "concacaf-champions",
  "copa-america", "eurocopa",
];
