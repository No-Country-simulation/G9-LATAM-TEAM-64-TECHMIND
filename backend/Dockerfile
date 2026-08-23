# --- Etapa 1: compilar el jar -----------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# El pom primero: mientras no cambien las dependencias, esta capa se reutiliza
# y no hay que volver a descargar medio Maven Central en cada build.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Etapa 2: ejecutar ------------------------------------------------------
# Solo el JRE, sin Maven ni el código fuente: la imagen final baja de ~800 MB a
# ~250 MB.
FROM eclipse-temurin:21-jre

WORKDIR /app

# No correr como root dentro del contenedor.
RUN useradd --create-home --shell /bin/bash spring
USER spring

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

# Definido en application.properties (server.port=8081).
EXPOSE 8081

# Memoria. La JVM respeta el límite del contenedor en vez de mirar la RAM de la
# máquina entera, pero MaxRAMPercentage solo gobierna el heap: metaspace, pilas
# de hilos y los buffers directos de Netty viven fuera de esa cuenta. Con 70 %
# el total se pasa del límite del contenedor y el kernel mata el proceso.
#
# -XX:+ExitOnOutOfMemoryError hace que un fallo de memoria termine el proceso de
# inmediato en lugar de dejarlo agonizando entre GCs: el reinicio es limpio y el
# log dice qué pasó.
ENTRYPOINT ["java", \
  "-XX:MaxRAMPercentage=50", \
  "-XX:MaxDirectMemorySize=64m", \
  "-XX:+ExitOnOutOfMemoryError", \
  "-jar", "app.jar"]
