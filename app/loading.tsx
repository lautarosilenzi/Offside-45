// Mientras se arma la página siguiente (algunas tardan unos segundos la primera vez): una barra que avanza arriba y
// placas grises en lugar del contenido, para que se note que el toque funcionó.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Cargando">
      <div className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden bg-volt-500/20">
        <div className="loading-bar h-full w-1/3 bg-volt-500" />
      </div>
      <div className="mx-auto max-w-5xl space-y-4 px-3 pt-4 sm:px-6 sm:pt-5">
        <div className="skeleton h-44 rounded-[2rem]" />
        <div className="skeleton h-24 rounded-3xl" />
        <div className="skeleton h-64 rounded-3xl" />
      </div>
    </div>
  );
}
