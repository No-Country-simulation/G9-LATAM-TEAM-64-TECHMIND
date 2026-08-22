/** Fuente de datos de respaldo usada cuando `VITE_API_URL` no está configurada.
 *  Expone las mismas operaciones que la API real para que los servicios de cada
 *  feature puedan alternar entre ambas sin cambiar su firma. */

import { ARCHIVO_DEMO_LEGIBLE, DEMO_LATENCY_MS } from "@/config"
import { DEMO_CATEGORIAS, DEMO_CONTENIDOS } from "@/lib/demo-data"
import { demoAnalizar, demoRelacionados } from "@/lib/demo-engine"
import type {
  AnalisisArchivoInput,
  AnalisisInput,
  AnalisisResponse,
  Contenido,
  ContenidoResumen,
  ListaContenidos,
} from "@/types"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toResumen(contenido: Contenido): ContenidoResumen {
  const { id, titulo, categoria, probabilidad, informacion_adicional, creado_en, texto } = contenido
  return { id, titulo, categoria, probabilidad, informacion_adicional, creado_en, texto }
}

export async function demoAnalizarContenido(input: AnalisisInput): Promise<AnalisisResponse> {
  await delay(DEMO_LATENCY_MS)
  return demoAnalizar(input.titulo, input.texto)
}

/** true si el navegador puede leer el archivo como texto plano sin librerías. */
function esLegibleEnCliente(archivo: File): boolean {
  const nombre = archivo.name.toLowerCase()
  return archivo.type.startsWith("text/") || ARCHIVO_DEMO_LEGIBLE.some((ext) => nombre.endsWith(ext))
}

/** Analiza un documento sin backend.
 *
 *  Si es texto plano se lee de verdad y se pasa por el mismo clasificador
 *  heurístico que el texto pegado. Con PDF o DOCX no se puede extraer el
 *  contenido en el navegador sin una librería pesada, así que se clasifica a
 *  partir del nombre del archivo: suficiente para enseñar el flujo en la demo,
 *  pero el resultado no describe el contenido real del documento. */
export async function demoAnalizarArchivo(input: AnalisisArchivoInput): Promise<AnalisisResponse> {
  await delay(DEMO_LATENCY_MS * 2)

  const titulo = input.titulo.trim() || input.archivo.name

  if (esLegibleEnCliente(input.archivo)) {
    const texto = await input.archivo.text()
    return demoAnalizar(titulo, texto)
  }

  const pistaDelNombre = input.archivo.name.replace(/[._-]+/g, " ").replace(/\.[a-z0-9]+$/i, "")
  const resultado = demoAnalizar(titulo, pistaDelNombre)
  return { ...resultado, probabilidad: Math.min(resultado.probabilidad, 0.5) }
}

/** Listado completo de muestra. El filtrado lo aplica la biblioteca en memoria
 *  con `filtrarContenidos`, igual que en modo API. */
export function demoListarContenidos(): ListaContenidos {
  const items = DEMO_CONTENIDOS.map(toResumen)
  return { total: items.length, items, categorias: DEMO_CATEGORIAS }
}

/** Devuelve el contenido con sus relacionados, o `null` si el id no existe. */
export function demoObtenerContenido(id: string): Contenido | null {
  const found = DEMO_CONTENIDOS.find((contenido) => contenido.id === id)
  if (!found) return null
  return { ...found, relacionados: demoRelacionados(id) }
}
