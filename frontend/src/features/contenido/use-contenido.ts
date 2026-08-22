import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { buscarPorId, toContenido } from "@/features/contenido/contenido-adapter"
import { contenidosQueryOptions, ES_DEMO } from "@/lib/contenidos-query"

/** Detalle de un contenido, resuelto desde el listado cacheado.
 *
 *  `GET /api/contenidos/{id}` no existe en el backend, pero tampoco hace falta:
 *  el listado ya devuelve el objeto completo de cada registro. Compartiendo la
 *  clave de consulta con la biblioteca, venir desde una tarjeta es instantáneo
 *  —los datos ya están— y entrar por URL directa carga el listado y busca dentro.
 *
 *  Cuando el backend implemente el endpoint, basta con cambiar este hook por su
 *  propia `useQuery`; la página no se entera. */
export function useContenido(id: string) {
  const { data: dtos, isPending, error } = useQuery(contenidosQueryOptions())

  const contenido = useMemo(() => {
    if (!dtos) return null
    const dto = buscarPorId(dtos, id)
    return dto ? toContenido(dto) : null
  }, [dtos, id])

  return {
    contenido,
    demo: ES_DEMO,
    loading: isPending,
    error: error ? error.message : null,
    /** El listado cargó pero no hay ningún contenido con ese id. */
    notFound: !isPending && !error && dtos !== undefined && contenido === null,
  }
}
