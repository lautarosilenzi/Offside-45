// Datos de Wikipedia (Ballon d'Or, tabla de ganadores) y fotos de Wikimedia Commons, con autor y licencia de cada una.
// Ganadores del Balón de Oro de France Football, con el podio de cada año. En 2010–2015 fue el FIFA Balón de Oro; en 2020 no se entregó.
export type BallonDorPlayer = { name: string; country: string; club: string };
export type BallonDor = BallonDorPlayer & {
  year: number;
  award: "Balón de Oro" | "FIFA Balón de Oro";
  // Puntos del ganador (en 2010–2015, porcentaje de los votos).
  points: number;
  photo: { src: string; file: string; author: string; license: string };
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Stanley_Matthews_1962_%28crop%29.jpg/500px-Stanley_Matthews_1962_%28crop%29.jpg",
      "file": "Stanley_Matthews_1962_(crop).jpg",
      "author": "Harry Pot (Anefo)",
      "license": "CC0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Alfredo_Di_Stefano_River_Plate.jpg/500px-Alfredo_Di_Stefano_River_Plate.jpg",
      "file": "Alfredo_Di_Stefano_River_Plate.jpg",
      "author": "Autor desconocido",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Raymond_Kopa_1963b.jpg/500px-Raymond_Kopa_1963b.jpg",
      "file": "Raymond_Kopa_1963b.jpg",
      "author": "Autor desconocido",
      "license": "CC BY-SA 3.0 nl"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Alfredo_Di_Stefano_River_Plate.jpg/500px-Alfredo_Di_Stefano_River_Plate.jpg",
      "file": "Alfredo_Di_Stefano_River_Plate.jpg",
      "author": "Autor desconocido",
      "license": "Public domain"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Luis_Su%C3%A1rez_Miramontes_1962.jpg",
      "file": "Luis_Suárez_Miramontes_1962.jpg",
      "author": "Autor desconocido",
      "license": "CC0"
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
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Josef_Masopust_official_photo.jpg/500px-Josef_Masopust_official_photo.jpg",
      "file": "Josef_Masopust_official_photo.jpg",
      "author": "Study1919",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/LevYashin.JPG/500px-LevYashin.JPG",
      "file": "LevYashin.JPG",
      "author": "Ron Kroon (Anefo)",
      "license": "CC BY-SA 3.0 nl"
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
      "license": "CC BY 2.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Eusebio_en_1973.jpg/500px-Eusebio_en_1973.jpg",
      "file": "Eusebio_en_1973.jpg",
      "author": "Panini",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/LondonHouseAmsterdam1966_Bobby_Charlton.jpg/500px-LondonHouseAmsterdam1966_Bobby_Charlton.jpg",
      "file": "LondonHouseAmsterdam1966_Bobby_Charlton.jpg",
      "author": "ANEFO",
      "license": "CC0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Fl%C3%B3ri%C3%A1n_Albert_cropped.jpg/500px-Fl%C3%B3ri%C3%A1n_Albert_cropped.jpg",
      "file": "Flórián_Albert_cropped.jpg",
      "author": "Nationaal Archief (Anefo)",
      "license": "CC BY-SA 3.0 nl"
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
      "license": "CC0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Rivera.jpg",
      "file": "Rivera.jpg",
      "author": "Italian House of Representatives",
      "license": "CC BY-SA 3.0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gerd_M%C3%BCller_c1973_%28cropped%29.jpg",
      "file": "Gerd_Müller_c1973_(cropped).jpg",
      "author": "Autor desconocido",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/500px-Johan_Cruijff_%281974%29.jpg",
      "file": "Johan_Cruijff_(1974).jpg",
      "author": "Rob Mieremet (Anefo)",
      "license": "CC0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Franz_Beckenbauer_%281975%29.jpg/500px-Franz_Beckenbauer_%281975%29.jpg",
      "file": "Franz_Beckenbauer_(1975).jpg",
      "author": "Panini Group",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/500px-Johan_Cruijff_%281974%29.jpg",
      "file": "Johan_Cruijff_(1974).jpg",
      "author": "Rob Mieremet (Anefo)",
      "license": "CC0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/500px-Johan_Cruijff_%281974%29.jpg",
      "file": "Johan_Cruijff_(1974).jpg",
      "author": "Rob Mieremet (Anefo)",
      "license": "CC0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/74/Oleg_Blokhin2013.jpg",
      "file": "Oleg_Blokhin2013.jpg",
      "author": "Илья Хохлов",
      "license": "CC BY-SA 3.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Franz_Beckenbauer_%281975%29.jpg/500px-Franz_Beckenbauer_%281975%29.jpg",
      "file": "Franz_Beckenbauer_(1975).jpg",
      "author": "Panini Group",
      "license": "Public domain"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Allan_Simonsen_%281976%29.jpg",
      "file": "Allan_Simonsen_(1976).jpg",
      "author": "Panini",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Kevin_keegan_panini_card_%28cropped%29.jpg/500px-Kevin_keegan_panini_card_%28cropped%29.jpg",
      "file": "Kevin_keegan_panini_card_(cropped).jpg",
      "author": "Autor desconocido",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Kevin_keegan_panini_card_%28cropped%29.jpg/500px-Kevin_keegan_panini_card_%28cropped%29.jpg",
      "file": "Kevin_keegan_panini_card_(cropped).jpg",
      "author": "Autor desconocido",
      "license": "Public domain"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/2015-02-06_Rummenigge_0370_%28cropped%29.JPG/500px-2015-02-06_Rummenigge_0370_%28cropped%29.JPG",
      "file": "2015-02-06_Rummenigge_0370_(cropped).JPG",
      "author": "Michael Lucan",
      "license": "CC BY-SA 3.0 de"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/2015-02-06_Rummenigge_0370_%28cropped%29.JPG/500px-2015-02-06_Rummenigge_0370_%28cropped%29.JPG",
      "file": "2015-02-06_Rummenigge_0370_(cropped).JPG",
      "author": "Michael Lucan",
      "license": "CC BY-SA 3.0 de"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Paolo_Rossi_Vicenza.jpg/500px-Paolo_Rossi_Vicenza.jpg",
      "file": "Paolo_Rossi_Vicenza.jpg",
      "author": "Snake90 (Wikipedia en italiano)",
      "license": "Public domain"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/6/66/Michel_Platini_2010_%28cropped%29.jpg",
      "file": "Michel_Platini_2010_(cropped).jpg",
      "author": "Chancellery of the President of the Republic of Poland",
      "license": "GFDL 1.2"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/6/66/Michel_Platini_2010_%28cropped%29.jpg",
      "file": "Michel_Platini_2010_(cropped).jpg",
      "author": "Chancellery of the President of the Republic of Poland",
      "license": "GFDL 1.2"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/6/66/Michel_Platini_2010_%28cropped%29.jpg",
      "file": "Michel_Platini_2010_(cropped).jpg",
      "author": "Chancellery of the President of the Republic of Poland",
      "license": "GFDL 1.2"
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
      "license": "CC BY-SA 3.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/25th_Laureus_World_Sports_Awards_-_Ruud_Gullit_-_240422_131911_%28cropped%29.jpg/500px-25th_Laureus_World_Sports_Awards_-_Ruud_Gullit_-_240422_131911_%28cropped%29.jpg",
      "file": "25th_Laureus_World_Sports_Awards_-_Ruud_Gullit_-_240422_131911_(cropped).jpg",
      "author": "Barcex",
      "license": "CC BY-SA 4.0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marco_van_Basten_%282%29_%28cropped%29.jpg",
      "file": "Marco_van_Basten_(2)_(cropped).jpg",
      "author": "Paul Blank",
      "license": "CC BY 2.5"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marco_van_Basten_%282%29_%28cropped%29.jpg",
      "file": "Marco_van_Basten_(2)_(cropped).jpg",
      "author": "Paul Blank",
      "license": "CC BY 2.5"
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
      "license": "CC BY-SA 4.0"
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
      "license": "CC BY-SA 4.0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marco_van_Basten_%282%29_%28cropped%29.jpg",
      "file": "Marco_van_Basten_(2)_(cropped).jpg",
      "author": "Paul Blank",
      "license": "CC BY 2.5"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/4/4e/%D8%B1%D9%88%D8%A8%D8%B1%D8%AA%D9%88_%D8%A8%D8%A7%D8%AC%D9%88_%28cropped%29.jpg",
      "file": "روبرتو_باجو_(cropped).jpg",
      "author": "AbolfaZl0990",
      "license": "CC BY-SA 4.0"
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
      "license": "CC BY-SA 4.0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/5/53/Clar_Weah%2C_George_Weah%2C_Joe_Biden%2C_Jill_Biden_%28cropped%29.jpg",
      "file": "Clar_Weah,_George_Weah,_Joe_Biden,_Jill_Biden_(cropped).jpg",
      "author": "Departamento de Estado de EE. UU.",
      "license": "Public domain"
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
      "license": "CC BY-SA 3.0"
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
      "license": "CC BY-SA 4.0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg",
      "file": "Zinedine_Zidane_by_Tasnim_03.jpg",
      "author": "Hadi Abyar",
      "license": "CC BY 4.0"
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
      "license": "CC BY 3.0 br"
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
      "license": "Public domain"
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
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg/500px-12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg",
      "file": "12.12.2025_–_Cerimônia_de_lançamento_do_SBT_News_-_54980664160_(cropped2).jpg",
      "author": "Lula Oficial",
      "license": "CC BY-SA 4.0"
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
      "license": "CC BY-SA 2.0"
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
      "src": "https://upload.wikimedia.org/wikipedia/commons/2/25/%D0%90%D0%BD%D0%B4%D1%80%D1%96%D0%B9_%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%BE_2024_%28cropped%29.png",
      "file": "Андрій_Шевченко_2024_(cropped).png",
      "author": "Міністерство молоді та спорту України",
      "license": "CC BY 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Ronaldinho_in_2019.jpg/500px-Ronaldinho_in_2019.jpg",
      "file": "Ronaldinho_in_2019.jpg",
      "author": "Marcos Corrêa/PR",
      "license": "CC BY 2.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Fabio_Cannavaro_2011.jpg/500px-Fabio_Cannavaro_2011.jpg",
      "file": "Fabio_Cannavaro_2011.jpg",
      "author": "Doha Stadium Plus Qatar",
      "license": "CC BY 2.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Kak%C3%A1_visited_Stadium_St._Petersburg.jpg/500px-Kak%C3%A1_visited_Stadium_St._Petersburg.jpg",
      "file": "Kaká_visited_Stadium_St._Petersburg.jpg",
      "author": "Евгений Асмолов",
      "license": "CC BY-SA 3.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg",
      "file": "Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg",
      "file": "Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg",
      "file": "Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg",
      "file": "Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg",
      "file": "Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg/500px-Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg",
      "file": "Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Karim_Benzema_Pick.jpg/500px-Karim_Benzema_Pick.jpg",
      "file": "Karim_Benzema_Pick.jpg",
      "author": "Zack",
      "license": "CC BY 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "file": "Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Rodri_Argentina_v_Spain_19_July_2026-187_%28cropped%29.jpg/500px-Rodri_Argentina_v_Spain_19_July_2026-187_%28cropped%29.jpg",
      "file": "Rodri_Argentina_v_Spain_19_July_2026-187_(cropped).jpg",
      "author": "Bryan Berlin",
      "license": "CC BY-SA 4.0"
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
      "license": "CC BY-SA 4.0"
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
