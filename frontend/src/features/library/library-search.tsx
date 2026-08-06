import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilterChip } from "@/features/library/filter-chip"
import { useLanguage } from "@/language-context"

type LibrarySearchProps = {
  query: string
  onQueryChange: (value: string) => void
  categoria: string
  onCategoriaChange: (value: string) => void
  categorias: string[]
  loading: boolean
}

/** Caja de búsqueda y filtros por categoría de la biblioteca. */
export function LibrarySearch({
  query,
  onQueryChange,
  categoria,
  onCategoriaChange,
  categorias,
  loading,
}: LibrarySearchProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Label htmlFor="library-search" className="sr-only">
          {t("library.search")}
        </Label>
        <Input
          id="library-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t("library.search")}
          className="pl-9"
        />
        {loading && (
          <Loader2
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>

      {categorias.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("library.category")}>
          <FilterChip active={categoria === ""} onClick={() => onCategoriaChange("")}>
            {t("library.allCategories")}
          </FilterChip>
          {categorias.map((cat) => (
            <FilterChip key={cat} active={categoria === cat} onClick={() => onCategoriaChange(cat)}>
              {cat}
            </FilterChip>
          ))}
        </div>
      )}
    </div>
  )
}
