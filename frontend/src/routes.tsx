import { Route, Routes } from "react-router-dom"
import { ROUTES } from "@/config"
import BibliotecaPage from "@/pages/biblioteca"
import ContenidoPage from "@/pages/contenido"
import HomePage from "@/pages/home"
import NotFoundPage from "@/pages/not-found"

/** Mapa de rutas de la SPA. Los paths viven en `config/app-config.ts`. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.biblioteca} element={<BibliotecaPage />} />
      <Route path={ROUTES.contenido} element={<ContenidoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
