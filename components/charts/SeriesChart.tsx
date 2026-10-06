"use client";

import { useId, useState } from "react";

export type Series = {
  name: string;
  color: string;
  values: (number | null)[];
  // Texto del recuadro para cada punto (por ejemplo, la temporada y el club).
  details?: (string | undefined)[];
};

// Gráfico de barras agrupadas o de líneas, en SVG, con un solo eje. Al pasar el mouse (o tocar) una categoría,
// la marca y muestra el valor de cada serie. Leyenda arriba; las etiquetas del eje x se ralean si no entran.
export default function SeriesChart({
  labels,
  series,
  type = "bar",
  height = 260,
  unit = "",
  ariaLabel,
}: {
  labels: string[];
  series: Series[];
  type?: "bar" | "line";
  height?: number;
  unit?: string;
  ariaLabel: string;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = height;
  const pad = { top: 12, right: 8, bottom: 28, left: 34 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = Math.max(1, ...series.flatMap((s) => s.values.map((v) => v ?? 0)));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const n = labels.length;
  const band = innerW / n;
  const y = (v: number) => pad.top + innerH - (v / top) * innerH;
  const x = (i: number) => pad.left + band * i + band / 2;
  const every = Math.ceil(n / Math.floor(innerW / 44));
  const barGap = 2;
  const barW = Math.max(2, Math.min(18, (band - 6) / series.length - barGap));

  return (
    <figure className="relative">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-600">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y select-none"
        role="img"
        aria-label={ariaLabel}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} className="stroke-navy-100" strokeWidth={1} />
            <text x={pad.left - 6} y={y(t) + 4} textAnchor="end" className="fill-navy-400" fontSize={11}>
              {t}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % every === 0 ? (
            <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-navy-400" fontSize={11}>
              {l}
            </text>
          ) : null,
        )}
        {hover !== null && <rect x={pad.left + band * hover} y={pad.top} width={band} height={innerH} fill="#1f6bff" opacity={0.07} rx={4} />}

        {type === "bar"
          ? series.map((s, si) =>
              s.values.map((v, i) => {
                if (v === null || v === 0) return null;
                const left = x(i) - (series.length * (barW + barGap) - barGap) / 2 + si * (barW + barGap);
                const h = Math.max(1, (v / top) * innerH);
                return <path key={`${si}-${i}`} d={roundedTop(left, y(v), barW, h, Math.min(4, barW / 2))} fill={s.color} opacity={hover === null || hover === i ? 1 : 0.55} />;
              }),
            )
          : series.map((s, si) => {
              const pts = s.values.map((v, i) => (v === null ? null : [x(i), y(v)] as const));
              const d = pts.reduce((acc, p, i) => (p ? `${acc}${acc && pts[i - 1] ? "L" : "M"}${p[0]},${p[1]}` : acc), "");
              return (
                <g key={si}>
                  <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  {hover !== null && pts[hover] && <circle cx={pts[hover]![0]} cy={pts[hover]![1]} r={5} fill={s.color} className="stroke-white" strokeWidth={2} />}
                </g>
              );
            })}

        {/* Zonas para el mouse: toda la columna de cada categoría. */}
        {labels.map((_, i) => (
          <rect
            key={`hit-${i}`}
            x={pad.left + band * i}
            y={pad.top}
            width={band}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onClick={() => setHover(i)}
            aria-describedby={hover === i ? `${id}-tip` : undefined}
          />
        ))}
      </svg>
      {hover !== null && (
        <div
          id={`${id}-tip`}
          role="tooltip"
          className="pointer-events-none absolute top-8 z-10 min-w-[10rem] rounded-xl bg-navy-950/95 px-3 py-2 text-xs text-white shadow-xl"
          style={hover > n / 2 ? { right: `${((n - hover - 0.5) / n) * 100}%` } : { left: `${((hover + 0.5) / n) * 100}%` }}
        >
          <div className="mb-1 font-display text-sm font-bold uppercase tracking-wide">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.name} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="flex-1">
                {s.name}: <b className="tabular-nums">{s.values[hover] ?? "—"}</b>
                {s.values[hover] !== null && unit ? ` ${unit}` : ""}
                {s.details?.[hover] && <span className="block text-navy-300">{s.details[hover]}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

function niceStep(max: number) {
  const raw = max / 5;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow;
}

// Barra con las esquinas de arriba redondeadas y la base recta sobre el eje.
function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}
