import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Contenido no encontrado</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        El identificador solicitado no existe en la base de conocimiento.
      </p>
      <Button render={<Link to={ROUTES.biblioteca} />}>Volver a la biblioteca</Button>
    </div>
  )
}
