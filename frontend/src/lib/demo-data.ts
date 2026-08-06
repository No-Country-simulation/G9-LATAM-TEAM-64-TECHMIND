import type { Contenido } from "@/types"

/** Dataset de muestra local. Solo se usa mientras `VITE_API_URL` no esté
 *  configurada, para que la interfaz siga siendo explorable antes de desplegar
 *  la API del modelo. */
export const DEMO_CONTENIDOS: Contenido[] = [
  {
    id: "c-001",
    titulo: "Introducción a Spring Boot",
    texto:
      "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot. Se cubren anotaciones como @RestController y @Service, inyección de dependencias, configuración con application.yml y el manejo de excepciones con @ControllerAdvice.",
    categoria: "Backend",
    probabilidad: 0.89,
    informacion_adicional: ["Java", "Spring Boot", "API REST", "Inyección de dependencias"],
    creado_en: "2026-07-14T10:12:00Z",
    resumen: "Fundamentos para exponer APIs REST con Java y Spring Boot.",
  },
  {
    id: "c-002",
    titulo: "TF-IDF y clasificación de textos con Scikit-Learn",
    texto:
      "Guía práctica sobre vectorización de textos con TfidfVectorizer, limpieza de corpus, stopwords en español, entrenamiento de una regresión logística y evaluación con precisión, recall y matriz de confusión.",
    categoria: "Ciencia de Datos",
    probabilidad: 0.94,
    informacion_adicional: ["TF-IDF", "Scikit-Learn", "Regresión Logística", "NLP"],
    creado_en: "2026-07-16T08:40:00Z",
    resumen: "Pipeline clásico de clasificación de texto con TF-IDF.",
  },
  {
    id: "c-003",
    titulo: "Object Storage en OCI para modelos serializados",
    texto:
      "Anotaciones sobre cómo crear un bucket en Oracle Cloud Infrastructure, subir artefactos joblib del modelo entrenado, generar pre-authenticated requests y descargarlos desde la API en tiempo de arranque.",
    categoria: "Cloud",
    probabilidad: 0.91,
    informacion_adicional: ["OCI", "Object Storage", "joblib", "Despliegue"],
    creado_en: "2026-07-18T15:05:00Z",
    resumen: "Almacenamiento y consumo de modelos serializados en OCI.",
  },
  {
    id: "c-004",
    titulo: "Componentes de servidor y streaming en React",
    texto:
      "Material de curso sobre React Server Components, suspense boundaries, streaming de HTML, hidratación parcial y cómo dividir la interfaz para reducir el JavaScript enviado al cliente.",
    categoria: "Frontend",
    probabilidad: 0.87,
    informacion_adicional: ["React", "Server Components", "Streaming", "Rendimiento"],
    creado_en: "2026-07-20T11:30:00Z",
    resumen: "Renderizado en servidor y streaming aplicado a interfaces React.",
  },
  {
    id: "c-005",
    titulo: "Índices y planes de ejecución en PostgreSQL",
    texto:
      "Documentación interna sobre EXPLAIN ANALYZE, índices B-tree y GIN, estadísticas del planificador, y estrategias para optimizar consultas con joins y filtros de texto completo.",
    categoria: "Bases de Datos",
    probabilidad: 0.92,
    informacion_adicional: ["PostgreSQL", "Índices", "EXPLAIN", "Optimización"],
    creado_en: "2026-07-22T09:15:00Z",
    resumen: "Cómo leer planes de ejecución y elegir índices en PostgreSQL.",
  },
  {
    id: "c-006",
    titulo: "Contenedores Docker para APIs de inferencia",
    texto:
      "Tutorial de empaquetado de una API de inferencia en Docker: imágenes multi-stage, requirements congelados, variables de entorno, healthchecks y publicación de la imagen en un registro.",
    categoria: "DevOps",
    probabilidad: 0.88,
    informacion_adicional: ["Docker", "Multi-stage", "Healthcheck", "CI/CD"],
    creado_en: "2026-07-24T17:50:00Z",
    resumen: "Containerización de servicios de inferencia paso a paso.",
  },
  {
    id: "c-007",
    titulo: "Búsqueda semántica con embeddings y similitud coseno",
    texto:
      "Notas de estudio sobre generación de embeddings de documentos, almacenamiento vectorial, cálculo de similitud coseno y construcción de un recomendador de contenidos relacionados.",
    categoria: "Ciencia de Datos",
    probabilidad: 0.9,
    informacion_adicional: ["Embeddings", "Similitud coseno", "Recomendación", "Búsqueda semántica"],
    creado_en: "2026-07-26T13:20:00Z",
    resumen: "Recomendación de contenidos usando vectores y similitud.",
  },
  {
    id: "c-008",
    titulo: "Validación de entrada y manejo de errores en APIs REST",
    texto:
      "Referencia sobre validación de payloads, códigos de estado HTTP correctos, respuestas de error consistentes en JSON y registro estructurado de fallos en servicios de inferencia.",
    categoria: "Backend",
    probabilidad: 0.85,
    informacion_adicional: ["Validación", "HTTP", "Manejo de errores", "Observabilidad"],
    creado_en: "2026-07-28T07:05:00Z",
    resumen: "Buenas prácticas de validación y errores en APIs REST.",
  },
]

export const DEMO_CATEGORIAS = Array.from(new Set(DEMO_CONTENIDOS.map((c) => c.categoria))).sort()

export const CATEGORY_RULES: { categoria: string; terms: string[]; keywords: string[] }[] = [
  {
    categoria: "Ciencia de Datos",
    terms: ["modelo", "dataset", "pandas", "sklearn", "scikit", "tf-idf", "tfidf", "embedding", "nlp", "regresión", "clasificación", "entrenamiento", "machine learning"],
    keywords: ["Python", "Scikit-Learn", "NLP"],
  },
  {
    categoria: "Backend",
    terms: ["api", "rest", "endpoint", "spring", "java", "node", "fastapi", "servidor", "controller", "microservicio"],
    keywords: ["API REST", "Backend", "HTTP"],
  },
  {
    categoria: "Frontend",
    terms: ["react", "css", "componente", "interfaz", "ui", "next", "vue", "navegador", "hidratación"],
    keywords: ["React", "UI", "Componentes"],
  },
  {
    categoria: "Cloud",
    terms: ["oci", "oracle", "aws", "azure", "bucket", "object storage", "nube", "despliegue", "compute", "functions"],
    keywords: ["OCI", "Despliegue", "Cloud"],
  },
  {
    categoria: "Bases de Datos",
    terms: ["sql", "postgres", "índice", "query", "consulta", "tabla", "mongo", "transacción"],
    keywords: ["SQL", "Modelado", "Consultas"],
  },
  {
    categoria: "DevOps",
    terms: ["docker", "kubernetes", "pipeline", "ci/cd", "contenedor", "imagen", "terraform", "monitoreo"],
    keywords: ["Docker", "CI/CD", "Infraestructura"],
  },
]

export const STOPWORDS = new Set(
  "de la que el en y a los del se las por un para con no una su al lo como más pero sus le ya o este sí porque esta entre cuando muy sin sobre también me hasta hay donde quien desde todo nos durante the of and to in for is on with este esta estos estas contenido utilizando".split(
    " ",
  ),
)
