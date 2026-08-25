/** Fuente de datos de respaldo usada cuando `VITE_API_URL` no está configurada.
 *  Expone las mismas operaciones que la API real para que los servicios de cada
 *  feature puedan alternar entre ambas sin cambiar su firma. */

import { ARCHIVO_DEMO_LEGIBLE, DEMO_LATENCY_MS } from "@/config"
import { DEMO_CONTENIDOS } from "@/lib/demo-data"
import { demoAnalizar } from "@/lib/demo-engine"
import type {
  AnalisisArchivoInput,
  AnalisisInput,
  AnalisisResponse,
  Contenido,
  ContenidoBackendDTO,
} from "@/types"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Nivel textual de confianza, con los mismos umbrales que el servicio de ML. */
function nivelConfianza(probabilidad: number): string {
  if (probabilidad >= 0.75) return "alta"
  if (probabilidad >= 0.5) return "media"
  return "baja"
}

/** Adapta un contenido de muestra a la forma que devuelve el backend, para que
 *  el modo demo y el modo API compartan exactamente el mismo camino de datos. */
function toBackendDTO(contenido: Contenido): ContenidoBackendDTO {
  return {
    id: contenido.id,
    titulo: contenido.titulo,
    texto: contenido.texto,
    categoria: contenido.categoria,
    etiquetas: contenido.informacion_adicional,
    confianza: nivelConfianza(contenido.probabilidad),
    probabilidad: contenido.probabilidad,
    palabrasClave: contenido.informacion_adicional,
    temasRelacionados: contenido.temas ?? null,
    resumenCorto: contenido.resumen ?? null,
    requiereRevision: contenido.probabilidad < 0.5,
    fechaRegistro: contenido.creado_en ?? "",
  }
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

/** Listado completo de muestra, en el formato del backend. El filtrado lo
 *  aplica la biblioteca en memoria, igual que en modo API. */
export function demoListarContenidos(): ContenidoBackendDTO[] {
  return DEMO_CONTENIDOS.map(toBackendDTO)
}
