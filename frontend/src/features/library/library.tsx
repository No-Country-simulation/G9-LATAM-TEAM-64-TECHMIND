import { Skeleton } from "@/components/ui/skeleton"
import { ContentCard, DemoBadge, ErrorNotice } from "@/components/common"
import { useLanguage } from "@/language-context"
import { LibrarySearch } from "@/features/library/library-search"
import { useContenidos } from "@/features/library/use-contenidos"
import { SKELETON_ITEMS } from "@/config"

/** Contenedor de la feature: búsqueda, filtros y rejilla de resultados. */
export function Library() {
  const { t } = useLanguage()
  const { query, setQuery, categoria, setCategoria, categorias, data, demo, loading, error } = useContenidos()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("library.title")}</h1>
          {demo && <DemoBadge />}
        </div>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">{t("library.description")}</p>
      </div>

      <LibrarySearch
        query={query}
        onQueryChange={setQuery}
        categoria={categoria}
        onCategoriaChange={setCategoria}
        categorias={categorias}
        loading={loading}
      />

      {error && <ErrorNotice title={t("library.error")} message={error} />}

      {loading && !data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-lg" />
          ))}
        </div>
      )}

      {data && (
        <>
          <p className="font-mono text-xs text-muted-foreground">
            {data.total} {t("library.results")}
          </p>
          {data.items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t("library.empty")}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
