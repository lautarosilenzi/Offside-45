import type { Metadata } from "next";
import CupHistory from "@/components/CupHistory";
import { seasonFinals } from "@/lib/cup-history";

export const metadata: Metadata = { title: "Copa Sudamericana · Offside 45" };

export default function SudamericanaPage() {
  return (
    <CupHistory
      eyebrow="Conmebol · desde 2002"
      title="Copa Sudamericana"
      intro="Todos los campeones de la Copa Sudamericana, la segunda copa de clubes de la Conmebol, con el finalista de cada edición. Cada año lleva a su edición, con todos los partidos de los clubes argentinos."
      rows={seasonFinals("Copa Sudamericana")}
      logo="sudamericana"
    />
  );
}
