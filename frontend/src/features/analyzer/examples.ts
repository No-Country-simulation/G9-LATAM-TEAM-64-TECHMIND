/** Textos de ejemplo que rellenan el formulario con un clic. */

export type AnalyzerExample = {
  label: string
  titulo: string
  texto: string
}

export const ANALYZER_EXAMPLES: AnalyzerExample[] = [
  {
    label: "Spring Boot",
    titulo: "Introducción a Spring Boot",
    texto:
      "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot, incluyendo controladores, servicios, inyección de dependencias y manejo de errores.",
  },
  {
    label: "TF-IDF",
    titulo: "Clasificación de textos con TF-IDF",
    texto:
      "Apuntes sobre vectorización de documentos con TF-IDF en Scikit-Learn, limpieza del corpus, entrenamiento de una regresión logística y evaluación del modelo con matriz de confusión.",
  },
  {
    label: "OCI Storage",
    titulo: "Modelos serializados en OCI Object Storage",
    texto:
      "Guía para crear un bucket en Oracle Cloud Infrastructure, subir el modelo joblib entrenado y descargarlo desde la API en el arranque del contenedor de despliegue.",
  },
]
