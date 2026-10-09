import QIDS from "@/lib/data/clubs-wikidata.generated.json";

const UA = { "User-Agent": "126Goals/1.0 (https://126goals.vercel.app)" };

// Año de fundación del club (Wikidata, P571), por su número de ESPN. Se guarda un mes.
export async function foundedYear(espnTeamId: string): Promise<number | undefined> {
  const qid = (QIDS as Record<string, string>)[espnTeamId];
  if (!qid) return undefined;
  const r = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`, { headers: UA, next: { revalidate: 2592000 } });
  if (!r.ok) return undefined;
  const j = await r.json();
  const claim = j.entities?.[qid]?.claims?.P571?.find((c: any) => c.rank !== "deprecated");
  const time: string | undefined = claim?.mainsnak?.datavalue?.value?.time;
  const year = time ? Number(time.slice(1, 5)) : NaN;
  return year > 1800 && year < 2100 ? year : undefined;
}
