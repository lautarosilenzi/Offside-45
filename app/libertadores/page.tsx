import type { Metadata } from "next";
import CupHistory from "@/components/CupHistory";
import { seasonFinals } from "@/lib/cup-history";

export const metadata: Metadata = { title: "Copa Libertadores · Offside 45" };

export default function LibertadoresPage() {
  return (
    <CupHistory
      eyebrow="Conmebol · desde 1960"
      title="Copa Libertadores"
      intro="Todos los campeones de la Copa Libertadores de América (hasta 1964, Copa de Campeones de América), con el finalista de cada edición. Cada año lleva a su edición, con todos los partidos de los clubes argentinos."
      rows={seasonFinals("Copa Libertadores")}
      logo="libertadores"
    />
  );
}
