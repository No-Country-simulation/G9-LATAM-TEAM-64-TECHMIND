FROM python:3.12-slim

WORKDIR /app

# curl para el healthcheck del compose. --no-install-recommends evita arrastrar
# paquetes que no se usan.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Las dependencias primero, por la misma razón que en los otros Dockerfiles.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# El modelo v3 viaja en el repositorio, así que el servicio arranca sin
# credenciales de OCI: main.py intenta descargar de Object Storage y, si no
# puede, usa la copia local.
RUN useradd --create-home ml && chown -R ml:ml /app
USER ml

EXPOSE 8000

# --host 0.0.0.0 es obligatorio dentro de un contenedor: por defecto uvicorn
# escucha solo en 127.0.0.1 y nadie de fuera podría alcanzarlo.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
