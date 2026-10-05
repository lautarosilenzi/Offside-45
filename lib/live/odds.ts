// Cuotas de apuestas que publica ESPN (de DraftKings), pasadas del formato estadounidense (+250 / -165) al decimal que
// se usa en la Argentina (3,50 / 1,61).
export type Odds = {
  provider: string;
  home?: number;
  draw?: number;
  away?: number;
  total?: number; // línea de goles (2,5)
  over?: number;
  under?: number;
};

export function americanToDecimal(v: unknown): number | undefined {
  const n = Number(String(v ?? "").replace(/^\+/, ""));
  if (!Number.isFinite(n) || n === 0) return undefined;
  const d = n > 0 ? 1 + n / 100 : 1 + 100 / Math.abs(n);
  return Math.round(d * 100) / 100;
}

const pick = (...vals: unknown[]) => vals.find((v) => v !== undefined && v !== null && v !== "");

// Acepta el formato del listado de partidos (moneyline.home.close.odds) y el del detalle (homeTeamOdds.moneyLine).
export function parseOdds(o: any): Odds | undefined {
  if (!o) return undefined;
  const odds: Odds = {
    provider: o.provider?.name ?? "",
    home: americanToDecimal(pick(o.moneyline?.home?.close?.odds, o.homeTeamOdds?.moneyLine, o.moneyline?.home?.open?.odds)),
    draw: americanToDecimal(pick(o.moneyline?.draw?.close?.odds, o.drawOdds?.moneyLine, o.moneyline?.draw?.open?.odds)),
    away: americanToDecimal(pick(o.moneyline?.away?.close?.odds, o.awayTeamOdds?.moneyLine, o.moneyline?.away?.open?.odds)),
    total: typeof o.overUnder === "number" ? o.overUnder : undefined,
    over: americanToDecimal(pick(o.total?.over?.close?.odds, o.overOdds)),
    under: americanToDecimal(pick(o.total?.under?.close?.odds, o.underOdds)),
  };
  return odds.home || odds.draw || odds.away ? odds : undefined;
}

export const fmtOdd = (n?: number) => (n ? n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "–");
