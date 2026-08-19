from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel, field_validator
import joblib
import oci

app = FastAPI()

# Carga del pipeline:
# intenta descargar v3 desde OCI Object Storage;
# si OCI no está disponible, utiliza la copia local.
BASE_DIR = Path(__file__).resolve().parent

LOCAL_PIPELINE_PATH = (
    BASE_DIR / "models" / "modelo_techmind_v3.joblib"
)

OCI_PIPELINE_PATH = (
    BASE_DIR / "models" / "modelo_techmind_v3_oci.joblib"
)

OCI_BUCKET_NAME = "techmind-storage"
OCI_OBJECT_NAME = "models/modelo_techmind_v3.joblib"


def descargar_modelo_desde_oci() -> Path:
    config = oci.config.from_file()

    client = oci.object_storage.ObjectStorageClient(config)
    namespace = client.get_namespace().data

    response = client.get_object(
        namespace_name=namespace,
        bucket_name=OCI_BUCKET_NAME,
        object_name=OCI_OBJECT_NAME,
    )

    OCI_PIPELINE_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(OCI_PIPELINE_PATH, "wb") as archivo:
        archivo.write(response.data.content)

    return OCI_PIPELINE_PATH


try:
    pipeline_path = descargar_modelo_desde_oci()
    pipeline = joblib.load(pipeline_path)

    print(
        "Modelo v3 cargado correctamente desde "
        "OCI Object Storage"
    )

except Exception as error:
    print(
        f"No se pudo cargar el modelo v3 desde OCI: {error}"
    )
    print("Usando modelo v3 local como fallback...")

    if LOCAL_PIPELINE_PATH.exists():
        pipeline = joblib.load(LOCAL_PIPELINE_PATH)
        print("Modelo v3 local cargado correctamente")
    else:
        raise FileNotFoundError(
            "No se pudo obtener el modelo v3 desde OCI "
            "y tampoco existe el modelo local en: "
            f"{LOCAL_PIPELINE_PATH}"
        ) from error

# Definición del contrato de entrada
class InputData(BaseModel):
    titulo: str
    texto: str

    @field_validator("titulo", "texto")
    @classmethod
    def validar_texto_no_vacio(cls, valor: str) -> str:
        valor_limpio = valor.strip()

        if not valor_limpio:
            raise ValueError("El campo no puede estar vacío")

        return valor_limpio

# Definición del contrato de salida
class PredictionResult(BaseModel):
    categoria: str
    probabilidad: float
    confianza: str
    palabras_clave: list[str]
    temas_relacionados: list[str]
    resumen_corto: str | None
    requiere_revision: bool
    
def extraer_palabras_clave(
    texto: str,
    limite: int = 5
) -> list[str]:
    # Obtener el vectorizador TF-IDF del pipeline
    vectorizer = pipeline.named_steps["tfidf"]

    # Vectorizar el texto
    vector_texto = vectorizer.transform([texto])

    # Obtener vocabulario y pesos
    terminos = vectorizer.get_feature_names_out()
    puntuaciones = vector_texto.toarray()[0]

    # Ordenar por mayor peso TF-IDF
    indices = puntuaciones.argsort()[::-1]

    terminos_genericos = {
    # Artículos
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",

    # Preposiciones
    "de",
    "del",
    "en",
    "con",
    "por",
    "para",
    "sin",
    "sobre",
    "entre",
    "hasta",
    "desde",
    "hacia",

    # Conectores
    "y",
    "o",
    "e",
    "u",

    # Verbos frecuentes
    "usar",
    "usando",
    "utilizar",
    "utilizando",
    "crear",
    "creando",
    "desarrollar",
    "desarrollo",
    "implementar",
    "implementación",

    # Términos demasiado genéricos
    "api",
    "rest",
    "servicio",
    "servicios",
    "aplicación",
    "sistema",
    "proyecto",
    "software",
    "desarrollo de"
}

    palabras_clave = []

    for indice in indices:
        if puntuaciones[indice] <= 0:
            break

        termino = str(terminos[indice]).strip()

        if termino in terminos_genericos:
            continue

        partes = termino.split()

        if partes and (
            partes[0] in terminos_genericos
            or partes[-1] in terminos_genericos
        ):
            continue

        es_redundante = any(
            termino in palabra_existente.split()
            or palabra_existente in termino.split()
            for palabra_existente in palabras_clave
        )

        if es_redundante:
            continue

        palabras_clave.append(termino)

        if len(palabras_clave) >= limite:
            break
    conceptos_compuestos = {
        ("machine", "learning"): "machine learning",
        ("deep", "learning"): "deep learning",
        ("spring", "boot"): "spring boot",
        ("oracle", "cloud"): "oracle cloud",
        ("object", "storage"): "object storage",
    }

    for (primera, segunda), concepto in conceptos_compuestos.items():
        if primera in palabras_clave and segunda in palabras_clave:
            palabras_clave = [
                palabra
                for palabra in palabras_clave
                if palabra not in {primera, segunda}
            ]

            palabras_clave.insert(0, concepto)

    return palabras_clave[:limite]

def obtener_temas_relacionados(
    categoria: str,
    limite: int = 3
) -> list[str]:
    temas_por_categoria = {
        "Data Science": [
            "Machine Learning",
            "Análisis de datos",
            "Modelos predictivos",
        ],
        "Backend": [
            "APIs REST",
            "Arquitectura de servicios",
            "Desarrollo del lado del servidor",
        ],
        "Bases de Datos": [
            "Consultas SQL",
            "Modelado de datos",
            "Gestión de bases de datos",
        ],
        "Cloud/DevOps": [
            "Computación en la nube",
            "Despliegue de aplicaciones",
            "Automatización e infraestructura",
        ],
        "Frontend": [
            "Interfaces web",
            "Experiencia de usuario",
            "Desarrollo del lado del cliente",
        ],
    }

    temas = temas_por_categoria.get(categoria, [])

    return temas[:limite]   


def generar_resumen_corto(
    titulo: str,
    texto: str,
    limite: int = 160
) -> str:
    contenido = f"{titulo}. {texto}".strip()

    if len(contenido) <= limite:
        return contenido

    return contenido[:limite].rsplit(" ", 1)[0] + "..."

@app.post("/predict", response_model=PredictionResult)
def predict(data: InputData):
    # Regla de negocio: concatenar para procesar
    full_text = f"{data.titulo}. {data.texto}".strip()
    
    # Inferencia
    categoria = str(pipeline.predict([full_text])[0])
    probabilidad = float(pipeline.predict_proba([full_text]).max())
    palabras_clave = extraer_palabras_clave(
    texto=full_text,
    limite=5
    )

    temas_relacionados = obtener_temas_relacionados(
        categoria=categoria,
        limite=3
    )
    resumen_corto = generar_resumen_corto(
    titulo=data.titulo,
    texto=data.texto,
    limite=160
)
    # Aplicar lógica de negocio acordada
    # Umbral de confianza: Alta >= 0.40, Media >= 0.30, Baja < 0.30
    if probabilidad >= 0.40:
        confianza = "alta"
    elif probabilidad >= 0.30:
        confianza = "media"
    else:
        confianza = "baja"
    
    requiere_revision = probabilidad < 0.30
    
    return {
        "categoria": categoria,
        "probabilidad": probabilidad,
        "confianza": confianza,
        "palabras_clave": palabras_clave,
        "temas_relacionados": temas_relacionados, 
        "resumen_corto": resumen_corto,
        "requiere_revision": requiere_revision
    }
