import { useLanguage } from "@/language-context"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-semibold text-foreground">{t("brand.name")}</span> — {t("footer.note")}
        </p>
      </div>
    </footer>
  )
}
