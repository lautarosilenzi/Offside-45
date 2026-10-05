// Ajustes por competencia: desde qué temporada, en qué parte del artículo buscar, cómo unir filas repetidas y nombres
// históricos que el propio artículo suma a otro club.
module.exports = {
  "coppa-italia": { twoLegs: true },
  "europa-league": { twoLegs: true },
  "concacaf-champions": { dedupe: "champion", alias: { "Leones Negros UdeG": "UdeG", "Racing Club Haïtien": "Racing CH" } },
  "fa-cup": { dedupe: "champion" }, // desempates (replays)
  "copa-del-rey": { dedupe: "champion", alias: { "Club Ciclista": "Club Ciclista de San Sebastián" } },
  "dfb-pokal": { dedupe: "champion" },
  "taca-portugal": { from: 1938, dedupe: "champion" }, // antes, el Campeonato de Portugal (otro torneo)
  "coupe-de-france": { yearFromDate: true, dedupe: "champion", alias: { "Girondins de Bordeaux": "Bordeaux", "CS Sedan": "Sedan", "Olympique de Pantin": "Olympique de Paris" } },
  "copa-do-brasil": { dedupe: "champion", alias: { "Sport Recife": "Sport" } },
  champions: { dedupe: "champion" },
  "ligue-1": { from: 1932 }, // era profesional
  "liga-mx": { only: [0, 1] }, // las demás tablas son de la segunda división
  "primeira-liga": { only: [1], seasonCol: 1, champCol: 2 },
  eurocopa: { dedupe: "champion" }, // 1968: final con desempate
  "brasileirao-b": { exclude: ["1986", "1987"] }, // ganadores de grupo, sin campeón (el artículo no los cuenta)
  "primera-uruguay": { only: [3] }, // las otras tablas son torneos cortos y copas
  "primera-colombia": { alias: { "Deportes Caldas": "Once Caldas", Quindío: "Deportes Quindío", "Atlético Quindío": "Deportes Quindío" } },
  bundesliga: {
    before: /==\s*(Other|Workers|Non-DFB|.*[Ww]orkers)/,
    alias: { "VfB Leipzig": "Lokomotive Leipzig", "SpVgg Fürth": "Greuther Fürth", "Union 92 Berlin": "SpVg Blau-Weiß 90 Berlin", "Phönix Karlsruhe": "Karlsruher SC" },
  },
};
