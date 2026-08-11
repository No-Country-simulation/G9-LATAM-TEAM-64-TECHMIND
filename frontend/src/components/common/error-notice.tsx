import { AlertTriangle } from "lucide-react"

/** Bloque de error con el mensaje crudo devuelto por la API. */
export function ErrorNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div className="space-y-1 text-sm">
        <p className="font-medium">{title}</p>
        <p className="break-words font-mono text-xs leading-relaxed text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
