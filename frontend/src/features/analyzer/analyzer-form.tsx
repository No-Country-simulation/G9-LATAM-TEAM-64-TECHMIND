import type * as React from "react"
import { Loader2, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/language-context"
import { ANALYZER_EXAMPLES } from "@/features/analyzer/examples"
import { FileAttachment } from "@/features/analyzer/file-attachment"
import type { useAnalyzer } from "@/features/analyzer/use-analyzer"

type AnalyzerFormProps = Pick<
  ReturnType<typeof useAnalyzer>,
  | "titulo"
  | "setTitulo"
  | "texto"
  | "setTexto"
  | "archivo"
  | "attachFile"
  | "clearFile"
  | "mode"
  | "length"
  | "tooShort"
  | "canSubmit"
  | "loading"
  | "submit"
  | "reset"
  | "loadExample"
>

/** Formulario de envío de texto al modelo. Sin lógica de red: la aporta `useAnalyzer`. */
export function AnalyzerForm({
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
  submit,
  reset,
  loadExample,
}: AnalyzerFormProps) {
  const { t } = useLanguage()
  const conArchivo = mode === "archivo"

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("analyzer.title")}</CardTitle>
        <CardDescription className="font-mono text-xs">{t("analyzer.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="titulo">{t("analyzer.titulo")}</Label>
            <Input
              id="titulo"
              name="titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder={t("analyzer.tituloPlaceholder")}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="texto">{t("analyzer.texto")}</Label>
            <Textarea
              id="texto"
              name="texto"
              required={!conArchivo}
              disabled={conArchivo}
              rows={9}
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder={conArchivo ? t("analyzer.textoDisabled") : t("analyzer.textoPlaceholder")}
              className="resize-y leading-relaxed disabled:opacity-50"
            />
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>
                {conArchivo ? t("analyzer.fileMode") : `${length} ${t("analyzer.chars")}`}
              </span>
              {tooShort && <span className="text-destructive">{t("analyzer.minChars")}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("analyzer.fileLabel")}</span>
            <FileAttachment archivo={archivo} onAttach={attachFile} onClear={clearFile} disabled={loading} />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("analyzer.examples")}</span>
            <div className="flex flex-wrap gap-2">
              {ANALYZER_EXAMPLES.map((example) => (
                <Button
                  key={example.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 font-mono text-xs"
                  onClick={() => loadExample(example)}
                >
                  {example.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={!canSubmit} className="gap-2">
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {loading ? t("analyzer.loading") : conArchivo ? t("analyzer.submitFile") : t("analyzer.submit")}
            </Button>
            <Button type="button" variant="ghost" onClick={reset} className="gap-2 text-muted-foreground">
              <Trash2 className="size-4" aria-hidden="true" />
              {t("analyzer.clear")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
