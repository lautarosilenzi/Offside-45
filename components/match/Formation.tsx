import Link from "next/link";
import type { Lineup, LineupPlayer } from "@/lib/live/espn";

// Qué tan adelantado juega cada posición que informa ESPN (arquero 0 … delantero 4) y de qué lado (-1 izquierda,
// 1 derecha). Con eso se reparten los titulares en las líneas del esquema (4-2-3-1 → 4, 2, 3 y 1) y se ordenan de
// izquierda a derecha dentro de cada línea.
function depth(pos: string) {
  const p = pos.toUpperCase();
  if (p === "G" || p === "GK") return 0;
  if (p === "SW") return 0.9;
  if (/^(CD|CB|LB|RB|D)(-|$)/.test(p)) return 1;
  if (/WB/.test(p)) return 1.4;
  if (/^DM/.test(p)) return 1.8;
  if (/^(CM|LM|RM|M)(-|$)/.test(p)) return 2;
  if (/^AM/.test(p)) return 3;
  if (/^(LW|RW)/.test(p)) return 3.4;
  return 4; // F, CF, ST, LF, RF, SS
}
// Laterales y extremos (LB, LM, LW, LF, LWB) bien afuera (±2); los centrales corridos a un lado (CD-L, AM-R…), ±1.
function side(pos: string) {
  const p = pos.toUpperCase();
  if (/^L(B|M|F|W|WB)$/.test(p)) return -2;
  if (/^R(B|M|F|W|WB)$/.test(p)) return 2;
  if (/-L$/.test(p)) return -1;
  if (/-R$/.test(p)) return 1;
  return 0;
}

export function arrange(l: Lineup): LineupPlayer[][] | null {
  const lines = (l.formation ?? "").split("-").map(Number).filter((n) => n > 0);
  const starters = l.starters;
  if (starters.length !== 11 || lines.reduce((a, b) => a + b, 0) !== 10) return null;
  const gk = starters.find((p) => depth(p.position) === 0) ?? starters[0];
  const outfield = starters.filter((p) => p !== gk).sort((a, b) => depth(a.position) - depth(b.position) || (a.place ?? 0) - (b.place ?? 0));
  const rows: LineupPlayer[][] = [[gk]];
  let i = 0;
  for (const n of lines) {
    rows.push(outfield.slice(i, i + n).sort((a, b) => side(a.position) - side(b.position) || (a.place ?? 0) - (b.place ?? 0)));
    i += n;
  }
  return rows;
}

// Apellido para mostrar en la cancha: la última palabra, con sus partículas ("Di María", "De la Cruz", "van Dijk").
const lastName = (name: string) => {
  const parts = name.split(" ");
  let i = parts.length - 1;
  while (i > 1 && /^(de|di|da|del|la|las|los|van|von|der|dos|das|do|le|el|mac|al)$/i.test(parts[i - 1])) i--;
  return parts.length > 1 ? parts.slice(i).join(" ") : name;
};

// Media cancha con los titulares en su esquema (el arco propio abajo). Si el esquema no cierra, la lista.
// Con onPlayer, tocar un jugador abre su ficha del partido; si no, lleva a su perfil.
export default function Formation({ lineup, color, onPlayer }: { lineup: Lineup; color: string; onPlayer?: (id: string) => void }) {
  const rows = arrange(lineup);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="font-display text-base font-bold uppercase tracking-wide text-navy-950">{lineup.team.name}</span>
        {lineup.formation && <span className="rounded-full bg-navy-950 px-2 py-0.5 font-display text-xs font-bold text-white">{lineup.formation}</span>}
      </div>
      {rows ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 p-2" style={{ aspectRatio: "3 / 3.4" }}>
          {/* Líneas de la cancha */}
          <svg viewBox="0 0 100 113" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden>
            <rect x="3" y="3" width="94" height="107" fill="none" stroke="#fff" strokeWidth="0.6" />
            <line x1="3" y1="3" x2="97" y2="3" stroke="#fff" strokeWidth="0.6" />
            <path d="M38 3 A12 12 0 0 0 62 3" fill="none" stroke="#fff" strokeWidth="0.6" />
            <rect x="22" y="88" width="56" height="22" fill="none" stroke="#fff" strokeWidth="0.6" />
            <rect x="37" y="102" width="26" height="8" fill="none" stroke="#fff" strokeWidth="0.6" />
          </svg>
          <div className="relative flex h-full flex-col-reverse justify-between py-1">
            {rows.map((row, r) => (
              <div key={r} className="flex justify-around">
                {row.map((p) => (
                  <PlayerLink key={p.name} p={p} onPlayer={onPlayer} className="flex w-16 flex-col items-center text-center hover:opacity-80 sm:w-20">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white font-display text-xs font-bold text-white shadow" style={{ background: color }}>
                      {p.number ?? ""}
                    </span>
                    <span className="on-dark mt-0.5 line-clamp-1 rounded bg-navy-950/60 px-1 text-[0.65rem] font-semibold leading-tight text-white">
                      {lastName(p.name)}
                      {p.subbedOut && " ↓"}
                    </span>
                  </PlayerLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-1 text-sm">
          {lineup.starters.map((p) => (
            <li key={p.name} className="flex gap-2">
              <span className="w-6 text-right font-display font-bold text-navy-400">{p.number}</span>
              <PlayerLink p={p} onPlayer={onPlayer} className="hover:text-volt-600 hover:underline">
                {p.name}
              </PlayerLink>
            </li>
          ))}
        </ul>
      )}
      {lineup.subs.length > 0 && (
        <details className="mt-2 text-sm">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-navy-500">Suplentes ({lineup.subs.length})</summary>
          <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
            {lineup.subs.map((p) => (
              <li key={p.name} className="flex gap-2 text-navy-700">
                <span className="w-6 text-right font-display font-bold text-navy-400">{p.number}</span>
                <PlayerLink p={p} onPlayer={onPlayer} className="truncate hover:text-volt-600 hover:underline">
                  {p.name}
                  {p.subbedIn && <span className="text-emerald-600"> ↑</span>}
                </PlayerLink>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

// Nombre de un jugador: abre su ficha del partido o lleva a su perfil, si ESPN da su número.
function PlayerLink({ p, onPlayer, className, children }: { p: LineupPlayer; onPlayer?: (id: string) => void; className?: string; children: React.ReactNode }) {
  if (p.id && onPlayer)
    return (
      <button type="button" onClick={() => onPlayer(p.id!)} className={className}>
        {children}
      </button>
    );
  return p.id ? (
    <Link href={`/jugador/${p.id}`} className={className}>
      {children}
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}
