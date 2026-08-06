import { Tag } from "lucide-react"
import type { Keyword } from "@/types"

/** Lista de palabras clave extraídas por el modelo. */
export function KeywordChips({ keywords }: { keywords: Keyword[] }) {
  if (keywords.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-1.5">
      {keywords.map((keyword) => (
        <li key={keyword}>
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">
            <Tag className="size-3 text-muted-foreground" aria-hidden="true" />
            {keyword}
          </span>
        </li>
      ))}
    </ul>
  )
}
