import type { Metadata } from "next";
import Link from "next/link";
import CensusTable from "@/components/account/CensusTable";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Censo del Hincha · 126Goals",
  description: "¿Cuál es el club con más hinchas? El Censo del Hincha de 126Goals: cada cuenta elige un solo club, el suyo de verdad.",
};

export default function CensusPage() {
  return (
    <>
      <PageHero eyebrow="126Goals" title="Censo del Hincha">
        Cada cuenta elige un solo club, el suyo de verdad. Acá están los totales.
      </PageHero>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6">
        <CensusTable />
        <p className="text-center text-sm text-navy-500">
          ¿Todavía no te censaste?{" "}
          <Link href="/cuenta" className="font-semibold text-volt-600 underline">
            Creá tu cuenta y elegí tu club
          </Link>
          .
        </p>
      </main>
    </>
  );
}
