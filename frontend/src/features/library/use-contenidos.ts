import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { filtrarContenidos, toListaContenidos } from "@/features/library/library-adapter"
import { contenidosQueryOptions, ES_DEMO } from "@/lib/contenidos-query"

/** Estado de la biblioteca.
 *
 *  El listado se cachea en memoria, así que volver desde otra ruta muestra los
 *  datos al instante y revalida por detrás si están obsoletos. El filtrado por
 *  texto y categoría ocurre sobre lo ya cargado, sin tocar la red. */
export function useContenidos() {
  const [query, setQuery] = useState("")
  const [categoria, setCategoria] = useState("")

  const { data: dtos, isPending, isFetching, error, refetch } = useQuery(contenidosQueryOptions())

  const lista = useMemo(() => (dtos ? toListaContenidos(dtos) : null), [dtos])

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
    demo: ES_DEMO,
    data,
    /** Primera carga: no hay nada que mostrar todavía. Usa el skeleton. */
    loading: isPending,
    /** Hay datos en pantalla y se está revalidando por detrás. Indicador sutil. */
    revalidando: isFetching && !isPending,
    error: error ? error.message : null,
    recargar: refetch,
  }
}
