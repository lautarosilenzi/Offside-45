import type { Metadata } from "next";
import CupHistory from "@/components/CupHistory";
import LiveMatches from "@/components/live/LiveMatches";
import { seasonFinals } from "@/lib/cup-history";
import { liveLeagues } from "@/lib/live/leagues";

export const metadata: Metadata = { title: "Copa Libertadores · 126Goals" };

export default function LibertadoresPage() {
  return (
    <CupHistory
      eyebrow="Conmebol · desde 1960"
      title="Copa Libertadores"
      intro="Todos los campeones de la Copa Libertadores de América (hasta 1964, Copa de Campeones de América), con el finalista de cada edición. Cada año lleva a su edición, con todos los partidos de los clubes argentinos."
      rows={seasonFinals("Copa Libertadores")}
      logo="libertadores"
      top={
        <section className="space-y-3">
          <p className="live-dot">En juego</p>
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-navy-950">Copa Libertadores 2026</h2>
          <LiveMatches leagues={liveLeagues(["libertadores"])} />
        </section>
      }
    />
  );
}
