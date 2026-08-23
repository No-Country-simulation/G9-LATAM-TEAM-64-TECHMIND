import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { filtrarContenidos } from "@/features/library/library-adapter"
import { listarContenidos } from "@/features/library/library-service"
import { queryKeys } from "@/lib/query-client"
import type { ListaContenidos } from "@/types"

type ContenidosQueryResult = {
  lista: ListaContenidos
  demo: boolean
}

/** Los servicios devuelven `ApiEnvelope` y nunca lanzan. TanStack Query espera
 *  lo contrario: necesita una excepción para pasar al estado de error. Aquí se
 *  hace esa traducción. */
async function fetchContenidos({ signal }: { signal: AbortSignal }): Promise<ContenidosQueryResult> {
  const payload = await listarContenidos(signal)
  if (!payload.data) throw new Error(payload.error ?? "Error desconocido")
  return { lista: payload.data, demo: payload.demo }
}

/** Estado de la biblioteca.
 *
 *  El listado se cachea en memoria, así que volver desde otra ruta muestra los
 *  datos al instante y revalida por detrás si están obsoletos. El filtrado por
 *  texto y categoría ocurre sobre lo ya cargado, sin tocar la red. */
export function useContenidos() {
  const [query, setQuery] = useState("")
  const [categoria, setCategoria] = useState("")

  const {
    data: resultado,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.contenidos,
    queryFn: fetchContenidos,
  })

  const lista = resultado?.lista ?? null

  const data = useMemo(
    () => (lista ? filtrarContenidos(lista, { q: query, categoria }) : null),
    [lista, query, categoria],
  )

  const categorias = useMemo(() => lista?.categorias ?? [], [lista])

  return {
    query,
    setQuery,
    categoria,
    setCategoria,
    categorias,
    data,
    demo: resultado?.demo ?? false,
    /** Primera carga: no hay nada que mostrar todavía. Usa el skeleton. */
    loading: isPending,
    /** Hay datos en pantalla y se está revalidando por detrás. Indicador sutil. */
    revalidando: isFetching && !isPending,
    error: error ? error.message : null,
    recargar: refetch,
  }
}
