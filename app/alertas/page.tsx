import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AlertsManager from "@/components/match/AlertsManager";

export const metadata: Metadata = { title: "Alertas · Offside 45" };

export default function AlertsPage() {
  return (
    <>
      <PageHero eyebrow="Tus partidos" title="Alertas">
        Elegí de qué querés que te avisemos en cada partido que seguís: goles, tarjetas, faltas, córners, cambios, penales, VAR, el comienzo, el
        entretiempo y el final.
      </PageHero>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <AlertsManager />
      </main>
    </>
  );
}
