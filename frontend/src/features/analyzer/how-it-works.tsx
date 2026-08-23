import { Cpu, FileJson, FileUp } from "lucide-react"

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
    <section className="py-4">
      <p className="mb-7 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary">
        Cómo funciona
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex items-start gap-4"
          >
            <div className="text-4xl font-semibold tracking-tight text-primary">
              {step.number}
            </div>

            <div className="pt-1">
              <div className="mb-2 flex items-center gap-2">
                <step.icon className="size-4 text-primary" />
                <h3 className="font-medium">{step.title}</h3>
              </div>

              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="absolute -right-4 top-6 hidden w-8 border-t border-dashed border-primary/35 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}