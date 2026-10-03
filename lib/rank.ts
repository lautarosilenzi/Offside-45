// Puesto de cada fila en una tabla ya ordenada: si tiene lo mismo que la de arriba, comparte su puesto (1, 2, 2, 4…).
export function positions<T>(rows: T[], value: (r: T) => number): number[] {
  const out: number[] = [];
  rows.forEach((r, i) => out.push(i > 0 && value(r) === value(rows[i - 1]) ? out[i - 1] : i + 1));
  return out;
}
