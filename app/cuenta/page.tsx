import type { Metadata } from "next";
import AccountForm from "@/components/AccountForm";
import PageHero from "@/components/PageHero";
import { TEAM_IDS_WITH_MATCHES } from "@/lib/matches";
import { LEAGUE_SEASONS } from "@/lib/seasons";
import { HISTORIC_TEAMS, TEAMS, getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Mi cuenta · 126Goals" };

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "es");

export default function AccountPage() {
  // Clubes del fútbol argentino: los que juegan hoy la Primera (el último torneo de liga cargado) y después el resto que
  // jugó algún partido cargado en el sitio.
  const current = LEAGUE_SEASONS[LEAGUE_SEASONS.length - 1];
  const ids = new Set(current.matches.flatMap((m) => [m.homeId, m.awayId]));
  const primera = [...ids].map((id) => getTeam(id)!).sort(byName).map((t) => ({ id: t.id, name: t.name }));
  const otros = [...TEAMS, ...HISTORIC_TEAMS]
    .filter((t) => !ids.has(t.id) && TEAM_IDS_WITH_MATCHES.has(t.id))
    .sort(byName)
    .map((t) => ({ id: t.id, name: t.name }));
  return (
    <>
      <PageHero eyebrow="Sumate a 126Goals" title="Mi cuenta">
        Creá tu usuario, contanos de qué club sos hincha y participá en el foro.
      </PageHero>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AccountForm primera={primera} otros={otros} />
      </main>
    </>
  );
}
