import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ConfidenceMeter, DemoBadge, JsonBlock, KeywordChips } from "@/components/common"
import { DownloadButton } from "@/features/contenido/download-button"
import { ROUTES } from "@/config"
import { useLanguage } from "@/language-context"
import type { Contenido } from "@/types"
import { formatDate } from "@/lib/format"

/** Vista de detalle: texto original, metadatos, relacionados y JSON crudo. */
export function ContentDetail({ contenido, demo }: { contenido: Contenido; demo: boolean }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={ROUTES.biblioteca}
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("detail.back")}
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {contenido.categoria}
          </Badge>
          {demo && <DemoBadge />}
        </div>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight">{contenido.titulo}</h1>
        {contenido.resumen && <p className="max-w-2xl leading-relaxed text-muted-foreground">{contenido.resumen}</p>}
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("detail.texto")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line leading-relaxed text-foreground/90">{contenido.texto}</p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.metadata")}</CardTitle>
              <CardDescription className="font-mono text-xs">{contenido.id}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ConfidenceMeter value={contenido.probabilidad} label={t("result.confianza")} />
              <Separator />
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("result.keywords")}</span>
                <KeywordChips keywords={contenido.informacion_adicional ?? []} />
              </div>
              {contenido.creado_en && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground">{t("detail.creado")}</span>
                    <span>{formatDate(contenido.creado_en)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {contenido.archivo && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm uppercase tracking-wide text-muted-foreground">
            {t("detail.documento")}
          </h2>
          <DownloadButton
            id={contenido.id}
            nombre={contenido.archivo.nombre}
            tamano={contenido.archivo.tamano}
          />
        </section>
      )}

      {/* El backend devuelve nombres de temas derivados de la categoría, no
          referencias a otros contenidos: se pintan como etiquetas, no como
          tarjetas enlazables. */}
      {contenido.temas && contenido.temas.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm uppercase tracking-wide text-muted-foreground">{t("detail.temas")}</h2>
          <ul className="flex flex-wrap gap-2">
            {contenido.temas.map((tema) => (
              <li key={tema}>
                <Badge variant="outline" className="text-sm font-normal">
                  {tema}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonBlock value={contenido} />
    </div>
  )
}
