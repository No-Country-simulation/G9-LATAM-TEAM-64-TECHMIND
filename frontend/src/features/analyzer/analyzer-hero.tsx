import { FolderTree, Network, Tags } from "lucide-react"
import { useLanguage } from "@/language-context"

/** Encabezado de la página de análisis: propuesta de valor y capacidades. */
export function AnalyzerHero() {
  const { t } = useLanguage()

  const capabilities = [
    { icon: FolderTree, label: t("hero.stat1") },
    { icon: Tags, label: t("hero.stat2") },
    { icon: Network, label: t("hero.stat3") },
  ]

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="w-fit rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {t("hero.eyebrow")}
        </span>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{t("hero.subtitle")}</p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {capabilities.map((capability) => (
          <li
            key={capability.label}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm"
          >
            <capability.icon className="size-4 text-primary" aria-hidden="true" />
            {capability.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
