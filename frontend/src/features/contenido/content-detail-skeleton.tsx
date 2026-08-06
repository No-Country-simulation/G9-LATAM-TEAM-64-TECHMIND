import { Skeleton } from "@/components/ui/skeleton"

/** Esqueleto mostrado mientras se resuelve GET /contenidos/:id. */
export function ContentDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-6 w-40 rounded-md" />
      <Skeleton className="h-10 w-2/3 rounded-md" />
      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  )
}
