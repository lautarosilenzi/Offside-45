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

Cargados y verificados:

- **Todos los campeonatos de Primera de la era amateur (1891–1930)**, incluidas las ligas paralelas de los dos cismas (1912–1914 y 1919–1926). Unos 10.000 partidos.
- **1931–1940**: la liga profesional y, hasta 1934, la liga amateur oficial en paralelo (la AFA cuenta los campeones de las dos); en 1936, la Copa de Honor, la Copa Campeonato y la Copa de Oro.
- **Todas las copas nacionales de Primera que reconoce la AFA hasta 1940**, con todos los clubes que las jugaron (también los de Rosario, Santa Fe, ascenso y los uruguayos invitados): Chevallier Boutell, Copa de Honor, Jockey Club, La Nación, Ibarguren, Copa de la Asociación Amateurs, Estímulo y Campeonato Porteño. 58 ediciones y 1.128 partidos.

- `lib/data/seasons/1891.ts` … `1896.ts`: escritas a mano.
- `lib/data/seasons/generated/*.json`: generadas desde [RSSSF](https://www.rsssf.org/tablesa/arghist.html) con el importador.
- `lib/data/amateur.ts`: los clásicos cargados a mano al principio. Los que ya están en una temporada o copa importada no se usan (mismo día y mismos equipos); `scripts/import/check-clasicos.ts` los compara.

### Importador

```bash
npx tsx scripts/import/build.ts 1927 1928   # o sin argumentos para todas
npx tsx scripts/import/build.ts copas      # todas las copas (o copa-honor, copa-jockey-club, …)
npm run verify:data                         # recalcula y verifica todas las tablas
```

`build.ts` lee la página de RSSSF (con caché en `.cache/`), traduce las notas, identifica los clubes (`aliases.ts`), aplica la configuración y las notas de cada torneo (`config.ts`) y **frena si la tabla calculada con los partidos no coincide con la publicada**. Además compara partidos y tabla con Wikipedia en español y reporta las diferencias.

En las copas (`config-cups.ts`) controla además: que la final la gane el campeón configurado y coincida con el índice de copas de RSSSF (otro documento), que ningún eliminado vuelva a jugar, que todos los clubes de la lista de participantes tengan partidos y, en las copas por grupos, que la tabla de cada grupo coincida con la publicada.

Criterios:
- Los partidos anulados, suspendidos sin definir o perdidos por ambos equipos se muestran pero no suman.
- Si un partido se definió por escritorio (`awardedTo`), cuenta el resultado oficial; los goles son los de la cancha (salvo que la tabla oficial no los cuente).
- Si falta el resultado de un partido (`scoreUnknown`), suman los puntos pero no los goles.
- Las diferencias de la tabla que no se pueden resolver con las fuentes quedan documentadas en `knownTableDiffs`; nunca se "corrige" un resultado por deducción sin decirlo.
- Si un partido se jugó y después se resolvió por escritorio (`goalsVoid`), se muestra el resultado de la cancha y sus goles no suman, como en las tablas de la época.
- Si una copa vieja no da el día de un partido, figura con el año solo: nunca se inventa una fecha. Cuando Wikipedia completa lo que falta (fecha o goles) y coincide con RSSSF en el ganador, se usa y se aclara en el partido.
- Los amistosos no se incluyen.

Próximo paso: 1941 en adelante, y después pasar los datos a Supabase.

## Deploy en Vercel

1. Importar el repo en https://vercel.com/new (detecta Next.js automáticamente).
2. Cuando se conecte Supabase, cargar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en *Settings → Environment Variables* (ver `.env.example`).
