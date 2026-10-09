import GENERATED from "./data/crests.generated.json";

// Escudos descargados de Wikimedia Commons (public/crests). Todos revisados a mano.
// Los clubes sin escudo documentado muestran sus iniciales.
export type Crest = { file: string; license: string; page: string };

const c = (file: string, license: string, page: string): Crest => ({ file: `/crests/${file}.png`, license, page });

export const CRESTS: Record<string, Crest> = {
  river: c("river", "Public domain", "https://commons.wikimedia.org/wiki/File:Club_Atl%C3%A9tico_River_Plate_logo.svg"),
  boca: c("boca", "Public domain", "https://commons.wikimedia.org/wiki/File:Club_Atl%C3%A9tico_Boca_Juniors_logo_(70_stars).png"),
  racing: c("racing", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_de_Racing_Club_(2014).svg"),
  independiente: c("independiente", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_del_Club_Atl%C3%A9tico_Independiente.svg"),
  sanlorenzo: c("sanlorenzo", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_San_Lorenzo_2026.svg"),
  huracan: c("huracan", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg"),
  estudiantes: c("estudiantes", "Public domain", "https://commons.wikimedia.org/wiki/File:Estudiantes_de_la_Plata_crest_(2025).svg"),
  gimnasia: c("gimnasia", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_del_Club_de_Gimnasia_y_Esgrima_La_Plata_(v2026).svg"),
  velez: c("velez", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg"),
  newells: c("newells", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys_de_Rosario.svg"),
  central: c("central", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_del_Club_Atl%C3%A9tico_Rosario_Central.svg"),
  talleres: c("talleres", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_Talleres_2015.svg"),
  belgrano: c("belgrano", "Public domain", "https://commons.wikimedia.org/wiki/File:Club_Atl%C3%A9tico_Belgrano_2026.svg"),
  lanus: c("lanus", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_de_Lan%C3%BAs_(sin_estrellas).svg"),
  banfield: c("banfield", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Banfield_2022.png"),
  argentinos: c("argentinos", "Public domain", "https://commons.wikimedia.org/wiki/File:Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors_logo.svg"),
  tigre: c("tigre", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_del_Club_Atl%C3%A9tico_Tigre_-_2019.svg"),
  platense: c("platense", "Public domain", "https://commons.wikimedia.org/wiki/File:Club_Alt%C3%A9tico_Platense_crest_(2025).svg"),
  quilmes: c("quilmes", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_de_Quilmes_Atl%C3%A9tico_Club.svg"),
  "lomas-athletic": c("lomas-athletic", "CC0", "https://commons.wikimedia.org/wiki/File:Escudo_Lomas_jpg.jpg"),
  alumni: c("alumni", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_Alumni.png"),
  "rosario-athletic": c("rosario-athletic", "Public domain", "https://commons.wikimedia.org/wiki/File:Atlet_rosario_logo.svg"),
  "belgrano-athletic": c("belgrano-athletic", "Public domain", "https://commons.wikimedia.org/wiki/File:Escudo_de_Belgrano_Athletic_Club.svg"),
};

// El resto de los clubes (también los del exterior): los baja scripts/crests (Wikipedia y Commons), revisados a mano.
// Los que no tienen escudo libre en Commons usan el logo de la Wikipedia en inglés.
for (const [id, crest] of Object.entries(GENERATED as Record<string, Crest>)) CRESTS[id] ??= crest;

// Lomas Academy era el segundo equipo del Lomas Athletic Club: mismo escudo.
CRESTS["lomas-academy"] = CRESTS["lomas-athletic"];
