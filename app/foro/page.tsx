import type { Metadata } from "next";
import ForoBoard, { type Topic } from "@/components/ForoBoard";
import ForoLogo from "@/components/ForoLogo";
import { winnerOf } from "@/lib/matches";
import { SEASONS, seasonLabel } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "El foro del hincha · 126Goals" };

// Temas del foro: los últimos partidos de los torneos que se están jugando ("Ganó Boca vs Unión").
function topics(): Topic[] {
  const live = SEASONS.filter((s) => s.inProgress);
  const matches = live
    .flatMap((s) => s.matches.map((m) => ({ m, s })))
    .filter(({ m }) => m.date.length === 10)
    .sort((a, b) => b.m.date.localeCompare(a.m.date))
    .slice(0, 16);
  return matches.map(({ m, s }) => {
    const home = getTeam(m.homeId)!;
    const away = getTeam(m.awayId)!;
    const w = winnerOf(m);
    const title =
      w === null
        ? `Empataron ${home.name} y ${away.name}`
        : `Ganó ${getTeam(w)!.name} vs ${w === m.homeId ? away.name : home.name}`;
    return {
      id: m.id,
      title,
      score: `${home.name} ${m.homeGoals}-${m.awayGoals} ${away.name}`,
      competition: s.kind === "cup" ? s.title : `Liga Argentina ${seasonLabel(s)}`,
      date: m.date,
      homeId: m.homeId,
      awayId: m.awayId,
    };
  });
}

export default function ForoPage() {
  return (
    <>
      <section className="mx-auto mt-6 max-w-5xl px-3 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a2a6b] via-[#0d47b5] to-[#1d8bff] px-6 py-8 text-white shadow-[0_20px_40px_-20px_rgba(10,26,63,0.8)] sm:px-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <ForoLogo size={64} className="foro-logo shrink-0 rounded-2xl ring-2 ring-blue-400/40" />
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Opiná, discutí, bancá</p>
              <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">El foro del hincha</h1>
            </div>
          </div>
          <p className="relative mt-4 max-w-2xl text-blue-100">
            Cada partido abre su debate. Elegí uno, escribí lo que te pareció y respondé a los otros hinchas. Los mensajes con más me gusta
            quedan arriba de todo.
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-5xl px-3 py-6 sm:px-6">
        <ForoBoard topics={topics()} />
      </main>
    </>
  );
}
