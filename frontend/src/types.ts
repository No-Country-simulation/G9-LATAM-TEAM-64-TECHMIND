/** Contratos compartidos: dominio, transporte e i18n. */

import type { TranslationKey } from "@/translations"

// --- Dominio -----------------------------------------------------------------

export type Keyword = string

/** Respuesta de POST /contenido en la API del modelo. */
export type AnalisisResponse = {
  categoria: string
  probabilidad: number
  informacion_adicional: Keyword[]
  /** Extras opcionales que algunos enfoques del modelo pueden devolver. */
  id?: string
  cluster?: string | number
  resumen?: string
  relacionados?: ContenidoResumen[]
}

export type ContenidoResumen = {
  id: string
  titulo: string
  categoria: string
  probabilidad: number
  informacion_adicional: Keyword[]
  similitud?: number
  creado_en?: string
}

export type Contenido = ContenidoResumen & {
  texto: string
  resumen?: string
  relacionados?: ContenidoResumen[]
}

export type ListaContenidos = {
  total: number
  items: ContenidoResumen[]
  categorias?: string[]
}

/** Entrada del formulario de análisis por texto pegado. */
export type AnalisisInput = {
  titulo: string
  texto: string
}

/** Entrada del formulario de análisis por documento adjunto.
 *  Se envía como `multipart/form-data`, no como JSON. */
export type AnalisisArchivoInput = {
  titulo: string
  archivo: File
}

/** Modo activo del analizador: se envía texto pegado o un documento, nunca ambos. */
export type AnalyzerMode = "texto" | "archivo"

/** Filtros del listado de la biblioteca. */
export type ContenidoFiltros = {
  q?: string
  categoria?: string
}

// --- Transporte --------------------------------------------------------------

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

/** Sobre uniforme que devuelven todos los servicios de las features.
 *  `demo` es true cuando la respuesta viene del dataset de muestra local
 *  porque `VITE_API_URL` todavía no está configurada. */
export type ApiEnvelope<T> = {
  data: T | null
  error: string | null
  demo: boolean
}

export type ApiRequestOptions = {
  method?: HttpMethod
  body?: unknown
  searchParams?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

// --- i18n --------------------------------------------------------------------

export type Lang = "es" | "en"

export type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

export type { TranslationKey }
