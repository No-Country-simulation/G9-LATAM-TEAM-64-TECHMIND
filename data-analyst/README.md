# Data Analyst — TechMind

## Objetivo

Clasificar contenido técnico en cinco categorías mediante un pipeline de Machine Learning basado en TF-IDF y Logistic Regression.

## Categorías

- Backend
- Bases de Datos
- Cloud/DevOps
- Data Science
- Frontend

## Archivos

- `TechMind_EDA.ipynb`: limpieza, análisis exploratorio, entrenamiento, evaluación y validación del modelo.
- `dataset_final_actualizado_FINAL_103filas.xlsx`: dataset original utilizado para la carga y limpieza.
- `modelo_techmind_v2.joblib`: pipeline final serializado con TF-IDF y Logistic Regression.

## Dataset final

Después de eliminar 5 filas completamente vacías, el dataset quedó con:

- 98 registros válidos
- 5 categorías balanceadas
- 13 columnas

## Resultados del modelo

### Split de prueba

- Accuracy: 95 %
- F1 macro: 94.92 %
- DummyClassifier: 20 %

### Validación cruzada estratificada de 5 folds

- Accuracy promedio: 85.79 % ± 4.73 %
- F1 macro promedio: 85.83 % ± 4.51 %

## Artefacto final

El archivo `modelo_techmind_v2.joblib` contiene el pipeline completo:

1. Vectorización TF-IDF
2. Clasificación con Logistic Regression

El artefacto fue guardado, cargado nuevamente y validado con una predicción desde cero.

## Uso básico

```python
import joblib

modelo = joblib.load("modelo_techmind_v2.joblib")

texto = ["Desarrollo de una API REST con Java y Spring Boot"]

categoria = modelo.predict(texto)[0]
probabilidad = modelo.predict_proba(texto)[0].max()

print("Categoría:", categoria)
print("Probabilidad:", round(float(probabilidad), 4))
```
## Salida del modelo

La categoría y la probabilidad provienen directamente del modelo.

Los campos:

- `palabras_clave`
- `temas_relacionados`
- `resumen_corto`

corresponden a una etapa de enriquecimiento complementario.

## Nota sobre artefactos anteriores

Los archivos `modelo_clasificador.joblib` y `vectorizer.joblib` pertenecen a una versión anterior, donde el modelo y el vectorizador se guardaban por separado.

La versión recomendada para integración es:

`modelo_techmind_v2.joblib`
