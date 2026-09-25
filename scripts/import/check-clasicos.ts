// Control cruzado: los clásicos cargados a mano al principio (desde Wikipedia) contra las temporadas importadas.
import { AMATEUR_MATCHES } from "../../lib/data/amateur";
import { SEASON_MATCHES } from "../../lib/seasons";

let ok = 0;
// Ligas y, desde que se importan, también las copas: se busca el mismo partido en cualquier temporada cargada.
for (const m of AMATEUR_MATCHES) {
  const same = SEASON_MATCHES.filter(
    (s) => ((s.homeId === m.homeId && s.awayId === m.awayId) || (s.homeId === m.awayId && s.awayId === m.homeId)) && s.date.slice(0, 4) === m.date.slice(0, 4),
  );
  const exact = same.find((s) => s.date === m.date);
  const tag = `${m.date} ${m.homeId} ${m.homeGoals}-${m.awayGoals} ${m.awayId}`;
  if (!exact) {
    console.log(`✗ ${tag}: no está en la temporada con esa fecha (candidatos: ${same.map((s) => `${s.date} ${s.homeId} ${s.homeGoals}-${s.awayGoals} ${s.awayId}`).join("; ") || "ninguno"})`);
    continue;
  }
  const g = exact.homeId === m.homeId ? [exact.homeGoals, exact.awayGoals] : [exact.awayGoals, exact.homeGoals];
  const statusOk = (exact.status === "annulled") === (m.status === "annulled") && (exact.awardedTo ?? null) === (m.awardedTo ?? null);
  if (g[0] !== m.homeGoals || g[1] !== m.awayGoals || !statusOk)
    console.log(`✗ ${tag}: en la temporada figura ${exact.homeId} ${exact.homeGoals}-${exact.awayGoals} ${exact.awayId} status=${exact.status ?? "-"} awarded=${exact.awardedTo ?? "-"}`);
  else ok++;
}
console.log(`coinciden ${ok}`);
