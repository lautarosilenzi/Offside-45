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

export const FEATURED: Competition[] = [
  c("liga-profesional", "Liga Argentina", "es:Primera División de Argentina", "/temporadas"),
  c("copa-argentina", "Copa Argentina", "en:Copa Argentina", "/copa-argentina"),
  c("libertadores", "Copa Libertadores", "en:Copa Libertadores", "/libertadores"),
  c("sudamericana", "Copa Sudamericana", "en:Copa Sudamericana", "/sudamericana"),
  c("mundial", "Mundiales", "en:FIFA World Cup Trophy", "/mundiales"),
];

export const GROUPS: CountryGroup[] = [
  {
    id: "argentina",
    name: "Argentina",
    flag: "ar",
    competitions: [
      c("liga-profesional", "Liga Profesional", "es:Primera División de Argentina", "/temporadas"),
      c("copa-argentina", "Copa Argentina", "en:Copa Argentina", "/copa-argentina"),
      c("copas-nacionales", "Copas Nacionales", "", "/copas"),
      c("descensos", "Descensos", "", "/descensos"),
      c("campeones", "Campeones", "", "/campeones"),
      c("estadisticas", "Estadísticas", "", "/estadisticas"),
      c("primera-nacional", "Primera Nacional", "en:Primera Nacional"),
      c("primera-b-metro", "Primera B Metropolitana", "en:Primera B Metropolitana"),
      c("federal-a", "Torneo Federal A", "es:Torneo Federal A"),
      c("primera-c", "Primera C", "en:Primera C"),
      c("liga-femenina", "Liga Femenina", ""),
    ],
  },
  {
    id: "internacional",
    name: "Internacional",
    flag: "un",
    competitions: [
      c("libertadores", "Copa Libertadores", "en:Copa Libertadores", "/libertadores"),
      c("sudamericana", "Copa Sudamericana", "en:Copa Sudamericana", "/sudamericana"),
      c("recopa", "Recopa Sudamericana", "es:Recopa Sudamericana", "/recopa"),
      c("mundial-clubes", "Intercontinental y Mundial de Clubes", "es:Copa Mundial de Clubes de la FIFA", "/mundial-de-clubes"),
      c("internacionales", "Clubes argentinos en copas internacionales", "", "/internacionales"),
      c("champions", "Champions League", "es:Liga de Campeones de la UEFA"),
      c("europa-league", "Europa League", "es:Liga Europa de la UEFA"),
      c("conference-league", "Conference League", "en:UEFA Conference League"),
      c("concacaf-champions", "Concacaf Champions Cup", "es:Copa de Campeones de la Concacaf"),
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
    id: "selecciones",
    name: "Selecciones",
    flag: "un",
    competitions: [
      c("mundial", "Mundiales", "en:FIFA World Cup Trophy", "/mundiales"),
      c("balon-de-oro", "Balón de Oro", "en:Ballon d'Or", "/balon-de-oro"),
      c("copa-america", "Copa América", "es:Copa América"),
      c("eliminatorias", "Eliminatorias Conmebol", ""),
      c("eurocopa", "Eurocopa", "en:UEFA European Championship"),
    ],
  },
];

// Página de una competencia: la propia si tiene datos, o la que espera los resultados en vivo.
export const compHref = (group: CountryGroup, comp: Competition) => comp.href ?? `/ligas/${group.id}/${comp.id}`;

// Todas las competencias sin página propia, para generar sus páginas.
export const PENDING = GROUPS.flatMap((g) => g.competitions.filter((comp) => !comp.href).map((comp) => ({ group: g, comp })));
