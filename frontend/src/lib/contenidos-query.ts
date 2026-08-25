/** Acceso al listado de contenidos, compartido por la biblioteca y el detalle.
 *
 *  `GET /api/contenidos` devuelve el objeto completo de cada contenido —incluido
 *  `texto`—, no un resumen. Por eso una sola consulta alimenta las dos pantallas:
 *  la biblioteca pinta las tarjetas y el detalle busca su registro por id, sin
 *  petición propia.
 *
 *  Vive en `lib/` y no dentro de una feature porque ya no pertenece a ninguna de
 *  las dos: ambas dependen de ella por igual.
 *
 *  TODO: cuando el listado crezca lo suficiente para que traerlo entero deje de
 *  ser viable, habrá que paginar y recuperar `GET /api/contenidos/{id}`.
 */

import { queryOptions } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api-client"
import { demoListarContenidos } from "@/lib/demo-service"
import { queryKeys } from "@/lib/query-client"
import type { ContenidoBackendDTO } from "@/types"
import { API_CONFIGURED, ENDPOINTS } from "@/config"

/** true cuando la interfaz trabaja con el dataset de muestra. */
export const ES_DEMO = !API_CONFIGURED

async function fetchContenidos({ signal }: { signal: AbortSignal }): Promise<ContenidoBackendDTO[]> {
  if (ES_DEMO) return demoListarContenidos()
  return apiRequest<ContenidoBackendDTO[]>(ENDPOINTS.contenidos, { signal })
}

/** Opciones compartidas: garantiza que biblioteca y detalle usan la misma clave
 *  y, por tanto, la misma entrada de caché. */
export function contenidosQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.contenidos,
    queryFn: fetchContenidos,
  })
}
