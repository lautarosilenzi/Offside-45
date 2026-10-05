// API-Football (api-sports.io): los torneos argentinos que ESPN no publica (Federal A, Promocional Amateur, Reserva,
// Femenino…). La clave está en la variable de entorno API_FOOTBALL_KEY (Vercel → Settings → Environment Variables) y
// nunca llega al navegador. El plan gratis permite 100 consultas por día: todo se guarda en caché.
const BASE = "https://v3.football.api-sports.io";

export const hasApiFootball = () => !!process.env.API_FOOTBALL_KEY;

export async function apiFootball<T = any>(path: string, revalidate: number): Promise<T> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("Falta API_FOOTBALL_KEY");
  const r = await fetch(`${BASE}${path}`, { headers: { "x-apisports-key": key }, next: { revalidate } });
  if (!r.ok) throw new Error(`API-Football ${r.status}`);
  const j = await r.json();
  // La API responde 200 aun con errores (clave inválida, cupo agotado): vienen en "errors".
  const errors = j.errors && (Array.isArray(j.errors) ? j.errors : Object.values(j.errors));
  if (errors?.length) throw new Error(`API-Football: ${errors.join(", ")}`);
  return j as T;
}

export type AfLeague = { id: number; name: string; type: string; season?: number; start?: string; end?: string; logo?: string; coverage?: Record<string, unknown> };

// Competencias de un país con su temporada en curso (una sola consulta, guardada un día).
export async function countryLeagues(country: string): Promise<AfLeague[]> {
  const j = await apiFootball<{ response: any[] }>(`/leagues?country=${encodeURIComponent(country)}`, 86400);
  return j.response.map((x) => {
    const current = (x.seasons ?? []).find((s: any) => s.current) ?? (x.seasons ?? []).at(-1);
    return {
      id: x.league.id,
      name: x.league.name,
      type: x.league.type,
      logo: x.league.logo,
      season: current?.year,
      start: current?.start,
      end: current?.end,
      coverage: current?.coverage,
    };
  });
}
