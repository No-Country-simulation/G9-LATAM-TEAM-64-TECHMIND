/** Listado y filtrado de contenidos ya procesados (GET /contenidos). */

import { apiRequest, toErrorMessage } from "@/lib/api-client"
import { demoListarContenidos } from "@/lib/demo-service"
import type { ApiEnvelope } from "@/types"
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
    const data = await apiRequest<ListaContenidos>(ENDPOINTS.contenidos, {
      searchParams: { q: q || undefined, categoria: categoria || undefined },
      signal,
    })
    return { data, error: null, demo: false }
  } catch (error) {
    return { data: null, error: toErrorMessage(error), demo: false }
  }
}
