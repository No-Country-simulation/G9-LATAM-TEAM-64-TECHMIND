/** Listado de contenidos ya procesados (GET /api/contenidos).
 *
 *  Devuelve el listado completo. El filtrado por texto y categoría lo hace la
 *  biblioteca en memoria con `filtrarContenidos`: el backend no admite query
 *  params, así que pedirle un subconjunto no ahorraría nada.
 *
 *  Cuando el listado crezca lo suficiente para que traerlo entero deje de ser
 *  viable, el filtrado vuelve al servidor — pero junto con paginación, que es
 *  lo que lo justifica.
 */

import { toListaContenidos } from "@/features/library/library-adapter"
import { apiRequest, toErrorMessage } from "@/lib/api-client"
import { demoListarContenidos } from "@/lib/demo-service"
import type { ApiEnvelope, ContenidoBackendDTO, ListaContenidos } from "@/types"
import { API_CONFIGURED, ENDPOINTS } from "@/config"

export async function listarContenidos(signal?: AbortSignal): Promise<ApiEnvelope<ListaContenidos>> {
  if (!API_CONFIGURED) {
    return { data: demoListarContenidos(), error: null, demo: true }
  }

  try {
    const dtos = await apiRequest<ContenidoBackendDTO[]>(ENDPOINTS.contenidos, { signal })
    return { data: toListaContenidos(dtos), error: null, demo: false }
  } catch (error) {
    return { data: null, error: toErrorMessage(error), demo: false }
  }
}
