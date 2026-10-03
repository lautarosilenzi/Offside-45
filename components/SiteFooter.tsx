import { existsSync } from "fs";
import Image from "next/image";
import Link from "next/link";
import { join } from "path";
import { DONATION_URL } from "@/lib/site";

// Logo completo (public/logo.png). Si todavía no está, va el nombre en texto.
const LOGO = existsSync(join(process.cwd(), "public", "logo.png")) ? "/logo.png" : undefined;

export default function SiteFooter() {
  return (
    <footer className="mt-16 space-y-3 px-3 pb-4 sm:px-6 sm:pb-6">
      <div className="donate-card mx-auto flex max-w-5xl flex-col items-start gap-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-navy-900 px-6 py-6 text-white shadow-[0_20px_50px_-25px_rgba(0,71,171,0.7)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-wide">¿Te sirve Offside 45?</p>
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
        <div className="flex items-center gap-3">
          {LOGO ? (
            <Image src={LOGO} alt="Offside 45" width={120} height={120} className="h-16 w-16 rounded-xl object-cover" />
          ) : null}
          <p>
            <span className="font-display font-bold uppercase tracking-wide text-white">Offside 45</span> · Fútbol, análisis y
            actualidad. Historia del fútbol argentino desde 1891.
          </p>
        </div>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/foro" className="text-white underline-offset-2 hover:underline">
            Foro del hincha
          </Link>
          <Link href="/creditos" className="text-white underline-offset-2 hover:underline">
            Fuentes y créditos
          </Link>
          <span>Datos: RSSSF y Wikipedia</span>
        </p>
      </div>
    </footer>
  );
}
