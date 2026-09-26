// Nombres de equipos tal como aparecen en RSSSF y en Wikipedia → club.
// `as` es el nombre de época que se muestra en los partidos cuando no coincide con el actual.
// Las identidades dudosas se confirmaron con los enlaces de las páginas de temporada de Wikipedia.
import { getTeam } from "../../lib/teams";

type Alias = { id: string; names: string[]; as?: string; from?: number; to?: number };

const ALIASES: Alias[] = [
  { id: "lomas-athletic", names: ["Lomas Athletic Club", "Lomas Athletic", "Lomas AC", "Lomas"] },
  { id: "lanus-athletic", names: ["Lanús Athletic Club", "Lanús Athletic", "Lanus Athletic", "Lanús"], to: 1899 },
  { id: "belgrano-athletic", names: ["Belgrano Athletic Club", "Belgrano Athletic", "Belgrano AC", "Belgrano"], to: 1930 },
  { id: "belgrano-athletic-b", names: ['Belgrano "B"', 'Belgrano Athletic "B"'] },
  { id: "flores-athletic", names: ["Flores Athletic Club", "Flores Athletic", "Flores AC", "Flores"] },
  { id: "palermo-athletic", names: ["Palermo Athletic Club", "Palermo Athletic"] },
  { id: "banfield", names: ["Banfield Athletic Club", "Banfield Athletic"], as: "Banfield Athletic Club", to: 1912 },
  { id: "banfield", names: ["Banfield", "CA Banfield", "Club Atlético Banfield"] },
  { id: "lobos-athletic", names: ["Lobos Athletic Club", "Lobos Athletic", "Lobos"] },
  { id: "united-banks", names: ["United Banks"] },
  { id: "alumni", names: ["English High School AC", "English High School Athletic Club", "English High School"], as: "English High School", to: 1900 },
  { id: "alumni", names: ["Alumni", "Alumni FT", "Alumni Football Team", "Alumni AC", "Alumni Athletic Club"], from: 1901 },
  { id: "quilmes", names: ["Quilmes", "Quilmes AC", "Quilmes Athletic Club", "Quilmes Atlético Club"], from: 1900 },
  { id: "barracas-athletic", names: ["Barracas Athletic", "Barracas Athletic Club", "Barracas AC", "Barracas"], to: 1910 },
  {
    id: "belgrano-athletic-b",
    names: ["Belgrano Extra", "Belgrano AC Extra", "Belgrano Athletic Club Extra", "CA Belgrano Extra"],
    as: "Belgrano Extra",
  },
  // Estudiantes de Buenos Aires (Club Atlético Estudiantes, hoy en Caseros). Wikipedia: "Estudiantes (BA)".
  {
    id: "estudiantes-ba",
    names: ["Club de Estudiantes", "Estudiantes", "CA Estudiantes", "Club Atlético Estudiantes", "Atlético Estudiantes", "Estudiantes (BA)", "Estudiantes BA"],
    to: 1911,
  },
  // Desde 1912 "Estudiantes" a secas es el de Buenos Aires en la Asociación; en la Federación (La Plata) se usa un alias local.
  { id: "estudiantes-ba", names: ["Atlético Estudiantes", "Estudiantes (BA)", "Estudiantes BA", "Club de Estudiantes", "Estudiantes"], from: 1912 },
  // Estudiantes de La Plata.
  { id: "estudiantes", names: ["Estudiantes LPG", "Estudiantes LP", "Estudiantes de La Plata", "Estudiantes (LP)", "Club Estudiantes de La Plata"] },
  { id: "independiente", names: ["Independiente", "Independiente (Ave)", "Independiente (A)", "CA Independiente", "Club Atlético Independiente", "Indpendiente"] },
  { id: "atlanta", names: ["Atlanta", "Atlanta AC", "Atlanta Athletic Club", "Club Atlético Atlanta"] },
  { id: "kimberley", names: ["Kimberley", "Kimberley AC", "Kimberley Athletic Club", "Kimberley Atlético Club"], to: 1950 },
  { id: "sportiva-argentina", names: ["Sportiva Argentina", "Sociedad Sportiva Argentina"] },
  { id: "boca", names: ["Boca Juniors", "CA Boca Juniors", "Club Atlético Boca Juniors", "Boca"] },
  { id: "platense", names: ["Platense", "CA Platense", "Club Atlético Platense", "Platense (VL)"] },
  // Platense (Retiro): se separó de Platense, jugó en la Asociación Argentina desde 1921 y después se llamó Universal.
  { id: "platense-retiro", names: ["Platense II", "Platense (BA)", "Platense (Retiro)"], as: "Platense (Retiro)" },
  { id: "platense-retiro", names: ["Universal"], as: "Universal" },
  { id: "estudiantil-porteno", names: ["Estudiantil Porteño", "CA Estudiantil Porteño", "Club Atlético Estudiantil Porteño"] },
  { id: "comercio", names: ["Comercio", "Comercio FBC", "Comercio Foot Ball Club", "Club Atlético Comercio"] },
  { id: "ferro", names: ["Ferro Carril Oeste", "CA Ferro Carril Oeste", "Club Atlético Ferro Carril Oeste", "Club Ferro Carril Oeste", "Ferro Carril Oeste (BA)", "FC Oeste"] },
  { id: "ferrocarril-sud", names: ["Ferrocarril Sud", "CA Ferrocarril Sud", "Club Atlético del Ferrocarril Sud", "Ferrocarril Gran Sud"] },
  { id: "olivos", names: ["Olivos", "CA Olivos", "Club Atlético Olivos"] },
  { id: "riachuelo", names: ["Riachuelo", "CA Riachuelo", "Club Atlético Riachuelo"] },
  { id: "tigre", names: ["Tigre", "CA Tigre", "Club Atlético del Tigre", "Club Atlético Tigre"] },
  { id: "columbian", names: ["Hispano Argentino", "Club Hispano Argentino"], as: "Hispano Argentino" },
  { id: "columbian", names: ["Columbian", "Club Columbian"] },
  { id: "huracan", names: ["Huracán", "Huracán (BA)", "CA Huracán", "Club Atlético Huracán"] },
  { id: "floresta", names: ["Floresta", "Sportivo Floresta", "Club Sportivo Floresta", "Club Floresta", "Club Atlético Floresta"] },
  { id: "sanlorenzo", names: ["San Lorenzo", "San Lorenzo de Almagro", "San Lorenzo del Almagro", "CA San Lorenzo de Almagro", "Club Atlético San Lorenzo de Almagro"] },
  { id: "defensores-belgrano", names: ["Defensores de Belgrano", "Club Atlético Defensores de Belgrano"] },
  { id: "sportivo-barracas", names: ["Sportivo Barracas", "Club Sportivo Barracas", "Club Sportivo Barracas Bolívar"] },
  {
    id: "gimnasia",
    names: [
      "Gimnasia y Esgrima LP",
      "Gimnasia y Esgrima La Plata",
      "Gimnasia y Esgrima (LP)",
      "Gimnasia y Esgrima(LP)",
      "Gimansia y Esgrima LP",
      "Gimnsasia y Esgrima LP",
      "Club de Gimnasia y Esgrima La Plata",
    ],
  },
  { id: "central", names: ["Rosario Central", "Club Atlético Rosario Central"] },
  // Segundo cisma (1919–1926).
  { id: "eureka", names: ["Eureka"] },
  // Wikipedia: Sportivo Almagro es el actual Club Almagro (no Columbian).
  { id: "almagro", names: ["Sportivo Almagro", "Sportivo de Almagro", "Spotivo de Almagro"], as: "Sportivo Almagro" },
  { id: "almagro", names: ["Almagro", "Club Almagro"] },
  { id: "velez", names: ["Vélez Sarsfield", "Velez Sarsfield", "Club Atlético Vélez Sarsfield"] },
  { id: "lanus", names: ["Lanús", "Club Atlético Lanús"], from: 1915 },
  { id: "del-plata", names: ["Del Plata", "Club Del Plata", "Club Atlético Del Plata"] },
  { id: "nueva-chicago", names: ["Nueva Chicago", "Club Atlético Nueva Chicago"] },
  { id: "palermo", names: ["Palermo", "Club Atlético Palermo"], from: 1915 },
  { id: "sportivo-palermo", names: ["Sportivo Palermo", "Club Sportivo Palermo"] },
  // Wikipedia: Sportivo del Norte es el actual Colegiales (Munro).
  { id: "colegiales", names: ["Sportivo del Norte"], as: "Sportivo del Norte" },
  { id: "colegiales", names: ["Colegiales", "Club Atlético Colegiales"] },
  { id: "barracas-central", names: ["Barracas Central", "Club Atlético Barracas Central"] },
  { id: "sportivo-buenos-aires", names: ["Sportivo Buenos Aires", "Club Social y Sportivo Buenos Aires"] },
  { id: "general-mitre", names: ["General Mitre", "Club General Mitre"] },
  { id: "argentinos", names: ["Argentinos Juniors", "Argentinos", "Asociación Atlética Argentinos Juniors"] },
  { id: "alvear", names: ["Alvear", "Club Alvear", "Club Atlético Alvear"] },
  { id: "boca-alumni", names: ["Boca Alumni", "Club Boca Alumni"] },
  { id: "el-porvenir", names: ["El Porvenir", "Club El Porvenir"] },
  { id: "progresista", names: ["Progresista", "Club Progresista"] },
  { id: "san-fernando", names: ["San Fernando", "Club San Fernando"] },
  { id: "sportivo-dock-sud", names: ["Sportivo Dock Sud", "Dock Sud", "Club Sportivo Dock Sud"] },
  { id: "argentino-banfield", names: ["Argentino de Banfield", "Club Argentino de Banfield"] },
  { id: "argentino-del-sud", names: ["Argentino del Sud", "Argentinos del Sud", "Club Argentino del Sud", "Club Atlético Argentino del Sud"] },
  { id: "temperley", names: ["Temperley", "Club Atlético Temperley"] },
  // Wikipedia 1924: "Urquiza" es el Club Villa Urquiza.
  { id: "villa-urquiza", names: ["Villa Urquiza", "Club Villa Urquiza", "Urquiza"] },
  { id: "all-boys", names: ["All Boys", "Club Atlético All Boys"] },
  { id: "liberal-argentino", names: ["Liberal Argentino", "Club Liberal Argentino"] },
  { id: "sportsman", names: ["Sportsman", "Club Atlético Sportsman"] },
  { id: "chacarita", names: ["Chacarita Juniors", "Club Atlético Chacarita Juniors"] },
  { id: "excursionistas", names: ["Excursionistas", "Club Atlético Excursionistas"] },
  { id: "general-san-martin", names: ["General San Martín", "Gral. San Martín", "Club Atlético General San Martín"] },
  { id: "sportivo-balcarce", names: ["Sportivo Balcarce", "Club Sportivo Balcarce"] },
  { id: "talleres-re", names: ["Talleres RE", "Talleres (RdE)", "Club Atlético Talleres (Remedios de Escalada)"] },
  { id: "estudiantes-ba", names: ["Estudiantes (C)"] },
  { id: "honor-y-patria", names: ["Honor y Patria"] },
  { id: "newells", names: ["Newell's Old Boys", "Newells Old Boys", "Club Atlético Newell's Old Boys"] },
  { id: "remedios-escalada", names: ["Remedios de Escalada"] },
  { id: "reformer", names: ["Reformer", "Reformer AC", "Reformer Athletic Club"] },
  { id: "san-martin-athletic", names: ["San Martín Athletic", "San Martín Athletic Club", "San Martín AC", "San Martín"], to: 1912 },
  { id: "san-isidro", names: ["San Isidro", "CA San Isidro", "Club Atlético de San Isidro", "Club Atlético San Isidro"] },
  { id: "argentino-quilmes", names: ["Argentino de Quilmes", "CA Argentino de Quilmes", "Club Atlético Argentino de Quilmes"] },
  { id: "porteno", names: ["Porteño", "CA Porteño", "Club Atlético Porteño"] },
  { id: "nacional-floresta", names: ["Nacional"], to: 1912 },
  { id: "gimnasia-ba", names: ["Gimnasia y Esgrima BA", "Gimnasia y Esgrima BUE", "Gimnasia y Esgrima (BA)", "Gimnasia y Esgrima de Buenos Aires", "Club de Gimnasia y Esgrima"] },
  { id: "river", names: ["River Plate", "CA River Plate", "Club Atlético River Plate", "River"] },
  { id: "racing", names: ["Racing Club", "Racing FC", "Racing Football Club", "Racing"] },
  // Copas nacionales: equipos de La Plata con el nombre completo, y de Rosario y Santa Fe.
  { id: "estudiantes", names: ["Estudiantes (La Plata)"] },
  { id: "gimnasia", names: ["Gimnasia y Esgrima (La Plata)", "Gimnasia y Esgrima LPG", "Gimnasia y Esgrima de La Plata"] },
  { id: "estudiantes-ba", names: ["Estudiantes (Bs.As.)"] },
  { id: "gimnasia-ba", names: ["Gimnasia y Esgrima (Buenos Aires)", "Gimnasia y Esgrima (B. Aires)"] },
  { id: "ferro", names: ["Ferro Carril Oeste de BA", "FCO", "Ferro Carril Oeste (BUE)"] },
  { id: "columbian", names: ["Columbian FC", "Columbian Football Club", "Columbian Footbal Club"] },
  { id: "sportivo-barracas", names: ["CS Barracas"] },
  // Solo aparecen como canchas: "GEBA, Palermo", "CASI, San Isidro".
  { id: "gimnasia-ba", names: ["GEBA"] },
  { id: "san-isidro", names: ["CASI", "CAd San Isidro"] },
  { id: "rosario-athletic", names: ["Rosario AC", "Rosario Athletic", "Rosario Athletic Club"] },
  // "Argentino (R)" es el Club Atlético Argentino de Rosario, que en 1914 pasó a llamarse Gimnasia y Esgrima de Rosario.
  { id: "gimnasia-rosario", names: ["Argentino (R)", "Argentino (Rosario)"], as: "Argentino (Rosario)", to: 1914 },
  {
    id: "gimnasia-rosario",
    names: ["Gimnasia y Esgrima Rosario", "Gimnasia y Esgrima dR", "Gimnasia y Esgrima de Rosario", "Gimnasia y Esgrima (R)", "Club Gimnasia y Esgrima dR", "Club Gimnasia y Esgrima Rosario"],
  },
  { id: "provincial-rosario", names: ["Provincial", "Provincial (Rosario)"] },
  { id: "tiro-federal-rosario", names: ["Tiro Federal", "Tiro Federal Argentino", "Tiro Fedreral Argentino", "Tiro Federal (Rosario)"] },
  { id: "belgrano-rosario", names: ["Belgrano (Rosario)", "Belgrano de Rosario", "Belgrano (R)"] },
  { id: "central-cordoba-rosario", names: ["Central Córdoba", "Central Córdoba (Rosario)", "Central Córdoba (R)"] },
  { id: "sparta-rosario", names: ["Sparta", "Sparta (Rosario)"] },
  // El actual Argentino de Rosario se llamó Club Atlético Nacional hasta 1934.
  { id: "argentino-rosario", names: ["Nacional", "Nacional (Rosario)", "Nacional (R)"], as: "Nacional (Rosario)", from: 1913, to: 1933 },
  { id: "rosario-puerto-belgrano", names: ["Rosario a Puerto Belgrano", "Rosario Puerto Belgrano"] },
  { id: "union-santa-fe", names: ["Unión", "Unión (Santa Fe)", "Unión Santa Fe"] },
  { id: "colon-santa-fe", names: ["Colón", "Colón (Santa Fe)", "Club Atlético Colón"] },
  // Uruguayos (Copa Chevallier Boutell). "Nacional" a secas se resuelve con un alias local.
  { id: "albion-uy", names: ["Albion FC", "Albion", "Albion Football Club"] },
  { id: "curcc-uy", names: ["CURCC", "Central Uruguay Railway Cricket Club"] },
  { id: "nacional-uy", names: ["Club Nacional de Football", "Nacional (Montevideo)"] },
  { id: "deutscher-uy", names: ["Deutscher FK", "Deustcher FK", "Deutscher", "Deustcher"] },
  { id: "wanderers-uy", names: ["Montevideo Wanderers", "Montevideo Wanderers FC", "Montevideo Wanderers Football Club", "Wanderers"] },
  // Copa Jockey Club: clubes de ascenso. "CA Alumni" / "Alumni (O)" se resuelven con alias locales (Alumni a secas es el campeón de 1900–1911).
  { id: "ca-alumni", names: ["Alumni (O)", "Alumni (Olivos)"] },
  { id: "san-telmo", names: ["San Telmo", "San Telmo FC", "Club Atlético San Telmo"] },
  { id: "victoria", names: ["Victoria", "CSyA Victoria", "Club Social y Atlético Victoria"] },
  { id: "everton", names: ["Everton", "CD Everton", "Club Deportivo Everton"] },
  { id: "general-belgrano", names: ["General Belgrano", "AD General Belgrano", "Asociación Deportiva General Belgrano"] },
  { id: "burzaco", names: ["Burzaco", "Club de Burzaco", "Club Atlético Burzaco"] },
  { id: "germinal", names: ["Germinal", "CA Germinal", "Club Atlético Germinal", "Club Germinal"] },
  { id: "barracas-juniors", names: ["Barracas Juniors", "Club Atlético Barracas Juniors"] },
  { id: "central-argentino", names: ["Central Argentino", "Club Atlético Central Argentino"] },
  { id: "sportivo-alsina", names: ["El Aeroplano"], as: "El Aeroplano" },
  { id: "adrogue", names: ["Adrogué", "Club Atlético Adrogué"] },
  { id: "liniers", names: ["Liniers", "Liniers Sport Club"] },
  { id: "lugano", names: ["Compañía General Buenos Aires", "Companía General Buenos Aires", "CGBA"], as: "Compañía General Buenos Aires" },
  { id: "sportivo-coghlan", names: ["Sportivo Coghlan", "Club Sportivo Coghlan", "Coghlan"] },
  { id: "wilde", names: ["Wilde"] },
  { id: "villa-real", names: ["Villa Real"] },
  { id: "pineyro", names: ["Piñeyro"] },
  { id: "balcarce", names: ["Balcarce"], to: 1919 },
  // Wikipedia (Jockey Club 1919, Intermedia 1919): "Sportivo Avellaneda" es el actual Sportsman.
  { id: "sportsman", names: ["Sportivo Avellaneda", "Sp. Avellaneda"], as: "Sportivo Avellaneda", to: 1920 },
  { id: "excursionistas", names: ["Unión Excursionistas", "Club Unión Excursionistas"] },
  { id: "all-boys", names: ["All Boys AC", "All Boys Athletic Club"] },
  { id: "ferro", names: ["Ferrocarril Oeste", "Ferrocarril Oeste de Buenos Aires", "Ferro Carril Oeste de Buenos Aires"] },
  { id: "el-porvenir", names: ["El Porvernir"] },
  { id: "banfield", names: ["Banfied"] },
  { id: "porteno", names: ["Porteño AC"] },
  // 1931 en adelante.
  { id: "argentino-banfield", names: ["Argentino de Lomas"], as: "Argentino de Lomas", from: 1931 },
  { id: "sportivo-buenos-aires", names: ["Social y Sportivo Buenos Aires", "S. y S. Bs. As.", "S. y S. Bs. As"], as: "Social y Sportivo Buenos Aires", from: 1931 },
  { id: "argentino-temperley", names: ["Argentino de Temperley"] },
  { id: "independiente", names: ["Independiente (Avellaneda)", "Independiente (Av)"] },
  { id: "talleres-re", names: ["Talleres (RE)"] },
  { id: "huracan", names: ["Huracán (Buenos Aires)"] },
  { id: "gimnasia", names: ["Gimnasia y Esgrima La Plata"] },
  { id: "los-andes", names: ["Los Andes", "CA Los Andes", "Club Atlético Los Andes", "Los Andes (LdZ)"], from: 1950 },
  // 1967–: clubes del interior en Nacionales y Promocionales (entre paréntesis, la ciudad o el código de RSSSF).
  { id: "deportivo-espanol", names: ["Deportivo Español", "Club Deportivo Español"], from: 1960 },
  { id: "deportivo-moron", names: ["Deportivo Morón", "Club Deportivo Morón"], from: 1960 },
  { id: "almirante-brown", names: ["Almirante Brown (IC)", "Almirante Brown"], from: 1960 },
  { id: "union-santa-fe", names: ["Unión (SFN)", "Unión (SF)", "Unión"], from: 1960 },
  { id: "colon-santa-fe", names: ["Colón", "Colón (SF)"], from: 1960 },
  { id: "chaco-for-ever", names: ["Chaco For Ever"], from: 1960 },
  { id: "central-cordoba-sde", names: ["Central Córdoba (SDE)", "Central Córdoba (SdE)"], from: 1960 },
  { id: "san-lorenzo-mdp", names: ["San Lorenzo (MDQ)", "San Lorenzo (MdP)"], from: 1960 },
  { id: "san-martin-mendoza", names: ["San Martín (MDZ)", "San Martín (M)", "San Martín (GSM)"], from: 1960 },
  { id: "san-martin-tucuman", names: ["San Martín (TUC)", "San Martín (T)"], from: 1960 },
  { id: "san-martin-sj", names: ["San Martín (UAQ)", "San Martín (SJ)"], from: 1960 },
  { id: "atletico-juventud-sj", names: ["Atlético de la Juventud"], from: 1960 },
  { id: "sportivo-guzman", names: ["Sportivo Guzmán", "Sortivo Guzmán"], from: 1960 },
  { id: "olimpo", names: ["Olimpo"], from: 1960 },
  { id: "racing-cordoba", names: ["Racing (COR)", "Racing (C)"], from: 1960 },
  { id: "independiente-rivadavia", names: ["Independiente Rivadavia"], from: 1960 },
  { id: "belgrano", names: ["Belgrano (COR)", "Belgrano (C)"], from: 1960 },
  { id: "talleres", names: ["Talleres (C)", "Talleres (COR)"], from: 1960 },
  { id: "huracan-iw", names: ["Huracán (IWh)", "Huracán (IW)"], from: 1960 },
  { id: "huracan-corrientes", names: ["Huracán (CNQ)"], from: 1960 },
  { id: "huracan", names: ["Huracán (BUE)"], from: 1960 },
  { id: "desamparados", names: ["Sportivo Desamparados"], from: 1960 },
  { id: "gimnasia-mendoza", names: ["Gimnasia y Esgrima M", "Gimnasia y Egrima M", "Gimnasia y Esgrima (M)"], from: 1960 },
  { id: "gimnasia-jujuy", names: ["Gimnasia y Esgrima J", "Gimnasia y Esgrima (J)"], from: 1960 },
  { id: "kimberley-mdp", names: ["Kimberley (MdP)"], from: 1960 },
  { id: "ferro", names: ["Ferro Carril Oeste (BUE)"], from: 1960 },
  // 1971–1985: nombres de los Nacionales y Metropolitanos (RSSSF escribe la ciudad de muchas formas).
  // Tablas de la década (1980s): la ciudad con el código de su aeropuerto (JUJ, MDZ, JNI, AFA = San Rafael...).
  { id: "gimnasia-jujuy", names: ["Gimnasia y Esgrima (JUJ)", "GIMNASIA Y ESGRIMA (JUJ)"], from: 1970 },
  { id: "gimnasia-mendoza", names: ["Gimnasia y Esgrima (MDZ)", "GIMNASIA Y ESGRIMA (MDZ)"], from: 1970 },
  { id: "sarmiento-junin", names: ["Sarmiento (JNI)"], from: 1970 },
  { id: "huracan-san-rafael", names: ["Huracán (AFA)"], from: 1970 },
  { id: "racing-cordoba", names: ["Atlético Racing", "ATLÉTICO RACING"], from: 1970 },
  { id: "atletico-uruguay", names: ["Atlético Uruguay"], from: 1970 },
  { id: "estudiantes-rio-cuarto", names: ["Estudiantes (RCU)"], from: 1970 },
  { id: "estudiantes-sde", names: ["Estudiantes (SDE)", "Estudiantes (Sgo. del Estero)"], from: 1970 },
  { id: "instituto", names: ["Instituto (Córdoba)"], from: 1970 },
  { id: "union-san-vicente", names: ["Unión San Vicente (Córdoba)"], from: 1970 },
  { id: "guarani-antonio-franco", names: ["Guaraní Antonio Franco (Misiones)"], from: 1970 },
  { id: "ferro-general-pico", names: ["Ferro Carril Oeste (GPO)"], from: 1970 },
  { id: "union-general-pinedo", names: ["Unión (General Pinedo)"], from: 1970 },
  { id: "juventud-antoniana", names: ["Juventud Antoniana", "Juventud Antoniana (Salta)", "Juventud Antoniana (S)", "Juv. Antoniana (S)"], from: 1970 },
  { id: "huracan-comodoro", names: ["Huracán (CR)", "Huracán (Com.Rivadavia)", "Huracán (Comodoro Rivadavia)"], from: 1970 },
  { id: "huracan-iw", names: ["Huracán (Bahía Blanca)"], from: 1970 },
  { id: "huracan-san-rafael", names: ["Huracán (SR)", "Huracán (San Rafael)"], from: 1970 },
  { id: "huracan-las-heras", names: ["Huracán Las Heras"], from: 1970 },
  { id: "aldosivi", names: ["Aldosivi", "Aldosivi (Mar del Plata)", "Aldosivi (MdP)"], from: 1970 },
  { id: "alvarado", names: ["Alvarado (Mar del Plata)", "Alvarado (MdP)", "Alvarado"], from: 1970 },
  { id: "andino-la-rioja", names: ["Andino"], from: 1970 },
  { id: "argentino-firmat", names: ["Argentino (F)"], from: 1970 },
  { id: "cipolletti", names: ["Cipolletti", "Cipolletti (RN)", "Cipolletti (Río Negro)", "Atlético Cipolletti"], from: 1970 },
  { id: "circulo-deportivo", names: ["Círculo Deportivo", "Círculo Deportivo (Mar del Plata)", "Círculo Deportivo (MdP)"], from: 1970 },
  { id: "deportivo-mandiyu", names: ["Deportivo Mandiyú", "Mandiyú"], from: 1970 },
  { id: "deportivo-roca", names: ["Deportivo Roca (RN)", "Deportivo Roca (Río Negro)", "Deportivo Roca"], from: 1970 },
  { id: "estudiantes-rio-cuarto", names: ["Estudiantes (RC)", "Estudiantes (Río IV)", "Estudiantes (Río Cuarto)"], from: 1970 },
  { id: "estudiantes-sde", names: ["Estudiantes (Santiago del Estero)", "Estudiantes (Sgo.)"], from: 1970 },
  { id: "estudiantes", names: ["Estudiantes(La Plata)", "Estudiantes (La Plata)"], from: 1970 },
  { id: "ferro-general-pico", names: ["Ferro(Gral.Pico)", "Ferro (Gral.Pico)", "Ferro Carril Oeste (General Pico)"], from: 1970 },
  { id: "gimnasia-tiro-salta", names: ["Gimnasia y Tiro", "Gimnasia y Tiro (Salta)"], from: 1970 },
  { id: "jorge-newbery-junin", names: ["Jorge Newbery", "Jorge Newbery (Junín)"], from: 1970 },
  { id: "loma-negra", names: ["Loma Negra"], from: 1970 },
  { id: "mariano-moreno-junin", names: ["Mariano Moreno (Junín)", "Mariano Moreno"], from: 1970 },
  { id: "regina", names: ["Atlético Regina", "Regina"], from: 1970 },
  { id: "renato-cesarini", names: ["Renato Cesarini", "Renato Cesarini (Ros.)", "Renato Cesarini (Rosario)"], from: 1970 },
  { id: "santa-rosa-lp", names: ["Atlético Santa Rosa"], from: 1970 },
  { id: "union-san-vicente", names: ["Unión San Vicente", "Unión San Vicente (Cba.)", "Unión San Vicente(Cba.)"], from: 1970 },
  { id: "union-general-pinedo", names: ["Unión(Gral.Pinedo)", "Unión (Gral.Pinedo)"], from: 1970 },
  { id: "juventud-unida-sl", names: ["Alianza Juventud Pringles"], as: "Alianza Juventud Pringles", from: 1970 },
  { id: "atletico-juventud-sj", names: ["Juventud Alianza"], from: 1970 },
  { id: "all-boys", names: ["All Boys (BA)", "All Boys (Buenos Aires)"], from: 1970 },
  { id: "altos-hornos-zapla", names: ["Altos Hornos Zapla", "Altos Hornos Zapla (J)", "Altos Hornos Zapla (Jujuy)", "Altos Hornos Zapla(Juj)", "Altos Hornos Zapla(Jujuy)"], from: 1970 },
  { id: "atletico-tucuman", names: ["Atlético Tucumán", "Atlético (Tucumán)"], from: 1970 },
  { id: "atletico-concepcion", names: ["Atlético Concepción", "Atlético Concepción (Tucumán)", "Atlético Concepción(Tuc)", "Atlético Concepción(Tucumán)"], from: 1970 },
  { id: "atletico-ledesma", names: ["Atlético Ledesma", "Atlético Ledesma (Juj)", "Atlético Ledesma (Jujuy)", "Atlético Ledesma(Jujuy)"], from: 1970 },
  { id: "atletico-uruguay", names: ["Atlético Uruguay (C.U.)"], from: 1970 },
  { id: "bartolome-mitre-posadas", names: ["Bartolomé Mitre", "Bartolomé Mitre (Posadas)"], from: 1970 },
  { id: "belgrano", names: ["Belgrano", "Belgrano (Cba.)", "Belgrano(Cba.)", "Belgrano (Córdoba)"], from: 1970 },
  { id: "central-cordoba-sde", names: ["Central Córdoba (Santiago del Estero)", "Central Córdoba (Sgo)", "Central Córdoba (Sgo.)"], from: 1970 },
  { id: "central-norte-salta", names: ["Central Norte (Salta)", "Central Norte(Salta)", "Central Norte"], from: 1970 },
  { id: "colon-santa-fe", names: ["Colón (Sta. Fe)", "Colón (Sta.Fe)", "Colón (Santa Fe)"], from: 1970 },
  { id: "don-orione-resistencia", names: ["Don Orione (Chaco)", "Don Orione"], from: 1970 },
  { id: "gimnasia-jujuy", names: ["Gimnasia (Jujuy)", "Gimnasia (San Salvador de Jujuy)", "Gimnasia y Esg.(Jujuy)", "Gimnasia y Esgrima (Jujuy)"], from: 1970 },
  { id: "gimnasia-mendoza", names: ["Gimnasia Esgrima (Mendoza)", "Gimnasia y Esgrima (Mendoza)", "Gimnasia y Esgrima (Mza)", "Gimnasia y Esgrima (Mza.)", "Gimnasia y Esgrima(Mendoza)", "Gimnasia y Esgrima(Mza)", "Gimnasia y Esgrima(Mza.)", "Gimnasia y Esgrima(Mza)"], from: 1970 },
  { id: "gimnasia", names: ["Gimnasia (LP)", "Grimnasia y Esgrima LP", "Gimnasia y Esgrima (LP)"], from: 1970 },
  { id: "godoy-cruz", names: ["Godoy Cruz"], from: 1970 },
  { id: "guarani-antonio-franco", names: ["Guaraní A. Franco (Mis)", "Guaraní A. Franco (Mis.)", "Guaraní A. Franco (Misiones)", "Guaraní Antonio Franco"], from: 1970 },
  { id: "independiente-rivadavia", names: ["Ind. Rivadavia (M)", "Ind. Rivadavia", "Independiente Riv.(Mza)", "Independiente Riv.(Mza.)", "Independiente Rivadavia (Mendoza)", "Independiente Rivadavia (Mza.)", "Independiente Rivadavia(Mendoza)"], from: 1970 },
  { id: "independiente-trelew", names: ["Independiente (T)"], from: 1970 },
  { id: "instituto", names: ["Instituto", "Instituto (Cba)", "Instituto (Cba.)", "Instituto(Cba.)"], from: 1970 },
  { id: "kimberley-mdp", names: ["Kimberley", "Kimberley (MDQ)", "Kimberley (Mar del Plata)", "Kimberley(Mar del Plata)", "Kimberley(MdP)"], from: 1970 },
  { id: "los-andes-sj", names: ["Los Andes (San Juan)"], from: 1970 },
  { id: "olimpo", names: ["Olimpo(Bahía Blanca)", "Olimpo (Bahía Blanca)"], from: 1970 },
  { id: "patronato-parana", names: ["Patronato (Paraná)", "Patronato"], from: 1970 },
  { id: "puerto-comercial", names: ["Puerto Comercial"], from: 1970 },
  { id: "racing-cordoba", names: ["Racing (Cba.)", "Racing(Cba.)", "Racing (Córdoba)"], from: 1970 },
  { id: "ramon-santamarina", names: ["Ramón Santamarina"], from: 1970 },
  { id: "san-lorenzo-mdp", names: ["San Lorenzo (Mar del Plata)"], from: 1970 },
  { id: "san-martin-mendoza", names: ["San Martín (Mendoza)", "San Martín (SM)", "San Martín (Mza)"], from: 1970 },
  { id: "san-martin-tucuman", names: ["San Martín (San Miguel Tucumán)", "San Martín (Tuc.)", "San Martín (Tucumán)", "San Martín (Tucumán"], from: 1970 },
  { id: "sarmiento-resistencia", names: ["Sarmiento (Chaco)"], from: 1970 },
  { id: "sarmiento-junin", names: ["Sarmiento (J)", "Sarmiento (Junín)"], from: 1970 },
  { id: "desamparados", names: ["Sp. Desamparados"], from: 1970 },
  { id: "sportivo-patria", names: ["Sportivo Patria"], from: 1970 },
  { id: "talleres", names: ["Talleres (Cba.)", "Talleres (Córdoba)", "Talleres(Cba.)"], from: 1970 },
  { id: "union-santa-fe", names: ["Unión (Sta. Fe)", "Unión (Sta.Fe)", "Unión(Sta.Fe)", "Unión (Santa Fe)"], from: 1970 },
  // 1952–1955: la ciudad de La Plata se llamó Eva Perón.
  {
    id: "gimnasia",
    names: ["Gimnasia y Esgrima Eva Perón", "Club Gimnasia y Esgrima Eva Perón", "Gimnasia y Esgrima EP", "Gimnasia EP"],
    as: "Gimnasia y Esgrima (Eva Perón)",
  },
  { id: "estudiantes", names: ["Estudiantes de Eva Perón", "Club Estudiantes de Eva Perón", "Estudiantes EP"], as: "Estudiantes de Eva Perón" },
  { id: "ferro", names: ["Ferro Carril Oeste (Buenos Aires)"] },
  { id: "sportivo-alsina", names: ["Sportivo Alsina", "Club Sportivo Alsina"] },
  { id: "general-san-martin", names: ["Gral.San Martín", "Gral. San Martín"] },
  { id: "penarol-uy", names: ["Peñarol", "CA Peñarol"] },
  { id: "union-talleres-lanus", names: ["Unión Talleres-Lanús"] },
  { id: "atlanta-argentinos", names: ["Atlanta-Argentinos Juniors"] },
  { id: "ramsar", names: ["Ramsar Sport Club", "Ramsar"] },
  { id: "ferro", names: ["Club Ferro Carril Oeste"] },
  { id: "defensor-uy", names: ["Defensor"] },
  { id: "sud-america-uy", names: ["Sud América"] },
  { id: "gimnasia-santa-fe", names: ["Gimnasia y Esgrima (Santa Fe)"] },
  { id: "belgrano", names: ["Belgrano (Córdoba)"] },
  { id: "talleres-re", names: ["Talleres (Remedios de Escalada)"] },
  { id: "gimnasia-lanus", names: ["Gimnasia y Esgrima L", "Gimnasia y Esgrima de Lanús"] },
  { id: "gutenberg", names: ["Gutenberg", "Gutenberg (LP)", "Gutenberg de La Plata"] },
  { id: "nacional-adrogue", names: ["Nacional de Adrogué"] },
  { id: "la-paternal", names: ["La Paternal"] },
  { id: "sportivo-acassuso", names: ["Sportivo Acassuso"] },
  { id: "union-caseros", names: ["Unión de Caseros", "Unión (C)"] },
  { id: "alvear-caseros", names: ["Alvear de Caseros"] },
  { id: "alvear-caseros", names: ["Atlético Caseros"], as: "Atlético Caseros" },
  { id: "ferrocarriles-estado", names: ["Ferrocarriles del Estado"] },
  { id: "platense", names: ["Platense (VLo)"] },
  { id: "huracan", names: ["Huracán (BUE)"] },
  // Copa La Nación 1913–1914. Wikipedia: "Argentino de Vélez Sarsfield" es el actual Vélez.
  { id: "velez", names: ["Argentinos de Vélez Sarsfield", "Argentino de Vélez Sarsfield", "Argentinos de Vélez de Sarfield"], as: "Argentinos de Vélez Sarsfield", to: 1914 },
  { id: "argentino-avellaneda", names: ["Argentino de Avellaneda"] },
  { id: "argentino-nunez", names: ["Argentino de Núñez"] },
  { id: "instituto-americano", names: ["Instituto Americano"] },
  { id: "juventud-tigre", names: ["Juventud del Tigre"] },
  { id: "martinez", names: ["Martínez"] },
  { id: "atlas", names: ["Atlas"] },
  { id: "carapachay", names: ["Carapachay"] },
  { id: "federal", names: ["Federal"] },
  { id: "gimnasia-banfield", names: ["Gimnasia y Esgrima (B)"] },
  { id: "lanus-united", names: ["Lanús United"] },
  { id: "sportivo-suizo", names: ["Sportivo Suizo"] },
  { id: "universitarios", names: ["Universitarios"] },
  { id: "general-belgrano", names: ["General Belgrano LP", "General Belgrano (LP)"] },
  { id: "honor-y-patria", names: ["Honor y Patria (BA)"] },
  { id: "kimberley", names: ["Kimberley (BA)"] },
  { id: "sportiva-argentina", names: ["Sociedad Sportiva Argentino"] },
  { id: "defensores-belgrano", names: ["Defensores de Belgrano FBC", "Defensores de Belgrano Foot-Ball Club"] },
  { id: "rosario-athletic", names: ["Club Atlético del Rosario"] },
  { id: "san-telmo", names: ["San Telmo Football Club"] },
];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[“”]/g, '"')
    // Apóstrofos de Windows-1252 (0x92) y tipográficos: "Newell’s".
    .replace(/[\u0092’`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// Alias propios de un torneo (tienen prioridad): el mismo nombre puede ser otro club en otra liga del mismo año.
let local: Record<string, string> = {};
export function setLocalAliases(aliases: Record<string, string> | undefined) {
  local = Object.fromEntries(Object.entries(aliases ?? {}).map(([k, v]) => [norm(k), v]));
}

// `exact`: sin sacar la forma jurídica (las canchas: "Club Atlético de Flores" no es Flores Athletic).
export function resolveName(raw: string, year: number, exact = false): { id: string; name: string; as?: string } | null {
  const direct = resolveExact(raw, year);
  if (direct || exact) return direct;
  // Las páginas de copas anteponen la forma jurídica ("CA Boca Juniors", "CAd San Isidro", "Cd Gimnasia...").
  const stripped = raw.replace(
    /^(CAd|CA del|CA de|CA|C\.|Cd|CSyD|CSyA|CSD|CS|CD|AD|SC|AA|AC|Club Atlético del|Club Atlético de|Club Atlético|Club Social y Deportivo|Club Deportivo|Asociación Atlética|Club de|Club)\s+/,
    "",
  );
  return stripped !== raw ? resolveExact(stripped, year) : null;
}

function resolveExact(raw: string, year: number): { id: string; name: string; as?: string } | null {
  const n = norm(raw);
  if (local[n]) {
    // "id" o "id|Nombre de época" (ej. "almagro|Sportivo Almagro").
    const [id, as] = local[n].split("|");
    const team = getTeam(id);
    if (!team) throw new Error(`Alias local apunta a un club que no existe: ${id}`);
    return { id: team.id, name: team.name, ...(as && as !== team.name && { as }) };
  }
  const hit = ALIASES.find(
    (a) => (a.from === undefined || year >= a.from) && (a.to === undefined || year <= a.to) && a.names.some((x) => norm(x) === n),
  );
  if (!hit) return null;
  const team = getTeam(hit.id);
  if (!team) throw new Error(`Alias apunta a un club que no existe en lib/teams.ts: ${hit.id}`);
  return { id: hit.id, name: team.name, ...(hit.as && hit.as !== team.name && { as: hit.as }) };
}
