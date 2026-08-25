import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiRequest, toErrorMessage } from "@/lib/api-client"
import { API_CONFIGURED, ENDPOINTS } from "@/config"
import { useLanguage } from "@/language-context"

/** Formatea el tamaño del archivo de forma legible. */
function formatSize(bytes?: number): string | null {
  if (!bytes) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

type Props = {
  id: string
  nombre: string
  tamano?: number
}

/** Descarga del documento original.
 *
 *  El backend no transmite el archivo: devuelve una URL firmada de OCI que
 *  caduca a los quince minutos. Por eso el enlace se pide en el momento del
 *  clic y no al cargar la página — uno generado antes podría estar caducado. */
export function DownloadButton({ id, nombre, tamano }: Props) {
  const { t } = useLanguage()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function descargar() {
    if (!API_CONFIGURED) {
      setError(t("detail.descargaDemo"))
      return
    }

    setCargando(true)
    setError(null)
    try {
      const { url } = await apiRequest<{ url: string }>(ENDPOINTS.archivoEnlace(id))
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (caught) {
      setError(toErrorMessage(caught))
    } finally {
      setCargando(false)
    }
  }

  const peso = formatSize(tamano)

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={descargar}
        disabled={cargando}
        className="w-fit gap-2"
      >
        {cargando ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        <span className="max-w-[18rem] truncate">{nombre}</span>
        {peso && <span className="font-mono text-[11px] text-muted-foreground">{peso}</span>}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
