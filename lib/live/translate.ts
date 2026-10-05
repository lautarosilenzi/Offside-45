// Traduce al castellano las frases más comunes del relato de ESPN (que llega en inglés). Lo que no reconoce queda como
// viene. Los nombres de jugadores y equipos no se tocan.
const RULES: [RegExp, (...m: string[]) => string][] = [
  [/^Goal!\s*(.+?)\.\s*(.+?) \((.+?)\) (.*)$/i, (_, score, p, t, rest) => `¡Gol! ${score}. ${p} (${t}) ${shot(rest)}`],
  [/^(.+?) \((.+?)\) Goal at (\d+'?\+?\d*'?)$/i, (_, p, t) => `Gol de ${p} (${t})`],
  [/^Own Goal by (.+?), (.+?)\.\s*(.+)$/i, (_, p, t, score) => `Gol en contra de ${p} (${t}). ${score}`],
  [/^Foul by (.+?)\.$/i, (_, p) => `Falta de ${p}.`],
  [/^(.+?) wins a free kick (?:in the |on the )?(.*)\.$/i, (_, p, where) => `${p} recibe una falta${where ? ` (${zone(where)})` : ""}.`],
  [/^Corner,\s*(.+?)\.\s*Conceded by (.+?)\.$/i, (_, t, p) => `Córner para ${t}. Lo cedió ${p}.`],
  [/^(.+?) is shown the yellow card(?: for (.+?))?\.$/i, (_, p, why) => `Amarilla para ${p}${why ? ` por ${reason(why)}` : ""}.`],
  [/^(.+?) is shown the red card(?: for (.+?))?\.$/i, (_, p, why) => `Roja para ${p}${why ? ` por ${reason(why)}` : ""}.`],
  [/^(.+?) is shown the second yellow card\.?$/i, (_, p) => `Segunda amarilla y expulsión para ${p}.`],
  [/^Substitution,\s*(.+?)\.\s*(.+?) replaces (.+?)(?: because of an injury)?\.$/i, (_, t, inn, out) => `Cambio en ${t}: entra ${inn} por ${out}.`],
  [/^Offside,\s*(.+?)\.\s*(.+?) is caught offside\.$/i, (_, t, p) => `Offside de ${p} (${t}).`],
  [/^Offside,\s*(.+?)\.\s*(.+?) tries a through ball, but (.+?) is caught offside\.$/i, (_, t, a, p) => `Offside de ${p} (${t}) tras un pase de ${a}.`],
  [/^Attempt missed\.\s*(.+)$/i, (_, r) => `Remate desviado. ${shot(r)}`],
  [/^Attempt saved\.\s*(.+)$/i, (_, r) => `Remate atajado. ${shot(r)}`],
  [/^Attempt blocked\.\s*(.+)$/i, (_, r) => `Remate bloqueado. ${shot(r)}`],
  [/^(.+?) hits the (left |right )?(post|bar)(.*)$/i, (_, p, side, what) => `${p} pega en ${what === "bar" ? "el travesaño" : `el ${side?.trim() === "left" ? "palo izquierdo" : side?.trim() === "right" ? "palo derecho" : "palo"}`}.`],
  [/^Penalty conceded by (.+?) after a foul in the penalty area\.$/i, (_, p) => `Penal cometido por ${p}.`],
  [/^Penalty (.+?)\.\s*(.+?) draws a foul in the penalty area\.$/i, (_, t, p) => `Penal para ${t}: le cometen falta a ${p}.`],
  [/^Penalty saved!\s*(.+)$/i, (_, r) => `¡Penal atajado! ${shot(r)}`],
  [/^Penalty missed!\s*(.+)$/i, (_, r) => `¡Penal errado! ${shot(r)}`],
  [/^VAR Decision: (.+?)\.?$/i, (_, d) => `Decisión del VAR: ${d}.`],
  [/^Delay in match because of an injury (.+?)\.$/i, (_, p) => `Partido detenido por una lesión de ${p}.`],
  [/^Delay over\. They are ready to continue\.$/i, () => "Se reanuda el partido."],
  [/^First Half begins\.$/i, () => "Empieza el primer tiempo."],
  [/^First Half ends,\s*(.+)\.$/i, (_, s) => `Termina el primer tiempo: ${s}.`],
  [/^Second Half begins\s*(.+)\.$/i, (_, s) => `Empieza el segundo tiempo (${s}).`],
  [/^Second Half ends,\s*(.+)\.$/i, (_, s) => `Termina el segundo tiempo: ${s}.`],
  [/^Match ends,\s*(.+)\.$/i, (_, s) => `Final del partido: ${s}.`],
  [/^Fourth official has announced (\d+) minutes? of added time\.$/i, (_, n) => `El cuarto árbitro anuncia ${n} minutos de descuento.`],
  [/^(.+?) has gone down, but the referee deems it simulation\.$/i, (_, p) => `${p} se tira, pero el árbitro lo considera simulación.`],
  [/^Lineups are announced and players are warming up\.$/i, () => "Se confirmaron las formaciones y los jugadores hacen la entrada en calor."],
];

function zone(s: string) {
  return s.replace(/defensive half/i, "en campo propio").replace(/attacking half/i, "en campo rival").replace(/on the (left|right) wing/i, (_, w) => `por la ${w === "left" ? "izquierda" : "derecha"}`);
}
function reason(s: string) {
  return s.replace(/a bad foul/i, "una falta fuerte").replace(/hand ball/i, "mano").replace(/dangerous play/i, "juego peligroso").replace(/unsporting behaviour/i, "conducta antideportiva").replace(/time wasting/i, "demorar el juego");
}
// Frases de los remates ("right footed shot from outside the box is saved in the bottom left corner…"): las más comunes.
function shot(s: string) {
  return s
    .replace(/right footed shot/gi, "remate de derecha")
    .replace(/left footed shot/gi, "remate de zurda")
    .replace(/header/gi, "cabezazo")
    .replace(/from outside the box/gi, "desde afuera del área")
    .replace(/from the centre of the box/gi, "desde el centro del área")
    .replace(/from the left side of the box/gi, "desde la izquierda del área")
    .replace(/from the right side of the box/gi, "desde la derecha del área")
    .replace(/from very close range/gi, "desde muy cerca")
    .replace(/from a difficult angle/gi, "desde un ángulo difícil")
    .replace(/is saved in the (?:bottom|top|centre of the|centre)? ?(?:left |right )?(?:corner|goal)?\s*by (.+?)(?=\.|$)/gi, "lo ataja $1")
    .replace(/is saved in the (bottom|top|centre of the|centre) (left |right )?(corner|goal)?/gi, "lo ataja el arquero")
    .replace(/is high and wide to the (left|right)/gi, "se va alto y desviado")
    .replace(/misses to the (left|right)/gi, (_, w) => `se va por la ${w === "left" ? "izquierda" : "derecha"}`)
    .replace(/is too high/gi, "se va alto")
    .replace(/is close, but misses/gi, "pasa cerca")
    .replace(/to the (bottom|top) (left|right) corner/gi, (_, a, b) => `al ${a === "bottom" ? "rincón inferior" : "ángulo superior"} ${b === "left" ? "izquierdo" : "derecho"}`)
    .replace(/to the (high|centre of the|bottom) (centre of the )?goal/gi, "al medio del arco")
    .replace(/is blocked/gi, "es bloqueado")
    .replace(/Assisted by (.+?)( with a (cross|through ball|headed pass))?(?=\.| following)/gi, (_, p, __, kind) => `Asistencia de ${p}${kind ? (kind === "cross" ? " con un centro" : kind === "through ball" ? " con un pase en profundidad" : " de cabeza") : ""}`)
    .replace(/following a (corner|set piece situation|fast break)/gi, (_, k) => (k === "corner" ? "tras un córner" : k === "fast break" ? "de contraataque" : "tras una pelota parada"));
}

export function translate(text: string): string {
  const t = text.trim();
  for (const [re, fn] of RULES) {
    const m = t.match(re);
    if (m) return fn(...m);
  }
  return t;
}
