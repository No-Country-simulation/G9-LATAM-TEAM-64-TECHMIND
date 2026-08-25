import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/language-context"
import { COPY_FEEDBACK_MS } from "@/config"

/** Muestra la respuesta cruda de la API en JSON, con botón de copiar. */
export function JsonBlock({ value }: { value: unknown }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(value, null, 2)

  async function copy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">{t("result.json")}</span>
        <Button type="button" variant="ghost" size="sm" onClick={copy} className="h-7 gap-1.5 px-2 text-xs">
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? t("result.copied") : t("result.copy")}
        </Button>
      </div>
      <pre className="max-h-72 overflow-auto p-3 font-mono text-xs leading-relaxed text-foreground">{json}</pre>
    </div>
  )
}
