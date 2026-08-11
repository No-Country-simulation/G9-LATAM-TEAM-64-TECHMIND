import { useId, useRef } from "react"
import { FileText, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ARCHIVO_ACCEPT } from "@/config"
import { useLanguage } from "@/language-context"

type FileAttachmentProps = {
  archivo: File | null
  onAttach: (file: File | null) => void
  onClear: () => void
  disabled?: boolean
}

/** Formatea el tamaño del archivo de forma legible. */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** Botón de adjuntar y ficha del documento seleccionado.
 *  El `<input type="file">` real queda oculto: se dispara desde el botón para
 *  poder darle el estilo del resto de la interfaz. */
export function FileAttachment({ archivo, onAttach, onClear, disabled = false }: FileAttachmentProps) {
  const { t } = useLanguage()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ""
    onClear()
  }

  if (archivo) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
        <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{archivo.name}</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatSize(archivo.size)}
            {archivo.type && ` · ${archivo.type}`}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleClear}
          disabled={disabled}
          aria-label={t("analyzer.fileRemove")}
          className="ml-auto shrink-0 text-muted-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={ARCHIVO_ACCEPT || undefined}
        disabled={disabled}
        onChange={(event) => onAttach(event.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="gap-1.5"
      >
        <Paperclip className="size-3.5" aria-hidden="true" />
        {t("analyzer.fileAttach")}
      </Button>
      <span className="text-xs text-muted-foreground">{t("analyzer.fileHint")}</span>
    </div>
  )
}
