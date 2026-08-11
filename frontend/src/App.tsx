import { MainLayout } from "@/components/layout"
import { LanguageProvider } from "@/language-context"
import { AppRoutes } from "@/routes"

export default function App() {
  return (
    <LanguageProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </LanguageProvider>
  )
}
