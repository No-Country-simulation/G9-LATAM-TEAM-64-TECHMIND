import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/language-context"

/** Aviso de página completa: la API del modelo aún no está configurada. */
export function DemoNotice() {
  const { t } = useLanguage()

  return (
    <div className="flex gap-3 rounded-lg border border-signal/40 bg-signal/10 p-4">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
      <div className="space-y-1 text-sm">
        <p className="font-medium">{t("demo.title")}</p>
        <p className="leading-relaxed text-muted-foreground">{t("demo.body")}</p>
      </div>
    </div>
  )
}

/** Etiqueta compacta que marca un resultado como procedente del dataset local. */
export function DemoBadge() {
  const { t } = useLanguage()

  return (
    <Badge variant="outline" className="border-signal/50 text-signal">
      {t("demo.badge")}
    </Badge>
  )
}
