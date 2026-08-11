import { useLanguage } from "@/language-context"
import type { Lang } from "@/types"
import { cn } from "@/lib/cn"

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
]

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="flex items-center rounded-md border border-border bg-card p-0.5"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          aria-pressed={lang === option.value}
          className={cn(
            "rounded-sm px-2 py-1 font-mono text-xs font-medium transition-colors",
            lang === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
