import type * as React from "react"
import { cn } from "@/lib/cn"

type FilterChipProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

/** Botón de filtro por categoría con estado activo. */
export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
