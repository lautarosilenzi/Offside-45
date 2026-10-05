"use client";

import { useEffect, useState } from "react";

// Pestañas de la página de un torneo (Fixture y tablas · Equipos y estadísticas · Campeones). El contenido de las tres
// viene armado del servidor; acá solo se elige cuál se ve. La pestaña queda en la dirección (#equipos) para compartirla.
export default function HubTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  return (
    <div>
      <div role="tablist" className="mb-5 grid grid-cols-3 border-b border-navy-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => {
              setActive(t.id);
              history.replaceState(null, "", `#${t.id}`);
            }}
            className={`-mb-px border-b-2 px-2 py-3 text-center font-display text-sm font-bold uppercase tracking-wide transition sm:text-lg ${
              active === t.id ? "border-volt-500 text-volt-600" : "border-transparent text-navy-700 hover:text-navy-950"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
