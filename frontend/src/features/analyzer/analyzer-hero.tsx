import { FolderTree, Network, Tags } from "lucide-react"
import { useLanguage } from "@/language-context"

/** Encabezado de la página de análisis: propuesta de valor y capacidades. */
export function AnalyzerHero() {
  const { t } = useLanguage()

  const capabilities = [
    {
      icon: FolderTree,
      label: t("hero.stat1"),
      description: "Organiza por categorías",
    },
    {
      icon: Tags,
      label: t("hero.stat2"),
      description: "Identifica lo más importante",
    },
    {
      icon: Network,
      label: t("hero.stat3"),
      description: "Descubre contenido útil",
    },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Convierte texto técnico en{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                conocimiento
              </span>{" "}
              estructurado
            </h1>

            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {capabilities.map((capability) => (
              <li
                key={capability.label}
                className="group rounded-xl border border-primary/15 bg-card/60 p-4 backdrop-blur-sm transition hover:border-primary/35 hover:bg-card/80"
              >
                <capability.icon
                  className="mb-3 size-5 text-primary"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium">{capability.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {capability.description}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
  <span className="text-primary">●</span>
  <span>Resultado estructurado en JSON</span>
</div>
</div>

<div className="relative hidden min-h-[460px] items-center justify-center lg:flex">
  <div className="absolute size-[26rem] rounded-full bg-primary/20 blur-3xl" />

  <img
    src="/techmind-hero-visual.png"
    alt="Visual de documento técnico estructurado en JSON"
    className="relative z-10 w-[115%] max-w-[650px] object-contain drop-shadow-[0_0_60px_rgba(139,92,246,0.35)]"
  />
</div>

</div>
</section>
)
}