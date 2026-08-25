# Frontend — trabajo realizado

Estado a 23 de agosto de 2026. Todo lo marcado está en `develop` o en una rama
con PR abierto.

## Base del proyecto

- [x] Inicializar React 19 + Vite 7 + TypeScript en modo estricto
- [x] Portar los componentes del prototipo de Next.js a una SPA
- [x] Configurar Tailwind v4, shadcn sobre `@base-ui/react` y react-router 7
- [x] Definir la estructura de carpetas por features y aplanarla tras revisión (de 37 carpetas a 12)
- [x] Centralizar entorno, rutas, endpoints y límites en un único `config.ts`

## Analizador

- [x] Formulario de título y texto con validación de longitud mínima y máxima
- [x] Botón de adjuntar documento, excluyente con el texto pegado
- [x] Restringir los formatos admitidos a TXT, PDF y DOCX
- [x] Mostrar los formatos y el tamaño máximo junto al botón de adjuntar
- [x] Validar la extensión en cliente, porque el atributo `accept` se puede esquivar
- [x] Mostrar el nivel de confianza en la tarjeta de resultado
- [x] Corregir el medidor, que marcaba 0 % siempre por confundir `confianza` con `probabilidad`
- [x] Ejemplos precargados para probar sin escribir nada

## Biblioteca

- [x] Conectar el listado a `GET /api/contenidos`
- [x] Buscador con retardo de 300 ms
- [x] Filtrar por categoría en memoria, sin lanzar peticiones a la API
- [x] Cachear el listado con TanStack Query
- [x] Distinguir la primera carga (esqueleto) de la revalidación en segundo plano
- [x] Invalidar la caché al analizar contenido nuevo, para que aparezca al volver

## Detalle del documento

- [x] Resolver el detalle desde el listado ya cacheado, sin endpoint propio
- [x] Eliminar el error de red que salía al entrar en un documento

## Integración con la API

- [x] Cliente HTTP compartido con tiempo de espera, errores tipados y subida multipart
- [x] Capa de adaptadores para traducir los DTO del backend a los tipos de la interfaz
- [x] Modo demo automático con datos de muestra cuando no hay `VITE_API_URL`
- [x] Alinear rutas y el nombre del campo del `multipart/form-data` con el backend

## Marca e interfaz

- [x] Renombrar a TechMind by Orbit Lab e integrar el logo en SVG
- [x] Pie de página con los cuatro integrantes y enlaces a LinkedIn y GitHub
- [x] Iconos de marca propios, porque lucide-react ya no los distribuye
- [x] Tema oscuro
- [x] Interfaz bilingüe en español e inglés
- [x] Reordenar la navegación: Biblioteca antes que Analizar

## Despliegue

- [x] Dockerfile multietapa que compila con Node y sirve con nginx
- [x] Configuración de nginx con proxy hacia el backend y reenvío de rutas del SPA
- [x] Desplegar en Vercel

## Pendiente

- [ ] Confirmar que `VITE_API_URL` entra en el build de Vercel — si aparece la marca "datos de muestra", no entró
- [ ] Verificar que al recargar `/contenido/:id` directamente no salga un 404
- [ ] Descargar el documento original desde el detalle (requiere que el backend lo guarde primero)
- [ ] Revisar el aviso de copiar JSON: `navigator.clipboard` solo existe sobre HTTPS
