/** Listado y filtrado de contenidos ya procesados (GET /contenidos).
 *
 *  El backend no soporta `q`/`categoria` como query params: devuelve todo el
 *  listado y `library-adapter.ts` filtra en el cliente. */

import { toListaContenidos } from "@/features/library/library-adapter"
import { apiRequest, toErrorMessage } from "@/lib/api-client"
import { demoListarContenidos } from "@/lib/demo-service"
import type { ApiEnvelope, ContenidoBackendDTO } from "@/types"
import type { ContenidoFiltros, ListaContenidos } from "@/types"
import { API_CONFIGURED, ENDPOINTS } from "@/config"

export async function listarContenidos(
  filtros: ContenidoFiltros = {},
  signal?: AbortSignal,
): Promise<ApiEnvelope<ListaContenidos>> {
  const q = filtros.q?.trim() ?? ""
  const categoria = filtros.categoria?.trim() ?? ""

  if (!API_CONFIGURED) {
    return { data: demoListarContenidos({ q, categoria }), error: null, demo: true }
  }

  try {
    const dtos = await apiRequest<ContenidoBackendDTO[]>(ENDPOINTS.contenidos, { signal })
    return { data: toListaContenidos(dtos, { q, categoria }), error: null, demo: false }
  } catch (error) {
    return { data: null, error: toErrorMessage(error), demo: false }
  }
}
