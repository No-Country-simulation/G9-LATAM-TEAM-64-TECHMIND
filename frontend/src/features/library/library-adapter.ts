/** Traducción entre `GET /api/contenidos` y el listado que usa la biblioteca.
 *
 *  El backend devuelve un array plano de `ContenidoResponseDTO`, sin `total` ni
 *  `categorias`, y no admite filtros por query param. Este adaptador arma el
 *  sobre `ListaContenidos`.
 *
 *  El filtrado vive aparte, en `filtrarContenidos`, y se aplica en memoria sobre
 *  la lista ya cargada. Así cambiar de categoría o escribir en el buscador no
 *  dispara ninguna petición.
 */

import { toContenidoResumen } from "@/features/analyzer/analyzer-adapter"
import type { ContenidoBackendDTO, ContenidoFiltros, ListaContenidos } from "@/types"

const SIN_CATEGORIA = "Sin categoría"

/** `ContenidoResponseDTO[]` → `ListaContenidos` completa, sin filtrar. */
export function toListaContenidos(dtos: ContenidoBackendDTO[]): ListaContenidos {
  const categorias = Array.from(new Set(dtos.map((dto) => dto.categoria ?? SIN_CATEGORIA))).sort((a, b) =>
    a.localeCompare(b),
  )

  return { total: dtos.length, items: dtos.map(toContenidoResumen), categorias }
}

/** Filtra una lista ya cargada. Función pura, sin red.
 *
 *  `categorias` se conserva del listado completo, no del filtrado, para que las
 *  opciones del filtro no desaparezcan al usarlo. */
export function filtrarContenidos(lista: ListaContenidos, filtros: ContenidoFiltros = {}): ListaContenidos {
  const q = filtros.q?.trim().toLowerCase() ?? ""
  const categoria = filtros.categoria?.trim() ?? ""

  if (!q && !categoria) return lista

  const items = lista.items.filter((item) => {
    const coincideCategoria = !categoria || item.categoria === categoria
    const coincideTexto =
      !q ||
      item.titulo.toLowerCase().includes(q) ||
      (item.texto?.toLowerCase().includes(q) ?? false) ||
      item.informacion_adicional.some((keyword) => keyword.toLowerCase().includes(q))
    return coincideCategoria && coincideTexto
  })

  return { total: items.length, items, categorias: lista.categorias }
}
