import Link from "next/link";
import CompLogo from "@/components/CompLogo";
import LiveMatches from "@/components/live/LiveMatches";
import MyTeamCard from "@/components/myteam/MyTeamCard";
import { FEATURED } from "@/lib/competitions";
import { liveLeagues } from "@/lib/live/leagues";

const TZ = "America/Argentina/Buenos_Aires";

// Secciones especiales, abajo de los partidos.
const SPECIALS = [
  { href: "/historiales", title: "Historial entre equipos", text: "Todos los partidos oficiales entre dos clubes, desde 1891." },
  { href: "/messi-vs-cristiano", title: "Messi vs Cristiano", text: "Goles, títulos, finales y los partidos que jugaron entre ellos." },
  { href: "/jugadores", title: "Comparador de leyendas", text: "Las 25 leyendas del fútbol, cara a cara." },
  { href: "/campeones", title: "Campeones", text: "Todos los campeones del fútbol argentino." },
  { href: "/mundiales", title: "Mundiales", text: "Campeones, finales y estadísticas de cada Copa del Mundo." },
  { href: "/descensos", title: "Descensos", text: "Promedios y descensos de la Primera División." },
];

// Portada: mi equipo, los partidos del día (en vivo primero) y el acceso a los torneos y a las secciones especiales.
// El logo del encabezado lleva acá.
// Los links viejos del historial (/?a=river&b=boca) los redirige next.config.mjs a /historiales.
export default function Home() {
  // Hoy, en la hora de la Argentina (la página se vuelve a armar cada minuto).
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).replace(/-/g, "");
  const tournaments = FEATURED.filter((c) => c.href?.startsWith("/torneos/"));

  return (
    <>
      {/* Sin portada grande: lo primero es tu equipo y los partidos. */}
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6">
        <h1 className="sr-only">Offside 45 · Fútbol en vivo</h1>
        <MyTeamCard />

        <nav aria-label="Torneos destacados" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          {tournaments.map((c) => (
            <Link
              key={c.id}
              href={c.href!}
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-navy-800 ring-1 ring-navy-100 transition hover:ring-volt-400"
            >
              <CompLogo id={c.id} size={20} />
              {c.name}
            </Link>
          ))}
        </nav>

        <section>
          <h2 className="section-title mb-3">Partidos</h2>
          <LiveMatches leagues={liveLeagues()} date={today} />
        </section>

        <section>
          <h2 className="section-title mb-3">Especiales</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALS.map((s) => (
              <Link key={s.href} href={s.href} className="panel block px-4 py-3">
                <span className="block font-display text-lg font-bold uppercase tracking-wide text-navy-950">{s.title}</span>
                <span className="block text-sm text-navy-500">{s.text}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

// La página se vuelve a armar cada minuto para que "hoy" no quede viejo después de la medianoche.
export const revalidate = 60;
