"use client";

import { useState } from "react";

// Botones para cambiar de vista dentro de una pestaña (Zonas · Tabla anual · Promedios).
export default function Switch({ views }: { views: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(views[0].id);
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={active === v.id}
            onClick={() => setActive(v.id)}
            className={`btn-press rounded-full px-3.5 py-1.5 font-display text-sm font-semibold uppercase tracking-wide ring-1 transition ${
              active === v.id ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-navy-700 ring-navy-200 hover:ring-volt-400"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      {views.map((v) => (
        <div key={v.id} hidden={active !== v.id}>
          {v.content}
        </div>
      ))}
    </div>
  );
}
