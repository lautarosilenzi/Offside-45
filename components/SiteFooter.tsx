import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, DONATION_URL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 space-y-3 px-3 pb-4 sm:px-6 sm:pb-6">
      <div className="donate-card mx-auto flex max-w-5xl flex-col items-start gap-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-navy-900 px-6 py-6 text-white shadow-[0_20px_50px_-25px_rgba(0,71,171,0.7)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-wide">¿Te sirve 126Goals?</p>
          <p className="mt-1 max-w-xl text-sm text-brand-100">
            Es un proyecto independiente: cada partido se carga y se verifica a mano. Si querés ayudar a que siga creciendo, podés
            colaborar con lo que quieras.
          </p>
        </div>
        <a
          href={DONATION_URL || "/colaborar"}
          {...(DONATION_URL ? { target: "_blank", rel: "noreferrer" } : {})}
          className="shine shrink-0 rounded-full bg-white px-6 py-2.5 font-display text-lg font-bold uppercase tracking-wide text-navy-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Colaborar
        </a>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-[2rem] bg-navy-950 px-6 py-6 text-sm text-navy-300 shadow-[0_20px_50px_-25px_rgba(7,15,32,0.6)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          {/* Logo de 126Goals (public/brand). */}
          <Image src="/brand/logo-horizontal.svg" alt="126Goals" width={147} height={50} className="h-12 w-auto" />
          <p>Fútbol en vivo, estadísticas e historia del fútbol argentino desde 1891.</p>
        </div>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/foro" className="text-white underline-offset-2 hover:underline">
            Foro del hincha
          </Link>
          <a href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "/creditos#contacto"} className="text-white underline-offset-2 hover:underline">
            Contacto
          </a>
          <Link href="/creditos" className="text-white underline-offset-2 hover:underline">
            Acerca de y créditos
          </Link>
        </p>
      </div>
    </footer>
  );
}
