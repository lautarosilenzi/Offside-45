import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 px-3 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 rounded-[2rem] bg-navy-950 px-6 py-7 text-sm text-navy-300 shadow-[0_20px_50px_-25px_rgba(7,15,32,0.6)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          <span className="font-display font-bold uppercase tracking-wide text-white">Offside 45</span> · Historia del
          fútbol argentino desde 1891
        </p>
        <p>
          Datos: RSSSF y Wikipedia ·{" "}
          <Link href="/creditos" className="rounded-full text-white underline-offset-2 hover:underline">
            Fuentes y créditos
          </Link>
        </p>
      </div>
    </footer>
  );
}
