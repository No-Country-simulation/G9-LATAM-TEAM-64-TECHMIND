import { AnalyzerForm } from "@/features/analyzer/analyzer-form"
import { AnalyzerResult } from "@/features/analyzer/analyzer-result"
import { useAnalyzer } from "@/features/analyzer/use-analyzer"

/** Contenedor de la feature: conecta el hook con el formulario y el resultado. */
export function Analyzer() {
  const analyzer = useAnalyzer()

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AnalyzerForm
        titulo={analyzer.titulo}
        setTitulo={analyzer.setTitulo}
        texto={analyzer.texto}
        setTexto={analyzer.setTexto}
        archivo={analyzer.archivo}
        attachFile={analyzer.attachFile}
        clearFile={analyzer.clearFile}
        mode={analyzer.mode}
        length={analyzer.length}
        tooShort={analyzer.tooShort}
        canSubmit={analyzer.canSubmit}
        loading={analyzer.loading}
        submit={analyzer.submit}
        reset={analyzer.reset}
        loadExample={analyzer.loadExample}
      />
      <AnalyzerResult result={analyzer.result} error={analyzer.error} demo={analyzer.demo} />
    </div>
  )
}
