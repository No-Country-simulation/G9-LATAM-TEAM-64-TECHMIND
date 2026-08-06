import { useCallback, useState } from "react"
import { analizarArchivo, analizarContenido } from "@/features/analyzer/analyzer-service"
import { TEXT_LIMITS } from "@/config"
import type { AnalisisResponse, AnalyzerMode } from "@/types"

/** Estado y acciones del formulario de análisis.
 *
 *  El analizador trabaja en dos modos excluyentes: `texto` (se pega el contenido)
 *  y `archivo` (se adjunta un documento). Adjuntar cambia el modo; quitar el
 *  archivo devuelve al textarea con lo que hubiera escrito antes. */
export function useAnalyzer() {
  const [titulo, setTitulo] = useState("")
  const [texto, setTexto] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalisisResponse | null>(null)
  const [demo, setDemo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mode: AnalyzerMode = archivo ? "archivo" : "texto"

  const length = texto.trim().length
  const tooShort = mode === "texto" && length > 0 && length < TEXT_LIMITS.min
  const canSubmit = !loading && (mode === "archivo" ? archivo !== null : length >= TEXT_LIMITS.min)

  const attachFile = useCallback((file: File | null) => {
    setArchivo(file)
    setError(null)
  }, [])

  const clearFile = useCallback(() => {
    setArchivo(null)
    setError(null)
  }, [])

  const submit = useCallback(async () => {
    if (!canSubmit) return

    setLoading(true)
    setError(null)
    try {
      const payload =
        archivo !== null
          ? await analizarArchivo({ titulo, archivo })
          : await analizarContenido({ titulo, texto })

      setDemo(payload.demo)
      if (!payload.data) {
        setResult(null)
        setError(payload.error ?? "Error desconocido")
        return
      }
      setResult(payload.data)
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught.message : "Error de red")
    } finally {
      setLoading(false)
    }
  }, [archivo, canSubmit, texto, titulo])

  const reset = useCallback(() => {
    setTitulo("")
    setTexto("")
    setArchivo(null)
    setResult(null)
    setError(null)
  }, [])

  const loadExample = useCallback((example: { titulo: string; texto: string }) => {
    setArchivo(null)
    setTitulo(example.titulo)
    setTexto(example.texto)
  }, [])

  return {
    titulo,
    setTitulo,
    texto,
    setTexto,
    archivo,
    attachFile,
    clearFile,
    mode,
    length,
    tooShort,
    canSubmit,
    loading,
    result,
    demo,
    error,
    submit,
    reset,
    loadExample,
  }
}
