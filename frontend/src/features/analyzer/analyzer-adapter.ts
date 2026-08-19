/** Traducción entre el contrato del backend y el modelo que usa la interfaz.
 *
 *  El backend devuelve `ContenidoResponseDTO`, que es la entidad persistida, no
 *  el resultado del modelo. `confianza` llega como string 0–1 (ej. "0.95"), no
 *  como el `probabilidad: number` que espera la interfaz; y `resumen_corto` /
 *  `temas_relacionados` no tienen equivalente en `AnalisisResponse`.
 *
 *  Este adaptador aísla ese desajuste: cuando el backend empiece a exponer más
 *  campos, solo hay que ampliar `ContenidoBackendDTO` y este archivo. Ningún
 *  componente cambia.
 */

import type { AnalisisResponse, ContenidoBackendDTO, ContenidoResumen } from "@/types"

/** Normaliza el `id` numérico del backend al `string` que usa la interfaz. */
function toId(id: number | null | undefined): string | undefined {
  return id === null || id === undefined ? undefined : String(id)
}

/** Usa la probabilidad nueva y conserva compatibilidad con la confianza
 * numérica almacenada por registros anteriores. */
function toProbabilidad(
  probabilidad: number | null | undefined,
  confianza: string | null | undefined,
): number {
  if (typeof probabilidad === "number" && Number.isFinite(probabilidad)) {
    return Math.min(1, Math.max(0, probabilidad))
  }

  const parsed = Number(confianza)
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0
}

/** `ContenidoResponseDTO` → resultado del analizador.
 *
 *  Deja `resumen` y `relacionados` sin definir a propósito: el backend no los
 *  devuelve y la interfaz oculta esos bloques cuando faltan. */
export function toAnalisisResponse(dto: ContenidoBackendDTO): AnalisisResponse {
  return {
    id: toId(dto.id),
    categoria: dto.categoria ?? "Sin categoría",
    informacion_adicional: dto.etiquetas ?? [],
    probabilidad: toProbabilidad(dto.probabilidad, dto.confianza),
  }
}

/** `ContenidoResponseDTO` → tarjeta de la biblioteca. Usado por
 *  `features/library/library-adapter.ts` para armar el listado. */
export function toContenidoResumen(dto: ContenidoBackendDTO): ContenidoResumen {
  return {
    id: String(dto.id),
    titulo: dto.titulo,
    categoria: dto.categoria ?? "Sin categoría",
    informacion_adicional: dto.etiquetas ?? [],
    probabilidad: toProbabilidad(dto.probabilidad, dto.confianza),
    creado_en: dto.fechaRegistro ?? undefined,
  }
}
