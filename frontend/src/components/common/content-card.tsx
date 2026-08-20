import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { KeywordChips } from "@/components/common/keyword-chips"
import { useLanguage } from "@/language-context"
import type { ContenidoResumen } from "@/types"
import { formatDate, toPercent } from "@/lib/format"
import { CARD_KEYWORDS_LIMIT, ROUTES } from "@/config"
import { cn } from "@/lib/cn"

/** Nivel de confianza devuelto por la API ("alta"/"media"/"baja") → etiqueta
 *  visible y color, alineados con los tonos de `ConfidenceMeter`. */
const CONFIANZA_NIVEL: Record<string, { es: string; en: string; className: string }> = {
  alta: { es: "Alta", en: "High", className: "border-primary/50 text-primary" },
  media: { es: "Media", en: "Medium", className: "border-signal/50 text-signal" },
  baja: { es: "Baja", en: "Low", className: "text-muted-foreground" },
}

/** Tarjeta enlazable de un contenido. Se reutiliza en el analizador,
 *  la biblioteca y el bloque de relacionados del detalle. */
export function ContentCard({ item, compact = false }: { item: ContenidoResumen; compact?: boolean }) {
  const { t, lang } = useLanguage()
  const nivelConfianza = item.confianza ? CONFIANZA_NIVEL[item.confianza.toLowerCase()] : undefined

  return (
    <Link
      to={ROUTES.contenidoDetalle(item.id)}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <Badge variant="secondary" className="font-mono text-[11px]">
            {item.categoria}
          </Badge>
          <h3 className="text-pretty font-medium leading-snug group-hover:text-primary">{item.titulo}</h3>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </div>

      {!compact && <KeywordChips keywords={item.informacion_adicional.slice(0, CARD_KEYWORDS_LIMIT)} />}

      <div className="mt-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
        <span className="tabular-nums">{toPercent(item.probabilidad)}% conf.</span>
        {nivelConfianza && (
          <Badge variant="outline" className={cn("font-mono text-[11px]", nivelConfianza.className)}>
            {nivelConfianza[lang]}
          </Badge>
        )}
        {typeof item.similitud === "number" && (
          <span className="tabular-nums text-primary">
            {toPercent(item.similitud)}% {t("detail.similitud")}
          </span>
        )}
        {item.creado_en && <span className="ml-auto">{formatDate(item.creado_en)}</span>}
      </div>
    </Link>
  )
}
