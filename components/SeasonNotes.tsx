import type { NoteKind, SeasonNote } from "@/lib/types";

export const NOTE_KINDS: Record<NoteKind, { label: string; className: string }> = {
  formato: { label: "Formato", className: "bg-brand-50 text-brand-700 ring-brand-100" },
  descalificacion: { label: "Descalificación", className: "bg-red-50 text-red-700 ring-red-200" },
  retiro: { label: "Retiro", className: "bg-orange-50 text-orange-700 ring-orange-200" },
  anulado: { label: "Partido anulado", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  walkover: { label: "No presentación", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  puntos: { label: "Puntos / título", className: "bg-violet-50 text-violet-700 ring-violet-200" },
  identidad: { label: "Nombres de clubes", className: "bg-slate-100 text-slate-700 ring-slate-200" },
  fuentes: { label: "Diferencias entre fuentes", className: "bg-slate-100 text-slate-700 ring-slate-200" },
  dato: { label: "Dato", className: "bg-slate-100 text-slate-700 ring-slate-200" },
};

export function NoteTag({ kind }: { kind: NoteKind }) {
  const k = NOTE_KINDS[kind];
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${k.className}`}>
      {k.label}
    </span>
  );
}

export default function SeasonNotes({ notes }: { notes: SeasonNote[] }) {
  return (
    <ul className="space-y-3">
      {notes.map((n) => (
        <li key={n.text} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
          <span className="sm:w-44 sm:shrink-0">
            <NoteTag kind={n.kind} />
          </span>
          <p className="text-sm leading-relaxed text-slate-600">{n.text}</p>
        </li>
      ))}
    </ul>
  );
}
