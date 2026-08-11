import { useEffect, useState } from "react"
import { obtenerContenido } from "@/features/contenido/contenido-service"
import type { Contenido } from "@/types"

/** Carga el detalle de un contenido por id, distinguiendo 404 de error real. */
export function useContenido(id: string) {
  const [contenido, setContenido] = useState<Contenido | null>(null)
  const [demo, setDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      setNotFound(false)

      const payload = await obtenerContenido(id, controller.signal)
      if (controller.signal.aborted) return

      setDemo(payload.demo)
      setContenido(payload.data)
      setNotFound(payload.notFound)
      if (!payload.data && !payload.notFound) setError(payload.error ?? "Error desconocido")
      setLoading(false)
    }

    void load()
    return () => controller.abort()
  }, [id])

  return { contenido, demo, loading, error, notFound }
}
