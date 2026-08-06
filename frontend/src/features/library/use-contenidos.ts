import { useEffect, useMemo, useState } from "react"
import { SEARCH_DEBOUNCE_MS } from "@/config"
import { listarContenidos } from "@/features/library/library-service"
import { useDebounce } from "@/lib/use-debounce"
import type { ListaContenidos } from "@/types"

/** Búsqueda con debounce y filtro por categoría sobre la biblioteca. */
export function useContenidos() {
  const [query, setQuery] = useState("")
  const [categoria, setCategoria] = useState("")
  const [data, setData] = useState<ListaContenidos | null>(null)
  const [demo, setDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const payload = await listarContenidos({ q: debouncedQuery, categoria }, controller.signal)
        if (controller.signal.aborted) return

        setDemo(payload.demo)
        if (!payload.data) {
          setData(null)
          setError(payload.error ?? "Error desconocido")
          return
        }
        setData(payload.data)
      } catch (caught) {
        if (controller.signal.aborted) return
        setData(null)
        setError(caught instanceof Error ? caught.message : "Error de red")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [debouncedQuery, categoria])

  const categorias = useMemo(() => data?.categorias ?? [], [data])

  return { query, setQuery, categoria, setCategoria, categorias, data, demo, loading, error }
}
