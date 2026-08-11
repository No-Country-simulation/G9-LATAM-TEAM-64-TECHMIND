/** Sustituto local y heurístico del modelo entrenado. Solo en modo demo. */
import { CATEGORY_RULES, DEMO_CONTENIDOS, STOPWORDS } from "@/lib/demo-data"
import type { Contenido, ContenidoResumen } from "@/types"

/** Clasificador heurístico que imita la respuesta del modelo. */
export function demoAnalizar(titulo: string, texto: string) {
  const haystack = `${titulo} ${texto}`.toLowerCase()

  let best = { categoria: "General", score: 0, keywords: [] as string[] }
  for (const rule of CATEGORY_RULES) {
    const score = rule.terms.reduce((acc, t) => (haystack.includes(t) ? acc + 1 : acc), 0)
    if (score > best.score) best = { categoria: rule.categoria, score, keywords: rule.keywords }
  }

  const probabilidad = best.score === 0 ? 0.42 : Math.min(0.97, 0.6 + best.score * 0.07)

  const freq = new Map<string, number>()
  for (const raw of haystack.split(/[^\p{L}\p{N}+#.-]+/u)) {
    const word = raw.replace(/^[.-]+|[.-]+$/g, "")
    if (word.length < 4 || STOPWORDS.has(word)) continue
    freq.set(word, (freq.get(word) ?? 0) + 1)
  }
  const topTerms = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1))

  const informacion_adicional = Array.from(new Set([...best.keywords, ...topTerms])).slice(0, 6)

  const relacionados = DEMO_CONTENIDOS.filter((c) => c.categoria === best.categoria)
    .slice(0, 3)
    .map(({ id, titulo: t, categoria, probabilidad: p, informacion_adicional: k }) => ({
      id,
      titulo: t,
      categoria,
      probabilidad: p,
      informacion_adicional: k,
      similitud: Number((0.6 + Math.random() * 0.35).toFixed(2)),
    }))

  return { categoria: best.categoria, probabilidad, informacion_adicional, relacionados }
}

export function demoRelacionados(id: string) {
  const base = DEMO_CONTENIDOS.find((c) => c.id === id)
  if (!base) return [] as ContenidoResumen[]
  const baseTokens = new Set(
    `${base.titulo} ${base.texto} ${base.informacion_adicional.join(" ")}`
      .toLowerCase()
      .split(/[^\p{L}\p{N}+#.-]+/u)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
  )

  const overlap = (c: Contenido) => {
    const tokens = new Set(
      `${c.titulo} ${c.texto} ${c.informacion_adicional.join(" ")}`
        .toLowerCase()
        .split(/[^\p{L}\p{N}+#.-]+/u)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
    )
    let shared = 0
    for (const token of tokens) if (baseTokens.has(token)) shared += 1
    // Jaccard-style score, nudged up when the category matches.
    const jaccard = shared / (baseTokens.size + tokens.size - shared || 1)
    return Math.min(0.98, jaccard * 2.2 + (c.categoria === base.categoria ? 0.28 : 0))
  }

  return DEMO_CONTENIDOS.filter((c) => c.id !== id)
    .sort((a, b) => overlap(b) - overlap(a))
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      titulo: c.titulo,
      categoria: c.categoria,
      probabilidad: c.probabilidad,
      informacion_adicional: c.informacion_adicional,
      similitud: Number(overlap(c).toFixed(2)),
      creado_en: c.creado_en,
    }))
}
