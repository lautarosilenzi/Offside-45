# Offside 45

App web de fútbol argentino. Primera funcionalidad: **historial entre equipos** (partidos, resultados, competencia y estadísticas).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (color principal `#0047AB`, token `brand-500`)
- Supabase (cliente preparado en `lib/supabase.ts`, todavía sin uso)
- Deploy en Vercel

## Desarrollo

```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

## Datos

Cargados y verificados: **todos los campeonatos de Primera de la era amateur (1891–1930)**, incluidas las ligas paralelas de los dos cismas (1912–1914 y 1919–1926). Unos 10.000 partidos.

- `lib/data/seasons/1891.ts` … `1896.ts`: escritas a mano.
- `lib/data/seasons/generated/*.json`: generadas desde [RSSSF](https://www.rsssf.org/tablesa/arghist.html) con el importador.
- `lib/data/amateur.ts`: partidos de copas nacionales de los tres clásicos hasta 1930 (las copas del resto de los clubes todavía no están).

### Importador

```bash
npx tsx scripts/import/build.ts 1927 1928   # o sin argumentos para todas
npm run verify:data                         # recalcula y verifica todas las tablas
```

`build.ts` lee la página de RSSSF (con caché en `.cache/`), traduce las notas, identifica los clubes (`aliases.ts`), aplica la configuración y las notas de cada torneo (`config.ts`) y **frena si la tabla calculada con los partidos no coincide con la publicada**. Además compara partidos y tabla con Wikipedia en español y reporta las diferencias.

Criterios:
- Los partidos anulados, suspendidos sin definir o perdidos por ambos equipos se muestran pero no suman.
- Si un partido se definió por escritorio (`awardedTo`), cuenta el resultado oficial; los goles son los de la cancha (salvo que la tabla oficial no los cuente).
- Si falta el resultado de un partido (`scoreUnknown`), suman los puntos pero no los goles.
- Las diferencias de la tabla que no se pueden resolver con las fuentes quedan documentadas en `knownTableDiffs`; nunca se "corrige" un resultado por deducción sin decirlo.
- Los amistosos no se incluyen.

Próximo paso: el profesionalismo (1931 en adelante), las copas nacionales de todos los clubes, y después pasar los datos a Supabase.

## Deploy en Vercel

1. Importar el repo en https://vercel.com/new (detecta Next.js automáticamente).
2. Cuando se conecte Supabase, cargar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en *Settings → Environment Variables* (ver `.env.example`).
