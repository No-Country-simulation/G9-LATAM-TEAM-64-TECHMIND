import { cn } from "@/lib/cn"
import { CONFIDENCE_THRESHOLDS } from "@/config"
import { toPercent } from "@/lib/format"

/** Barra de confianza del modelo. `value` es una probabilidad entre 0 y 1. */
export function ConfidenceMeter({ value, label }: { value: number; label: string }) {
  const pct = toPercent(value)
  const tone =
    pct >= CONFIDENCE_THRESHOLDS.alto
      ? "bg-primary"
      : pct >= CONFIDENCE_THRESHOLDS.medio
        ? "bg-signal"
        : "bg-muted-foreground"

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold tabular-nums">{pct}%</span>
      </div>
      <div
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div className={cn("h-full rounded-full transition-all duration-500", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
