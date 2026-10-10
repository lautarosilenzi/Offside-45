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
// Con onPlayer, tocar un jugador abre su ficha del partido; si no, lleva a su perfil. Con photos, cada jugador va con
// su foto (y el número en una placa); sin foto, su número sobre el color del equipo.
export default function Formation({
  lineup,
  color,
  ink = "#ffffff",
  photos,
  onPlayer,
}: {
  lineup: Lineup;
  color: string;
  ink?: string;
  photos?: Record<string, { url: string }>;
  onPlayer?: (id: string) => void;
}) {
  const rows = arrange(lineup);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="font-display text-base font-bold uppercase tracking-wide text-navy-950">{lineup.team.name}</span>
        {lineup.formation && <span className="rounded-full bg-navy-950 px-2 py-0.5 font-display text-xs font-bold text-white">{lineup.formation}</span>}
      </div>
      {rows ? (
        // La cancha crece con lo que necesite (apellidos en dos renglones): nunca corta al arquero ni a los de las puntas.
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 px-2 pb-3 pt-2">
          {/* Líneas de la cancha */}
          <svg viewBox="0 0 100 113" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden>
            <rect x="3" y="3" width="94" height="107" fill="none" stroke="#fff" strokeWidth="0.6" />
            <line x1="3" y1="3" x2="97" y2="3" stroke="#fff" strokeWidth="0.6" />
            <path d="M38 3 A12 12 0 0 0 62 3" fill="none" stroke="#fff" strokeWidth="0.6" />
            <rect x="22" y="88" width="56" height="22" fill="none" stroke="#fff" strokeWidth="0.6" />
            <rect x="37" y="102" width="26" height="8" fill="none" stroke="#fff" strokeWidth="0.6" />
          </svg>
          <div className="relative flex min-h-[23rem] flex-col-reverse justify-between gap-3 py-1 sm:min-h-[26rem]">
            {rows.map((row, r) => (
              <div key={r} className="flex justify-around">
                {row.map((p) => (
                  <PlayerLink key={p.name} p={p} onPlayer={onPlayer} className="flex min-w-0 max-w-[5.5rem] flex-1 flex-col items-center px-0.5 text-center hover:opacity-80">
                    {p.id && photos?.[p.id] ? (
                      <span className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element -- foto de ESPN o de Wikimedia Commons */}
                        <img src={photos[p.id].url} alt="" loading="lazy" className="h-9 w-9 rounded-full border-2 border-white bg-white object-cover object-top shadow sm:h-10 sm:w-10" />
                        <span
                          className="absolute -bottom-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 font-display text-[0.6rem] font-bold leading-none shadow"
                          style={{ background: color, color: ink }}
                        >
                          {p.number ?? ""}
                        </span>
                      </span>
                    ) : (
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white font-display text-sm font-bold shadow sm:h-10 sm:w-10"
                        style={{ background: color, color: ink }}
                      >
                        {p.number ?? ""}
                      </span>
                    )}
                    <span className="on-dark mt-1 max-w-full whitespace-normal rounded bg-navy-950/70 px-1 py-px text-[0.68rem] font-semibold leading-[1.15] text-white [overflow-wrap:anywhere] sm:text-xs">
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
                <PlayerLink p={p} onPlayer={onPlayer} className="min-w-0 hover:text-volt-600 hover:underline">
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
