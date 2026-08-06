import { NavLink, Link } from "react-router-dom"
import { Layers, Library, ScanText } from "lucide-react"
import { LanguageToggle } from "@/components/layout/language-toggle"
import { ROUTES } from "@/config"
import { useLanguage } from "@/language-context"
import { cn } from "@/lib/cn"

export function SiteHeader() {
  const { t } = useLanguage()

  const links = [
    { to: ROUTES.biblioteca, label: t("nav.biblioteca"), icon: Library, end: false },
    { to: ROUTES.home, label: t("nav.analizar"), icon: ScanText, end: true },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to={ROUTES.home} className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="size-4" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">{t("brand.name")}</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">{t("brand.tagline")}</span>
          </span>
        </Link>

        <nav aria-label={t("brand.name")} className="ml-auto flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <link.icon className="size-4" aria-hidden="true" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <LanguageToggle />
      </div>
    </header>
  )
}
