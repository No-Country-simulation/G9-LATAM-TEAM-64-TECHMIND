/** Análisis contra la API del modelo: texto pegado (POST /contenido) o
 *  documento adjunto (POST /contenido/archivo, ruta aún por confirmar). */

import { apiRequest, apiUpload, toErrorMessage } from "@/lib/api-client"
import { demoAnalizarArchivo, demoAnalizarContenido } from "@/lib/demo-service"
import type { AnalisisArchivoInput, AnalisisInput, AnalisisResponse, ApiEnvelope } from "@/types"
import {
  API_CONFIGURED,
  ARCHIVO_FORMATOS,
  ARCHIVO_FORM_FIELD,
  ARCHIVO_MAX_BYTES,
  ENDPOINTS,
  TEXT_LIMITS,
} from "@/config"

/** Valida la entrada antes de gastar una llamada a la API. */
export function validarTexto(texto: string): string | null {
  const limpio = texto.trim()
  if (limpio.length < TEXT_LIMITS.min) {
    return `El campo 'texto' es obligatorio y debe tener al menos ${TEXT_LIMITS.min} caracteres.`
  }
  if (limpio.length > TEXT_LIMITS.max) {
    return `El campo 'texto' excede el máximo de ${TEXT_LIMITS.max.toLocaleString("es")} caracteres.`
  }
  return null
}

export async function analizarContenido(
  input: AnalisisInput,
  signal?: AbortSignal,
): Promise<ApiEnvelope<AnalisisResponse>> {
  const payload: AnalisisInput = { titulo: input.titulo.trim(), texto: input.texto.trim() }

  const invalido = validarTexto(payload.texto)
  if (invalido) return { data: null, error: invalido, demo: !API_CONFIGURED }

  if (!API_CONFIGURED) {
    return { data: await demoAnalizarContenido(payload), error: null, demo: true }
  }

  try {
    const data = await apiRequest<AnalisisResponse>(ENDPOINTS.analizar, {
      method: "POST",
      body: payload,
      signal,
    })
    return { data, error: null, demo: false }
  } catch (error) {
    return { data: null, error: toErrorMessage(error), demo: false }
  }
}

/** Formatea bytes para los mensajes de error de validación. */
function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

/** Valida el documento antes de subirlo.
 *
 *  El atributo `accept` del input solo filtra lo que muestra el selector: el
 *  usuario puede cambiar a "todos los archivos" y elegir cualquier cosa. Por
 *  eso la extensión se comprueba aquí también. */
export function validarArchivo(archivo: File | null): string | null {
  if (!archivo) return "Selecciona un documento para analizar."
  if (archivo.size === 0) return "El documento está vacío."
  if (archivo.size > ARCHIVO_MAX_BYTES) {
    return `El documento supera el máximo de ${formatBytes(ARCHIVO_MAX_BYTES)}.`
  }

  const nombre = archivo.name.toLowerCase()
  if (!ARCHIVO_FORMATOS.some((ext) => nombre.endsWith(ext))) {
    return `Formato no admitido. Solo se aceptan ${listarFormatos()}.`
  }

  return null
}

/** "TXT, PDF o DOCX" — para mensajes y para la ayuda del formulario. */
export function listarFormatos(): string {
  const nombres = ARCHIVO_FORMATOS.map((ext) => ext.replace(".", "").toUpperCase())
  return `${nombres.slice(0, -1).join(", ")} o ${nombres.at(-1)}`
}

/** Sube un documento al modelo como `multipart/form-data`.
 *
 *  TODO: pendiente de confirmar con backend la ruta (`ENDPOINTS.analizarArchivo`)
 *  y el nombre del campo (`ARCHIVO_FORM_FIELD`). Se asume que la respuesta tiene
 *  la misma forma que POST /contenido. */
export async function analizarArchivo(
  input: AnalisisArchivoInput,
  signal?: AbortSignal,
): Promise<ApiEnvelope<AnalisisResponse>> {
  const invalido = validarArchivo(input.archivo)
  if (invalido) return { data: null, error: invalido, demo: !API_CONFIGURED }

  const titulo = input.titulo.trim()

  if (!API_CONFIGURED) {
    return { data: await demoAnalizarArchivo({ titulo, archivo: input.archivo }), error: null, demo: true }
  }

  const formData = new FormData()
  formData.append(ARCHIVO_FORM_FIELD, input.archivo, input.archivo.name)
  if (titulo) formData.append("titulo", titulo)

  try {
    const data = await apiUpload<AnalisisResponse>(ENDPOINTS.analizarArchivo, formData, { signal })
    return { data, error: null, demo: false }
  } catch (error) {
    return { data: null, error: toErrorMessage(error), demo: false }
  }
}
