/** Configuración de la aplicación: entorno, rutas, endpoints y límites.
 *  Único punto del código que lee `import.meta.env`. */

import type { Lang } from "@/types"

// --- Entorno -----------------------------------------------------------------

/** URL base de la API del modelo, sin barra final. Cadena vacía = modo demo. */
export const API_BASE = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "")

/** true cuando hay una API real configurada; false = dataset de muestra local. */
export const API_CONFIGURED = API_BASE.length > 0

/** Token opcional enviado como `Authorization: Bearer`.
 *  Ojo: en una SPA queda expuesto en el bundle. */
export const API_KEY = (import.meta.env.VITE_API_KEY ?? "").trim()

/** Tiempo máximo de espera de una petición, en milisegundos. */
export const API_TIMEOUT_MS = 35_000

// --- Rutas y endpoints -------------------------------------------------------

/** Rutas de la SPA. Usar siempre estas constantes en vez de literales sueltos. */
export const ROUTES = {
  home: "/",
  biblioteca: "/biblioteca",
  contenido: "/contenido/:id",
  /** Construye la ruta de detalle de un contenido concreto. */
  contenidoDetalle: (id: string) => `/contenido/${encodeURIComponent(id)}`,
} as const

/** Endpoints de la API del modelo, relativos a `API_BASE`. */
export const ENDPOINTS = {
  analizar: "/api/contenidos/procesar",
  /** TODO: ruta provisional. Confirmar con backend el path y el nombre del campo
   *  del `multipart/form-data` (ver `ARCHIVO_FORM_FIELD`) antes de integrar. */
  analizarArchivo: "/api/contenidos/archivo",
  contenidos: "/api/contenidos",
  /** No implementado en backend. El detalle no lo necesita: se resuelve desde
   *  el listado cacheado, que ya devuelve el objeto completo de cada contenido.
   *  Queda declarado para cuando el listado crezca y toque paginar. */
  contenidoPorId: (id: string) => `/api/contenidos/${encodeURIComponent(id)}`,
} as const


// --- Comportamiento ----------------------------------------------------------

/** Límites de validación del texto enviado al modelo. */
export const TEXT_LIMITS = { min: 30, max: 20_000 } as const

// --- Documento adjunto -------------------------------------------------------

/** Tamaño máximo aceptado del documento, en bytes (10 MB). */
export const ARCHIVO_MAX_BYTES = 10 * 1024 * 1024

/** Formatos admitidos, tal y como se muestran al usuario. */
export const ARCHIVO_FORMATOS = [".txt", ".pdf", ".docx"] as const

/** Valor del atributo `accept` del input.
 *
 *  Se listan las extensiones y también los tipos MIME: Windows y macOS filtran
 *  por criterios distintos, y con solo uno de los dos algún selector acaba
 *  mostrando archivos que luego se rechazan. */
export const ARCHIVO_ACCEPT = [
  ...ARCHIVO_FORMATOS,
  "text/plain",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",")

/** Nombre del campo del archivo dentro del `multipart/form-data`. */
export const ARCHIVO_FORM_FIELD = "archivo"

/** Extensiones que el modo demo sabe leer en el navegador. El resto se simula. */
export const ARCHIVO_DEMO_LEGIBLE = [".txt", ".md", ".markdown", ".csv", ".json"] as const

/** Retardo del debounce del buscador de la biblioteca, en ms. */
export const SEARCH_DEBOUNCE_MS = 300

/** Idioma inicial de la interfaz. */
export const DEFAULT_LANG: Lang = "es"

/** Umbrales (en %) que determinan el color del medidor de confianza. */
export const CONFIDENCE_THRESHOLDS = { alto: 75, medio: 50 } as const

/** Nº de tarjetas fantasma mientras carga la biblioteca. */
export const SKELETON_ITEMS = 6

/** Máximo de palabras clave mostradas en una tarjeta de contenido. */
export const CARD_KEYWORDS_LIMIT = 4

/** Duración del estado "Copiado" del bloque JSON, en ms. */
export const COPY_FEEDBACK_MS = 1800

/** Latencia simulada en modo demo, para que se vean los estados de carga. */
export const DEMO_LATENCY_MS = 400
