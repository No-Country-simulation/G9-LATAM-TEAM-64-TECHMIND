import joblib
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_validate

DATASET = "dataset_backend_refuerzo_v1.xlsx"
MODELO_ACTUAL = "../ml-service/models/modelo_techmind_v2.joblib"
MODELO_CANDIDATO = "modelo_techmind_v3_candidato.joblib"
RESULTADOS = "comparacion_modelos_v2_v3.xlsx"

df = pd.read_excel(DATASET).dropna(subset=["categoria"]).copy()

for columna in ["titulo", "descripcion_adaptada", "palabras_clave"]:
    df[columna] = df[columna].fillna("").astype(str)

df["texto_modelo"] = (
    df["titulo"] + " " +
    df["descripcion_adaptada"] + " " +
    df["palabras_clave"]
).str.replace(",", " ", regex=False).str.replace(r"\s+", " ", regex=True).str.strip()

pipeline = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            strip_accents="unicode",
            ngram_range=(1, 2),
            min_df=1,
            max_df=0.95,
            sublinear_tf=True
        )
    ),
    (
        "modelo",
        LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            random_state=42
        )
    )
])

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

metricas = cross_validate(
    pipeline,
    df["texto_modelo"],
    df["categoria"],
    cv=cv,
    scoring={"accuracy": "accuracy", "f1_macro": "f1_macro"}
)

print("=== VALIDACIÓN CRUZADA DEL CANDIDATO ===")
print("Accuracy promedio:", round(metricas["test_accuracy"].mean(), 4))
print("F1 macro promedio:", round(metricas["test_f1_macro"].mean(), 4))
print("F1 por fold:", [round(x, 4) for x in metricas["test_f1_macro"]])

pipeline.fit(df["texto_modelo"], df["categoria"])
joblib.dump(pipeline, MODELO_CANDIDATO)

modelo_actual = joblib.load(MODELO_ACTUAL)
modelo_nuevo = pipeline

pruebas = [
    {
        "prueba": 1,
        "titulo": "Arquitectura de servicios",
        "texto": """Arquitectura de microservicios y gestión de datos transaccionales. El desarrollo de sistemas distribuidos modernos requiere patrones para mantener la consistencia de los datos entre diferentes bases de datos independientes. Cuando una operación involucra múltiples servicios, las transacciones ACID tradicionales no se pueden aplicar de forma directa. En su lugar, se utilizan patrones como Sagas para gestionar transacciones distribuidas mediante una secuencia de transacciones locales. Para implementar esto de manera confiable, el patrón Outbox permite guardar los eventos en una tabla de la misma base de datos relacional dentro de la misma transacción local antes de publicarlos en un broker de mensajería como Apache Kafka o RabbitMQ. Esto garantiza que la publicación de eventos sea atómica respecto a la modificación de los datos, evitando inconsistencias causadas por fallos de red o caídas del sistema.""",
        "esperada": "Backend"
    },
    {
        "prueba": 2,
        "titulo": "Gestión de concurrencia",
        "texto": """Gestión de concurrencia y manejo de hilos en servidores web. El procesamiento de peticiones simultáneas en un servidor requiere una estrategia eficiente para no agotar los recursos del sistema. Cuando se reciben miles de solicitudes por segundo, el modelo tradicional de un hilo por conexión puede generar un consumo excesivo de memoria debido al overhead del cambio de contexto. Para optimizar esto, los entornos modernos utilizan modelos de entrada/salida no bloqueante basados en un bucle de eventos. Mediante el uso de thread pools y programación asincrónica, el sistema puede atender múltiples solicitudes concurrentes con un número reducido de hilos ejecutándose en paralelo. Además, la implementación de mecanismos de Rate Limiting permite controlar el flujo de tráfico entrante y proteger la aplicación contra sobrecargas o ataques de denegación de servicio.""",
        "esperada": "Backend"
    },
    {
        "prueba": 3,
        "titulo": "Acoplamiento",
        "texto": """La implementación adecuada de la lógica de negocio requiere un diseño que evite el acoplamiento fuerte entre los componentes del sistema. Al utilizar el patrón de Inyección de Dependencias, las clases delegadoras no instancian directamente sus colaboradores, sino que los reciben a través de sus constructores o mediante contenedores de IoC. Esto facilita la creación de pruebas unitarias mediante el uso de objetos simulados y permite intercambiar las implementaciones concretas de los componentes sin alterar la lógica central de la aplicación. Además, la separación de responsabilidades mediante la arquitectura en capas asegura que los controladores solo se encarguen de la orquestación de la solicitud y la respuesta, dejando la validación de reglas de negocio y la transformación de DTOs a la capa de servicios dedicada.""",
        "esperada": "Backend"
    },
    {
        "prueba": 4,
        "titulo": "Introducción a Spring Boot",
        "texto": """En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot, incluyendo controladores, servicios, inyección de dependencias y manejo de errores.""",
        "esperada": "Backend"
    },
    {
        "prueba": 5,
        "titulo": "Clasificación de textos con TF-IDF",
        "texto": """Apuntes sobre vectorización de documentos con TF-IDF en Scikit-Learn, limpieza del corpus, entrenamiento de una regresión logística y evaluación del modelo con matriz de confusión.""",
        "esperada": "Data Science"
    },
    {
        "prueba": 6,
        "titulo": "Modelos serializados en OCI Object Storage",
        "texto": """Guía para crear un bucket en Oracle Cloud Infrastructure, subir el modelo joblib entrenado y descargarlo desde la API en el arranque del contenedor de despliegue.""",
        "esperada": "Cloud/DevOps"
    }
]

filas = []

for prueba in pruebas:
    texto_completo = f"{prueba['titulo']} {prueba['texto']}".strip()

    pred_v2 = str(modelo_actual.predict([texto_completo])[0])
    prob_v2 = float(modelo_actual.predict_proba([texto_completo]).max())

    pred_v3 = str(modelo_nuevo.predict([texto_completo])[0])
    prob_v3 = float(modelo_nuevo.predict_proba([texto_completo]).max())

    filas.append({
        "prueba": prueba["prueba"],
        "titulo": prueba["titulo"],
        "categoria_esperada": prueba["esperada"],
        "prediccion_v2": pred_v2,
        "probabilidad_v2": prob_v2,
        "correcta_v2": pred_v2 == prueba["esperada"],
        "prediccion_v3": pred_v3,
        "probabilidad_v3": prob_v3,
        "correcta_v3": pred_v3 == prueba["esperada"],
        "mejora_probabilidad": prob_v3 - prob_v2,
        "requiere_revision_v3": prob_v3 < 0.50
    })

comparacion = pd.DataFrame(filas)
comparacion.to_excel(RESULTADOS, index=False)

print("\n=== COMPARACIÓN EXTERNA ===")
print(comparacion.to_string(index=False))
print("\nAciertos v2:", int(comparacion["correcta_v2"].sum()), "/ 6")
print("Aciertos v3:", int(comparacion["correcta_v3"].sum()), "/ 6")
print("\nModelo candidato guardado en:", MODELO_CANDIDATO)
print("Resultados guardados en:", RESULTADOS)