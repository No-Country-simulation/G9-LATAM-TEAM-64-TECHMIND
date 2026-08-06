/** Formateadores de presentación compartidos. */

/** Convierte una probabilidad 0–1 en un porcentaje entero acotado a [0, 100]. */
export function toPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.round(Math.max(0, Math.min(1, value)) * 100)
}

/** Igual que `toPercent` pero con el símbolo, p. ej. "89%". */
export function formatPercent(value: number): string {
  return `${toPercent(value)}%`
}

/** Recorta un timestamp ISO a fecha corta, p. ej. "2026-07-14". */
export function formatDate(iso?: string): string {
  if (!iso) return ""
  return iso.slice(0, 10)
}
