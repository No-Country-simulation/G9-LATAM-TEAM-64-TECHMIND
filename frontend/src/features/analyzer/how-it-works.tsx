import { Cpu, FileUp, FileJson } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: FileUp,
    title: "Envío",
    description: "Sube tu archivo o pega tu texto técnico.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Procesamiento",
    description: "Nuestro modelo analiza y extrae información clave.",
  },
  {
    number: "03",
    icon: FileJson,
    title: "Resultado",
    description: "Recibes la respuesta estructurada en JSON.",
  },
]

export function HowItWorks() {
  return (
    <section className="rounded-2xl border border-primary/15 bg-card/40 px-6 py-7 backdrop-blur-sm sm:px-8">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary">
        Cómo funciona
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex items-start gap-4"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-semibold text-primary">
              {step.number}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <step.icon className="size-4 text-primary" />
                <h3 className="font-medium">{step.title}</h3>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="absolute -right-3 top-6 hidden w-6 border-t border-dashed border-primary/35 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}