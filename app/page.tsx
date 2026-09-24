import HeadToHead from "@/components/HeadToHead";
import PageHero from "@/components/PageHero";

export default function Home() {
  return (
    <>
      <PageHero eyebrow="Cara a cara" title="Historial entre equipos">
        Elegí dos equipos y mirá todos sus enfrentamientos oficiales, resultados y estadísticas.
      </PageHero>
      <main className="mx-auto -mt-px max-w-5xl px-4 py-8 sm:px-6">
        <HeadToHead />
      </main>
    </>
  );
}
