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

// region: separador del menú lateral ("Internacional", "Sudamérica", "Europa"…); el primero, Argentina, no lleva.
export type CountryGroup = { id: string; name: string; flag: string; region?: string; competitions: Competition[] };

const c = (id: string, name: string, wiki: string, href?: string): Competition => ({ id, name, wiki, href });

// Destacado: lo mismo que destacan los sitios de resultados. Las que tienen datos en vivo van a su página de torneo
// (/torneos/<id>: fixture, tablas, equipos y estadísticas); la historia de cada una sigue en su sección.
export const FEATURED: Competition[] = [
  c("historiales", "Historial entre equipos", "", "/historiales"),
  c("liga-profesional", "Liga Profesional de Fútbol", "es:Primera División de Argentina", "/torneos/liga-profesional"),
  c("primera-nacional", "Primera Nacional", "en:Primera Nacional", "/torneos/primera-nacional"),
  c("libertadores", "Copa Libertadores", "en:Copa Libertadores", "/torneos/libertadores"),
  c("sudamericana", "Copa Sudamericana", "en:Copa Sudamericana", "/torneos/sudamericana"),
  c("copa-argentina", "Copa Argentina", "en:Copa Argentina", "/torneos/copa-argentina"),
  c("champions", "Champions League", "es:Liga de Campeones de la UEFA", "/torneos/champions"),
  c("eliminatorias", "Eliminatorias Conmebol", "", "/torneos/eliminatorias"),
  c("mundial", "Copa del Mundo", "en:FIFA World Cup Trophy" /* logo: ilustración de Commons, cargada a mano */, "/mundiales"),
  c("balon-de-oro", "Balón de Oro", "en:Ballon d'Or", "/balon-de-oro"),
  c("messi-vs-cristiano", "Messi vs Cristiano", "", "/messi-vs-cristiano"),
];

export const GROUPS: CountryGroup[] = [
  {
    id: "argentina",
    name: "Argentina",
    flag: "ar",
    competitions: [
      c("historiales", "Historial entre equipos", "", "/historiales"),
      c("liga-profesional", "Liga Profesional de Fútbol", "es:Primera División de Argentina", "/temporadas"),
      c("primera-nacional", "Primera Nacional", "en:Primera Nacional"),
      c("copa-argentina", "Copa Argentina", "en:Copa Argentina", "/copa-argentina"),
      c("trofeo-campeones", "Trofeo de Campeones", ""),
      c("supercopa-argentina", "Supercopa Argentina", ""),
      c("supercopa-internacional", "Supercopa Internacional", ""),
      c("primera-b-metro", "Primera B Metro", "en:Primera B Metropolitana"),
      c("federal-a", "Federal A", "es:Torneo Federal A"),
      c("primera-c", "Primera C", "en:Primera C"),
      c("promocional-amateur", "Promocional Amateur", ""),
      c("reserva", "Liga Profesional · Reserva", ""),
      c("liga-femenina", "Liga Femenina", ""),
      c("futsal", "Futsal", ""),
      c("internacionales", "Clubes argentinos en copas internacionales", "", "/internacionales"),
      c("copas-nacionales", "Copas Nacionales (historia)", "", "/copas"),
      c("descensos", "Descensos", "", "/descensos"),
      c("campeones", "Campeones", "", "/campeones"),
      c("estadisticas", "Estadísticas del fútbol argentino", "", "/estadisticas"),
    ],
  },
  {
    id: "selecciones",
    name: "Selecciones",
    flag: "un",
    region: "Internacional",
    competitions: [
      c("mundial", "Copa del Mundo", "en:FIFA World Cup Trophy" /* logo: ilustración de Commons, cargada a mano */, "/mundiales"),
      c("eliminatorias", "Eliminatorias Conmebol", ""),
      c("copa-america", "Copa América", "es:Copa América"),
      c("finalissima", "Finalissima", "es:Copa de Campeones Conmebol-UEFA"),
      c("amistosos", "Amistosos internacionales", ""),
      c("eurocopa", "Eurocopa", "en:UEFA European Championship"),
      c("nations-league", "Nations League", "es:Liga de las Naciones de la UEFA"),
      c("eliminatorias-uefa", "Eliminatorias UEFA", ""),
      c("mundial-sub20", "Mundial Sub-20", "es:Copa Mundial de Fútbol Sub-20"),
      c("mundial-sub17", "Mundial Sub-17", "es:Copa Mundial de Fútbol Sub-17"),
      c("juegos-olimpicos", "Juegos Olímpicos", "es:Fútbol en los Juegos Olímpicos"),
      c("copa-oro", "Copa Oro Concacaf", "es:Copa de Oro de la Concacaf"),
      c("nations-league-concacaf", "Liga de Naciones Concacaf", "es:Liga de Naciones de la Concacaf"),
      c("copa-africana", "Copa Africana de Naciones", "es:Copa Africana de Naciones"),
      c("copa-asiatica", "Copa Asiática", "es:Copa Asiática"),
    ],
  },
  {
    id: "internacional",
    name: "Copas de clubes",
    flag: "un",
    region: "Internacional",
    competitions: [
      c("libertadores", "Copa Libertadores", "en:Copa Libertadores", "/libertadores"),
      c("sudamericana", "Copa Sudamericana", "en:Copa Sudamericana", "/sudamericana"),
      c("recopa", "Recopa Sudamericana", "es:Recopa Sudamericana", "/recopa"),
      c("champions", "Champions League", "es:Liga de Campeones de la UEFA"),
      c("europa-league", "Europa League", "es:Liga Europa de la UEFA"),
      c("conference-league", "Conference League", "en:UEFA Conference League"),
      c("supercopa-europa", "Supercopa de Europa", "es:Supercopa de la UEFA"),
      c("mundial-clubes", "Mundial de Clubes", "es:Copa Mundial de Clubes de la FIFA", "/mundial-de-clubes"),
      c("copa-intercontinental", "Copa Intercontinental de la FIFA", ""),
      c("concacaf-champions", "Concacaf Champions Cup", "es:Copa de Campeones de la Concacaf"),
      c("champions-asia", "Champions de Asia", "es:Liga de Campeones de la AFC"),
      c("champions-africa", "Champions de África", "es:Liga de Campeones de la CAF"),
    ],
  },
  // Sudamérica
  { id: "brasil", name: "Brasil", flag: "br", region: "Sudamérica", competitions: [c("brasileirao", "Brasileirão Serie A", "es:Campeonato Brasileño de Serie A"), c("brasileirao-b", "Brasileirão Serie B", "es:Campeonato Brasileño de Serie B"), c("copa-do-brasil", "Copa de Brasil", "es:Copa de Brasil")] },
  { id: "uruguay", name: "Uruguay", flag: "uy", region: "Sudamérica", competitions: [c("primera-uruguay", "Primera División", "es:Primera División de Uruguay")] },
  { id: "paraguay", name: "Paraguay", flag: "py", region: "Sudamérica", competitions: [c("primera-paraguay", "Primera División", "es:Primera División de Paraguay")] },
  { id: "chile", name: "Chile", flag: "cl", region: "Sudamérica", competitions: [c("primera-chile", "Primera División", "en:Chilean Primera División"), c("copa-chile", "Copa Chile", "es:Copa Chile")] },
  { id: "colombia", name: "Colombia", flag: "co", region: "Sudamérica", competitions: [c("primera-colombia", "Primera A", "es:Categoría Primera A"), c("copa-colombia", "Copa Colombia", "es:Copa Colombia")] },
  { id: "peru", name: "Perú", flag: "pe", region: "Sudamérica", competitions: [c("liga-1-peru", "Liga 1", "es:Liga 1 (Perú)")] },
  { id: "ecuador", name: "Ecuador", flag: "ec", region: "Sudamérica", competitions: [c("ligapro-ecuador", "LigaPro", "es:Serie A de Ecuador")] },
  { id: "bolivia", name: "Bolivia", flag: "bo", region: "Sudamérica", competitions: [c("primera-bolivia", "División Profesional", "es:División Profesional de Bolivia")] },
  { id: "venezuela", name: "Venezuela", flag: "ve", region: "Sudamérica", competitions: [c("liga-futve", "Liga FUTVE", "es:Primera División de Venezuela")] },
  // Europa
  { id: "inglaterra", name: "Inglaterra", flag: "gb-eng", region: "Europa", competitions: [c("premier-league", "Premier League", "es:Premier League"), c("championship", "Championship", "es:EFL Championship"), c("fa-cup", "FA Cup", "en:FA Cup"), c("league-cup", "Copa de la Liga", "es:Copa de la Liga de Inglaterra")] },
  { id: "espana", name: "España", flag: "es", region: "Europa", competitions: [c("laliga", "LaLiga", "es:Primera División de España"), c("segunda-espana", "Segunda División", "es:Segunda División de España"), c("copa-del-rey", "Copa del Rey", "es:Copa del Rey"), c("supercopa-espana", "Supercopa de España", "es:Supercopa de España")] },
  { id: "italia", name: "Italia", flag: "it", region: "Europa", competitions: [c("serie-a", "Serie A", "es:Serie A (Italia)"), c("serie-b", "Serie B", "es:Serie B (Italia)"), c("coppa-italia", "Copa Italia", "es:Copa Italia"), c("supercopa-italia", "Supercopa de Italia", "es:Supercopa de Italia")] },
  { id: "alemania", name: "Alemania", flag: "de", region: "Europa", competitions: [c("bundesliga", "Bundesliga", "en:Bundesliga"), c("2-bundesliga", "2. Bundesliga", "es:2. Bundesliga"), c("dfb-pokal", "Copa de Alemania", "es:Copa de Alemania"), c("supercopa-alemania", "Supercopa de Alemania", "es:Supercopa de Alemania")] },
  { id: "francia", name: "Francia", flag: "fr", region: "Europa", competitions: [c("ligue-1", "Ligue 1", "es:Ligue 1"), c("ligue-2", "Ligue 2", "es:Ligue 2"), c("coupe-de-france", "Copa de Francia", "en:Coupe de France"), c("trophee-champions", "Supercopa de Francia", "es:Supercopa de Francia")] },
  { id: "portugal", name: "Portugal", flag: "pt", region: "Europa", competitions: [c("primeira-liga", "Primeira Liga", "es:Primeira Liga"), c("taca-portugal", "Copa de Portugal", "en:Taça de Portugal")] },
  { id: "paises-bajos", name: "Países Bajos", flag: "nl", region: "Europa", competitions: [c("eredivisie", "Eredivisie", "es:Eredivisie"), c("copa-paises-bajos", "Copa de los Países Bajos", "es:Copa de los Países Bajos")] },
  { id: "escocia", name: "Escocia", flag: "gb-sct", region: "Europa", competitions: [c("premiership-escocia", "Premiership", "es:Scottish Premiership")] },
  { id: "belgica", name: "Bélgica", flag: "be", region: "Europa", competitions: [c("pro-league-belgica", "Pro League", "es:Primera División de Bélgica")] },
  { id: "turquia", name: "Turquía", flag: "tr", region: "Europa", competitions: [c("super-lig", "Süper Lig", "es:Superliga de Turquía")] },
  // Resto del mundo
  { id: "mexico", name: "México", flag: "mx", region: "Resto del mundo", competitions: [c("liga-mx", "Liga MX", "es:Primera División de México"), c("leagues-cup", "Leagues Cup", "es:Leagues Cup")] },
  { id: "eeuu", name: "Estados Unidos", flag: "us", region: "Resto del mundo", competitions: [c("mls", "MLS", "es:Major League Soccer"), c("leagues-cup", "Leagues Cup", "es:Leagues Cup")] },
  { id: "arabia", name: "Arabia Saudita", flag: "sa", region: "Resto del mundo", competitions: [c("saudi-pro-league", "Liga Profesional Saudí", "es:Liga Profesional Saudí")] },
  // Femenino
  {
    id: "femenino",
    name: "Fútbol femenino",
    flag: "un",
    region: "Femenino",
    competitions: [
      c("mundial-femenino", "Mundial Femenino", "es:Copa Mundial Femenina de Fútbol"),
      c("copa-america-femenina", "Copa América Femenina", "es:Copa América Femenina"),
      c("champions-femenina", "Champions League Femenina", "es:Liga de Campeones Femenina de la UEFA"),
    ],
  },
  // Especiales del sitio
  {
    id: "especiales",
    name: "Especiales",
    flag: "un",
    region: "Especiales",
    competitions: [
      c("messi-vs-cristiano", "Messi vs Cristiano", "", "/messi-vs-cristiano"),
      c("comparador", "Comparador de leyendas", "", "/jugadores"),
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
  "supercopa-internacional": "arg.supercopa.internacional",
  finalissima: "global.finalissima",
  amistosos: "fifa.friendly",
  "nations-league": "uefa.nations",
  "eliminatorias-uefa": "fifa.worldq.uefa",
  "mundial-sub20": "fifa.world.u20",
  "mundial-sub17": "fifa.world.u17",
  "juegos-olimpicos": "fifa.olympics",
  "copa-oro": "concacaf.gold",
  "nations-league-concacaf": "concacaf.nations.league",
  "copa-africana": "caf.nations",
  "copa-asiatica": "afc.asian.cup",
  "supercopa-europa": "uefa.super_cup",
  "mundial-clubes": "fifa.cwc",
  "leagues-cup": "concacaf.leagues.cup",
  "champions-asia": "afc.champions",
  "champions-africa": "caf.champions",
  "copa-chile": "chi.copa_chi",
  "copa-colombia": "col.copa",
  "liga-1-peru": "per.1",
  "ligapro-ecuador": "ecu.1",
  "primera-bolivia": "bol.1",
  "liga-futve": "ven.1",
  "league-cup": "eng.league_cup",
  "supercopa-espana": "esp.super_cup",
  "supercopa-italia": "ita.super_cup",
  "supercopa-alemania": "ger.super_cup",
  "trophee-champions": "fra.super_cup",
  eredivisie: "ned.1",
  "copa-paises-bajos": "ned.cup",
  "premiership-escocia": "sco.1",
  "pro-league-belgica": "bel.1",
  "super-lig": "tur.1",
  "saudi-pro-league": "ksa.1",
  "mundial-femenino": "fifa.wwc",
  "copa-america-femenina": "conmebol.america.femenina",
  "champions-femenina": "uefa.wchampions",
};

// Competencias sin página propia ni datos en vivo: esperan una fuente (/ligas/<país>/<id>).
export const PENDING = GROUPS.flatMap((g) => g.competitions.filter((comp) => !comp.href && !LIVE_CODE[comp.id]).map((comp) => ({ group: g, comp })));

// Orden de la lista de partidos (En vivo, Calendario, Live): lo argentino y las copas sudamericanas, las selecciones, las
// copas europeas, las grandes ligas, el resto de Sudamérica y después lo demás.
export const LIVE_ORDER = [
  "liga-profesional", "copa-argentina", "trofeo-campeones", "supercopa-argentina", "supercopa-internacional",
  "libertadores", "sudamericana", "recopa", "primera-nacional", "primera-b-metro", "primera-c", "eliminatorias",
  "copa-america", "finalissima", "amistosos", "nations-league", "eurocopa", "eliminatorias-uefa", "mundial-sub20",
  "mundial-sub17", "juegos-olimpicos", "champions", "europa-league", "conference-league", "supercopa-europa",
  "mundial-clubes", "copa-intercontinental", "premier-league", "laliga", "serie-a", "bundesliga", "ligue-1",
  "primeira-liga", "eredivisie", "brasileirao", "primera-uruguay", "primera-paraguay", "primera-chile",
  "primera-colombia", "liga-1-peru", "ligapro-ecuador", "primera-bolivia", "liga-futve", "liga-mx", "mls",
  "saudi-pro-league", "super-lig", "premiership-escocia", "pro-league-belgica", "championship", "segunda-espana",
  "serie-b", "2-bundesliga", "ligue-2", "brasileirao-b", "fa-cup", "league-cup", "copa-del-rey", "supercopa-espana",
  "coppa-italia", "supercopa-italia", "dfb-pokal", "supercopa-alemania", "coupe-de-france", "trophee-champions",
  "taca-portugal", "copa-paises-bajos", "copa-do-brasil", "copa-chile", "copa-colombia", "concacaf-champions",
  "leagues-cup", "champions-asia", "champions-africa", "copa-oro", "nations-league-concacaf", "copa-africana",
  "copa-asiatica", "mundial-femenino", "copa-america-femenina", "champions-femenina",
];

// Destacados de un país (lib/region.ts): cada id con su nombre y su página, como en el menú.
export function featuredList(ids: string[]): Competition[] {
  return ids
    .map((id) => {
      const f = FEATURED.find((c) => c.id === id);
      if (f) return f;
      const g = GROUPS.find((x) => x.competitions.some((c) => c.id === id));
      const c = g?.competitions.find((x) => x.id === id);
      return g && c ? { ...c, href: compHref(g, c) } : undefined;
    })
    .filter((c): c is Competition => !!c);
}
