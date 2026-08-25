import numpy as np
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_predict

df = pd.read_excel("dataset_backend_refuerzo_v1.xlsx")
df = df.dropna(subset=["categoria"]).copy()

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

probabilidades = cross_val_predict(
    pipeline,
    df["texto_modelo"],
    df["categoria"],
    cv=cv,
    method="predict_proba"
)

clases = np.array(sorted(df["categoria"].unique()))
indices = probabilidades.argmax(axis=1)
predicciones = clases[indices]
confianzas = probabilidades.max(axis=1)
correctas = predicciones == df["categoria"].to_numpy()

print("Accuracy global OOF:", round(correctas.mean(), 4))
print("Confianza mínima:", round(confianzas.min(), 4))
print("Confianza media:", round(confianzas.mean(), 4))
print("Confianza máxima:", round(confianzas.max(), 4))

print("\n=== ANÁLISIS DE UMBRALES ===")

for umbral in [0.25, 0.30, 0.35, 0.40, 0.45, 0.50]:
    automaticas = confianzas >= umbral
    cantidad = automaticas.sum()
    cobertura = automaticas.mean()

    if cantidad > 0:
        precision_automatica = correctas[automaticas].mean()
        errores_automaticos = (~correctas[automaticas]).sum()
    else:
        precision_automatica = 0
        errores_automaticos = 0

    print(
        f"Umbral {umbral:.2f} | "
        f"Cobertura {cobertura:.1%} | "
        f"Precisión automática {precision_automatica:.1%} | "
        f"Errores automáticos {errores_automaticos}"
    )