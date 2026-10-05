// Promedios del descenso de la Liga Profesional 2026: puntos de las dos temporadas anteriores (ya terminadas), de la tabla
// "Relegation based on coefficients" de Wikipedia (2026 AFA Liga Profesional de Fútbol). Los puntos de 2026 se calculan en vivo
// con los partidos de ESPN (se verificó que coinciden con Wikipedia para los 30 clubes). Partidos: 41 en 2024 (Copa de la Liga
// + Liga) y 32 en 2025 (Apertura + Clausura), sin contar los playoffs. null = no jugó esa temporada en Primera.
export const PROMEDIOS_BASE: { espnId: string; name: string; p2024: number | null; p2025: number | null }[] = [
 {
  "espnId": "5",
  "name": "Boca Juniors",
  "p2024": 67,
  "p2025": 62
 },
 {
  "espnId": "16",
  "name": "River Plate",
  "p2024": 70,
  "p2025": 53
 },
 {
  "espnId": "21",
  "name": "Vélez Sarsfield",
  "p2024": 76,
  "p2025": 40
 },
 {
  "espnId": "3",
  "name": "Argentinos Juniors",
  "p2024": 56,
  "p2025": 57
 },
 {
  "espnId": "17",
  "name": "Rosario Central",
  "p2024": 47,
  "p2025": 66
 },
 {
  "espnId": "15",
  "name": "Racing",
  "p2024": 70,
  "p2025": 53
 },
 {
  "espnId": "11",
  "name": "Independiente",
  "p2024": 63,
  "p2025": 47
 },
 {
  "espnId": "10",
  "name": "Huracán",
  "p2024": 62,
  "p2025": 47
 },
 {
  "espnId": "12",
  "name": "Lanús",
  "p2024": 59,
  "p2025": 50
 },
 {
  "espnId": "8",
  "name": "Estudiantes (LP)",
  "p2024": 63,
  "p2025": 42
 },
 {
  "espnId": "9744",
  "name": "Independiente Rivadavia",
  "p2024": 46,
  "p2025": 43
 },
 {
  "espnId": "19",
  "name": "Talleres (C)",
  "p2024": 72,
  "p2025": 34
 },
 {
  "espnId": "11972",
  "name": "Gimnasia y Esgrima (M)",
  "p2024": null,
  "p2025": null
 },
 {
  "espnId": "8950",
  "name": "Defensa y Justicia",
  "p2024": 58,
  "p2025": 38
 },
 {
  "espnId": "10060",
  "name": "Barracas Central",
  "p2024": 49,
  "p2025": 49
 },
 {
  "espnId": "2975",
  "name": "Instituto",
  "p2024": 53,
  "p2025": 34
 },
 {
  "espnId": "20",
  "name": "Unión",
  "p2024": 60,
  "p2025": 39
 },
 {
  "espnId": "4",
  "name": "Belgrano",
  "p2024": 49,
  "p2025": 37
 },
 {
  "espnId": "9",
  "name": "Gimnasia y Esgrima (LP)",
  "p2024": 48,
  "p2025": 38
 },
 {
  "espnId": "18",
  "name": "San Lorenzo",
  "p2024": 45,
  "p2025": 51
 },
 {
  "espnId": "17702",
  "name": "Deportivo Riestra",
  "p2024": 48,
  "p2025": 52
 },
 {
  "espnId": "7767",
  "name": "Tigre",
  "p2024": 39,
  "p2025": 49
 },
 {
  "espnId": "7764",
  "name": "Platense",
  "p2024": 57,
  "p2025": 35
 },
 {
  "espnId": "14",
  "name": "Newell's Old Boys",
  "p2024": 49,
  "p2025": 33
 },
 {
  "espnId": "9785",
  "name": "Atlético Tucumán",
  "p2024": 50,
  "p2025": 34
 },
 {
  "espnId": "11989",
  "name": "Central Córdoba (SdE)",
  "p2024": 42,
  "p2025": 42
 },
 {
  "espnId": "10158",
  "name": "Sarmiento (J)",
  "p2024": 35,
  "p2025": 35
 },
 {
  "espnId": "235",
  "name": "Banfield",
  "p2024": 41,
  "p2025": 35
 },
 {
  "espnId": "9739",
  "name": "Aldosivi",
  "p2024": null,
  "p2025": 33
 },
 {
  "espnId": "19685",
  "name": "Estudiantes (RC)",
  "p2024": null,
  "p2025": null
 }
];

export const PLAYED_2024 = 41;
export const PLAYED_2025 = 32;
