import type { Metadata } from "next";
import CupHistory from "@/components/CupHistory";
import LiveMatches from "@/components/live/LiveMatches";
import { seasonFinals } from "@/lib/cup-history";
import { liveLeagues } from "@/lib/live/leagues";

export const metadata: Metadata = { title: "Copa Sudamericana · 126Goals" };

export default function SudamericanaPage() {
  return (
    <CupHistory
      eyebrow="Conmebol · desde 2002"
      title="Copa Sudamericana"
      intro="Todos los campeones de la Copa Sudamericana, la segunda copa de clubes de la Conmebol, con el finalista de cada edición. Cada año lleva a su edición, con todos los partidos de los clubes argentinos."
      rows={seasonFinals("Copa Sudamericana")}
      logo="sudamericana"
      top={
        <section className="space-y-3">
          <p className="live-dot">En juego</p>
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-navy-950">Copa Sudamericana 2026</h2>
          <LiveMatches leagues={liveLeagues(["sudamericana"])} />
        </section>
      }
    />
  );
}
