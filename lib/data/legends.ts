// Comparador de leyendas: los 25 jugadores de la lista de Offside 45. Generado con datos de Wikipedia en inglés
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
 }
];
