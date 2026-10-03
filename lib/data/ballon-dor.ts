// Datos de Wikipedia (Ballon d'Or, tabla de ganadores) y fotos de Wikimedia Commons, con autor y licencia de cada una.
// Ganadores del Balón de Oro de France Football, con el podio de cada año. En 2010–2015 fue el FIFA Balón de Oro; en 2020 no se entregó.
export type BallonDorPlayer = { name: string; country: string; club: string };
export type BallonDor = BallonDorPlayer & {
  year: number;
  award: "Balón de Oro" | "FIFA Balón de Oro";
  // Puntos del ganador (en 2010–2015, porcentaje de los votos).
  points: number;
  // Foto del ganador, del año en que lo ganó o del más cercano que hay en Commons (year: cuándo se sacó;
  // position: encuadre cuando hay más de una persona en la foto).
  photo: { src: string; file: string; author: string; license: string; year?: number; position?: string };
  podium: (BallonDorPlayer & { rank: 2 | 3 })[];
};

export const BALLON_DOR: BallonDor[] = [
  {
    "year": 1956,
    "award": "Balón de Oro",
    "name": "Stanley Matthews",
    "country": "Inglaterra",
    "club": "Blackpool",
    "points": 47,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/StanleyMatthewsRotterdam1957.jpg/330px-StanleyMatthewsRotterdam1957.jpg",
      "file": "StanleyMatthewsRotterdam1957.jpg",
      "author": "Herbert Behrens (ANEFO)",
      "license": "CC0",
      "year": 1957
    },
    "podium": [
      {
        "rank": 2,
        "name": "Alfredo Di Stéfano",
        "country": "España",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Raymond Kopa",
        "country": "Francia",
        "club": "Real Madrid"
      }
    ]
  },
  {
    "year": 1957,
    "award": "Balón de Oro",
    "name": "Alfredo Di Stéfano",
    "country": "España",
    "club": "Real Madrid",
    "points": 72,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Distefano_eg_1958.jpg/330px-Distefano_eg_1958.jpg",
      "file": "Distefano eg 1958.jpg",
      "author": "Autor desconocido (Editorial Atlántida)",
      "license": "Public domain",
      "year": 1958
    },
    "podium": [
      {
        "rank": 2,
        "name": "Billy Wright",
        "country": "Inglaterra",
        "club": "Wolverhampton Wanderers"
      },
      {
        "rank": 3,
        "name": "Duncan Edwards",
        "country": "Inglaterra",
        "club": "Manchester United"
      },
      {
        "rank": 3,
        "name": "Raymond Kopa",
        "country": "Francia",
        "club": "Real Madrid"
      }
    ]
  },
  {
    "year": 1958,
    "award": "Balón de Oro",
    "name": "Raymond Kopa",
    "country": "Francia",
    "club": "Real Madrid",
    "points": 71,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Kopa%2C_Franse_vortballer.jpg/330px-Kopa%2C_Franse_vortballer.jpg",
      "file": "Kopa, Franse vortballer.jpg",
      "author": "Jack de Nijs (Anefo)",
      "license": "CC BY-SA 3.0 nl",
      "year": 1960
    },
    "podium": [
      {
        "rank": 2,
        "name": "Helmut Rahn",
        "country": "Alemania Federal",
        "club": "Rot-Weiss Essen"
      },
      {
        "rank": 3,
        "name": "Just Fontaine",
        "country": "Francia",
        "club": "Stade de Reims"
      }
    ]
  },
  {
    "year": 1959,
    "award": "Balón de Oro",
    "name": "Alfredo Di Stéfano",
    "country": "España",
    "club": "Real Madrid",
    "points": 80,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Di_Stefano_1959.jpg/330px-Di_Stefano_1959.jpg",
      "file": "Di Stefano 1959.jpg",
      "author": "Wim van Rossem for Anefo",
      "license": "CC0",
      "year": 1959
    },
    "podium": [
      {
        "rank": 2,
        "name": "Raymond Kopa",
        "country": "Francia",
        "club": "Stade de Reims"
      },
      {
        "rank": 3,
        "name": "John Charles",
        "country": "Gales",
        "club": "Juventus"
      }
    ]
  },
  {
    "year": 1960,
    "award": "Balón de Oro",
    "name": "Luis Suárez",
    "country": "España",
    "club": "Barcelona",
    "points": 54,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/LuisSuarezMiramontes1960.webp/330px-LuisSuarezMiramontes1960.webp",
      "file": "LuisSuarezMiramontes1960.webp",
      "author": "Jacques Boisleme",
      "license": "Public domain",
      "year": 1960
    },
    "podium": [
      {
        "rank": 2,
        "name": "Ferenc Puskás",
        "country": "Hungría",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Uwe Seeler",
        "country": "Alemania Federal",
        "club": "Hamburger SV"
      }
    ]
  },
  {
    "year": 1961,
    "award": "Balón de Oro",
    "name": "Omar Sívori",
    "country": "Italia",
    "club": "Juventus",
    "points": 46,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Omar_Sivori.jpg/500px-Omar_Sivori.jpg",
      "file": "Omar_Sivori.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1954
    },
    "podium": [
      {
        "rank": 2,
        "name": "Luis Suárez",
        "country": "España",
        "club": "Inter de Milán"
      },
      {
        "rank": 3,
        "name": "Johnny Haynes",
        "country": "Inglaterra",
        "club": "Fulham"
      }
    ]
  },
  {
    "year": 1962,
    "award": "Balón de Oro",
    "name": "Josef Masopust",
    "country": "Checoslovaquia",
    "club": "Dukla Praga",
    "points": 65,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Josef_Masopust_1962.jpg/330px-Josef_Masopust_1962.jpg",
      "file": "Josef Masopust 1962.jpg",
      "author": "Autor desconocido",
      "license": "CC BY-SA 3.0 nl",
      "year": 1962
    },
    "podium": [
      {
        "rank": 2,
        "name": "Eusébio",
        "country": "Portugal",
        "club": "Benfica"
      },
      {
        "rank": 3,
        "name": "Karl-Heinz Schnellinger",
        "country": "Alemania Federal",
        "club": "Colonia"
      }
    ]
  },
  {
    "year": 1963,
    "award": "Balón de Oro",
    "name": "Lev Yashin",
    "country": "Unión Soviética",
    "club": "Dinamo de Moscú",
    "points": 73,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/LevYashin.JPG/330px-LevYashin.JPG",
      "file": "LevYashin.JPG",
      "author": "Kroon, Ron for Anefo",
      "license": "CC BY-SA 3.0 nl",
      "year": 1965
    },
    "podium": [
      {
        "rank": 2,
        "name": "Gianni Rivera",
        "country": "Italia",
        "club": "Milan"
      },
      {
        "rank": 3,
        "name": "Jimmy Greaves",
        "country": "Inglaterra",
        "club": "Tottenham Hotspur"
      }
    ]
  },
  {
    "year": 1964,
    "award": "Balón de Oro",
    "name": "Denis Law",
    "country": "Escocia",
    "club": "Manchester United",
    "points": 61,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Denis_Law_%284x5_cropped%29.jpg/500px-Denis_Law_%284x5_cropped%29.jpg",
      "file": "Denis_Law_(4x5_cropped).jpg",
      "author": "Danny Molyneux",
      "license": "CC BY 2.0",
      "year": 2011
    },
    "podium": [
      {
        "rank": 2,
        "name": "Luis Suárez",
        "country": "España",
        "club": "Inter de Milán"
      },
      {
        "rank": 3,
        "name": "Amancio",
        "country": "España",
        "club": "Real Madrid"
      }
    ]
  },
  {
    "year": 1965,
    "award": "Balón de Oro",
    "name": "Eusébio",
    "country": "Portugal",
    "club": "Benfica",
    "points": 67,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Eusebio_%281963%29.jpg/330px-Eusebio_%281963%29.jpg",
      "file": "Eusebio (1963).jpg",
      "author": "Harry Pot (Anefo)",
      "license": "CC BY-SA 3.0 nl",
      "year": 1963
    },
    "podium": [
      {
        "rank": 2,
        "name": "Giacinto Facchetti",
        "country": "Italia",
        "club": "Inter de Milán"
      },
      {
        "rank": 3,
        "name": "Luis Suárez",
        "country": "España",
        "club": "Inter de Milán"
      }
    ]
  },
  {
    "year": 1966,
    "award": "Balón de Oro",
    "name": "Bobby Charlton",
    "country": "Inglaterra",
    "club": "Manchester United",
    "points": 81,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/LondonHouseAmsterdam1966_Bobby_Charlton.jpg/330px-LondonHouseAmsterdam1966_Bobby_Charlton.jpg",
      "file": "LondonHouseAmsterdam1966 Bobby Charlton.jpg",
      "author": "ANEFO",
      "license": "CC0",
      "year": 1966
    },
    "podium": [
      {
        "rank": 2,
        "name": "Eusébio",
        "country": "Portugal",
        "club": "Benfica"
      },
      {
        "rank": 3,
        "name": "Franz Beckenbauer",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 1967,
    "award": "Balón de Oro",
    "name": "Flórián Albert",
    "country": "Hungría",
    "club": "Ferencváros",
    "points": 68,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Gyula_Guly%C3%A1s_sports_reporter_with_Fl%C3%B3ri%C3%A1n_Albert%2C_Ferenc_Bene_and_J%C3%A1nos_Farkas_footballers_%28cropped%29.jpg/330px-Gyula_Guly%C3%A1s_sports_reporter_with_Fl%C3%B3ri%C3%A1n_Albert%2C_Ferenc_Bene_and_J%C3%A1nos_Farkas_footballers_%28cropped%29.jpg",
      "file": "Gyula Gulyás sports reporter with Flórián Albert, Ferenc Bene and János Farkas footballers (cropped).jpg",
      "author": "Fortepan / Szalay Zoltán",
      "license": "CC BY-SA 3.0",
      "year": 1969
    },
    "podium": [
      {
        "rank": 2,
        "name": "Bobby Charlton",
        "country": "Inglaterra",
        "club": "Manchester United"
      },
      {
        "rank": 3,
        "name": "Jimmy Johnstone",
        "country": "Escocia",
        "club": "Celtic"
      }
    ]
  },
  {
    "year": 1968,
    "award": "Balón de Oro",
    "name": "George Best",
    "country": "Irlanda del Norte",
    "club": "Manchester United",
    "points": 61,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/George_best_1976.jpg/500px-George_best_1976.jpg",
      "file": "George_best_1976.jpg",
      "author": "Bert Verhoeff (Anefo)",
      "license": "CC0",
      "year": 1976
    },
    "podium": [
      {
        "rank": 2,
        "name": "Bobby Charlton",
        "country": "Inglaterra",
        "club": "Manchester United"
      },
      {
        "rank": 3,
        "name": "Dragan Džajić",
        "country": "Yugoslavia",
        "club": "Estrella Roja"
      }
    ]
  },
  {
    "year": 1969,
    "award": "Balón de Oro",
    "name": "Gianni Rivera",
    "country": "Italia",
    "club": "Milan",
    "points": 83,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Stamp_of_Manama_1969_Gianni-Rivera-Ac-Milan.jpg/330px-Stamp_of_Manama_1969_Gianni-Rivera-Ac-Milan.jpg",
      "file": "Stamp of Manama 1969 Gianni-Rivera-Ac-Milan.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1969
    },
    "podium": [
      {
        "rank": 2,
        "name": "Gigi Riva",
        "country": "Italia",
        "club": "Cagliari"
      },
      {
        "rank": 3,
        "name": "Gerd Müller",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 1970,
    "award": "Balón de Oro",
    "name": "Gerd Müller",
    "country": "Alemania Federal",
    "club": "Bayern Múnich",
    "points": 77,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Gerd_M%C3%BCller_M%C3%A9xico_70.png/330px-Gerd_M%C3%BCller_M%C3%A9xico_70.png",
      "file": "Gerd Müller México 70.png",
      "author": "Panini",
      "license": "Public domain",
      "year": 1970
    },
    "podium": [
      {
        "rank": 2,
        "name": "Bobby Moore",
        "country": "Inglaterra",
        "club": "West Ham United"
      },
      {
        "rank": 3,
        "name": "Gigi Riva",
        "country": "Italia",
        "club": "Cagliari"
      }
    ]
  },
  {
    "year": 1971,
    "award": "Balón de Oro",
    "name": "Johan Cruyff",
    "country": "Países Bajos",
    "club": "Ajax",
    "points": 116,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Ajax_tegen_Borussia_M%C3%B6nchengladbach_4-3%2C_J_Cruyff_in_actie%2C_Bestanddeelnr_924-7979.jpg/330px-Ajax_tegen_Borussia_M%C3%B6nchengladbach_4-3%2C_J_Cruyff_in_actie%2C_Bestanddeelnr_924-7979.jpg",
      "file": "Ajax tegen Borussia Mönchengladbach 4-3, J Cruyff in actie, Bestanddeelnr 924-7979.jpg",
      "author": "Rob Mieremet / Anefo",
      "license": "CC0",
      "year": 1971
    },
    "podium": [
      {
        "rank": 2,
        "name": "Sandro Mazzola",
        "country": "Italia",
        "club": "Inter de Milán"
      },
      {
        "rank": 3,
        "name": "George Best",
        "country": "Irlanda del Norte",
        "club": "Manchester United"
      }
    ]
  },
  {
    "year": 1972,
    "award": "Balón de Oro",
    "name": "Franz Beckenbauer",
    "country": "Alemania Federal",
    "club": "Bayern Múnich",
    "points": 81,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Franz_Beckenbauer_1972.jpg/330px-Franz_Beckenbauer_1972.jpg",
      "file": "Franz Beckenbauer 1972.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1972
    },
    "podium": [
      {
        "rank": 2,
        "name": "Gerd Müller",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      },
      {
        "rank": 2,
        "name": "Günter Netzer",
        "country": "Alemania Federal",
        "club": "Borussia Mönchengladbach"
      }
    ]
  },
  {
    "year": 1973,
    "award": "Balón de Oro",
    "name": "Johan Cruyff",
    "country": "Países Bajos",
    "club": "Barcelona",
    "points": 96,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Johan_Cruyff_in_trainingspak_Nederlands_Elftal_%2C_kop.jpg/330px-Johan_Cruyff_in_trainingspak_Nederlands_Elftal_%2C_kop.jpg",
      "file": "Johan Cruyff in trainingspak Nederlands Elftal , kop.jpg",
      "author": "Nationaal Archief",
      "license": "CC BY-SA 3.0 nl",
      "year": 1973
    },
    "podium": [
      {
        "rank": 2,
        "name": "Dino Zoff",
        "country": "Italia",
        "club": "Juventus"
      },
      {
        "rank": 3,
        "name": "Gerd Müller",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 1974,
    "award": "Balón de Oro",
    "name": "Johan Cruyff",
    "country": "Países Bajos",
    "club": "Barcelona",
    "points": 116,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Johan_Cruyff_1974c.jpg/330px-Johan_Cruyff_1974c.jpg",
      "file": "Johan Cruyff 1974c.jpg",
      "author": "Mieremet, Rob / Anefo",
      "license": "CC0",
      "year": 1974
    },
    "podium": [
      {
        "rank": 2,
        "name": "Franz Beckenbauer",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Kazimierz Deyna",
        "country": "Polonia",
        "club": "Legia de Varsovia"
      }
    ]
  },
  {
    "year": 1975,
    "award": "Balón de Oro",
    "name": "Oleg Blojín",
    "country": "Unión Soviética",
    "club": "Dinamo de Kiev",
    "points": 122,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Mykhaylo_Fomenko_1975_%28cropped%29.jpg/330px-Mykhaylo_Fomenko_1975_%28cropped%29.jpg",
      "file": "Mykhaylo Fomenko 1975 (cropped).jpg",
      "author": "Nationaal Archief (Anefo)",
      "license": "CC0",
      "year": 1975
    },
    "podium": [
      {
        "rank": 2,
        "name": "Franz Beckenbauer",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Johan Cruyff",
        "country": "Países Bajos",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 1976,
    "award": "Balón de Oro",
    "name": "Franz Beckenbauer",
    "country": "Alemania Federal",
    "club": "Bayern Múnich",
    "points": 91,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Franz_Beckenbauer_%281975%29.jpg/330px-Franz_Beckenbauer_%281975%29.jpg",
      "file": "Franz Beckenbauer (1975).jpg",
      "author": "Panini Group",
      "license": "Public domain",
      "year": 1975
    },
    "podium": [
      {
        "rank": 2,
        "name": "Rob Rensenbrink",
        "country": "Países Bajos",
        "club": "Anderlecht"
      },
      {
        "rank": 3,
        "name": "Ivo Viktor",
        "country": "Checoslovaquia",
        "club": "Dukla Praga"
      }
    ]
  },
  {
    "year": 1977,
    "award": "Balón de Oro",
    "name": "Allan Simonsen",
    "country": "Dinamarca",
    "club": "Borussia Mönchengladbach",
    "points": 74,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Allan_Simonsen_%281976%29.jpg/330px-Allan_Simonsen_%281976%29.jpg",
      "file": "Allan Simonsen (1976).jpg",
      "author": "Panini",
      "license": "Public domain",
      "year": 1976
    },
    "podium": [
      {
        "rank": 2,
        "name": "Kevin Keegan",
        "country": "Inglaterra",
        "club": "Hamburger SV"
      },
      {
        "rank": 3,
        "name": "Michel Platini",
        "country": "Francia",
        "club": "Nancy"
      }
    ]
  },
  {
    "year": 1978,
    "award": "Balón de Oro",
    "name": "Kevin Keegan",
    "country": "Inglaterra",
    "club": "Hamburger SV",
    "points": 87,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Kevin_keegan_liverpool_panini.jpg/330px-Kevin_keegan_liverpool_panini.jpg",
      "file": "Kevin keegan liverpool panini.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1977
    },
    "podium": [
      {
        "rank": 2,
        "name": "Hans Krankl",
        "country": "Austria",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Rob Rensenbrink",
        "country": "Países Bajos",
        "club": "Anderlecht"
      }
    ]
  },
  {
    "year": 1979,
    "award": "Balón de Oro",
    "name": "Kevin Keegan",
    "country": "Inglaterra",
    "club": "Hamburger SV",
    "points": 118,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Kevin_keegan_panini_card_%28cropped%29.jpg/330px-Kevin_keegan_panini_card_%28cropped%29.jpg",
      "file": "Kevin keegan panini card (cropped).jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1980
    },
    "podium": [
      {
        "rank": 2,
        "name": "Karl-Heinz Rummenigge",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Ruud Krol",
        "country": "Países Bajos",
        "club": "Ajax"
      }
    ]
  },
  {
    "year": 1980,
    "award": "Balón de Oro",
    "name": "Karl-Heinz Rummenigge",
    "country": "Alemania Federal",
    "club": "Bayern Múnich",
    "points": 122,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Karl-Heinz_Rummenigge.jpg/330px-Karl-Heinz_Rummenigge.jpg",
      "file": "Karl-Heinz Rummenigge.jpg",
      "author": "Nationaal Archief (Anefo)",
      "license": "CC BY-SA 3.0 nl",
      "year": 1982
    },
    "podium": [
      {
        "rank": 2,
        "name": "Bernd Schuster",
        "country": "Alemania Federal",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Michel Platini",
        "country": "Francia",
        "club": "Saint-Étienne"
      }
    ]
  },
  {
    "year": 1981,
    "award": "Balón de Oro",
    "name": "Karl-Heinz Rummenigge",
    "country": "Alemania Federal",
    "club": "Bayern Múnich",
    "points": 106,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Karl-Heinz_Rummenigge.jpg/330px-Karl-Heinz_Rummenigge.jpg",
      "file": "Karl-Heinz Rummenigge.jpg",
      "author": "Nationaal Archief (Anefo)",
      "license": "CC BY-SA 3.0 nl",
      "year": 1982
    },
    "podium": [
      {
        "rank": 2,
        "name": "Paul Breitner",
        "country": "Alemania Federal",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Bernd Schuster",
        "country": "Alemania Federal",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 1982,
    "award": "Balón de Oro",
    "name": "Paolo Rossi",
    "country": "Italia",
    "club": "Juventus",
    "points": 115,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Paolo_Rossi_at_the_1982_FIFA_World_Cup_%28cropped%29.jpg/330px-Paolo_Rossi_at_the_1982_FIFA_World_Cup_%28cropped%29.jpg",
      "file": "Paolo Rossi at the 1982 FIFA World Cup (cropped).jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1982
    },
    "podium": [
      {
        "rank": 2,
        "name": "Alain Giresse",
        "country": "Francia",
        "club": "Burdeos"
      },
      {
        "rank": 3,
        "name": "Zbigniew Boniek",
        "country": "Polonia",
        "club": "Juventus"
      }
    ]
  },
  {
    "year": 1983,
    "award": "Balón de Oro",
    "name": "Michel Platini",
    "country": "Francia",
    "club": "Juventus",
    "points": 110,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Platini_entrevista.jpg/330px-Platini_entrevista.jpg",
      "file": "Platini entrevista.jpg",
      "author": "Eduardo Giménez",
      "license": "Public domain",
      "year": 1986
    },
    "podium": [
      {
        "rank": 2,
        "name": "Kenny Dalglish",
        "country": "Escocia",
        "club": "Liverpool"
      },
      {
        "rank": 3,
        "name": "Allan Simonsen",
        "country": "Dinamarca",
        "club": "Vejle"
      }
    ]
  },
  {
    "year": 1984,
    "award": "Balón de Oro",
    "name": "Michel Platini",
    "country": "Francia",
    "club": "Juventus",
    "points": 110,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Platini_ElGr%C3%A1fico.jpg",
      "file": "Platini ElGráfico.jpg",
      "author": "Caio Brandão Costa and unknow",
      "license": "Public domain",
      "year": 1985
    },
    "podium": [
      {
        "rank": 2,
        "name": "Jean Tigana",
        "country": "Francia",
        "club": "Burdeos"
      },
      {
        "rank": 3,
        "name": "Preben Elkjær",
        "country": "Dinamarca",
        "club": "Hellas Verona"
      }
    ]
  },
  {
    "year": 1985,
    "award": "Balón de Oro",
    "name": "Michel Platini",
    "country": "Francia",
    "club": "Juventus",
    "points": 127,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Platini_juventus.JPG",
      "file": "Platini juventus.JPG",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1985
    },
    "podium": [
      {
        "rank": 2,
        "name": "Preben Elkjær",
        "country": "Dinamarca",
        "club": "Hellas Verona"
      },
      {
        "rank": 3,
        "name": "Bernd Schuster",
        "country": "Alemania Federal",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 1986,
    "award": "Balón de Oro",
    "name": "Ígor Belánov",
    "country": "Unión Soviética",
    "club": "Dinamo de Kiev",
    "points": 84,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/8/80/Ihor_Belanov.jpeg",
      "file": "Ihor_Belanov.jpeg",
      "author": "Илья Хохлов",
      "license": "CC BY-SA 3.0",
      "year": 2012
    },
    "podium": [
      {
        "rank": 2,
        "name": "Gary Lineker",
        "country": "Inglaterra",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Emilio Butragueño",
        "country": "España",
        "club": "Real Madrid"
      }
    ]
  },
  {
    "year": 1987,
    "award": "Balón de Oro",
    "name": "Ruud Gullit",
    "country": "Países Bajos",
    "club": "Milan",
    "points": 106,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Nederlands_elftal_in_Noordwijk_Ruud_Gullit_ontmoet_toevallig_minister_Nijpels%2C_Bestanddeelnr_934-1138.jpg/330px-Nederlands_elftal_in_Noordwijk_Ruud_Gullit_ontmoet_toevallig_minister_Nijpels%2C_Bestanddeelnr_934-1138.jpg",
      "file": "Nederlands elftal in Noordwijk Ruud Gullit ontmoet toevallig minister Nijpels, Bestanddeelnr 934-1138.jpg",
      "author": "Rob Bogaerts for Anefo",
      "license": "CC0",
      "year": 1987,
      "position": "left top"
    },
    "podium": [
      {
        "rank": 2,
        "name": "Paulo Futre",
        "country": "Portugal",
        "club": "Atlético de Madrid"
      },
      {
        "rank": 3,
        "name": "Emilio Butragueño",
        "country": "España",
        "club": "Real Madrid"
      }
    ]
  },
  {
    "year": 1988,
    "award": "Balón de Oro",
    "name": "Marco van Basten",
    "country": "Países Bajos",
    "club": "Milan",
    "points": 129,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Trainingsstage_Nederlands_elftal_in_Noordwijk_Marco_van_Basten_volgt_training_v%2C_Bestanddeelnr_934-2516.jpg/330px-Trainingsstage_Nederlands_elftal_in_Noordwijk_Marco_van_Basten_volgt_training_v%2C_Bestanddeelnr_934-2516.jpg",
      "file": "Trainingsstage Nederlands elftal in Noordwijk Marco van Basten volgt training v, Bestanddeelnr 934-2516.jpg",
      "author": "Rob Bogaerts for Anefo",
      "license": "CC0",
      "year": 1988
    },
    "podium": [
      {
        "rank": 2,
        "name": "Ruud Gullit",
        "country": "Países Bajos",
        "club": "Milan"
      },
      {
        "rank": 3,
        "name": "Frank Rijkaard",
        "country": "Países Bajos",
        "club": "Milan"
      }
    ]
  },
  {
    "year": 1989,
    "award": "Balón de Oro",
    "name": "Marco van Basten",
    "country": "Países Bajos",
    "club": "Milan",
    "points": 129,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Marco_van_Basten_1989_crop.jpg/330px-Marco_van_Basten_1989_crop.jpg",
      "file": "Marco van Basten 1989 crop.jpg",
      "author": "Nationaal Archief (Anefo)",
      "license": "CC0",
      "year": 1989
    },
    "podium": [
      {
        "rank": 2,
        "name": "Franco Baresi",
        "country": "Italia",
        "club": "Milan"
      },
      {
        "rank": 3,
        "name": "Frank Rijkaard",
        "country": "Países Bajos",
        "club": "Milan"
      }
    ]
  },
  {
    "year": 1990,
    "award": "Balón de Oro",
    "name": "Lothar Matthäus",
    "country": "Alemania",
    "club": "Inter de Milán",
    "points": 137,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/2019_Lothar_Matth%C3%A4us.jpg/500px-2019_Lothar_Matth%C3%A4us.jpg",
      "file": "2019_Lothar_Matthäus.jpg",
      "author": "Steffen Prößdorf",
      "license": "CC BY-SA 4.0",
      "year": 2019
    },
    "podium": [
      {
        "rank": 2,
        "name": "Salvatore Schillaci",
        "country": "Italia",
        "club": "Juventus"
      },
      {
        "rank": 3,
        "name": "Andreas Brehme",
        "country": "Alemania",
        "club": "Inter de Milán"
      }
    ]
  },
  {
    "year": 1991,
    "award": "Balón de Oro",
    "name": "Jean-Pierre Papin",
    "country": "Francia",
    "club": "Olympique de Marsella",
    "points": 141,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/PapinJP1997_%28cropped%29.jpg/500px-PapinJP1997_%28cropped%29.jpg",
      "file": "PapinJP1997_(cropped).jpg",
      "author": "Leo Medvedev/Лев Леонидович Медведев",
      "license": "CC BY-SA 4.0",
      "year": 1997
    },
    "podium": [
      {
        "rank": 2,
        "name": "Dejan Savićević",
        "country": "Yugoslavia",
        "club": "Estrella Roja"
      },
      {
        "rank": 2,
        "name": "Darko Pančev",
        "country": "Yugoslavia",
        "club": "Estrella Roja"
      },
      {
        "rank": 2,
        "name": "Lothar Matthäus",
        "country": "Alemania",
        "club": "Inter de Milán"
      }
    ]
  },
  {
    "year": 1992,
    "award": "Balón de Oro",
    "name": "Marco van Basten",
    "country": "Países Bajos",
    "club": "Milan",
    "points": 98,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Marco_van_Basten_1990-1992.jpg/330px-Marco_van_Basten_1990-1992.jpg",
      "file": "Marco van Basten 1990-1992.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1990
    },
    "podium": [
      {
        "rank": 2,
        "name": "Hristo Stoichkov",
        "country": "Bulgaria",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Dennis Bergkamp",
        "country": "Países Bajos",
        "club": "Ajax"
      }
    ]
  },
  {
    "year": 1993,
    "award": "Balón de Oro",
    "name": "Roberto Baggio",
    "country": "Italia",
    "club": "Juventus",
    "points": 142,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Roberto_Baggio_-_Italia_%2790.jpg/330px-Roberto_Baggio_-_Italia_%2790.jpg",
      "file": "Roberto Baggio - Italia '90.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1990
    },
    "podium": [
      {
        "rank": 2,
        "name": "Dennis Bergkamp",
        "country": "Países Bajos",
        "club": "Inter de Milán"
      },
      {
        "rank": 3,
        "name": "Eric Cantona",
        "country": "Francia",
        "club": "Manchester United"
      }
    ]
  },
  {
    "year": 1994,
    "award": "Balón de Oro",
    "name": "Hristo Stoichkov",
    "country": "Bulgaria",
    "club": "Barcelona",
    "points": 210,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Stoichkov_in_2016.jpg/500px-Stoichkov_in_2016.jpg",
      "file": "Stoichkov_in_2016.jpg",
      "author": "Biser Todorov",
      "license": "CC BY-SA 4.0",
      "year": 2016
    },
    "podium": [
      {
        "rank": 2,
        "name": "Roberto Baggio",
        "country": "Italia",
        "club": "Juventus"
      },
      {
        "rank": 3,
        "name": "Paolo Maldini",
        "country": "Italia",
        "club": "Milan"
      }
    ]
  },
  {
    "year": 1995,
    "award": "Balón de Oro",
    "name": "George Weah",
    "country": "Liberia",
    "club": "Milan",
    "points": 144,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Coppa_UEFA_1992-93_-_Napoli_vs_PSG_-_George_Weah.jpg/330px-Coppa_UEFA_1992-93_-_Napoli_vs_PSG_-_George_Weah.jpg",
      "file": "Coppa UEFA 1992-93 - Napoli vs PSG - George Weah.jpg",
      "author": "Autor desconocido",
      "license": "Public domain",
      "year": 1992
    },
    "podium": [
      {
        "rank": 2,
        "name": "Jürgen Klinsmann",
        "country": "Alemania",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Jari Litmanen",
        "country": "Finlandia",
        "club": "Ajax"
      }
    ]
  },
  {
    "year": 1996,
    "award": "Balón de Oro",
    "name": "Matthias Sammer",
    "country": "Alemania",
    "club": "Borussia Dortmund",
    "points": 144,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Matthias_Sammer_2722.jpg/500px-Matthias_Sammer_2722.jpg",
      "file": "Matthias_Sammer_2722.jpg",
      "author": "Harald Bischoff",
      "license": "CC BY-SA 3.0",
      "year": 2013
    },
    "podium": [
      {
        "rank": 2,
        "name": "Ronaldo",
        "country": "Brasil",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Alan Shearer",
        "country": "Inglaterra",
        "club": "Newcastle United"
      }
    ]
  },
  {
    "year": 1997,
    "award": "Balón de Oro",
    "name": "Ronaldo",
    "country": "Brasil",
    "club": "Inter de Milán",
    "points": 222,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg/500px-12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg",
      "file": "12.12.2025_–_Cerimônia_de_lançamento_do_SBT_News_-_54980664160_(cropped2).jpg",
      "author": "Lula Oficial",
      "license": "CC BY-SA 4.0",
      "year": 2025
    },
    "podium": [
      {
        "rank": 2,
        "name": "Predrag Mijatović",
        "country": "Yugoslavia",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Zinedine Zidane",
        "country": "Francia",
        "club": "Juventus"
      }
    ]
  },
  {
    "year": 1998,
    "award": "Balón de Oro",
    "name": "Zinedine Zidane",
    "country": "Francia",
    "club": "Juventus",
    "points": 244,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Zidane_%2832090133204%29.jpg/330px-Zidane_%2832090133204%29.jpg",
      "file": "Zidane (32090133204).jpg",
      "author": "Philippe Roos from Strasbourg",
      "license": "CC BY-SA 2.0",
      "year": 1998
    },
    "podium": [
      {
        "rank": 2,
        "name": "Davor Šuker",
        "country": "Croacia",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Ronaldo",
        "country": "Brasil",
        "club": "Inter de Milán"
      }
    ]
  },
  {
    "year": 1999,
    "award": "Balón de Oro",
    "name": "Rivaldo",
    "country": "Brasil",
    "club": "Barcelona",
    "points": 219,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Rivaldo.jpg",
      "file": "Rivaldo.jpg",
      "author": "Laura Cortizo/Portal da Copa",
      "license": "CC BY 3.0 br",
      "year": 2014
    },
    "podium": [
      {
        "rank": 2,
        "name": "David Beckham",
        "country": "Inglaterra",
        "club": "Manchester United"
      },
      {
        "rank": 3,
        "name": "Andriy Shevchenko",
        "country": "Ucrania",
        "club": "Milan"
      }
    ]
  },
  {
    "year": 2000,
    "award": "Balón de Oro",
    "name": "Luís Figo",
    "country": "Portugal",
    "club": "Real Madrid",
    "points": 197,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Luis_Figo_2023.jpg/500px-Luis_Figo_2023.jpg",
      "file": "Luis_Figo_2023.jpg",
      "author": "Žan Kolman",
      "license": "Public domain",
      "year": 2023
    },
    "podium": [
      {
        "rank": 2,
        "name": "Zinedine Zidane",
        "country": "Francia",
        "club": "Juventus"
      },
      {
        "rank": 3,
        "name": "Andriy Shevchenko",
        "country": "Ucrania",
        "club": "Milan"
      }
    ]
  },
  {
    "year": 2001,
    "award": "Balón de Oro",
    "name": "Michael Owen",
    "country": "Inglaterra",
    "club": "Liverpool",
    "points": 176,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Michael_Owen.jpg/500px-Michael_Owen.jpg",
      "file": "Michael_Owen.jpg",
      "author": "David Seow",
      "license": "CC BY-SA 4.0",
      "year": 2014
    },
    "podium": [
      {
        "rank": 2,
        "name": "Raúl",
        "country": "España",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Oliver Kahn",
        "country": "Alemania",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 2002,
    "award": "Balón de Oro",
    "name": "Ronaldo",
    "country": "Brasil",
    "club": "Real Madrid",
    "points": 169,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Ronaldo_2002_cropped.jpg/330px-Ronaldo_2002_cropped.jpg",
      "file": "Ronaldo 2002 cropped.jpg",
      "author": "Milly barzellai",
      "license": "CC BY-SA 4.0",
      "year": 2002
    },
    "podium": [
      {
        "rank": 2,
        "name": "Roberto Carlos",
        "country": "Brasil",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Oliver Kahn",
        "country": "Alemania",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 2003,
    "award": "Balón de Oro",
    "name": "Pavel Nedvěd",
    "country": "República Checa",
    "club": "Juventus",
    "points": 190,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Pavel_Nedv%C4%9Bd.jpg/500px-Pavel_Nedv%C4%9Bd.jpg",
      "file": "Pavel_Nedvěd.jpg",
      "author": "Pavel Lebeda",
      "license": "CC BY-SA 2.0",
      "year": 2006
    },
    "podium": [
      {
        "rank": 2,
        "name": "Thierry Henry",
        "country": "Francia",
        "club": "Arsenal"
      },
      {
        "rank": 3,
        "name": "Paolo Maldini",
        "country": "Italia",
        "club": "Milan"
      }
    ]
  },
  {
    "year": 2004,
    "award": "Balón de Oro",
    "name": "Andriy Shevchenko",
    "country": "Ucrania",
    "club": "Milan",
    "points": 175,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Andriy_Shevchenko_-_2004_-_AC_Milan_%283%29.jpg/330px-Andriy_Shevchenko_-_2004_-_AC_Milan_%283%29.jpg",
      "file": "Andriy Shevchenko - 2004 - AC Milan (3).jpg",
      "author": "Original: Anastasiya Fedorenko Derivative work: Danyele",
      "license": "CC BY-SA 3.0",
      "year": 2004
    },
    "podium": [
      {
        "rank": 2,
        "name": "Deco",
        "country": "Portugal",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Ronaldinho",
        "country": "Brasil",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2005,
    "award": "Balón de Oro",
    "name": "Ronaldinho",
    "country": "Brasil",
    "club": "Barcelona",
    "points": 225,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Ronaldinho_corner.jpg/330px-Ronaldinho_corner.jpg",
      "file": "Ronaldinho corner.jpg",
      "author": "Hector Garcia",
      "license": "CC BY-SA 2.0",
      "year": 2005
    },
    "podium": [
      {
        "rank": 2,
        "name": "Frank Lampard",
        "country": "Inglaterra",
        "club": "Chelsea"
      },
      {
        "rank": 3,
        "name": "Steven Gerrard",
        "country": "Inglaterra",
        "club": "Liverpool"
      }
    ]
  },
  {
    "year": 2006,
    "award": "Balón de Oro",
    "name": "Fabio Cannavaro",
    "country": "Italia",
    "club": "Real Madrid",
    "points": 173,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Napolitano_e_Cannavaro.jpg",
      "file": "Napolitano e Cannavaro.jpg",
      "author": "Autor desconocido",
      "license": "Attribution",
      "year": 2006,
      "position": "right top"
    },
    "podium": [
      {
        "rank": 2,
        "name": "Gianluigi Buffon",
        "country": "Italia",
        "club": "Juventus"
      },
      {
        "rank": 3,
        "name": "Thierry Henry",
        "country": "Francia",
        "club": "Arsenal"
      }
    ]
  },
  {
    "year": 2007,
    "award": "Balón de Oro",
    "name": "Kaká",
    "country": "Brasil",
    "club": "Milan",
    "points": 444,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Ricardo_Izecson_dos_Santos_Leite_%28Kak%C3%A1%29_01.jpg/330px-Ricardo_Izecson_dos_Santos_Leite_%28Kak%C3%A1%29_01.jpg",
      "file": "Ricardo Izecson dos Santos Leite (Kaká) 01.jpg",
      "author": "José Cruz/ABr (cropped by tales.ebner)",
      "license": "CC BY 3.0 br",
      "year": 2007
    },
    "podium": [
      {
        "rank": 2,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Manchester United"
      },
      {
        "rank": 3,
        "name": "Lionel Messi",
        "country": "Argentina",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2008,
    "award": "Balón de Oro",
    "name": "Cristiano Ronaldo",
    "country": "Portugal",
    "club": "Manchester United",
    "points": 446,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Cristiano_Ronaldo_of_Manchester_United%2C_November_5%2C_2008.jpg/330px-Cristiano_Ronaldo_of_Manchester_United%2C_November_5%2C_2008.jpg",
      "file": "Cristiano Ronaldo of Manchester United, November 5, 2008.jpg",
      "author": "Photo beople/gowestphoto/ Tsutomu Takasu]",
      "license": "CC BY 2.0",
      "year": 2008
    },
    "podium": [
      {
        "rank": 2,
        "name": "Lionel Messi",
        "country": "Argentina",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Fernando Torres",
        "country": "España",
        "club": "Liverpool"
      }
    ]
  },
  {
    "year": 2009,
    "award": "Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Barcelona",
    "points": 473,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Messi_Training.jpg/330px-Messi_Training.jpg",
      "file": "Messi Training.jpg",
      "author": "@N03 Alex Tremps",
      "license": "CC BY 2.0",
      "year": 2009
    },
    "podium": [
      {
        "rank": 2,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Xavi",
        "country": "España",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2010,
    "award": "FIFA Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Barcelona",
    "points": 22,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Messi_Barcelona_-_Valladolid_%28cropped%29.jpg/330px-Messi_Barcelona_-_Valladolid_%28cropped%29.jpg",
      "file": "Messi Barcelona - Valladolid (cropped).jpg",
      "author": "Oemar (obra derivada: Lobo)",
      "license": "CC BY 2.0",
      "year": 2010
    },
    "podium": [
      {
        "rank": 2,
        "name": "Andrés Iniesta",
        "country": "España",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Xavi",
        "country": "España",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2011,
    "award": "FIFA Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Barcelona",
    "points": 47,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Lionel_Messi%2C_2011.jpg/330px-Lionel_Messi%2C_2011.jpg",
      "file": "Lionel Messi, 2011.jpg",
      "author": "Jeroen Bennink",
      "license": "CC BY 2.0",
      "year": 2011
    },
    "podium": [
      {
        "rank": 2,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Xavi",
        "country": "España",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2012,
    "award": "FIFA Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Barcelona",
    "points": 41,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Lionel_Messi_%282009%29.jpg",
      "file": "Lionel Messi (2009).jpg",
      "author": "Alex Tremps (obra derivada: César)",
      "license": "CC BY 2.0",
      "year": 2012
    },
    "podium": [
      {
        "rank": 2,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Andrés Iniesta",
        "country": "España",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2013,
    "award": "FIFA Balón de Oro",
    "name": "Cristiano Ronaldo",
    "country": "Portugal",
    "club": "Real Madrid",
    "points": 27,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Cristiano_Ronaldo%2C_2012.JPG/330px-Cristiano_Ronaldo%2C_2012.JPG",
      "file": "Cristiano Ronaldo, 2012.JPG",
      "author": "Goatling",
      "license": "CC BY-SA 2.0",
      "year": 2013
    },
    "podium": [
      {
        "rank": 2,
        "name": "Lionel Messi",
        "country": "Argentina",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Franck Ribéry",
        "country": "Francia",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 2014,
    "award": "FIFA Balón de Oro",
    "name": "Cristiano Ronaldo",
    "country": "Portugal",
    "club": "Real Madrid",
    "points": 37,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Cristiano_Ronaldo_-_Croatia_vs._Portugal%2C_10th_June_2013.jpg/330px-Cristiano_Ronaldo_-_Croatia_vs._Portugal%2C_10th_June_2013.jpg",
      "file": "Cristiano Ronaldo - Croatia vs. Portugal, 10th June 2013.jpg",
      "author": "Fanny Schertzer",
      "license": "CC BY-SA 3.0",
      "year": 2013
    },
    "podium": [
      {
        "rank": 2,
        "name": "Lionel Messi",
        "country": "Argentina",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Manuel Neuer",
        "country": "Alemania",
        "club": "Bayern Múnich"
      }
    ]
  },
  {
    "year": 2015,
    "award": "FIFA Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Barcelona",
    "points": 41,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Messi_v_AS_Roma_2015_%28cropped%29.jpg/330px-Messi_v_AS_Roma_2015_%28cropped%29.jpg",
      "file": "Messi v AS Roma 2015 (cropped).jpg",
      "author": "Justine Magny from Paris, France",
      "license": "CC BY-SA 2.0",
      "year": 2015
    },
    "podium": [
      {
        "rank": 2,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Neymar",
        "country": "Brasil",
        "club": "Barcelona"
      }
    ]
  },
  {
    "year": 2016,
    "award": "Balón de Oro",
    "name": "Cristiano Ronaldo",
    "country": "Portugal",
    "club": "Real Madrid",
    "points": 745,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Cristiano_Ronaldo_entrenando_%28crop%29.jpg/330px-Cristiano_Ronaldo_entrenando_%28crop%29.jpg",
      "file": "Cristiano Ronaldo entrenando (crop).jpg",
      "author": "Ruben Ortega",
      "license": "CC BY-SA 4.0",
      "year": 2016
    },
    "podium": [
      {
        "rank": 2,
        "name": "Lionel Messi",
        "country": "Argentina",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Antoine Griezmann",
        "country": "Francia",
        "club": "Atlético de Madrid"
      }
    ]
  },
  {
    "year": 2017,
    "award": "Balón de Oro",
    "name": "Cristiano Ronaldo",
    "country": "Portugal",
    "club": "Real Madrid",
    "points": 946,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Ronaldo_2017.jpg/330px-Ronaldo_2017.jpg",
      "file": "Ronaldo 2017.jpg",
      "author": "Дмитрий Голубович",
      "license": "CC BY-SA 3.0",
      "year": 2017
    },
    "podium": [
      {
        "rank": 2,
        "name": "Lionel Messi",
        "country": "Argentina",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Neymar",
        "country": "Brasil",
        "club": "Paris Saint-Germain"
      }
    ]
  },
  {
    "year": 2018,
    "award": "Balón de Oro",
    "name": "Luka Modrić",
    "country": "Croacia",
    "club": "Real Madrid",
    "points": 753,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Luka_Modri%C4%87_in_2018.jpg/330px-Luka_Modri%C4%87_in_2018.jpg",
      "file": "Luka Modrić in 2018.jpg",
      "author": "Светлана Бекетова",
      "license": "CC BY-SA 3.0",
      "year": 2018
    },
    "podium": [
      {
        "rank": 2,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Juventus"
      },
      {
        "rank": 3,
        "name": "Antoine Griezmann",
        "country": "Francia",
        "club": "Atlético de Madrid"
      }
    ]
  },
  {
    "year": 2019,
    "award": "Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Barcelona",
    "points": 686,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Lionel_Messi_16_June_2018.jpg/330px-Lionel_Messi_16_June_2018.jpg",
      "file": "Lionel Messi 16 June 2018.jpg",
      "author": "Екатерина Лаут",
      "license": "CC BY-SA 3.0",
      "year": 2018
    },
    "podium": [
      {
        "rank": 2,
        "name": "Virgil van Dijk",
        "country": "Países Bajos",
        "club": "Liverpool"
      },
      {
        "rank": 3,
        "name": "Cristiano Ronaldo",
        "country": "Portugal",
        "club": "Juventus"
      }
    ]
  },
  {
    "year": 2021,
    "award": "Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Paris Saint-Germain",
    "points": 613,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Lionel_Messi_PSG_%28cropped%29.jpg/330px-Lionel_Messi_PSG_%28cropped%29.jpg",
      "file": "Lionel Messi PSG (cropped).jpg",
      "author": "Bigmatbasket",
      "license": "CC BY-SA 4.0",
      "year": 2021
    },
    "podium": [
      {
        "rank": 2,
        "name": "Robert Lewandowski",
        "country": "Polonia",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Jorginho",
        "country": "Italia",
        "club": "Chelsea"
      }
    ]
  },
  {
    "year": 2022,
    "award": "Balón de Oro",
    "name": "Karim Benzema",
    "country": "Francia",
    "club": "Real Madrid",
    "points": 549,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Karim_Benzema_during_a_photoshoot_in_2020.jpg/330px-Karim_Benzema_during_a_photoshoot_in_2020.jpg",
      "file": "Karim Benzema during a photoshoot in 2020.jpg",
      "author": "Real Madrid YouTube channel",
      "license": "CC BY 3.0",
      "year": 2022
    },
    "podium": [
      {
        "rank": 2,
        "name": "Sadio Mané",
        "country": "Senegal",
        "club": "Bayern Múnich"
      },
      {
        "rank": 3,
        "name": "Kevin De Bruyne",
        "country": "Bélgica",
        "club": "Manchester City"
      }
    ]
  },
  {
    "year": 2023,
    "award": "Balón de Oro",
    "name": "Lionel Messi",
    "country": "Argentina",
    "club": "Inter Miami",
    "points": 462,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/CINvMIA_2023-08-23_-_Lionel_Messi%2C_Tata_Martino_%28PXL_20230824_010525464%29_%28Messi_crop%29.jpg/330px-CINvMIA_2023-08-23_-_Lionel_Messi%2C_Tata_Martino_%28PXL_20230824_010525464%29_%28Messi_crop%29.jpg",
      "file": "CINvMIA 2023-08-23 - Lionel Messi, Tata Martino (PXL 20230824 010525464) (Messi crop).jpg",
      "author": "Hayden Schiff",
      "license": "CC BY 4.0",
      "year": 2023
    },
    "podium": [
      {
        "rank": 2,
        "name": "Erling Haaland",
        "country": "Noruega",
        "club": "Manchester City"
      },
      {
        "rank": 3,
        "name": "Kylian Mbappé",
        "country": "Francia",
        "club": "Paris Saint-Germain"
      }
    ]
  },
  {
    "year": 2024,
    "award": "Balón de Oro",
    "name": "Rodri",
    "country": "España",
    "club": "Manchester City",
    "points": 1170,
    "photo": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/78/Rodri2024.jpg",
      "file": "Rodri2024.jpg",
      "author": "Frank Werner",
      "license": "CC0",
      "year": 2024
    },
    "podium": [
      {
        "rank": 2,
        "name": "Vinícius Júnior",
        "country": "Brasil",
        "club": "Real Madrid"
      },
      {
        "rank": 3,
        "name": "Jude Bellingham",
        "country": "Inglaterra",
        "club": "Real Madrid"
      }
    ]
  },
  {
    "year": 2025,
    "award": "Balón de Oro",
    "name": "Ousmane Dembélé",
    "country": "Francia",
    "club": "Paris Saint-Germain",
    "points": 1380,
    "photo": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Ousmane_Dembele_France_v_Senegal_16_June_2026-341_%28cropped%29_2.jpg/500px-Ousmane_Dembele_France_v_Senegal_16_June_2026-341_%28cropped%29_2.jpg",
      "file": "Ousmane_Dembele_France_v_Senegal_16_June_2026-341_(cropped)_2.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0",
      "year": 2026
    },
    "podium": [
      {
        "rank": 2,
        "name": "Lamine Yamal",
        "country": "España",
        "club": "Barcelona"
      },
      {
        "rank": 3,
        "name": "Vitinha",
        "country": "Portugal",
        "club": "Paris Saint-Germain"
      }
    ]
  }
];
