/** Cliente de TanStack Query y claves de las consultas.
 *
 *  La caché vive en memoria y sobrevive a la navegación de la SPA, así que
 *  volver a la biblioteca pinta al instante lo último que se vio y revalida por
 *  detrás. Se pierde al recargar la página, que es lo que queremos: un F5 debe
 *  traer datos frescos.
 */

import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Dentro de esta ventana, volver a montar no dispara petición: se usa la
       *  caché tal cual. Pasada, se muestra lo cacheado y se revalida detrás. */
      staleTime: 30_000,
      /** Cuánto se conservan los datos sin observadores antes de descartarlos. */
      gcTime: 5 * 60_000,
      /** El backend del MVP puede estar caído; tres reintentos solo alargan la
       *  espera antes de mostrar el error. */
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

/** Claves de consulta, centralizadas para que invalidar no dependa de recordar
 *  el array exacto en cada sitio. */
export const queryKeys = {
  contenidos: ["contenidos"] as const,
  contenido: (id: string) => ["contenidos", id] as const,
}
