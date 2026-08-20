/** Diccionario de traducciones de la interfaz (es/en).
 *  Las claves de `TranslationKey` se derivan de este objeto, así que añadir
 *  una entrada nueva basta para que el autocompletado y el chequeo de tipos
 *  la reconozcan en todo el proyecto. */

export const DICT = {
  es: {
    "brand.name": "Sin nombre",
    "brand.tagline": "Base de conocimiento técnico inteligente",
    "nav.analizar": "Analizar",
    "nav.biblioteca": "Biblioteca",
    "nav.api": "API",
    "lang.label": "Idioma",

    "hero.eyebrow": "Organización automática de contenido técnico",
    "hero.title": "Convierte texto técnico en conocimiento estructurado",
    "hero.subtitle":
      "Envía documentación, apuntes o material de curso y recibe clasificación temática, palabras clave y contenidos relacionados en JSON, listos para consumir por otras aplicaciones.",
    "hero.stat1": "Clasificación temática",
    "hero.stat2": "Extracción de palabras clave",
    "hero.stat3": "Recomendación de relacionados",

    "analyzer.title": "Analizar contenido",
    "analyzer.description": "El texto se envía al modelo entrenado y la respuesta se devuelve en JSON.",
    "analyzer.titulo": "Título",
    "analyzer.tituloPlaceholder": "Introducción a Spring Boot",
    "analyzer.texto": "Texto técnico",
    "analyzer.textoPlaceholder":
      "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot...",
    "analyzer.submit": "Procesar contenido",
    "analyzer.loading": "Procesando",
    "analyzer.clear": "Limpiar",
    "analyzer.examples": "Ejemplos de uso",
    "analyzer.chars": "caracteres",
    "analyzer.minChars": "Mínimo 30 caracteres.",
    "analyzer.textoDisabled": "Se analizará el documento adjunto en lugar de este texto.",
    "analyzer.fileLabel": "Documento",
    "analyzer.fileAttach": "Adjuntar documento",
    "analyzer.fileHint": "Máximo 10 MB. Sustituye al texto pegado.",
    "analyzer.fileRemove": "Quitar documento",
    "analyzer.fileMode": "Se enviará el documento adjunto",
    "analyzer.submitFile": "Procesar documento",

    "result.empty.title": "Sin resultados todavía",
    "result.empty.body": "Envía un texto para ver la categoría predicha, la confianza del modelo y las palabras clave extraídas.",
    "result.categoria": "Categoría predicha",
    "result.confianza": "Confianza del modelo",
    "result.keywords": "Información adicional",
    "result.relacionados": "Contenidos relacionados",
    "result.json": "Respuesta JSON",
    "result.copy": "Copiar",
    "result.copied": "Copiado",
    "result.error": "No se pudo procesar el contenido",

    "library.title": "Biblioteca",
    "library.description": "Consulta y filtra los contenidos ya procesados por el modelo.",
    "library.search": "Buscar por título, palabra clave o texto",
    "library.category": "Categoría",
    "library.allCategories": "Todas las categorías",
    "library.results": "resultados",
    "library.empty": "Ningún contenido coincide con la búsqueda.",
    "library.error": "No se pudo cargar la biblioteca",

    "detail.back": "Volver a la biblioteca",
    "detail.texto": "Texto original",
    "detail.notFound": "Contenido no encontrado",
    "detail.similitud": "similitud",
    "detail.metadata": "Metadatos",
    "detail.id": "Identificador",
    "detail.creado": "Registrado",

    "demo.badge": "Datos de muestra",
    "demo.title": "API del modelo no configurada",
    "demo.body":
      "Define la variable de entorno CONTENIDO_API_URL con la URL de la API desplegada en OCI. Mientras tanto, la interfaz usa un conjunto de datos local de ejemplo.",
    "footer.note": "MVP de organización inteligente de contenido técnico.",
  },
  en: {
    "brand.name": "Sin nombre",
    "brand.tagline": "Intelligent technical knowledge base",
    "nav.analizar": "Analyze",
    "nav.biblioteca": "Library",
    "nav.api": "API",
    "lang.label": "Language",

    "hero.eyebrow": "Automatic technical content organization",
    "hero.title": "Turn technical text into structured knowledge",
    "hero.subtitle":
      "Send documentation, study notes or course material and get topic classification, keywords and related content as JSON, ready to be consumed by other applications.",
    "hero.stat1": "Topic classification",
    "hero.stat2": "Keyword extraction",
    "hero.stat3": "Related content recommendation",

    "analyzer.title": "Analyze content",
    "analyzer.description": "The text is sent to the trained model and the response comes back as JSON.",
    "analyzer.titulo": "Title",
    "analyzer.tituloPlaceholder": "Getting started with Spring Boot",
    "analyzer.texto": "Technical text",
    "analyzer.textoPlaceholder":
      "This content covers the basic concepts for building REST APIs using Java and Spring Boot...",
    "analyzer.submit": "Process content",
    "analyzer.loading": "Processing",
    "analyzer.clear": "Clear",
    "analyzer.examples": "Usage examples",
    "analyzer.chars": "characters",
    "analyzer.minChars": "Minimum 30 characters.",
    "analyzer.textoDisabled": "The attached document will be analyzed instead of this text.",
    "analyzer.fileLabel": "Document",
    "analyzer.fileAttach": "Attach document",
    "analyzer.fileHint": "Up to 10 MB. Replaces the pasted text.",
    "analyzer.fileRemove": "Remove document",
    "analyzer.fileMode": "The attached document will be sent",
    "analyzer.submitFile": "Process document",

    "result.empty.title": "No results yet",
    "result.empty.body": "Submit a text to see the predicted category, model confidence and extracted keywords.",
    "result.categoria": "Predicted category",
    "result.confianza": "Model confidence",
    "result.keywords": "Additional information",
    "result.relacionados": "Related content",
    "result.json": "JSON response",
    "result.copy": "Copy",
    "result.copied": "Copied",
    "result.error": "The content could not be processed",

    "library.title": "Library",
    "library.description": "Browse and filter the content already processed by the model.",
    "library.search": "Search by title, keyword or text",
    "library.category": "Category",
    "library.allCategories": "All categories",
    "library.results": "results",
    "library.empty": "No content matches your search.",
    "library.error": "The library could not be loaded",

    "detail.back": "Back to library",
    "detail.texto": "Original text",
    "detail.notFound": "Content not found",
    "detail.similitud": "similarity",
    "detail.metadata": "Metadata",
    "detail.id": "Identifier",
    "detail.creado": "Registered",

    "demo.badge": "Sample data",
    "demo.title": "Model API not configured",
    "demo.body":
      "Set the CONTENIDO_API_URL environment variable to the URL of the API deployed on OCI. Until then, the interface uses a local sample dataset.",
    "footer.note": "MVP for intelligent technical content organization.",
  },
} as const

/** Cualquier clave válida del diccionario, p. ej. "hero.title". */
export type TranslationKey = keyof (typeof DICT)["es"]
