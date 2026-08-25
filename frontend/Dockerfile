# --- Etapa 1: compilar la SPA -----------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Se copian solo los manifiestos primero: mientras no cambien, Docker reutiliza
# la capa de npm ci y no vuelve a descargar dependencias en cada build.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite incrusta las variables VITE_* en el bundle EN TIEMPO DE BUILD, no de
# ejecución. "/" deja las peticiones relativas al origen: el navegador pide a
# la misma máquina que le sirvió la página y nginx las reenvía al backend.
# Como resultado no hay CORS ni hay que conocer la IP al compilar.
ENV VITE_API_URL=/

RUN npm run build

# --- Etapa 2: servir --------------------------------------------------------
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# La imagen de nginx ya trae su propio CMD; no hace falta declararlo.
