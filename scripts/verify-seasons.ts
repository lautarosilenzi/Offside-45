// Verifica que la tabla calculada con los partidos de cada temporada coincida con la publicada por la fuente.
import { SEASONS, verifySeason } from "../lib/seasons";
import { getTeam } from "../lib/teams";

let failed = 0;
for (const season of SEASONS) {
  const problems = verifySeason(season);
  const missingTeams = [...new Set(season.matches.flatMap((m) => [m.homeId, m.awayId]))].filter((id) => !getTeam(id));
  const ids = season.matches.map((m) => m.id);
  const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  const all = [...problems, ...missingTeams.map((id) => `equipo sin definir: ${id}`), ...dupIds.map((id) => `id repetido: ${id}`)];
  if (all.length) {
    failed++;
    console.log(`✗ ${season.year}`);
    for (const p of all) console.log(`    ${p}`);
  } else {
    console.log(`✓ ${season.year} (${season.matches.length} partidos)`);
  }
}
process.exit(failed ? 1 : 0);
