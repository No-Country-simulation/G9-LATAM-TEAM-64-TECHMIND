/** Cliente HTTP compartido por todos los servicios de features.
 *
 *  Sustituye a las API routes de Next.js: al ser una SPA, el navegador llama
 *  directamente a la API del modelo. La API debe permitir CORS desde el origen
 *  del frontend (o usar el proxy de `vite.config.ts` en desarrollo).
 */

import { API_BASE, API_KEY, API_TIMEOUT_MS } from "@/config"
import type { ApiRequestOptions } from "@/types"

/** Error de transporte o de negocio devuelto por la API. */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function buildUrl(path: string, searchParams: ApiRequestOptions["searchParams"]) {
  const url = new URL(`${API_BASE}${path}`)
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value))
  }
  return url
}

function buildSignal(signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(API_TIMEOUT_MS)
  return signal ? AbortSignal.any([signal, timeout]) : timeout
}

function extractError(parsed: unknown, status: number): string {
  const payload = parsed as { detail?: string; message?: string; error?: string } | null
  return payload?.detail ?? payload?.message ?? payload?.error ?? `HTTP ${status}`
}

/** Lee la respuesta como JSON y lanza `ApiError` si el estado no es 2xx. */
async function parseResponse<T>(response: Response, path: string): Promise<T> {
  const raw = await response.text()
  let parsed: unknown = null
  try {
    parsed = raw ? JSON.parse(raw) : null
  } catch {
    throw new ApiError(`Respuesta no JSON de ${path} (HTTP ${response.status})`, response.status)
  }

  if (!response.ok) throw new ApiError(extractError(parsed, response.status), response.status)

  return parsed as T
}

/** Petición JSON tipada contra la API del modelo. Lanza `ApiError` si falla. */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }
  if (options.body !== undefined) headers["Content-Type"] = "application/json"
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`

  const response = await fetch(buildUrl(path, options.searchParams), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: buildSignal(options.signal),
  })

  return parseResponse<T>(response, path)
}

/** Subida `multipart/form-data`. No fija `Content-Type`: el navegador lo genera
 *  con el `boundary` correcto, y ponerlo a mano rompe el parseo en el servidor. */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options: Pick<ApiRequestOptions, "searchParams" | "signal"> = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`

  const response = await fetch(buildUrl(path, options.searchParams), {
    method: "POST",
    headers,
    body: formData,
    signal: buildSignal(options.signal),
  })

  return parseResponse<T>(response, path)
}

/** Normaliza cualquier excepción en un mensaje mostrable al usuario. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return `La API del modelo no respondió a tiempo (${API_TIMEOUT_MS / 1000}s).`
  }
  return error instanceof Error ? error.message : "Error desconocido"
}
