import type * as React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { DEFAULT_LANG } from "@/config"
import { DICT, type TranslationKey } from "@/translations"
import type { Lang, LanguageContextValue } from "@/types"

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key: TranslationKey) => DICT[lang][key] ?? key, [lang])

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>")
  return context
}
