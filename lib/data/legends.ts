// Comparador de leyendas: los 25 jugadores de la lista de 126Goals. Generado con datos de Wikipedia en inglés
// (fichas, tablas de estadísticas y secciones de títulos de cada artículo, octubre de 2026), revisados uno por uno.
// - Clubes (por club): partidos y goles de LIGA, como los publica la ficha de cada jugador.
// - clubTotal: todas las competencias oficiales de clubes (fila "Career total"); sin equipos B ni juveniles.
//   Messi y Cristiano, con los datos verificados de lib/data/messi-ronaldo.ts.
// - Títulos: solo como jugador; sin amistosos ni títulos como entrenador. Los subcampeonatos no cuentan.
// - Premios: Balón de Oro (lib/data/ballon-dor.ts), mejor jugador FIFA (desde 1991), Balón de Oro del Mundial (oficial
//   desde 1982), goleador del Mundial y Bota de Oro europea (desde 1968).
export type TitleCat = "liga" | "copa" | "intl" | "reg" | "mundial" | "continental" | "olimpico" | "selOtros" | "juvenil";
export type Legend = {
  id: string;
  rank: number;
  name: string;
  country: string;
  flag?: string;
  position: string;
  born?: string;
  died?: string;
  clubs: { club: string; loan?: boolean; years: string; apps: number; goals: number | null }[];
  national: { team: string; years: string; apps: number; goals: number }[];
  clubTotal: { apps: number; goals: number };
  assists?: { club: number; intl: number };
  titles: { cat: TitleCat; name: string; n: number }[];
  awards: { ballonDor: number[]; fifa: number; wcBall: number; wcBoot: number; shoe: number };
  photo?: { src: string; file: string; author: string; license: string; year?: string };
  note?: string;
};

export const LEGENDS: Legend[] = [
 {
  "id": "messi",
  "rank": 1,
  "name": "Lionel Messi",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1987-06-24",
  "clubs": [
   {
    "club": "Barcelona",
    "years": "2004–2021",
    "apps": 520,
    "goals": 474
   },
   {
    "club": "Paris Saint-Germain",
    "years": "2021–2023",
    "apps": 58,
    "goals": 22
   },
   {
    "club": "Inter Miami",
    "years": "2023–",
    "apps": 77,
    "goals": 71
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "2005–",
    "apps": 207,
    "goals": 125
   }
  ],
  "clubTotal": {
   "apps": 970,
   "goals": 806
  },
  "assists": {
   "club": 359,
   "intl": 65
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 10
   },
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "MLS (Supporters' Shield)",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 7
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 8
   },
   {
    "cat": "copa",
    "name": "Trophée des Champions",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "MLS Cup",
    "n": 1
   },
   {
    "cat": "reg",
    "name": "Conferencia Este de la MLS",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Leagues Cup",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Campeones Cup",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Finalissima",
    "n": 1
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    2009,
    2010,
    2011,
    2012,
    2015,
    2019,
    2021,
    2023
   ],
   "fifa": 8,
   "wcBall": 2,
   "wcBoot": 0,
   "shoe": 6
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/330px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Leo Messi Argentina v Egypt 7 July 2026-1.jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  }
 },
 {
  "id": "maradona",
  "rank": 2,
  "name": "Diego Maradona",
  "country": "Argentina",
  "flag": "ar",
  "position": "Enganche",
  "born": "1960-10-30",
  "died": "2020-11-25",
  "clubs": [
   {
    "club": "Argentinos Juniors",
    "years": "1976–1981",
    "apps": 166,
    "goals": 116
   },
   {
    "club": "Boca Juniors",
    "years": "1981–1982",
    "apps": 40,
    "goals": 28
   },
   {
    "club": "Barcelona",
    "years": "1982–1984",
    "apps": 36,
    "goals": 22
   },
   {
    "club": "Napoli",
    "years": "1984–1991",
    "apps": 188,
    "goals": 81
   },
   {
    "club": "Sevilla",
    "years": "1992–1993",
    "apps": 26,
    "goals": 5
   },
   {
    "club": "Newell's Old Boys",
    "years": "1993–1994",
    "apps": 5,
    "goals": 0
   },
   {
    "club": "Boca Juniors",
    "years": "1995–1997",
    "apps": 30,
    "goals": 7
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1977–1994",
    "apps": 91,
    "goals": 34
   }
  ],
  "clubTotal": {
   "apps": 589,
   "goals": 311
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División (Boca)",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga (España)",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa Italia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa UEFA",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Copa Artemio Franchi",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 1,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Argentina_celebrando_copa_%28cropped%29.jpg/330px-Argentina_celebrando_copa_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Argentina celebrando copa (cropped).jpg",
   "author": "Autor desconocido",
   "license": "Public domain",
   "year": "1986"
  }
 },
 {
  "id": "pele",
  "rank": 3,
  "name": "Pelé",
  "country": "Brasil",
  "flag": "br",
  "position": "Delantero",
  "born": "1940-10-23",
  "clubs": [
   {
    "club": "Santos",
    "years": "1956–1974",
    "apps": 583,
    "goals": 569
   },
   {
    "club": "New York Cosmos",
    "years": "1975–1977",
    "apps": 64,
    "goals": 37
   }
  ],
  "national": [
   {
    "team": "Brazil",
    "years": "1957–1971",
    "apps": 92,
    "goals": 77
   }
  ],
  "clubTotal": {
   "apps": 748,
   "goals": 698
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Brasileirão",
    "n": 6
   },
   {
    "cat": "liga",
    "name": "NASL",
    "n": 1
   },
   {
    "cat": "reg",
    "name": "Campeonato Paulista",
    "n": 10
   },
   {
    "cat": "reg",
    "name": "Torneo Río-San Pablo",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Supercopa Intercontinental",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 3
   },
   {
    "cat": "selOtros",
    "name": "Copa Roca, Taça Oswaldo Cruz, Copa O'Higgins y Taça do Atlântico",
    "n": 7
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Pele_con_brasil_%28cropped%29.jpg/330px-Pele_con_brasil_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Pele con brasil (cropped).jpg",
   "author": "Autor desconocido",
   "license": "Public domain",
   "year": "1970"
  },
  "note": "Según RSSSF, 775 goles en 840 partidos oficiales entre clubes y selección; los de clubes salen de restar los de Brasil. Con amistosos y giras llegó a 1.301 goles en 1.390 partidos."
 },
 {
  "id": "beckenbauer",
  "rank": 4,
  "name": "Franz Beckenbauer",
  "country": "Alemania",
  "flag": "de",
  "position": "Líbero",
  "born": "1945-09-11",
  "died": "2024-01-07",
  "clubs": [
   {
    "club": "Bayern Munich",
    "years": "1964–1977",
    "apps": 427,
    "goals": 60
   },
   {
    "club": "New York Cosmos",
    "years": "1977–1980",
    "apps": 80,
    "goals": 17
   },
   {
    "club": "Hamburger SV",
    "years": "1980–1982",
    "apps": 28,
    "goals": 0
   },
   {
    "club": "New York Cosmos",
    "years": "1983",
    "apps": 25,
    "goals": 2
   }
  ],
  "national": [
   {
    "team": "West Germany",
    "years": "1965–1977",
    "apps": 103,
    "goals": 14
   }
  ],
  "clubTotal": {
   "apps": 754,
   "goals": 98
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Bundesliga",
    "n": 5
   },
   {
    "cat": "liga",
    "name": "NASL",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa de Alemania",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Recopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1972,
    1976
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Franz_Beckenbauer_%281975%29.jpg/330px-Franz_Beckenbauer_%281975%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Franz Beckenbauer (1975).jpg",
   "author": "Panini Group",
   "license": "Public domain",
   "year": "1975"
  }
 },
 {
  "id": "cruyff",
  "rank": 5,
  "name": "Johan Cruyff",
  "country": "Países Bajos",
  "flag": "nl",
  "position": "Delantero",
  "born": "1947-04-25",
  "died": "2016-03-24",
  "clubs": [
   {
    "club": "Ajax",
    "years": "1964–1973",
    "apps": 245,
    "goals": 193
   },
   {
    "club": "Barcelona",
    "years": "1973–1978",
    "apps": 143,
    "goals": 48
   },
   {
    "club": "Los Angeles Aztecs",
    "years": "1979",
    "apps": 22,
    "goals": 14
   },
   {
    "club": "Washington Diplomats",
    "years": "1980–1981",
    "apps": 29,
    "goals": 12
   },
   {
    "club": "Levante",
    "loan": true,
    "years": "1981",
    "apps": 10,
    "goals": 2
   },
   {
    "club": "Ajax",
    "years": "1981–1983",
    "apps": 36,
    "goals": 14
   },
   {
    "club": "Feyenoord",
    "years": "1983–1984",
    "apps": 33,
    "goals": 11
   }
  ],
  "national": [
   {
    "team": "Netherlands",
    "years": "1966–1977",
    "apps": 48,
    "goals": 33
   }
  ],
  "clubTotal": {
   "apps": 713,
   "goals": 400
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Eredivisie",
    "n": 9
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de los Países Bajos",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1971,
    1973,
    1974
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/330px-Johan_Cruijff_%281974%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Johan Cruijff (1974).jpg",
   "author": "Rob Mieremet / Anefo",
   "license": "CC0",
   "year": "1974"
  }
 },
 {
  "id": "ronaldo-nazario",
  "rank": 6,
  "name": "Ronaldo Nazário",
  "country": "Brasil",
  "flag": "br",
  "position": "Delantero",
  "born": "1976-09-18",
  "clubs": [
   {
    "club": "Cruzeiro",
    "years": "1993–1994",
    "apps": 34,
    "goals": 34
   },
   {
    "club": "PSV",
    "years": "1994–1996",
    "apps": 46,
    "goals": 42
   },
   {
    "club": "Barcelona",
    "years": "1996–1997",
    "apps": 37,
    "goals": 34
   },
   {
    "club": "Inter Milan",
    "years": "1997–2002",
    "apps": 68,
    "goals": 49
   },
   {
    "club": "Real Madrid",
    "years": "2002–2007",
    "apps": 127,
    "goals": 83
   },
   {
    "club": "AC Milan",
    "years": "2007–2008",
    "apps": 20,
    "goals": 9
   },
   {
    "club": "Corinthians",
    "years": "2009–2011",
    "apps": 52,
    "goals": 29
   }
  ],
  "national": [
   {
    "team": "Brazil",
    "years": "1994–2011",
    "apps": 98,
    "goals": 62
   }
  ],
  "clubTotal": {
   "apps": 518,
   "goals": 352
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de los Países Bajos",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de Brasil",
    "n": 1
   },
   {
    "cat": "reg",
    "name": "Mineiro y Paulista",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Recopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa UEFA",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 2
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Copa Confederaciones",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1997,
    2002
   ],
   "fifa": 3,
   "wcBall": 1,
   "wcBoot": 1,
   "shoe": 1
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg/330px-12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "12.12.2025 – Cerimônia de lançamento do SBT News - 54980664160 (cropped2).jpg",
   "author": "Lula Oficial",
   "license": "CC BY-SA 4.0",
   "year": "2025"
  }
 },
 {
  "id": "zidane",
  "rank": 7,
  "name": "Zinedine Zidane",
  "country": "Francia",
  "flag": "fr",
  "position": "Enganche",
  "born": "1972-06-23",
  "clubs": [
   {
    "club": "Cannes",
    "years": "1989–1992",
    "apps": 61,
    "goals": 6
   },
   {
    "club": "Bordeaux",
    "years": "1992–1996",
    "apps": 139,
    "goals": 28
   },
   {
    "club": "Juventus",
    "years": "1996–2001",
    "apps": 151,
    "goals": 24
   },
   {
    "club": "Real Madrid",
    "years": "2001–2006",
    "apps": 155,
    "goals": 37
   }
  ],
  "national": [
   {
    "team": "France",
    "years": "1994–2006",
    "apps": 108,
    "goals": 31
   }
  ],
  "clubTotal": {
   "apps": 695,
   "goals": 125
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa Intertoto",
    "n": 2
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1998
   ],
   "fifa": 3,
   "wcBall": 1,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg/330px-Zinedine_Zidane_by_Tasnim_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Zinedine Zidane by Tasnim 03.jpg",
   "author": "Hadi Abyar",
   "license": "CC BY 4.0",
   "year": "2017"
  }
 },
 {
  "id": "cristiano",
  "rank": 8,
  "name": "Cristiano Ronaldo",
  "country": "Portugal",
  "flag": "pt",
  "position": "Delantero",
  "born": "1985-02-05",
  "clubs": [
   {
    "club": "Sporting CP",
    "years": "2002–2003",
    "apps": 25,
    "goals": 3
   },
   {
    "club": "Manchester United",
    "years": "2003–2009",
    "apps": 196,
    "goals": 84
   },
   {
    "club": "Real Madrid",
    "years": "2009–2018",
    "apps": 292,
    "goals": 311
   },
   {
    "club": "Juventus",
    "years": "2018–2021",
    "apps": 98,
    "goals": 81
   },
   {
    "club": "Manchester United",
    "years": "2021–2022",
    "apps": 40,
    "goals": 19
   },
   {
    "club": "Al-Nassr",
    "years": "2023–",
    "apps": 113,
    "goals": 105
   }
  ],
  "national": [
   {
    "team": "Portugal",
    "years": "2003–2026",
    "apps": 234,
    "goals": 146
   }
  ],
  "clubTotal": {
   "apps": 1104,
   "goals": 833
  },
  "assists": {
   "club": 224,
   "intl": 37
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Premier League",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Liga saudí",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga inglesa",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Community Shield",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa Italia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Supercopa de Portugal",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Copa de Campeones Árabe",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "UEFA Nations League",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [
    2008,
    2013,
    2014,
    2016,
    2017
   ],
   "fifa": 5,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 4
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/330px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Cristiano Ronaldo Croatia v Portugal 2 July 2026-075 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  }
 },
 {
  "id": "di-stefano",
  "rank": 9,
  "name": "Alfredo Di Stéfano",
  "country": "Argentina / España",
  "flag": "ar",
  "position": "Delantero",
  "born": "1926-07-04",
  "died": "2014-07-07",
  "clubs": [
   {
    "club": "River Plate",
    "years": "1945–1949",
    "apps": 66,
    "goals": 49
   },
   {
    "club": "Huracán",
    "loan": true,
    "years": "1945–1946",
    "apps": 25,
    "goals": 10
   },
   {
    "club": "Millonarios",
    "years": "1949–1953",
    "apps": 101,
    "goals": 90
   },
   {
    "club": "Real Madrid",
    "years": "1953–1964",
    "apps": 282,
    "goals": 216
   },
   {
    "club": "Espanyol",
    "years": "1964–1966",
    "apps": 47,
    "goals": 11
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1947",
    "apps": 6,
    "goals": 6
   },
   {
    "team": "Spain",
    "years": "1957–1961",
    "apps": 31,
    "goals": 23
   }
  ],
  "clubTotal": {
   "apps": 669,
   "goals": 480
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División (River)",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Liga colombiana",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 8
   },
   {
    "cat": "copa",
    "name": "Copa Colombia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Generalísimo",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Copa Latina",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Aldao",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América (Sudamericano 1947)",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1957,
    1959
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Alfredo_Di_Stefano_River_Plate.jpg/330px-Alfredo_Di_Stefano_River_Plate.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Alfredo Di Stefano River Plate.jpg",
   "author": "Autor desconocido",
   "license": "Public domain",
   "year": "1945"
  },
  "note": "Jugó para Argentina (6 PJ, 6 goles), Colombia (4 PJ que la FIFA no reconoce, por eso no se suman) y España (31 PJ, 23 goles)."
 },
 {
  "id": "platini",
  "rank": 10,
  "name": "Michel Platini",
  "country": "Francia",
  "flag": "fr",
  "position": "Enganche",
  "born": "1955-06-21",
  "clubs": [
   {
    "club": "Nancy",
    "years": "1972–1979",
    "apps": 181,
    "goals": 98
   },
   {
    "club": "Saint-Étienne",
    "years": "1979–1982",
    "apps": 104,
    "goals": 58
   },
   {
    "club": "Juventus",
    "years": "1982–1987",
    "apps": 147,
    "goals": 68
   }
  ],
  "national": [
   {
    "team": "France",
    "years": "1976–1987",
    "apps": 72,
    "goals": 41
   }
  ],
  "clubTotal": {
   "apps": 582,
   "goals": 313
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de Francia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa Italia",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Recopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Copa Artemio Franchi",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1983,
    1984,
    1985
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://upload.wikimedia.org/wikipedia/commons/6/66/Michel_Platini_2010_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
   "file": "Michel Platini 2010 (cropped).jpg",
   "author": "Chancellery of the President of the Republic of Poland",
   "license": "GFDL 1.2",
   "year": "2010"
  },
  "note": "También jugó un amistoso para Kuwait en 1988, que no cuenta como partido oficial."
 },
 {
  "id": "ronaldinho",
  "rank": 11,
  "name": "Ronaldinho",
  "country": "Brasil",
  "flag": "br",
  "position": "Enganche",
  "born": "1980-03-21",
  "clubs": [
   {
    "club": "Grêmio",
    "years": "1998–2001",
    "apps": 89,
    "goals": 47
   },
   {
    "club": "Paris Saint-Germain",
    "years": "2001–2003",
    "apps": 55,
    "goals": 17
   },
   {
    "club": "Barcelona",
    "years": "2003–2008",
    "apps": 145,
    "goals": 70
   },
   {
    "club": "AC Milan",
    "years": "2008–2011",
    "apps": 76,
    "goals": 20
   },
   {
    "club": "Flamengo",
    "years": "2011–2012",
    "apps": 56,
    "goals": 23
   },
   {
    "club": "Atlético Mineiro",
    "years": "2012–2014",
    "apps": 58,
    "goals": 20
   },
   {
    "club": "Querétaro",
    "years": "2014–2015",
    "apps": 25,
    "goals": 8
   },
   {
    "club": "Fluminense",
    "years": "2015",
    "apps": 7,
    "goals": 0
   },
   {
    "club": "Ravenna",
    "years": "2026–",
    "apps": 0,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Brazil",
    "years": "1999–2013",
    "apps": 97,
    "goals": 33
   }
  ],
  "clubTotal": {
   "apps": 699,
   "goals": 266
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "reg",
    "name": "Gaúcho, Carioca, Mineiro y Copa Sul",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Recopa Sudamericana",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intertoto",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Copa Confederaciones",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-17",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    2005
   ],
   "fifa": 2,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Ronaldinho_in_2019.jpg/330px-Ronaldinho_in_2019.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Ronaldinho in 2019.jpg",
   "author": "Marcos Corrêa/PR",
   "license": "CC BY 2.0",
   "year": "2019"
  }
 },
 {
  "id": "gerd-muller",
  "rank": 12,
  "name": "Gerd Müller",
  "country": "Alemania",
  "flag": "de",
  "position": "Delantero",
  "born": "1945-11-03",
  "died": "2021-08-15",
  "clubs": [
   {
    "club": "1861 Nördlingen",
    "years": "1963–1964",
    "apps": 31,
    "goals": 51
   },
   {
    "club": "Bayern Munich",
    "years": "1964–1979",
    "apps": 453,
    "goals": 398
   },
   {
    "club": "Fort Lauderdale Strikers",
    "years": "1979–1981",
    "apps": 71,
    "goals": 38
   }
  ],
  "national": [
   {
    "team": "West Germany",
    "years": "1966–1974",
    "apps": 62,
    "goals": 68
   }
  ],
  "clubTotal": {
   "apps": 718,
   "goals": 656
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Bundesliga",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Copa de Alemania",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Recopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1970
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 1,
   "shoe": 2
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Gerd_M%C3%BCller_c1973_%28cropped%29.jpg/330px-Gerd_M%C3%BCller_c1973_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Gerd Müller c1973 (cropped).jpg",
   "author": "Autor desconocido",
   "license": "Public domain",
   "year": "1973"
  }
 },
 {
  "id": "puskas",
  "rank": 13,
  "name": "Ferenc Puskás",
  "country": "Hungría / España",
  "flag": "hu",
  "position": "Delantero",
  "born": "1927-04-01",
  "died": "2006-11-17",
  "clubs": [
   {
    "club": "Budapest Honvéd",
    "years": "1943–1956",
    "apps": 397,
    "goals": 428
   },
   {
    "club": "Real Madrid",
    "years": "1958–1966",
    "apps": 262,
    "goals": 242
   }
  ],
  "national": [
   {
    "team": "Hungary",
    "years": "1945–1956",
    "apps": 85,
    "goals": 84
   },
   {
    "team": "Spain",
    "years": "1961–1962",
    "apps": 4,
    "goals": 0
   }
  ],
  "clubTotal": {
   "apps": 659,
   "goals": 670
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Liga húngara",
    "n": 5
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Copa del Generalísimo",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Copa Internacional de Europa Central y Copa de los Balcanes",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://upload.wikimedia.org/wikipedia/commons/9/93/Ferenc_Puskas_en_1965.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
   "file": "Ferenc Puskas en 1965.jpg",
   "author": "Panini",
   "license": "Public domain",
   "year": "1965"
  }
 },
 {
  "id": "maldini",
  "rank": 14,
  "name": "Paolo Maldini",
  "country": "Italia",
  "flag": "it",
  "position": "Defensor",
  "born": "1968-06-26",
  "clubs": [
   {
    "club": "Milan",
    "years": "1984–2009",
    "apps": 647,
    "goals": 29
   }
  ],
  "national": [
   {
    "team": "Italy",
    "years": "1988–2002",
    "apps": 126,
    "goals": 7
   }
  ],
  "clubTotal": {
   "apps": 902,
   "goals": 33
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 7
   },
   {
    "cat": "copa",
    "name": "Copa Italia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Paolo_Maldini_AC_Milan_Technical_director_2018.jpg/330px-Paolo_Maldini_AC_Milan_Technical_director_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Paolo Maldini AC Milan Technical director 2018.jpg",
   "author": "GOAL TV",
   "license": "CC BY 3.0",
   "year": "2018"
  }
 },
 {
  "id": "van-basten",
  "rank": 15,
  "name": "Marco van Basten",
  "country": "Países Bajos",
  "flag": "nl",
  "position": "Delantero",
  "born": "1964-10-31",
  "clubs": [
   {
    "club": "Ajax",
    "years": "1981–1987",
    "apps": 133,
    "goals": 128
   },
   {
    "club": "AC Milan",
    "years": "1987–1995",
    "apps": 147,
    "goals": 90
   }
  ],
  "national": [
   {
    "team": "Netherlands",
    "years": "1983–1992",
    "apps": 58,
    "goals": 24
   }
  ],
  "clubTotal": {
   "apps": 379,
   "goals": 283
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Eredivisie",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Copa de los Países Bajos",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Recopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 2
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1988,
    1989,
    1992
   ],
   "fifa": 1,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Marco_van_Basten_%282%29_%28cropped%29.jpg/330px-Marco_van_Basten_%282%29_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Marco van Basten (2) (cropped).jpg",
   "author": "Paul Blank",
   "license": "CC BY 2.5"
  }
 },
 {
  "id": "garrincha",
  "rank": 16,
  "name": "Garrincha",
  "country": "Brasil",
  "flag": "br",
  "position": "Puntero derecho",
  "born": "1933-10-28",
  "died": "1983-01-20",
  "clubs": [
   {
    "club": "Botafogo",
    "years": "1953–1965",
    "apps": 238,
    "goals": 84
   },
   {
    "club": "Corinthians",
    "years": "1966",
    "apps": 4,
    "goals": 0
   },
   {
    "club": "Atlético Junior",
    "years": "1968",
    "apps": 1,
    "goals": 0
   },
   {
    "club": "Flamengo",
    "years": "1968–1969",
    "apps": 5,
    "goals": 0
   },
   {
    "club": "Sacrofano",
    "years": "1970–1971",
    "apps": 12,
    "goals": 6
   },
   {
    "club": "Olaria",
    "years": "1971–1972",
    "apps": 6,
    "goals": null
   }
  ],
  "national": [
   {
    "team": "Brazil",
    "years": "1955–1966",
    "apps": 50,
    "goals": 12
   }
  ],
  "clubTotal": {
   "apps": 345,
   "goals": 102
  },
  "titles": [
   {
    "cat": "reg",
    "name": "Campeonato Carioca",
    "n": 3
   },
   {
    "cat": "reg",
    "name": "Torneo Río-San Pablo",
    "n": 3
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Copa O'Higgins y Taça Oswaldo Cruz",
    "n": 6
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 1,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Manoel_Francisco_dos_Santos-Garrincha.jpg/330px-Manoel_Francisco_dos_Santos-Garrincha.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Manoel Francisco dos Santos-Garrincha.jpg",
   "author": "El Gráfico, n° 2233",
   "license": "Public domain",
   "year": "1962"
  },
  "note": "Los torneos amistosos con Botafogo no se cuentan."
 },
 {
  "id": "baggio",
  "rank": 17,
  "name": "Roberto Baggio",
  "country": "Italia",
  "flag": "it",
  "position": "Segundo delantero",
  "born": "1967-02-18",
  "clubs": [
   {
    "club": "Vicenza",
    "years": "1982–1985",
    "apps": 36,
    "goals": 13
   },
   {
    "club": "Fiorentina",
    "years": "1985–1990",
    "apps": 94,
    "goals": 39
   },
   {
    "club": "Juventus",
    "years": "1990–1995",
    "apps": 141,
    "goals": 78
   },
   {
    "club": "AC Milan",
    "years": "1995–1997",
    "apps": 51,
    "goals": 12
   },
   {
    "club": "Bologna",
    "years": "1997–1998",
    "apps": 30,
    "goals": 22
   },
   {
    "club": "Inter Milan",
    "years": "1998–2000",
    "apps": 41,
    "goals": 9
   },
   {
    "club": "Brescia",
    "years": "2000–2004",
    "apps": 95,
    "goals": 45
   }
  ],
  "national": [
   {
    "team": "Italy",
    "years": "1988–2004",
    "apps": 56,
    "goals": 27
   }
  ],
  "clubTotal": {
   "apps": 643,
   "goals": 291
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa Italia",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa UEFA",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1993
   ],
   "fifa": 1,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/%D8%B1%D9%88%D8%A8%D8%B1%D8%AA%D9%88_%D8%A8%D8%A7%D8%AC%D9%88_%28cropped%29.jpg/330px-%D8%B1%D9%88%D8%A8%D8%B1%D8%AA%D9%88_%D8%A8%D8%A7%D8%AC%D9%88_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "روبرتو باجو (cropped).jpg",
   "author": "AbolfaZl0990",
   "license": "CC BY-SA 4.0",
   "year": "2023"
  }
 },
 {
  "id": "xavi",
  "rank": 18,
  "name": "Xavi Hernández",
  "country": "España",
  "flag": "es",
  "position": "Volante",
  "born": "1980-01-25",
  "clubs": [
   {
    "club": "Barcelona",
    "years": "1998–2015",
    "apps": 505,
    "goals": 58
   },
   {
    "club": "Al Sadd",
    "years": "2015–2019",
    "apps": 82,
    "goals": 20
   }
  ],
  "national": [
   {
    "team": "Spain",
    "years": "2000–2014",
    "apps": 133,
    "goals": 13
   }
  ],
  "clubTotal": {
   "apps": 890,
   "goals": 110
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 8
   },
   {
    "cat": "liga",
    "name": "Liga de Catar",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Copa del Emir, Copa de Catar y Copa Sheikh Jassim",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 2
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 2
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Xavi%2C_Persepolis_vs._Al_Sadd%2C_20190520_02_%28cropped%29.jpg/330px-Xavi%2C_Persepolis_vs._Al_Sadd%2C_20190520_02_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Xavi, Persepolis vs. Al Sadd, 20190520 02 (cropped).jpg",
   "author": "Meysam Mehabadi",
   "license": "CC BY 4.0",
   "year": "2019"
  }
 },
 {
  "id": "iniesta",
  "rank": 19,
  "name": "Andrés Iniesta",
  "country": "España",
  "flag": "es",
  "position": "Volante",
  "born": "1984-05-11",
  "clubs": [
   {
    "club": "Barcelona",
    "years": "2002–2018",
    "apps": 442,
    "goals": 35
   },
   {
    "club": "Vissel Kobe",
    "years": "2018–2023",
    "apps": 114,
    "goals": 21
   },
   {
    "club": "Emirates",
    "years": "2023–2024",
    "apps": 20,
    "goals": 5
   }
  ],
  "national": [
   {
    "team": "Spain",
    "years": "2006–2018",
    "apps": 131,
    "goals": 13
   }
  ],
  "clubTotal": {
   "apps": 836,
   "goals": 88
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 9
   },
   {
    "cat": "liga",
    "name": "J1 League",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Copa del Emperador y Supercopa de Japón",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 3
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 2
   },
   {
    "cat": "juvenil",
    "name": "Eurocopas Sub-16 y Sub-19",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Andr%C3%A9s_Iniesta_Argentina_v_Spain_19_July_2026-034_%28cropped%29.jpg/330px-Andr%C3%A9s_Iniesta_Argentina_v_Spain_19_July_2026-034_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Andrés Iniesta Argentina v Spain 19 July 2026-034 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  }
 },
 {
  "id": "matthaus",
  "rank": 20,
  "name": "Lothar Matthäus",
  "country": "Alemania",
  "flag": "de",
  "position": "Volante",
  "born": "1961-03-21",
  "clubs": [
   {
    "club": "Borussia Mönchengladbach",
    "years": "1979–1984",
    "apps": 162,
    "goals": 36
   },
   {
    "club": "Bayern Munich",
    "years": "1984–1988",
    "apps": 113,
    "goals": 57
   },
   {
    "club": "Inter Milan",
    "years": "1988–1992",
    "apps": 115,
    "goals": 40
   },
   {
    "club": "Bayern Munich",
    "years": "1992–2000",
    "apps": 189,
    "goals": 28
   },
   {
    "club": "MetroStars",
    "years": "2000",
    "apps": 16,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Germany",
    "years": "1980–2000",
    "apps": 150,
    "goals": 23
   }
  ],
  "clubTotal": {
   "apps": 782,
   "goals": 204
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Bundesliga",
    "n": 6
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Alemania",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga alemana",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de Alemania",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa UEFA",
    "n": 2
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1990
   ],
   "fifa": 1,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/2019_Lothar_Matth%C3%A4us.jpg/330px-2019_Lothar_Matth%C3%A4us.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "2019 Lothar Matthäus.jpg",
   "author": "Steffen Prößdorf",
   "license": "CC BY-SA 4.0",
   "year": "2019"
  }
 },
 {
  "id": "eusebio",
  "rank": 21,
  "name": "Eusébio",
  "country": "Portugal",
  "flag": "pt",
  "position": "Delantero",
  "born": "1942-01-25",
  "died": "2014-01-05",
  "clubs": [
   {
    "club": "Sporting Lourenço Marques",
    "years": "1957–1960",
    "apps": 42,
    "goals": 77
   },
   {
    "club": "Benfica",
    "years": "1961–1975",
    "apps": 301,
    "goals": 317
   },
   {
    "club": "Boston Minutemen",
    "years": "1975",
    "apps": 7,
    "goals": 2
   },
   {
    "club": "Monterrey",
    "years": "1975",
    "apps": 10,
    "goals": 1
   },
   {
    "club": "Toronto Metros-Croatia",
    "years": "1975–1976",
    "apps": 21,
    "goals": 16
   },
   {
    "club": "Beira-Mar",
    "years": "1976",
    "apps": 12,
    "goals": 3
   },
   {
    "club": "Las Vegas Quicksilvers",
    "years": "1976–1977",
    "apps": 17,
    "goals": 2
   },
   {
    "club": "União de Tomar",
    "years": "1977–1978",
    "apps": 12,
    "goals": 3
   },
   {
    "club": "New Jersey Americans",
    "years": "1978–1979",
    "apps": 9,
    "goals": 2
   }
  ],
  "national": [
   {
    "team": "Portugal",
    "years": "1961–1973",
    "apps": 64,
    "goals": 41
   }
  ],
  "clubTotal": {
   "apps": 577,
   "goals": 582
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primeira Liga",
    "n": 11
   },
   {
    "cat": "liga",
    "name": "NASL",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Portugal",
    "n": 5
   },
   {
    "cat": "reg",
    "name": "Taça de Honra, Taça Ribeiro dos Reis y liga de Mozambique",
    "n": 13
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1965
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 1,
   "shoe": 2
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Eusebio_en_1973.jpg/330px-Eusebio_en_1973.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Eusebio en 1973.jpg",
   "author": "Panini",
   "license": "Public domain",
   "year": "1973"
  }
 },
 {
  "id": "meazza",
  "rank": 22,
  "name": "Giuseppe Meazza",
  "country": "Italia",
  "flag": "it",
  "position": "Delantero",
  "born": "1910-08-23",
  "died": "1979-08-21",
  "clubs": [
   {
    "club": "Inter Milan",
    "years": "1927–1940",
    "apps": 348,
    "goals": 240
   },
   {
    "club": "AC Milan",
    "years": "1940–1942",
    "apps": 37,
    "goals": 9
   },
   {
    "club": "Juventus",
    "years": "1942–1943",
    "apps": 27,
    "goals": 10
   },
   {
    "club": "Varese",
    "years": "1944",
    "apps": 20,
    "goals": 7
   },
   {
    "club": "Atalanta",
    "years": "1945–1946",
    "apps": 14,
    "goals": 2
   },
   {
    "club": "Inter Milan",
    "years": "1946–1947",
    "apps": 17,
    "goals": 2
   }
  ],
  "national": [
   {
    "team": "Italy",
    "years": "1930–1939",
    "apps": 53,
    "goals": 33
   }
  ],
  "clubTotal": {
   "apps": 511,
   "goals": 314
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa Italia",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Copa Internacional de Europa Central",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Giuseppe_Meazza_1935.jpg/330px-Giuseppe_Meazza_1935.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Giuseppe Meazza 1935.jpg",
   "author": "Autor desconocido",
   "license": "Public domain",
   "year": "1934"
  }
 },
 {
  "id": "yashin",
  "rank": 23,
  "name": "Lev Yashin",
  "country": "Unión Soviética",
  "position": "Arquero",
  "born": "1929-10-22",
  "died": "1990-03-20",
  "clubs": [
   {
    "club": "Dynamo Moscow",
    "years": "1950–1970",
    "apps": 326,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Soviet Union",
    "years": "1954–1970",
    "apps": 74,
    "goals": 0
   }
  ],
  "clubTotal": {
   "apps": 358,
   "goals": 0
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Liga soviética",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Copa soviética",
    "n": 3
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1963
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/LevYashin.JPG/330px-LevYashin.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "LevYashin.JPG",
   "author": "Kroon, Ron for Anefo",
   "license": "CC BY-SA 3.0 nl",
   "year": "1965"
  },
  "note": "Arquero: los goles no son su medida."
 },
 {
  "id": "charlton",
  "rank": 24,
  "name": "Bobby Charlton",
  "country": "Inglaterra",
  "flag": "gb-eng",
  "position": "Volante ofensivo",
  "born": "1937-10-11",
  "died": "2023-10-21",
  "clubs": [
   {
    "club": "Manchester United",
    "years": "1956–1973",
    "apps": 606,
    "goals": 199
   },
   {
    "club": "Preston North End",
    "years": "1974–1975",
    "apps": 38,
    "goals": 8
   },
   {
    "club": "Waterford",
    "years": "1976",
    "apps": 3,
    "goals": 1
   },
   {
    "club": "Newcastle KB United",
    "years": "1978",
    "apps": 1,
    "goals": 0
   },
   {
    "club": "Perth Azzurri",
    "years": "1980",
    "apps": 3,
    "goals": 2
   },
   {
    "club": "Blacktown City",
    "years": "1980",
    "apps": 1,
    "goals": 1
   }
  ],
  "national": [
   {
    "team": "England",
    "years": "1958–1970",
    "apps": 106,
    "goals": 49
   }
  ],
  "clubTotal": {
   "apps": 812,
   "goals": 263
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División inglesa",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Charity Shield",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa de Europa",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Campeonato Británico",
    "n": 5
   }
  ],
  "awards": {
   "ballonDor": [
    1966
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/LondonHouseAmsterdam1966_Bobby_Charlton.jpg/330px-LondonHouseAmsterdam1966_Bobby_Charlton.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "LondonHouseAmsterdam1966 Bobby Charlton.jpg",
   "author": "ANEFO",
   "license": "CC0",
   "year": "1966"
  }
 },
 {
  "id": "zico",
  "rank": 25,
  "name": "Zico",
  "country": "Brasil",
  "flag": "br",
  "position": "Enganche",
  "born": "1953-03-03",
  "clubs": [
   {
    "club": "Flamengo",
    "years": "1971–1983",
    "apps": 212,
    "goals": 123
   },
   {
    "club": "Udinese",
    "years": "1983–1985",
    "apps": 39,
    "goals": 22
   },
   {
    "club": "Flamengo",
    "years": "1985–1989",
    "apps": 66,
    "goals": 20
   },
   {
    "club": "Kashima Antlers",
    "years": "1991–1994",
    "apps": 45,
    "goals": 35
   }
  ],
  "national": [
   {
    "team": "Brazil",
    "years": "1976–1986",
    "apps": 71,
    "goals": 48
   }
  ],
  "clubTotal": {
   "apps": 700,
   "goals": 469
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Brasileirão",
    "n": 3
   },
   {
    "cat": "reg",
    "name": "Campeonato Carioca",
    "n": 7
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Taça do Atlântico, Copa Río Branco, Taça Oswaldo Cruz y Copa Bicentenario",
    "n": 4
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Zico6.jpg/330px-Zico6.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
   "file": "Zico6.jpg",
   "author": "Мельников Александр",
   "license": "CC BY-SA 3.0",
   "year": "2007"
  },
  "note": "La Copa União 1987 con Flamengo no se cuenta: la justicia reconoció a Sport como campeón brasileño de ese año."
 },
 {
  "id": "kempes",
  "rank": 26,
  "name": "Mario Kempes",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1954-07-15",
  "clubs": [
   {
    "club": "Instituto",
    "years": "1973–1974",
    "apps": 13,
    "goals": 11
   },
   {
    "club": "Rosario Central",
    "years": "1974–1976",
    "apps": 107,
    "goals": 89
   },
   {
    "club": "Valencia",
    "years": "1976–1981",
    "apps": 142,
    "goals": 95
   },
   {
    "club": "River Plate",
    "years": "1981–1982",
    "apps": 29,
    "goals": 15
   },
   {
    "club": "Valencia",
    "years": "1982–1984",
    "apps": 42,
    "goals": 21
   },
   {
    "club": "Hércules",
    "years": "1984–1986",
    "apps": 38,
    "goals": 10
   },
   {
    "club": "First Vienna",
    "years": "1986–1987",
    "apps": 20,
    "goals": 7
   },
   {
    "club": "St. Pölten",
    "years": "1987–1990",
    "apps": 96,
    "goals": 34
   },
   {
    "club": "Krems",
    "years": "1990–1992",
    "apps": 39,
    "goals": 7
   },
   {
    "club": "Fernández Vial",
    "years": "1995",
    "apps": 11,
    "goals": 5
   },
   {
    "club": "Pelita Jaya",
    "years": "1995–1996",
    "apps": 15,
    "goals": 10
   },
   {
    "club": "Lushnja",
    "years": "1996",
    "apps": 0,
    "goals": null
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1973–1982",
    "apps": 43,
    "goals": 20
   }
  ],
  "clubTotal": {
   "apps": 638,
   "goals": 347
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Galatama (Indonesia)",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Recopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 1,
   "wcBoot": 1,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Mario_Kempes_Argentina_v_Spain_19_July_2026-036_%28cropped%29.jpg/330px-Mario_Kempes_Argentina_v_Spain_19_July_2026-036_%28cropped%29.jpg",
   "file": "Mario Kempes Argentina v Spain 19 July 2026-036 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  }
 },
 {
  "id": "batistuta",
  "rank": 27,
  "name": "Gabriel Batistuta",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1969-02-01",
  "clubs": [
   {
    "club": "Newell's Old Boys",
    "years": "1988–1989",
    "apps": 24,
    "goals": 7
   },
   {
    "club": "River Plate",
    "years": "1989–1990",
    "apps": 21,
    "goals": 4
   },
   {
    "club": "Boca Juniors",
    "years": "1990–1991",
    "apps": 34,
    "goals": 13
   },
   {
    "club": "Fiorentina",
    "years": "1991–2000",
    "apps": 269,
    "goals": 168
   },
   {
    "club": "Roma",
    "years": "2000–2003",
    "apps": 63,
    "goals": 30
   },
   {
    "club": "Inter Milan",
    "loan": true,
    "years": "2003",
    "apps": 12,
    "goals": 2
   },
   {
    "club": "Al-Arabi",
    "years": "2003–2005",
    "apps": 21,
    "goals": 25
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1991–2002",
    "apps": 78,
    "goals": 56
   }
  ],
  "clubTotal": {
   "apps": 551,
   "goals": 299
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Serie B",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Coppa Italia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 2
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Copa Confederaciones (Copa Rey Fahd) y Copa Artemio Franchi",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Gabriel_batistuta.jpg/330px-Gabriel_batistuta.jpg",
   "file": "Gabriel batistuta.jpg",
   "author": "",
   "license": "Public domain"
  }
 },
 {
  "id": "passarella",
  "rank": 28,
  "name": "Daniel Passarella",
  "country": "Argentina",
  "flag": "ar",
  "position": "Defensor",
  "born": "1953-05-25",
  "clubs": [
   {
    "club": "Sarmiento",
    "years": "1971–1973",
    "apps": 36,
    "goals": 9
   },
   {
    "club": "River Plate",
    "years": "1973–1982",
    "apps": 266,
    "goals": 90
   },
   {
    "club": "Fiorentina",
    "years": "1982–1986",
    "apps": 109,
    "goals": 26
   },
   {
    "club": "Inter Milan",
    "years": "1986–1988",
    "apps": 44,
    "goals": 9
   },
   {
    "club": "River Plate",
    "years": "1988–1989",
    "apps": 24,
    "goals": 7
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1976–1986",
    "apps": 70,
    "goals": 22
   }
  ],
  "clubTotal": {
   "apps": 479,
   "goals": 141
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 7
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 2
   },
   {
    "cat": "juvenil",
    "name": "Torneo Esperanzas de Toulon",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Daniel_passarella_en_1985.jpg",
   "file": "Daniel passarella en 1985.jpg",
   "author": "Unknown authorUnknown author",
   "license": "Public domain",
   "year": "1985"
  },
  "note": "Total en clubes: solo partidos de liga (no hay registro completo de copas)."
 },
 {
  "id": "riquelme",
  "rank": 29,
  "name": "Juan Román Riquelme",
  "country": "Argentina",
  "flag": "ar",
  "position": "Enganche",
  "born": "1978-06-24",
  "clubs": [
   {
    "club": "Boca Juniors",
    "years": "1996–2002",
    "apps": 151,
    "goals": 38
   },
   {
    "club": "Barcelona",
    "years": "2002–2005",
    "apps": 30,
    "goals": 3
   },
   {
    "club": "Villarreal",
    "loan": true,
    "years": "2003–2005",
    "apps": 68,
    "goals": 23
   },
   {
    "club": "Villarreal",
    "years": "2005–2007",
    "apps": 38,
    "goals": 13
   },
   {
    "club": "Boca Juniors",
    "loan": true,
    "years": "2007",
    "apps": 15,
    "goals": 2
   },
   {
    "club": "Boca Juniors",
    "years": "2007–2014",
    "apps": 126,
    "goals": 24
   },
   {
    "club": "Argentinos Juniors",
    "years": "2014–2015",
    "apps": 15,
    "goals": 3
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1997–2008",
    "apps": 51,
    "goals": 17
   }
  ],
  "clubTotal": {
   "apps": 596,
   "goals": 150
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Copa Argentina",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Recopa Sudamericana",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intertoto",
    "n": 1
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-20, Sudamericano Sub-20 y Torneo de Toulon",
    "n": 3
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Juan_Rom%C3%A1n_Riquelme_-_2019.jpg/330px-Juan_Rom%C3%A1n_Riquelme_-_2019.jpg",
   "file": "Juan Román Riquelme - 2019.jpg",
   "author": "Todo Noticias",
   "license": "CC BY 3.0",
   "year": "2019"
  }
 },
 {
  "id": "labruna",
  "rank": 30,
  "name": "Ángel Labruna",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1918-09-28",
  "died": "1983-09-19",
  "clubs": [
   {
    "club": "River Plate",
    "years": "1939–1959",
    "apps": 515,
    "goals": 295
   },
   {
    "club": "Rangers de Talca",
    "years": "1960",
    "apps": 4,
    "goals": 1
   },
   {
    "club": "Rampla Juniors",
    "years": "1960",
    "apps": 16,
    "goals": 4
   },
   {
    "club": "Platense",
    "years": "1961",
    "apps": 2,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1942–1958",
    "apps": 37,
    "goals": 17
   }
  ],
  "clubTotal": {
   "apps": 537,
   "goals": 300
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 9
   },
   {
    "cat": "copa",
    "name": "Copa Ibarguren, Copa Adrián C. Escobar y Copa Aldao",
    "n": 7
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Angel_Labruna_1940.jpg/330px-Angel_Labruna_1940.jpg",
   "file": "Angel Labruna 1940.jpg",
   "author": "Unknown authorUnknown author",
   "license": "Public domain",
   "year": "1940"
  },
  "note": "Total en clubes: solo partidos de liga (no hay registro completo de copas)."
 },
 {
  "id": "sivori",
  "rank": 31,
  "name": "Omar Sívori",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1935-10-02",
  "died": "2005-02-17",
  "clubs": [
   {
    "club": "River Plate",
    "years": "1954–1957",
    "apps": 63,
    "goals": 29
   },
   {
    "club": "Juventus",
    "years": "1957–1965",
    "apps": 215,
    "goals": 135
   },
   {
    "club": "Napoli",
    "years": "1965–1969",
    "apps": 63,
    "goals": 12
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1956–1957",
    "apps": 19,
    "goals": 9
   },
   {
    "team": "Italia",
    "years": "1961–1962",
    "apps": 9,
    "goals": 8
   }
  ],
  "clubTotal": {
   "apps": 380,
   "goals": 208
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Coppa Italia",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Copa de los Alpes",
    "n": 2
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    1961
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Omar_sivori_argentina.jpg/330px-Omar_sivori_argentina.jpg",
   "file": "Omar sivori argentina.jpg",
   "author": "Unknown authorUnknown author",
   "license": "Public domain",
   "year": "1956"
  }
 },
 {
  "id": "zanetti",
  "rank": 32,
  "name": "Javier Zanetti",
  "country": "Argentina",
  "flag": "ar",
  "position": "Lateral",
  "born": "1973-08-10",
  "clubs": [
   {
    "club": "Talleres",
    "years": "1992–1993",
    "apps": 33,
    "goals": 1
   },
   {
    "club": "Banfield",
    "years": "1993–1995",
    "apps": 66,
    "goals": 4
   },
   {
    "club": "Inter Milan",
    "years": "1995–2014",
    "apps": 615,
    "goals": 12
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "1994–2011",
    "apps": 145,
    "goals": 5
   }
  ],
  "clubTotal": {
   "apps": 957,
   "goals": 26
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Coppa Italia",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa UEFA",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Juegos Panamericanos",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Javier_Adelmar_Zanetti.jpg/330px-Javier_Adelmar_Zanetti.jpg",
   "file": "Javier Adelmar Zanetti.jpg",
   "author": "Давиденко Валерий",
   "license": "CC BY-SA 3.0",
   "year": "2009"
  }
 },
 {
  "id": "francescoli",
  "rank": 33,
  "name": "Enzo Francescoli",
  "country": "Uruguay",
  "flag": "uy",
  "position": "Enganche",
  "born": "1961-11-12",
  "clubs": [
   {
    "club": "Wanderers",
    "years": "1980–1982",
    "apps": 74,
    "goals": 20
   },
   {
    "club": "River Plate",
    "years": "1983–1986",
    "apps": 113,
    "goals": 68
   },
   {
    "club": "RC Paris",
    "years": "1986–1989",
    "apps": 89,
    "goals": 32
   },
   {
    "club": "Marseille",
    "years": "1989–1990",
    "apps": 28,
    "goals": 11
   },
   {
    "club": "Cagliari",
    "years": "1990–1993",
    "apps": 98,
    "goals": 17
   },
   {
    "club": "Torino",
    "years": "1993–1994",
    "apps": 24,
    "goals": 3
   },
   {
    "club": "River Plate",
    "years": "1994–1997",
    "apps": 84,
    "goals": 47
   }
  ],
  "national": [
   {
    "team": "Uruguay",
    "years": "1982–1997",
    "apps": 73,
    "goals": 17
   }
  ],
  "clubTotal": {
   "apps": 574,
   "goals": 220
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División (River Plate)",
    "n": 5
   },
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa Sudamericana",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 3
   },
   {
    "cat": "juvenil",
    "name": "Sudamericano Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://upload.wikimedia.org/wikipedia/commons/2/21/Enzo_Francescoli_2011.jpg",
   "file": "Enzo Francescoli 2011.jpg",
   "author": "Christophe95",
   "license": "CC BY-SA 3.0",
   "year": "2011"
  }
 },
 {
  "id": "suarez",
  "rank": 34,
  "name": "Luis Suárez",
  "country": "Uruguay",
  "flag": "uy",
  "position": "Delantero",
  "born": "1987-01-24",
  "clubs": [
   {
    "club": "Nacional",
    "years": "2005–2006",
    "apps": 27,
    "goals": 10
   },
   {
    "club": "Groningen",
    "years": "2006–2007",
    "apps": 29,
    "goals": 10
   },
   {
    "club": "Ajax",
    "years": "2007–2011",
    "apps": 110,
    "goals": 81
   },
   {
    "club": "Liverpool",
    "years": "2011–2014",
    "apps": 110,
    "goals": 69
   },
   {
    "club": "Barcelona",
    "years": "2014–2020",
    "apps": 191,
    "goals": 147
   },
   {
    "club": "Atlético Madrid",
    "years": "2020–2022",
    "apps": 67,
    "goals": 32
   },
   {
    "club": "Nacional",
    "years": "2022",
    "apps": 14,
    "goals": 8
   },
   {
    "club": "Grêmio",
    "years": "2023",
    "apps": 45,
    "goals": 24
   },
   {
    "club": "Inter Miami",
    "years": "2024–",
    "apps": 78,
    "goals": 43
   }
  ],
  "national": [
   {
    "team": "Uruguay",
    "years": "2007–2024",
    "apps": 143,
    "goals": 69
   }
  ],
  "clubTotal": {
   "apps": 912,
   "goals": 544
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División de Uruguay",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Eredivisie",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 5
   },
   {
    "cat": "liga",
    "name": "MLS (Supporters' Shield)",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "MLS Cup",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de los Países Bajos",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Inglaterra",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "reg",
    "name": "Campeonato Gaúcho y Recopa Gaúcha",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Campeones Cup",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 2
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Luis_Su%C3%A1rez_NE_Revolution_Inter_Miami_7.9.25-053_%28cropped%29.jpg/330px-Luis_Su%C3%A1rez_NE_Revolution_Inter_Miami_7.9.25-053_%28cropped%29.jpg",
   "file": "Luis Suárez NE Revolution Inter Miami 7.9.25-053 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2025"
  }
 },
 {
  "id": "romario",
  "rank": 35,
  "name": "Romário",
  "country": "Brasil",
  "flag": "br",
  "position": "Delantero",
  "born": "1966-01-29",
  "clubs": [
   {
    "club": "Vasco da Gama",
    "years": "1985–1988",
    "apps": 141,
    "goals": 80
   },
   {
    "club": "PSV Eindhoven",
    "years": "1988–1993",
    "apps": 110,
    "goals": 98
   },
   {
    "club": "Barcelona",
    "years": "1993–1995",
    "apps": 46,
    "goals": 34
   },
   {
    "club": "Flamengo",
    "years": "1995–1996",
    "apps": 59,
    "goals": 60
   },
   {
    "club": "Valencia",
    "years": "1996–1997",
    "apps": 11,
    "goals": 5
   },
   {
    "club": "Flamengo",
    "loan": true,
    "years": "1997",
    "apps": 22,
    "goals": 21
   },
   {
    "club": "Flamengo",
    "years": "1998–1999",
    "apps": 65,
    "goals": 34
   },
   {
    "club": "Vasco da Gama",
    "years": "2000–2002",
    "apps": 73,
    "goals": 79
   },
   {
    "club": "Fluminense",
    "years": "2002–2004",
    "apps": 73,
    "goals": 45
   },
   {
    "club": "Al Sadd",
    "loan": true,
    "years": "2003",
    "apps": 3,
    "goals": 0
   },
   {
    "club": "Vasco da Gama",
    "years": "2005–2006",
    "apps": 50,
    "goals": 35
   },
   {
    "club": "Miami FC",
    "years": "2006",
    "apps": 25,
    "goals": 19
   },
   {
    "club": "Adelaide United",
    "loan": true,
    "years": "2006",
    "apps": 4,
    "goals": 1
   },
   {
    "club": "Vasco da Gama",
    "years": "2007",
    "apps": 15,
    "goals": 13
   },
   {
    "club": "America-RJ",
    "years": "2009",
    "apps": 1,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Brasil",
    "years": "1987–2005",
    "apps": 70,
    "goals": 55
   }
  ],
  "clubTotal": {
   "apps": 893,
   "goals": 690
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Brasileirão",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Eredivisie",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de los Países Bajos",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Supercopa de los Países Bajos",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Príncipe de Catar",
    "n": 1
   },
   {
    "cat": "reg",
    "name": "Campeonato Carioca",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Copa Mercosur",
    "n": 2
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Copa Confederaciones",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Sudamericano Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 1,
   "wcBall": 1,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Senadores_da_57%C2%AA_Legislatura_%2852689451805%29.jpg/330px-Senadores_da_57%C2%AA_Legislatura_%2852689451805%29.jpg",
   "file": "Senadores da 57ª Legislatura (52689451805).jpg",
   "author": "Agência Senado from Brasilia, Brazil",
   "license": "CC BY 2.0",
   "year": "2023"
  }
 },
 {
  "id": "kaka",
  "rank": 36,
  "name": "Kaká",
  "country": "Brasil",
  "flag": "br",
  "position": "Mediocampista ofensivo",
  "born": "1982-04-22",
  "clubs": [
   {
    "club": "São Paulo",
    "years": "2000–2003",
    "apps": 59,
    "goals": 23
   },
   {
    "club": "AC Milan",
    "years": "2003–2009",
    "apps": 193,
    "goals": 70
   },
   {
    "club": "Real Madrid",
    "years": "2009–2013",
    "apps": 85,
    "goals": 23
   },
   {
    "club": "AC Milan",
    "years": "2013–2014",
    "apps": 30,
    "goals": 7
   },
   {
    "club": "Orlando City",
    "years": "2014–2017",
    "apps": 75,
    "goals": 24
   },
   {
    "club": "São Paulo",
    "loan": true,
    "years": "2014",
    "apps": 19,
    "goals": 2
   }
  ],
  "national": [
   {
    "team": "Brasil",
    "years": "2002–2016",
    "apps": 92,
    "goals": 29
   }
  ],
  "clubTotal": {
   "apps": 654,
   "goals": 208
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 1
   },
   {
    "cat": "reg",
    "name": "Supercampeonato Paulista y Torneo Río-São Paulo",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Copa Confederaciones",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [
    2007
   ],
   "fifa": 1,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Ricardo_Izecson_dos_Santos_Leite_%28Kak%C3%A1%29_01.jpg/330px-Ricardo_Izecson_dos_Santos_Leite_%28Kak%C3%A1%29_01.jpg",
   "file": "Ricardo Izecson dos Santos Leite (Kaká) 01.jpg",
   "author": "José Cruz/ABr (cropped by tales.ebner)",
   "license": "CC BY 3.0 br",
   "year": "2007"
  }
 },
 {
  "id": "socrates",
  "rank": 37,
  "name": "Sócrates",
  "country": "Brasil",
  "flag": "br",
  "position": "Mediocampista",
  "born": "1954-02-19",
  "died": "2011-12-04",
  "clubs": [
   {
    "club": "Botafogo-SP",
    "years": "1973–1978",
    "apps": 99,
    "goals": 35
   },
   {
    "club": "Corinthians",
    "years": "1978–1984",
    "apps": 297,
    "goals": 172
   },
   {
    "club": "Fiorentina",
    "years": "1984–1985",
    "apps": 25,
    "goals": 6
   },
   {
    "club": "Flamengo",
    "years": "1986–1987",
    "apps": 12,
    "goals": 3
   },
   {
    "club": "Santos",
    "years": "1988–1989",
    "apps": 25,
    "goals": 7
   },
   {
    "club": "Botafogo-SP",
    "years": "1989",
    "apps": 6,
    "goals": 0
   },
   {
    "club": "Garforth Town",
    "years": "2004",
    "apps": 1,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Brasil",
    "years": "1979–1986",
    "apps": 60,
    "goals": 22
   }
  ],
  "clubTotal": {
   "apps": 513,
   "goals": 236
  },
  "titles": [
   {
    "cat": "reg",
    "name": "Campeonato Paulista",
    "n": 3
   },
   {
    "cat": "reg",
    "name": "Campeonato Carioca y Taça Rio",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Socrates87660.jpg/330px-Socrates87660.jpg",
   "file": "Socrates87660.jpg",
   "author": "Foto U. Dettmar/ABr.",
   "license": "CC BY 3.0 br",
   "year": "2005"
  }
 },
 {
  "id": "valderrama",
  "rank": 38,
  "name": "Carlos Valderrama",
  "country": "Colombia",
  "flag": "co",
  "position": "Enganche",
  "born": "1961-09-02",
  "clubs": [
   {
    "club": "Unión Magdalena",
    "years": "1980–1984",
    "apps": 94,
    "goals": 5
   },
   {
    "club": "Millonarios",
    "years": "1984–1985",
    "apps": 33,
    "goals": 0
   },
   {
    "club": "Deportivo Cali",
    "years": "1985–1987",
    "apps": 131,
    "goals": 22
   },
   {
    "club": "Montpellier",
    "years": "1987–1991",
    "apps": 77,
    "goals": 4
   },
   {
    "club": "Real Valladolid",
    "years": "1991–1992",
    "apps": 17,
    "goals": 1
   },
   {
    "club": "Independiente Medellín",
    "years": "1992–1993",
    "apps": 10,
    "goals": 1
   },
   {
    "club": "Atlético Junior",
    "years": "1993–1995",
    "apps": 82,
    "goals": 5
   },
   {
    "club": "Tampa Bay Mutiny",
    "years": "1995–1997",
    "apps": 43,
    "goals": 7
   },
   {
    "club": "Deportivo Cali",
    "loan": true,
    "years": "1996–1997",
    "apps": 18,
    "goals": 4
   },
   {
    "club": "Miami Fusion",
    "years": "1997–1999",
    "apps": 22,
    "goals": 3
   },
   {
    "club": "Tampa Bay Mutiny",
    "years": "1999–2001",
    "apps": 71,
    "goals": 5
   },
   {
    "club": "Colorado Rapids",
    "years": "2001–2002",
    "apps": 39,
    "goals": 1
   }
  ],
  "national": [
   {
    "team": "Colombia",
    "years": "1985–1998",
    "apps": 111,
    "goals": 11
   }
  ],
  "clubTotal": {
   "apps": 705,
   "goals": 63
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Liga colombiana",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "MLS (Supporters' Shield)",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Francia",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Pibe_Valderrama_2022.jpg/330px-Pibe_Valderrama_2022.jpg",
   "file": "Pibe Valderrama 2022.jpg",
   "author": "Maritza Ariza Periodista",
   "license": "CC BY 3.0",
   "year": "2022"
  }
 },
 {
  "id": "figueroa",
  "rank": 39,
  "name": "Elías Figueroa",
  "country": "Chile",
  "flag": "cl",
  "position": "Defensor",
  "born": "1946-10-25",
  "clubs": [
   {
    "club": "Santiago Wanderers",
    "years": "1964–1966",
    "apps": 54,
    "goals": 0
   },
   {
    "club": "Unión La Calera",
    "loan": true,
    "years": "1964",
    "apps": 30,
    "goals": 0
   },
   {
    "club": "Peñarol",
    "years": "1967–1972",
    "apps": 214,
    "goals": 7
   },
   {
    "club": "Internacional",
    "years": "1972–1976",
    "apps": 336,
    "goals": 27
   },
   {
    "club": "Palestino",
    "years": "1977–1980",
    "apps": 118,
    "goals": 6
   },
   {
    "club": "Fort Lauderdale Strikers",
    "years": "1981",
    "apps": 22,
    "goals": 0
   },
   {
    "club": "Colo-Colo",
    "years": "1981–1982",
    "apps": 17,
    "goals": 0
   }
  ],
  "national": [
   {
    "team": "Chile",
    "years": "1966–1982",
    "apps": 47,
    "goals": 3
   }
  ],
  "clubTotal": {
   "apps": 791,
   "goals": 40
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División de Uruguay",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Primera División de Chile",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Brasileirão",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa Chile",
    "n": 1
   },
   {
    "cat": "reg",
    "name": "Campeonato Gaúcho",
    "n": 6
   },
   {
    "cat": "intl",
    "name": "Supercopa de Campeones Intercontinentales",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/El%C3%ADas_Figueroa.jpg/330px-El%C3%ADas_Figueroa.jpg",
   "file": "Elías Figueroa.jpg",
   "author": "Marco Nuñez from Santiago, Chile",
   "license": "CC BY 2.0",
   "year": "2009"
  },
  "note": "Total en clubes: solo partidos de liga (no hay registro completo de copas)."
 },
 {
  "id": "cubillas",
  "rank": 40,
  "name": "Teófilo Cubillas",
  "country": "Perú",
  "flag": "pe",
  "position": "Mediocampista ofensivo",
  "born": "1949-03-08",
  "clubs": [
   {
    "club": "Alianza Lima",
    "years": "1966–1972",
    "apps": 175,
    "goals": 117
   },
   {
    "club": "Basel",
    "years": "1973",
    "apps": 10,
    "goals": 3
   },
   {
    "club": "Porto",
    "years": "1974–1977",
    "apps": 85,
    "goals": 48
   },
   {
    "club": "Alianza Lima",
    "years": "1977–1978",
    "apps": 47,
    "goals": 35
   },
   {
    "club": "Fort Lauderdale Strikers",
    "years": "1979–1983",
    "apps": 139,
    "goals": 65
   },
   {
    "club": "Alianza Lima",
    "years": "1984",
    "apps": 4,
    "goals": 4
   },
   {
    "club": "South Florida Sun",
    "years": "1984–1985",
    "apps": 7,
    "goals": 5
   },
   {
    "club": "Alianza Lima",
    "years": "1987–1988",
    "apps": 13,
    "goals": 3
   },
   {
    "club": "Fort Lauderdale Strikers",
    "years": "1988",
    "apps": 12,
    "goals": 7
   },
   {
    "club": "Miami Sharks",
    "years": "1989",
    "apps": 8,
    "goals": 1
   }
  ],
  "national": [
   {
    "team": "Perú",
    "years": "1968–1982",
    "apps": 81,
    "goals": 26
   }
  ],
  "clubTotal": {
   "apps": 534,
   "goals": 314
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División de Perú",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Superliga de Suiza",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "United Soccer League (EE. UU.)",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de Portugal",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Teofilo_cubillas_panini_card_%28cropped%29.jpg/330px-Teofilo_cubillas_panini_card_%28cropped%29.jpg",
   "file": "Teofilo cubillas panini card (cropped).jpg",
   "author": "Unknown authorUnknown author",
   "license": "Public domain",
   "year": "1970"
  }
 },
 {
  "id": "aguero",
  "rank": 41,
  "name": "Sergio Agüero",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1988-06-02",
  "clubs": [
   {
    "club": "Independiente",
    "years": "2003–2006",
    "apps": 54,
    "goals": 23
   },
   {
    "club": "Atlético Madrid",
    "years": "2006–2011",
    "apps": 175,
    "goals": 74
   },
   {
    "club": "Manchester City",
    "years": "2011–2021",
    "apps": 275,
    "goals": 184
   },
   {
    "club": "Barcelona",
    "years": "2021",
    "apps": 4,
    "goals": 1
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "2006–2021",
    "apps": 101,
    "goals": 41
   }
  ],
  "clubTotal": {
   "apps": 685,
   "goals": 385
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Premier League",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Inglaterra",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Community Shield",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Europa League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 1
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-20",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Ag%C3%BCero_in_2018.jpg/330px-Ag%C3%BCero_in_2018.jpg",
   "file": "Agüero in 2018.jpg",
   "author": "Кирилл Венедиктов",
   "license": "CC BY-SA 3.0",
   "year": "2018"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "higuain",
  "rank": 42,
  "name": "Gonzalo Higuaín",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1987-12-10",
  "clubs": [
   {
    "club": "River Plate",
    "years": "2005–2007",
    "apps": 35,
    "goals": 13
   },
   {
    "club": "Real Madrid",
    "years": "2007–2013",
    "apps": 190,
    "goals": 107
   },
   {
    "club": "Napoli",
    "years": "2013–2016",
    "apps": 104,
    "goals": 71
   },
   {
    "club": "Juventus",
    "years": "2016–2020",
    "apps": 105,
    "goals": 48
   },
   {
    "club": "AC Milan",
    "loan": true,
    "years": "2018–2019",
    "apps": 15,
    "goals": 6
   },
   {
    "club": "Chelsea",
    "loan": true,
    "years": "2019",
    "apps": 14,
    "goals": 5
   },
   {
    "club": "Inter Miami",
    "years": "2020–2022",
    "apps": 67,
    "goals": 29
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "2009–2018",
    "apps": 75,
    "goals": 31
   }
  ],
  "clubTotal": {
   "apps": 711,
   "goals": 335
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Coppa Italia",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Europa League",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Higua%C3%ADn_20180626.jpg/330px-Higua%C3%ADn_20180626.jpg",
   "file": "Higuaín 20180626.jpg",
   "author": "Кирилл Венедиктов",
   "license": "CC BY-SA 3.0",
   "year": "2018"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "di-maria",
  "rank": 43,
  "name": "Ángel Di María",
  "country": "Argentina",
  "flag": "ar",
  "position": "Extremo",
  "born": "1988-02-14",
  "clubs": [
   {
    "club": "Rosario Central",
    "years": "2005–2007",
    "apps": 35,
    "goals": 6
   },
   {
    "club": "Benfica",
    "years": "2007–2010",
    "apps": 76,
    "goals": 7
   },
   {
    "club": "Real Madrid",
    "years": "2010–2014",
    "apps": 124,
    "goals": 22
   },
   {
    "club": "Manchester United",
    "years": "2014–2015",
    "apps": 27,
    "goals": 3
   },
   {
    "club": "Paris Saint-Germain",
    "years": "2015–2022",
    "apps": 197,
    "goals": 56
   },
   {
    "club": "Juventus",
    "years": "2022–2023",
    "apps": 26,
    "goals": 4
   },
   {
    "club": "Benfica",
    "years": "2023–2025",
    "apps": 53,
    "goals": 17
   },
   {
    "club": "Rosario Central",
    "years": "2025–",
    "apps": 40,
    "goals": 15
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "2008–2024",
    "apps": 145,
    "goals": 31
   }
  ],
  "clubTotal": {
   "apps": 863,
   "goals": 216
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División (Campeón de Liga 2025)",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Liga de Portugal",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Portugal y Supercopa de Portugal",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Copa del Rey y Supercopa de España",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa de Francia",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Francia",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Supercopa de Francia",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Supercopa Internacional",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Finalissima",
    "n": 1
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Mundial Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/NIG-ARG_%285%29.jpg/330px-NIG-ARG_%285%29.jpg",
   "file": "NIG-ARG (5).jpg",
   "author": "Кирилл Венедиктов",
   "license": "CC BY-SA 3.0",
   "year": "2018"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "lautaro",
  "rank": 44,
  "name": "Lautaro Martínez",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "1997-08-22",
  "clubs": [
   {
    "club": "Racing Club",
    "years": "2015–2018",
    "apps": 48,
    "goals": 22
   },
   {
    "club": "Inter Milan",
    "years": "2018–",
    "apps": 271,
    "goals": 136
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "2018–",
    "apps": 87,
    "goals": 42
   }
  ],
  "clubTotal": {
   "apps": 443,
   "goals": 206
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Serie A",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Coppa Italia",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 3
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Finalissima",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Lautaro_Martinez_Argentina_v_Spain_19_July_2026-049_%28cropped%29.jpg/330px-Lautaro_Martinez_Argentina_v_Spain_19_July_2026-049_%28cropped%29.jpg",
   "file": "Lautaro Martinez Argentina v Spain 19 July 2026-049 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "julian-alvarez",
  "rank": 45,
  "name": "Julián Álvarez",
  "country": "Argentina",
  "flag": "ar",
  "position": "Delantero",
  "born": "2000-01-31",
  "clubs": [
   {
    "club": "River Plate",
    "years": "2018–2022",
    "apps": 57,
    "goals": 23
   },
   {
    "club": "Manchester City",
    "years": "2022–2024",
    "apps": 67,
    "goals": 20
   },
   {
    "club": "River Plate",
    "loan": true,
    "years": "2022",
    "apps": 17,
    "goals": 11
   },
   {
    "club": "Atlético Madrid",
    "years": "2024–",
    "apps": 69,
    "goals": 25
   }
  ],
  "national": [
   {
    "team": "Argentina",
    "years": "2021–",
    "apps": 61,
    "goals": 16
   }
  ],
  "clubTotal": {
   "apps": 335,
   "goals": 139
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Primera División",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Premier League",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa Argentina, Supercopa Argentina y Trofeo de Campeones",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Copa América",
    "n": 2
   },
   {
    "cat": "selOtros",
    "name": "Finalissima",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Preolímpico Sudamericano",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Julian_Alvarez_Argentina_v_Spain_19_July_2026-052_%28cropped%29.jpg/330px-Julian_Alvarez_Argentina_v_Spain_19_July_2026-052_%28cropped%29.jpg",
   "file": "Julian Alvarez Argentina v Spain 19 July 2026-052 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "haaland",
  "rank": 46,
  "name": "Erling Haaland",
  "country": "Noruega",
  "flag": "no",
  "position": "Delantero",
  "born": "2000-07-21",
  "clubs": [
   {
    "club": "Bryne",
    "years": "2016–2017",
    "apps": 16,
    "goals": 0
   },
   {
    "club": "Molde",
    "years": "2017–2019",
    "apps": 39,
    "goals": 14
   },
   {
    "club": "Red Bull Salzburg",
    "years": "2019–2020",
    "apps": 16,
    "goals": 17
   },
   {
    "club": "Borussia Dortmund",
    "years": "2020–2022",
    "apps": 67,
    "goals": 62
   },
   {
    "club": "Manchester City",
    "years": "2022–",
    "apps": 137,
    "goals": 117
   }
  ],
  "national": [
   {
    "team": "Noruega",
    "years": "2019–",
    "apps": 59,
    "goals": 65
   }
  ],
  "clubTotal": {
   "apps": 409,
   "goals": 324
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Bundesliga de Austria",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Premier League",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de Austria",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Alemania",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Inglaterra",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Community Shield",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 1
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Erling_Haaland_France_v_Norway_26_June_26-008.jpg/330px-Erling_Haaland_France_v_Norway_26_June_26-008.jpg",
   "file": "Erling Haaland France v Norway 26 June 26-008.jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "yamal",
  "rank": 47,
  "name": "Lamine Yamal",
  "country": "España",
  "flag": "es",
  "position": "Extremo",
  "born": "2007-07-13",
  "clubs": [
   {
    "club": "Barcelona",
    "years": "2023–",
    "apps": 108,
    "goals": 37
   }
  ],
  "national": [
   {
    "team": "España",
    "years": "2023–",
    "apps": 37,
    "goals": 11
   }
  ],
  "clubTotal": {
   "apps": 162,
   "goals": 57
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 2
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "continental",
    "name": "Eurocopa",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Lamine_Yamal_Argentina_v_Spain_19_July_2026-214_%28cropped%29.jpg/330px-Lamine_Yamal_Argentina_v_Spain_19_July_2026-214_%28cropped%29.jpg",
   "file": "Lamine Yamal Argentina v Spain 19 July 2026-214 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "kane",
  "rank": 48,
  "name": "Harry Kane",
  "country": "Inglaterra",
  "flag": "gb-eng",
  "position": "Delantero",
  "born": "1993-07-28",
  "clubs": [
   {
    "club": "Tottenham Hotspur",
    "years": "2009–2023",
    "apps": 317,
    "goals": 213
   },
   {
    "club": "Leyton Orient",
    "loan": true,
    "years": "2011",
    "apps": 18,
    "goals": 5
   },
   {
    "club": "Millwall",
    "loan": true,
    "years": "2012",
    "apps": 22,
    "goals": 7
   },
   {
    "club": "Norwich City",
    "loan": true,
    "years": "2012–2013",
    "apps": 3,
    "goals": 0
   },
   {
    "club": "Leicester City",
    "loan": true,
    "years": "2013",
    "apps": 13,
    "goals": 2
   },
   {
    "club": "Bayern Munich",
    "years": "2023–",
    "apps": 99,
    "goals": 101
   }
  ],
  "national": [
   {
    "team": "Inglaterra",
    "years": "2015–",
    "apps": 125,
    "goals": 91
   }
  ],
  "clubTotal": {
   "apps": 655,
   "goals": 448
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Bundesliga",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de Alemania",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Alemania",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 1,
   "shoe": 2
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Harry_Kane_England_v_Ghana_23_June_2026-219_%28cropped%29.jpg/330px-Harry_Kane_England_v_Ghana_23_June_2026-219_%28cropped%29.jpg",
   "file": "Harry Kane England v Ghana 23 June 2026-219 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "mbappe",
  "rank": 49,
  "name": "Kylian Mbappé",
  "country": "Francia",
  "flag": "fr",
  "position": "Delantero",
  "born": "1998-12-20",
  "clubs": [
   {
    "club": "Monaco",
    "years": "2015–2018",
    "apps": 41,
    "goals": 16
   },
   {
    "club": "Paris Saint-Germain",
    "loan": true,
    "years": "2017–2018",
    "apps": 27,
    "goals": 13
   },
   {
    "club": "Paris Saint-Germain",
    "years": "2018–2024",
    "apps": 178,
    "goals": 162
   },
   {
    "club": "Real Madrid",
    "years": "2024–",
    "apps": 72,
    "goals": 63
   }
  ],
  "national": [
   {
    "team": "Francia",
    "years": "2017–",
    "apps": 107,
    "goals": 67
   }
  ],
  "clubTotal": {
   "apps": 491,
   "goals": 381
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 7
   },
   {
    "cat": "copa",
    "name": "Copa de Francia",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Francia",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Supercopa de Francia",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental de la FIFA",
    "n": 1
   },
   {
    "cat": "mundial",
    "name": "Copa del Mundo",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Nations League",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Eurocopa Sub-19",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 2,
   "shoe": 1
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg/330px-Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg",
   "file": "Kylian Mbappe France v Senegal 16 June 2026-391 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "vinicius",
  "rank": 50,
  "name": "Vinícius Júnior",
  "country": "Brasil",
  "flag": "br",
  "position": "Extremo",
  "born": "2000-07-12",
  "clubs": [
   {
    "club": "Flamengo",
    "years": "2017–2018",
    "apps": 50,
    "goals": 11
   },
   {
    "club": "Real Madrid",
    "years": "2018–",
    "apps": 249,
    "goals": 78
   }
  ],
  "national": [
   {
    "team": "Brasil",
    "years": "2019–",
    "apps": 57,
    "goals": 14
   }
  ],
  "clubTotal": {
   "apps": 458,
   "goals": 147
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental de la FIFA",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Sudamericano Sub-15 y Sub-17",
    "n": 2
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 1,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg/330px-Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg",
   "file": "Vinícius Júnior Brazil V Morocco 13 June 2026-207 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "salah",
  "rank": 51,
  "name": "Mohamed Salah",
  "country": "Egipto",
  "flag": "eg",
  "position": "Extremo",
  "born": "1992-06-15",
  "clubs": [
   {
    "club": "Al-Mokawloon",
    "years": "2010–2012",
    "apps": 40,
    "goals": 11
   },
   {
    "club": "Basel",
    "years": "2012–2014",
    "apps": 47,
    "goals": 9
   },
   {
    "club": "Chelsea",
    "years": "2014–2016",
    "apps": 13,
    "goals": 2
   },
   {
    "club": "Fiorentina",
    "loan": true,
    "years": "2015",
    "apps": 16,
    "goals": 6
   },
   {
    "club": "Roma",
    "loan": true,
    "years": "2015–2016",
    "apps": 34,
    "goals": 14
   },
   {
    "club": "Roma",
    "years": "2016–2017",
    "apps": 31,
    "goals": 15
   },
   {
    "club": "Liverpool",
    "years": "2017–2026",
    "apps": 315,
    "goals": 191
   },
   {
    "club": "Trabzonspor",
    "years": "2026–",
    "apps": 7,
    "goals": 7
   }
  ],
  "national": [
   {
    "team": "Egipto",
    "years": "2011–",
    "apps": 122,
    "goals": 68
   }
  ],
  "clubTotal": {
   "apps": 703,
   "goals": 341
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Superliga de Suiza",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Premier League",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Inglaterra",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Community Shield",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg/330px-Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg",
   "file": "Mohamed Salah Argentina v Egypt 7 July 2026-163 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "lewandowski",
  "rank": 52,
  "name": "Robert Lewandowski",
  "country": "Polonia",
  "flag": "pl",
  "position": "Delantero",
  "born": "1988-08-21",
  "clubs": [
   {
    "club": "Delta Warsaw",
    "years": "2005",
    "apps": 17,
    "goals": 4
   },
   {
    "club": "Znicz Pruszków",
    "years": "2006–2008",
    "apps": 59,
    "goals": 36
   },
   {
    "club": "Lech Poznań",
    "years": "2008–2010",
    "apps": 58,
    "goals": 32
   },
   {
    "club": "Borussia Dortmund",
    "years": "2010–2014",
    "apps": 131,
    "goals": 74
   },
   {
    "club": "Bayern Munich",
    "years": "2014–2022",
    "apps": 253,
    "goals": 238
   },
   {
    "club": "Barcelona",
    "years": "2022–2026",
    "apps": 134,
    "goals": 83
   },
   {
    "club": "Chicago Fire",
    "years": "2026–",
    "apps": 12,
    "goals": 6
   }
  ],
  "national": [
   {
    "team": "Polonia",
    "years": "2008–",
    "apps": 170,
    "goals": 92
   }
  ],
  "clubTotal": {
   "apps": 956,
   "goals": 669
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Ekstraklasa (Polonia)",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Bundesliga",
    "n": 10
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa y Supercopa de Polonia",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de Alemania",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Supercopa de Alemania",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 2,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 2
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Robert_Lewandowski_2018%2C_JAP-POL_%28cropped%29.jpg/330px-Robert_Lewandowski_2018%2C_JAP-POL_%28cropped%29.jpg",
   "file": "Robert Lewandowski 2018, JAP-POL (cropped).jpg",
   "author": "Светлана Бекетова",
   "license": "CC BY-SA 3.0",
   "year": "2018"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "modric",
  "rank": 53,
  "name": "Luka Modrić",
  "country": "Croacia",
  "flag": "hr",
  "position": "Mediocampista",
  "born": "1985-09-09",
  "clubs": [
   {
    "club": "Dinamo Zagreb",
    "years": "2003–2008",
    "apps": 94,
    "goals": 26
   },
   {
    "club": "Zrinjski Mostar",
    "loan": true,
    "years": "2003–2004",
    "apps": 25,
    "goals": 8
   },
   {
    "club": "Inter Zaprešić",
    "loan": true,
    "years": "2004–2005",
    "apps": 18,
    "goals": 4
   },
   {
    "club": "Tottenham Hotspur",
    "years": "2008–2012",
    "apps": 127,
    "goals": 13
   },
   {
    "club": "Real Madrid",
    "years": "2012–2025",
    "apps": 394,
    "goals": 30
   },
   {
    "club": "AC Milan",
    "years": "2025–",
    "apps": 39,
    "goals": 2
   }
  ],
  "national": [
   {
    "team": "Croacia",
    "years": "2006–",
    "apps": 206,
    "goals": 30
   }
  ],
  "clubTotal": {
   "apps": 972,
   "goals": 106
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Liga de Croacia",
    "n": 3
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Copa y Supercopa de Croacia",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 6
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Copa Intercontinental de la FIFA",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    2018
   ],
   "fifa": 1,
   "wcBall": 1,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg/330px-Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg",
   "file": "Luka Modric Croatia v Portugal 2 July 2026-055.jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "de-bruyne",
  "rank": 54,
  "name": "Kevin De Bruyne",
  "country": "Bélgica",
  "flag": "be",
  "position": "Mediocampista",
  "born": "1991-06-28",
  "clubs": [
   {
    "club": "Genk",
    "years": "2008–2012",
    "apps": 97,
    "goals": 16
   },
   {
    "club": "Chelsea",
    "years": "2012–2014",
    "apps": 3,
    "goals": 0
   },
   {
    "club": "Werder Bremen",
    "loan": true,
    "years": "2012–2013",
    "apps": 33,
    "goals": 10
   },
   {
    "club": "VfL Wolfsburg",
    "years": "2014–2015",
    "apps": 52,
    "goals": 13
   },
   {
    "club": "Manchester City",
    "years": "2015–2025",
    "apps": 285,
    "goals": 72
   },
   {
    "club": "Napoli",
    "years": "2025–",
    "apps": 23,
    "goals": 6
   }
  ],
  "national": [
   {
    "team": "Bélgica",
    "years": "2010–",
    "apps": 127,
    "goals": 40
   }
  ],
  "clubTotal": {
   "apps": 678,
   "goals": 161
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Liga de Bélgica",
    "n": 1
   },
   {
    "cat": "liga",
    "name": "Premier League",
    "n": 6
   },
   {
    "cat": "copa",
    "name": "Copa y Supercopa de Bélgica",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa y Supercopa de Alemania",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "FA Cup",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Inglaterra",
    "n": 5
   },
   {
    "cat": "copa",
    "name": "Community Shield",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de Italia",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg/330px-Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg",
   "file": "Kevin De Bruyne USMNT v Belgium Mar 28 2026-64 (cropped).jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "neymar",
  "rank": 55,
  "name": "Neymar",
  "country": "Brasil",
  "flag": "br",
  "position": "Delantero",
  "born": "1992-02-05",
  "clubs": [
   {
    "club": "Santos",
    "years": "2009–2013",
    "apps": 179,
    "goals": 107
   },
   {
    "club": "Barcelona",
    "years": "2013–2017",
    "apps": 123,
    "goals": 68
   },
   {
    "club": "Paris Saint-Germain",
    "years": "2017–2023",
    "apps": 112,
    "goals": 82
   },
   {
    "club": "Al-Hilal",
    "years": "2023–2025",
    "apps": 3,
    "goals": 0
   },
   {
    "club": "Santos",
    "years": "2025–",
    "apps": 42,
    "goals": 19
   }
  ],
  "national": [
   {
    "team": "Brasil",
    "years": "2010–2026",
    "apps": 130,
    "goals": 80
   }
  ],
  "clubTotal": {
   "apps": 644,
   "goals": 381
  },
  "titles": [
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 2
   },
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 5
   },
   {
    "cat": "liga",
    "name": "Liga Profesional Saudí",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Brasil",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Francia",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Copa de la Liga de Francia",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Supercopa de Francia",
    "n": 3
   },
   {
    "cat": "reg",
    "name": "Campeonato Paulista",
    "n": 3
   },
   {
    "cat": "intl",
    "name": "Copa Libertadores",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Recopa Sudamericana",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 1
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 1
   },
   {
    "cat": "olimpico",
    "name": "Juegos Olímpicos",
    "n": 1
   },
   {
    "cat": "selOtros",
    "name": "Copa Confederaciones",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Sudamericano Sub-20",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg/330px-Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg",
   "file": "Neymar Junior Brazil V Morocco 13 June 2026-40.jpg",
   "author": "Bryan Berlin",
   "license": "CC BY-SA 4.0",
   "year": "2026"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 },
 {
  "id": "benzema",
  "rank": 56,
  "name": "Karim Benzema",
  "country": "Francia",
  "flag": "fr",
  "position": "Delantero",
  "born": "1987-12-19",
  "clubs": [
   {
    "club": "Lyon",
    "years": "2004–2009",
    "apps": 112,
    "goals": 43
   },
   {
    "club": "Real Madrid",
    "years": "2009–2023",
    "apps": 439,
    "goals": 238
   },
   {
    "club": "Al-Ittihad",
    "years": "2023–2026",
    "apps": 64,
    "goals": 38
   },
   {
    "club": "Al-Hilal",
    "years": "2026",
    "apps": 12,
    "goals": 10
   }
  ],
  "national": [
   {
    "team": "Francia",
    "years": "2007–2022",
    "apps": 97,
    "goals": 37
   }
  ],
  "clubTotal": {
   "apps": 919,
   "goals": 502
  },
  "titles": [
   {
    "cat": "liga",
    "name": "Ligue 1",
    "n": 4
   },
   {
    "cat": "liga",
    "name": "LaLiga",
    "n": 4
   },
   {
    "cat": "liga",
    "name": "Liga Profesional Saudí",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Copa de Francia",
    "n": 1
   },
   {
    "cat": "copa",
    "name": "Supercopa de Francia",
    "n": 2
   },
   {
    "cat": "copa",
    "name": "Copa del Rey",
    "n": 3
   },
   {
    "cat": "copa",
    "name": "Supercopa de España",
    "n": 4
   },
   {
    "cat": "copa",
    "name": "Copa del Rey de Arabia Saudita",
    "n": 2
   },
   {
    "cat": "intl",
    "name": "Champions League",
    "n": 5
   },
   {
    "cat": "intl",
    "name": "Supercopa de Europa",
    "n": 4
   },
   {
    "cat": "intl",
    "name": "Mundial de Clubes",
    "n": 5
   },
   {
    "cat": "selOtros",
    "name": "Nations League",
    "n": 1
   },
   {
    "cat": "juvenil",
    "name": "Eurocopa Sub-17",
    "n": 1
   }
  ],
  "awards": {
   "ballonDor": [
    2022
   ],
   "fifa": 0,
   "wcBall": 0,
   "wcBoot": 0,
   "shoe": 0
  },
  "photo": {
   "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Karim_Benzema_Pick.jpg/330px-Karim_Benzema_Pick.jpg",
   "file": "Karim Benzema Pick.jpg",
   "author": "Zack",
   "license": "CC BY 4.0",
   "year": "2024"
  },
  "note": "Jugador en actividad o retirado hace poco: datos al 10 de octubre de 2026."
 }
];
