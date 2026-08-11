/** Detalle de un contenido concreto (GET /contenidos/:id). */

import { ApiError, apiRequest, toErrorMessage } from "@/lib/api-client"
import { demoObtenerContenido } from "@/lib/demo-service"
import type { ApiEnvelope } from "@/types"
import type { Contenido } from "@/types"
import { API_CONFIGURED, ENDPOINTS } from "@/config"

/** Sobre extendido con `notFound` para que la página pueda renderizar el 404
 *  en vez de un error genérico. */
export type ContenidoEnvelope = ApiEnvelope<Contenido> & { notFound: boolean }

export async function obtenerContenido(id: string, signal?: AbortSignal): Promise<ContenidoEnvelope> {
  if (!API_CONFIGURED) {
    const found = demoObtenerContenido(id)
    if (!found) return { data: null, error: "Contenido no encontrado.", demo: true, notFound: true }
    return { data: found, error: null, demo: true, notFound: false }
  }

  try {
    const data = await apiRequest<Contenido>(ENDPOINTS.contenidoPorId(id), { signal })
    return { data, error: null, demo: false, notFound: false }
  } catch (error) {
    const notFound = error instanceof ApiError && error.status === 404
    return { data: null, error: toErrorMessage(error), demo: false, notFound }
  }
}
