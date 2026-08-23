import pandas as pd

archivo = "dataset_backend_refuerzo_v1.xlsx"

df = pd.read_excel(archivo)
df = df.dropna(how="all").copy()

nuevos = [
    {
        "id": "BE-021",
        "titulo": "Coordinación de operaciones distribuidas con Sagas",
        "descripcion": "Patrones de coordinación para procesos que atraviesan varios servicios.",
        "categoria": "Backend",
        "subtema": "Microservicios y transacciones distribuidas",
        "palabras_clave": "backend, microservicios, sagas, compensación, consistencia, servicios distribuidos",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Diseño de un flujo backend distribuido donde cada microservicio ejecuta una operación local y utiliza acciones de compensación cuando una etapa falla, manteniendo la consistencia sin depender de una transacción global.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "microservicios, consistencia eventual, transacciones distribuidas",
        "resumen_corto": "Uso de Sagas para coordinar operaciones entre microservicios."
    },
    {
        "id": "BE-022",
        "titulo": "Publicación confiable de eventos con Transactional Outbox",
        "descripcion": "Persistencia y publicación segura de eventos desde servicios backend.",
        "categoria": "Backend",
        "subtema": "Mensajería y eventos",
        "palabras_clave": "backend, outbox, eventos, mensajería, kafka, rabbitmq, persistencia",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Implementación del patrón Transactional Outbox para registrar cambios de negocio y eventos pendientes en una misma operación local, permitiendo que un proceso backend publique posteriormente los mensajes en Kafka o RabbitMQ.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "arquitectura orientada a eventos, brokers, consistencia",
        "resumen_corto": "Patrón Outbox para publicar eventos backend de manera confiable."
    },
    {
        "id": "BE-023",
        "titulo": "Control de concurrencia mediante pools de trabajadores",
        "descripcion": "Administración de tareas simultáneas en un servidor.",
        "categoria": "Backend",
        "subtema": "Concurrencia",
        "palabras_clave": "backend, concurrencia, thread pool, trabajadores, solicitudes, servidor",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Configuración de un pool limitado de trabajadores para que un servidor backend procese solicitudes concurrentes sin crear un hilo ilimitado por cada conexión, controlando el consumo de memoria y CPU.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "hilos, rendimiento, servidores",
        "resumen_corto": "Pools de trabajadores para procesar solicitudes concurrentes."
    },
    {
        "id": "BE-024",
        "titulo": "Prevención de condiciones de carrera",
        "descripcion": "Protección de recursos compartidos en procesos concurrentes.",
        "categoria": "Backend",
        "subtema": "Sincronización",
        "palabras_clave": "backend, condición de carrera, sincronización, bloqueos, recursos compartidos",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Análisis de una aplicación backend donde varias tareas modifican el mismo recurso y pueden producir resultados inconsistentes. Se aplican mecanismos de sincronización, operaciones atómicas y secciones críticas.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "concurrencia, atomicidad, exclusión mutua",
        "resumen_corto": "Sincronización para evitar condiciones de carrera."
    },
    {
        "id": "BE-025",
        "titulo": "Procesamiento asíncrono con colas de tareas",
        "descripcion": "Ejecución diferida de trabajos costosos fuera de la solicitud principal.",
        "categoria": "Backend",
        "subtema": "Asincronía",
        "palabras_clave": "backend, asincronía, colas, workers, tareas, procesamiento",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Separación de tareas pesadas como envío de correos y generación de reportes mediante una cola. La API responde rápidamente y los workers backend consumen los trabajos de forma asíncrona.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "workers, mensajería, procesamiento diferido",
        "resumen_corto": "Colas y workers para procesamiento asíncrono."
    },
    {
        "id": "BE-026",
        "titulo": "Inversión de control e inyección de dependencias",
        "descripcion": "Separación entre la lógica de negocio y sus implementaciones técnicas.",
        "categoria": "Backend",
        "subtema": "Diseño de software",
        "palabras_clave": "backend, inyección de dependencias, inversión de control, contenedor, servicios",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Diseño de servicios backend que reciben repositorios y clientes externos mediante el constructor. Un contenedor de inversión de control administra las instancias y facilita sustituir implementaciones durante las pruebas.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "IoC, testing, arquitectura limpia",
        "resumen_corto": "Inyección de dependencias para desacoplar servicios backend."
    },
    {
        "id": "BE-027",
        "titulo": "Bajo acoplamiento mediante puertos e interfaces",
        "descripcion": "Diseño modular para intercambiar infraestructura sin alterar el dominio.",
        "categoria": "Backend",
        "subtema": "Arquitectura por capas",
        "palabras_clave": "backend, bajo acoplamiento, interfaces, puertos, adaptadores, arquitectura",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Organización de una aplicación backend para que la lógica central dependa de contratos y no de bases de datos o proveedores concretos. Los adaptadores implementan las interfaces y mantienen aislado el dominio.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "arquitectura hexagonal, SOLID, modularidad",
        "resumen_corto": "Interfaces y adaptadores para reducir el acoplamiento."
    },
    {
        "id": "BE-028",
        "titulo": "Protección de APIs mediante rate limiting",
        "descripcion": "Control del tráfico entrante y prevención de saturación.",
        "categoria": "Backend",
        "subtema": "Rendimiento y seguridad",
        "palabras_clave": "backend, rate limiting, api, servidor, tráfico, solicitudes, límites",
        "fuente": "Refuerzo sintético controlado",
        "url": "",
        "tipo_fuente": "Caso de entrenamiento",
        "descripcion_adaptada": "Aplicación de límites por cliente y ventana de tiempo para proteger una API backend frente a ráfagas de solicitudes. El servidor rechaza temporalmente el exceso y conserva recursos para usuarios legítimos.",
        "fecha_recoleccion": "2026-08-14",
        "temas_relacionados": "throttling, seguridad de APIs, disponibilidad",
        "resumen_corto": "Rate limiting para evitar la saturación de una API."
    }
]

refuerzo = pd.DataFrame(nuevos)
df = df[~df["id"].astype(str).isin(refuerzo["id"].astype(str))].copy()
resultado = pd.concat([df, refuerzo], ignore_index=True)
resultado.to_excel(archivo, index=False)

print("Filas válidas anteriores:", len(df))
print("Ejemplos añadidos:", len(refuerzo))
print("Filas válidas actuales:", len(resultado))
print(resultado["categoria"].value_counts())