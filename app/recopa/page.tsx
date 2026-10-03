import type { Metadata } from "next";
import CupHistory from "@/components/CupHistory";
import { recopaFinals } from "@/lib/cup-history";

export const metadata: Metadata = { title: "Recopa Sudamericana · Offside 45" };

export default function RecopaPage() {
  return (
    <CupHistory
      eyebrow="Conmebol · desde 1989"
      title="Recopa Sudamericana"
      intro="Todos los campeones de la Recopa Sudamericana: el campeón de la Libertadores contra el de la Supercopa (hasta 1998) o el de la Sudamericana (desde 2003). No se jugó entre 1999 y 2002."
      rows={recopaFinals()}
      logo="recopa"
      footer="Las ediciones con un club argentino llevan a sus partidos. Datos de Wikipedia, controlados con las ediciones cargadas desde RSSSF."
    />
  );
}
