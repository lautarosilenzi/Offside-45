import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { DONATION_LINKS, DONATION_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Colaborá · 126Goals" };

export default function DonatePage() {
  const links = DONATION_LINKS.filter((l) => l.url);
  return (
    <>
      <PageHero eyebrow="Proyecto independiente" title="Colaborá con 126Goals">
        126Goals se hace a pulmón: cada partido, cada tabla y cada escudo se cargan y se revisan a mano. Con tu aporte podemos
        sumar resultados en vivo, más ligas y la app.
      </PageHero>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="panel p-6 text-center">
          {links.length > 0 || DONATION_URL ? (
            <div className="space-y-4">
              <p className="text-navy-600">Elegí con cuánto querés colaborar. El pago es por Mercado Pago, seguro y sin crear cuenta en 126Goals.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {links.map((l) => (
                  <a key={l.amount} href={l.url} target="_blank" rel="noreferrer" className="shine inline-block rounded-full bg-brand-600 px-7 py-3 font-display text-xl font-bold uppercase tracking-wide text-white shadow-lg">
                    {l.amount}
                  </a>
                ))}
                {DONATION_URL && (
                  <a href={DONATION_URL} target="_blank" rel="noreferrer" className="inline-block rounded-full px-7 py-3 font-display text-xl font-bold uppercase tracking-wide text-navy-900 ring-2 ring-brand-500">
                    Otro monto
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-navy-600">El link para donar va a estar disponible muy pronto. ¡Gracias por el apoyo!</p>
          )}
        </div>
      </main>
    </>
  );
}
