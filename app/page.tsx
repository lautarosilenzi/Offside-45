import HeadToHead from "@/components/HeadToHead";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Historial entre equipos</h1>
          <p className="mt-2 text-slate-600">
            Elegí dos equipos y mirá todos sus enfrentamientos, resultados y estadísticas.
          </p>
        </div>
        <HeadToHead />
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6">
        Datos: RSSSF (rsssf.org) y Wikipedia · Offside 45
      </footer>
    </>
  );
}
