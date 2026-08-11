import { useParams } from "react-router-dom"
import { ErrorNotice } from "@/components/common"
import { ContentDetail } from "@/features/contenido/content-detail"
import { ContentDetailSkeleton } from "@/features/contenido/content-detail-skeleton"
import { useContenido } from "@/features/contenido/use-contenido"
import NotFoundPage from "@/pages/not-found"

export default function ContenidoPage() {
  const { id = "" } = useParams<{ id: string }>()
  const { contenido, demo, loading, error, notFound } = useContenido(id)

  if (notFound) return <NotFoundPage />

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {loading && <ContentDetailSkeleton />}

      {!loading && !contenido && (
        <div className="mx-auto max-w-2xl py-6">
          <ErrorNotice title="No se pudo cargar el contenido" message={error ?? "Error desconocido"} />
        </div>
      )}

      {!loading && contenido && <ContentDetail contenido={contenido} demo={demo} />}
    </div>
  )
}
