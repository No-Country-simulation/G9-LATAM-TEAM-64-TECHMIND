# Data Analyst — TechMind

## Objetivo

Clasificar contenido técnico en cinco categorías mediante un pipeline de Machine Learning basado en TF-IDF y Logistic Regression.

## Categorías

- Backend
- Bases de Datos
- Cloud/DevOps
- Data Science
- Frontend

## Estado de los modelos

- **Modelo estable:** v3, utilizado actualmente por `ml-service`.
- **Modelo candidato:** v4, evaluado sin reemplazar el modelo estable.

El candidato v4 mejora las métricas globales de validación cruzada, pero todavía presenta errores en dos casos externos de Backend. Por este motivo, v3 continúa siendo la versión recomendada para integración.

## Archivos del candidato v4

- `TechMind_EDA_modelo_v4_candidato.ipynb`: análisis exploratorio, entrenamiento, validación cruzada y evaluación externa.
- `dataset_techmind_candidato_v4.xlsx`: dataset enriquecido y balanceado utilizado para entrenar el candidato.
- `modelo_techmind_v4_candidato.joblib`: pipeline candidato con TF-IDF y Logistic Regression.
- `resultados_pruebas_externas_v4.csv`: resultados de las seis pruebas externas, incluyendo confianza, segunda categoría, margen y necesidad de revisión.

## Dataset candidato

El archivo contiene 130 filas, de las cuales 5 están completamente vacías. Después de eliminarlas, el dataset queda con:

- 125 registros válidos
- 13 columnas
- 5 categorías
- 25 registros por categoría

El dataset anterior contenía 98 registros válidos. El enriquecimiento incorporó 27 ejemplos nuevos y mantuvo el balance entre las categorías.

## Preparación del texto

Para entrenar el candidato se combinan:

- título
- descripción adaptada
- palabras clave

El pipeline utiliza TF-IDF con unigramas y bigramas, seguido de una regresión logística con balance de clases.

## Resultados del candidato v4

### División de entrenamiento y prueba

- Registros de entrenamiento: 100
- Registros de prueba: 25
- Accuracy: 88 %
- F1 macro: 88.16 %

### Validación cruzada estratificada de 5 folds

- Accuracy promedio: 88.80 %
- Desviación de accuracy: 3.92 %
- F1 macro promedio: 88.24 %
- Desviación de F1 macro: 4.07 %

### Comparación con DummyClassifier

- Dummy accuracy promedio: 20 %
- Dummy F1 macro promedio: 6.67 %
- Mejora del candidato en accuracy: 68.80 puntos porcentuales
- Mejora del candidato en F1 macro: 81.57 puntos porcentuales

## Comparación v3 vs. candidato v4

| Métrica | Modelo estable v3 | Candidato v4 |
|---|---:|---:|
| Accuracy promedio CV | 85.79 % | 88.80 % |
| F1 macro promedio CV | 85.83 % | 88.24 % |
| Desviación de accuracy | 4.73 % | 3.92 % |
| Desviación de F1 macro | 4.51 % | 4.07 % |
| Pruebas externas correctas | 6/6 | 4/6 |

Aunque v4 mejora las métricas globales y presenta menor variabilidad, no supera a v3 en la validación externa.

Los casos de concurrencia y bajo acoplamiento todavía se confunden con Frontend. Por ello, v4 se conserva como candidato y no reemplaza al modelo estable v3.

## Confianza y revisión manual

Las pruebas externas registran:

- categoría predicha
- confianza de la predicción
- segunda categoría más probable
- segunda probabilidad
- margen entre las dos categorías
- indicador `requiere_revision`

`requiere_revision` se activa cuando la confianza es menor que `0.30`.

## Uso básico del candidato v4

```python
import joblib

modelo = joblib.load("modelo_techmind_v4_candidato.joblib")

texto = [
    "Desarrollo de una API REST con Java y Spring Boot"
]

categoria = modelo.predict(texto)[0]
probabilidad = modelo.predict_proba(texto)[0].max()

print("Categoría:", categoria)
print("Probabilidad:", round(float(probabilidad), 4))
