// Arma una temporada sin escribirla y muestra un resumen de fases y estados (para depurar una configuración).
//   npx tsx scripts/import/inspect.ts 1931-amateur
import { buildTournament } from "./build";
import { TOURNAMENTS } from "./config";
import { CUP_TOURNAMENTS } from "./config-cups";
import { setLocalAliases } from "./aliases";

(async () => {
  const cfg = [...TOURNAMENTS, ...CUP_TOURNAMENTS].find((t) => t.slug === process.argv[2]);
  if (!cfg) throw new Error("No existe esa temporada");
  setLocalAliases(cfg.aliases);
  const { season } = await buildTournament(cfg);
  const count: Record<string, number> = {};
  for (const m of season.matches) {
    const k = `${m.phase} | ${m.status ?? "-"} | ${m.stage ?? "-"}`;
    count[k] = (count[k] ?? 0) + 1;
  }
  console.table(count);
  for (const m of season.matches.slice(0, Number(process.argv[3] ?? 5)))
    console.log(m.date, m.homeId, `${m.homeGoals}-${m.awayGoals}`, m.awayId, m.phase, m.status ?? "", m.note ?? "");
})();
