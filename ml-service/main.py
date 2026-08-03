from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()

# Carga de modelos al iniciar el servicio (Single load)
# Asegúrate de que las rutas coincidan con la estructura ml-service/models/
model_path = "models/modelo_clasificador.joblib"
vectorizer_path = "models/vectorizer.joblib"

if os.path.exists(model_path) and os.path.exists(vectorizer_path):
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
else:
    raise FileNotFoundError("Modelos no encontrados en la carpeta models/")

# Definición del contrato de entrada
class InputData(BaseModel):
    titulo: str
    texto: str

# Definición del contrato de salida
class PredictionResult(BaseModel):
    categoria: str
    probabilidad: float
    palabras_clave: list[str]
    temas_relacionados: list[str]
    resumen_corto: str | None
    requiere_revision: bool

@app.post("/predict", response_model=PredictionResult)
def predict(data: InputData):
    # Regla de negocio: concatenar para procesar
    full_text = f"{data.titulo}. {data.texto}".strip()
    
    # Inferencia
    text_vector = vectorizer.transform([full_text])
    categoria = model.predict(text_vector)[0]
    probabilidad = float(model.predict_proba(text_vector).max())
    
    # Aplicar lógica de negocio acordada
    # Umbral de confianza 50%
    requiere_revision = probabilidad < 0.50
    
    return {
        "categoria": categoria,
        "probabilidad": probabilidad,
        "palabras_clave": [], # Pendiente de lógica de Data Analyst
        "temas_relacionados": [], # Pendiente de lógica de Data Analyst
        "resumen_corto": None,
        "requiere_revision": requiere_revision
    }
