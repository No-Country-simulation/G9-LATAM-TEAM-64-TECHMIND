/** `ContenidoResponseDTO` → modelo del detalle. */

import { toContenidoResumen } from "@/features/analyzer/analyzer-adapter"
import type { Contenido, ContenidoBackendDTO } from "@/types"

export function toContenido(dto: ContenidoBackendDTO): Contenido {
  return {
    ...toContenidoResumen(dto),
    texto: dto.texto,
    resumen: dto.resumenCorto ?? undefined,
    temas: dto.temasRelacionados ?? undefined,
  }
}

/** Busca un contenido dentro del listado ya cargado.
 *
 *  Compara como texto porque el backend usa ids numéricos y el dataset de
 *  muestra usa cadenas, mientras que la URL siempre trae un string. */
export function buscarPorId(dtos: ContenidoBackendDTO[], id: string): ContenidoBackendDTO | undefined {
  return dtos.find((dto) => String(dto.id) === id)
}
