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

Los partidos están en `lib/data/` y cada uno indica sus fuentes. Por ahora está cargada y verificada la **era amateur (1913–1930)** de River vs Boca, Racing vs Independiente y San Lorenzo vs Huracán: liga y copas nacionales oficiales (Copa de Competencia, Copa de Honor), cruzando [RSSSF](https://www.rsssf.org/tablesa/arghist.html) con Wikipedia. Las diferencias entre fuentes están explicadas en el campo `note` de cada partido.

Criterios:
- Los partidos de torneos anulados (AAF 1919) se muestran pero no suman en las estadísticas.
- Si un partido se ganó por escritorio (`awardedTo`), cuenta el resultado oficial; los goles son los de la cancha.
- Los amistosos no se incluyen.

Próximo paso: el profesionalismo (1931 en adelante), después pasar los datos a una tabla de Supabase.

## Deploy en Vercel

1. Importar el repo en https://vercel.com/new (detecta Next.js automáticamente).
2. Cuando se conecte Supabase, cargar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en *Settings → Environment Variables* (ver `.env.example`).
