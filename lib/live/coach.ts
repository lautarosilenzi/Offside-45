// Director técnico actual de un club. ESPN lo publica desactualizado (en octubre de 2026 seguía mostrando a Ischia en
// Boca), así que se consulta en tres fuentes: Wikidata (entrenador sin fecha de fin), la Wikipedia en español
// (|entrenador=) y en inglés (|manager=). Se muestra solo si al menos dos coinciden; si no, no se muestra nada.
// Se renueva cada 6 horas.
import QIDS from "@/lib/data/clubs-wikidata.generated.json";

const UA = { "User-Agent": "126Goals/1.0 (https://126goals.vercel.app)" };
const REVALIDATE = 21600;

async function get(url: string) {
  const r = await fetch(url, { headers: UA, next: { revalidate: REVALIDATE } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

// Para comparar: sin tildes, sin aclaraciones ("(interino)") y solo el apellido (Wikidata dice "Jadson Viera Castro" y
// Wikipedia "Jadson Viera").
const words = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, "")
    .split(/[^a-z]+/)
    .filter((w) => w.length > 2);
const same = (a: string, b: string) => {
  const A = words(a);
  const B = words(b);
  return A.length > 0 && B.length > 0 && (B.includes(A[A.length - 1]) || A.includes(B[B.length - 1]));
};

// Valor de un campo del infobox, sin referencias, plantillas ni enlaces.
function infobox(text: string, fields: string[]): string | undefined {
  const m = text.match(new RegExp(`\\|\\s*(?:${fields.join("|")})\\s*=([^\\n]*)`, "i"));
  if (!m) return undefined;
  const v = m[1]
    .replace(/<ref[\s\S]*?(<\/ref>|\/>)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/'{2,}/g, "")
    .trim();
  return v || undefined;
}

async function wikitext(lang: string, title?: string) {
  if (!title) return "";
  const j = await get(
    `https://${lang}.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=${encodeURIComponent(title)}`,
  );
  return (j.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content as string) ?? "";
}

export async function currentCoach(espnTeamId: string): Promise<string | undefined> {
  const qid = (QIDS as Record<string, string>)[espnTeamId];
  if (!qid) return undefined;
  const e = (await get(`https://www.wikidata.org/w/api.php?format=json&action=wbgetentities&props=claims|sitelinks&ids=${qid}`)).entities?.[qid];
  if (!e) return undefined;

  const current: string[] = (e.claims?.P286 ?? [])
    .filter((c: any) => c.rank !== "deprecated" && !c.qualifiers?.P582)
    .map((c: any) => c.mainsnak?.datavalue?.value?.id)
    .filter(Boolean);
  const [wd, es, en] = await Promise.all([
    current.length
      ? get(`https://www.wikidata.org/w/api.php?format=json&action=wbgetentities&props=labels&languages=es|en&ids=${current.join("|")}`).then(
          (j) => Object.values(j.entities ?? {}).map((x: any) => (x.labels?.es ?? x.labels?.en)?.value as string),
        )
      : Promise.resolve([] as string[]),
    wikitext("es", e.sitelinks?.eswiki?.title).then((t) => infobox(t, ["entrenador", "director técnico", "director_técnico"])),
    wikitext("en", e.sitelinks?.enwiki?.title).then((t) => infobox(t, ["manager", "head_coach", "coach"])),
  ]);

  // Se muestra el nombre de la Wikipedia en español (con "(interino)" si lo dice), si otra fuente coincide; si no, el de
  // la inglesa si coincide con Wikidata.
  if (es && (same(es, en ?? "") || wd.some((w) => same(es, w)))) return es.replace(/\(\s*interino\s*\)/i, "(interino)");
  if (en && wd.some((w) => same(en, w))) return en;
  return undefined;
}
