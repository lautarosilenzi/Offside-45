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

Por ahora los partidos están hardcodeados en `lib/matches.ts` (River vs Boca, Racing vs Independiente, San Lorenzo vs Huracán) y son datos de ejemplo. El próximo paso es moverlos a una tabla de Supabase.

## Deploy en Vercel

1. Importar el repo en https://vercel.com/new (detecta Next.js automáticamente).
2. Cuando se conecte Supabase, cargar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en *Settings → Environment Variables* (ver `.env.example`).
