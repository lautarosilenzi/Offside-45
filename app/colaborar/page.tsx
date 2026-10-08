import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { DONATION_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Colaborá · 126Goals" };

export default function DonatePage() {
  return (
    <>
      <PageHero eyebrow="Proyecto independiente" title="Colaborá con 126Goals">
        126Goals se hace a pulmón: cada partido, cada tabla y cada escudo se cargan y se revisan a mano. Con tu aporte podemos
        sumar resultados en vivo, más ligas y la app.
      </PageHero>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="panel p-6 text-center">
          {DONATION_URL ? (
            <a href={DONATION_URL} target="_blank" rel="noreferrer" className="shine inline-block rounded-full bg-brand-600 px-8 py-3 font-display text-xl font-bold uppercase tracking-wide text-white shadow-lg">
              Donar
            </a>
          ) : (
            <p className="text-navy-600">El link para donar va a estar disponible muy pronto. ¡Gracias por el apoyo!</p>
          )}
        </div>
      </main>
    </>
  );
}
