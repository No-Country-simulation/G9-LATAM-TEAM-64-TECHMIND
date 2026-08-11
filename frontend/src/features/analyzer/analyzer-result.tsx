import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfidenceMeter, ContentCard, DemoBadge, ErrorNotice, JsonBlock, KeywordChips } from "@/components/common"
import { useLanguage } from "@/language-context"
import type { AnalisisResponse } from "@/types"

type AnalyzerResultProps = {
  result: AnalisisResponse | null
  error: string | null
  demo: boolean
}

/** Panel derecho del analizador: estado vacío, error o resultado del modelo. */
export function AnalyzerResult({ result, error, demo }: AnalyzerResultProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4">
      {error && <ErrorNotice title={t("result.error")} message={error} />}

      {!result && !error && (
        <Card className="flex-1">
          <CardContent className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
            <Sparkles className="size-5 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium">{t("result.empty.title")}</p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t("result.empty.body")}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardDescription className="text-xs uppercase tracking-wide">{t("result.categoria")}</CardDescription>
                  <CardTitle className="text-2xl tracking-tight">{result.categoria}</CardTitle>
                </div>
                {demo ? <DemoBadge /> : <Badge variant="secondary">API</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ConfidenceMeter value={result.probabilidad} label={t("result.confianza")} />
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("result.keywords")}</span>
                <KeywordChips keywords={result.informacion_adicional ?? []} />
              </div>
            </CardContent>
          </Card>

          {result.relacionados && result.relacionados.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("result.relacionados")}</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.relacionados.map((item) => (
                  <ContentCard key={item.id} item={item} compact />
                ))}
              </div>
            </div>
          )}

          <JsonBlock value={result} />
        </>
      )}
    </div>
  )
}
