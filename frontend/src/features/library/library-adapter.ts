/** Traducción entre `GET /api/contenidos` y el listado que usa la biblioteca.
 *
 *  El backend devuelve un array plano de `ContenidoResponseDTO`, sin `total`,
 *  `categorias` ni soporte de filtros por query param. Este adaptador arma el
 *  sobre `ListaContenidos` y aplica `q`/`categoria` en el cliente.
 */

import { toContenidoResumen } from "@/features/analyzer/analyzer-adapter"
import type { ContenidoBackendDTO, ContenidoFiltros, ListaContenidos } from "@/types"

const SIN_CATEGORIA = "Sin categoría"

function coincideTexto(dto: ContenidoBackendDTO, q: string): boolean {
  if (!q) return true
  const needle = q.toLowerCase()
  return dto.titulo.toLowerCase().includes(needle) || dto.texto.toLowerCase().includes(needle)
}

function coincideCategoria(dto: ContenidoBackendDTO, categoria: string): boolean {
  if (!categoria) return true
  return (dto.categoria ?? SIN_CATEGORIA) === categoria
}

/** `ContenidoResponseDTO[]` → `ListaContenidos`, filtrado por `q`/`categoria`.
 *  `categorias` se calcula sobre el set completo, no sobre el filtrado, para
 *  que las opciones del filtro no desaparezcan al usarlo. */
export function toListaContenidos(dtos: ContenidoBackendDTO[], filtros: ContenidoFiltros = {}): ListaContenidos {
  const q = filtros.q?.trim() ?? ""
  const categoria = filtros.categoria?.trim() ?? ""

  const categorias = Array.from(new Set(dtos.map((dto) => dto.categoria ?? SIN_CATEGORIA))).sort((a, b) =>
    a.localeCompare(b),
  )

  const items = dtos.filter((dto) => coincideTexto(dto, q) && coincideCategoria(dto, categoria)).map(toContenidoResumen)

  return { total: items.length, items, categorias }
}
