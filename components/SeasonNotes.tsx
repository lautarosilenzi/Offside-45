import type { NoteKind, SeasonNote } from "@/lib/types";

export const NOTE_KINDS: Record<NoteKind, { label: string; className: string }> = {
  formato: { label: "Formato", className: "bg-navy-100 text-navy-700" },
  descalificacion: { label: "Descalificación", className: "bg-red-100 text-red-800" },
  retiro: { label: "Retiro", className: "bg-orange-100 text-orange-800" },
  anulado: { label: "Partido anulado", className: "bg-amber-100 text-amber-800" },
  walkover: { label: "No presentación", className: "bg-amber-100 text-amber-800" },
  puntos: { label: "Título", className: "bg-brand-100 text-brand-800" },
  identidad: { label: "Nombres de clubes", className: "bg-navy-100 text-navy-700" },
  fuentes: { label: "Fuentes", className: "bg-navy-100 text-navy-700" },
  dato: { label: "Dato", className: "bg-navy-100 text-navy-700" },
};

export function NoteTag({ kind }: { kind: NoteKind }) {
  const k = NOTE_KINDS[kind];
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${k.className}`}
    >
      {k.label}
    </span>
  );
}

export default function SeasonNotes({ notes }: { notes: SeasonNote[] }) {
  return (
    <ul className="divide-y divide-navy-100">
      {notes.map((n) => (
        <li key={n.text} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="sm:w-40 sm:shrink-0">
            <NoteTag kind={n.kind} />
          </span>
          <p className="text-sm leading-relaxed text-navy-700">{n.text}</p>
        </li>
      ))}
    </ul>
  );
}
