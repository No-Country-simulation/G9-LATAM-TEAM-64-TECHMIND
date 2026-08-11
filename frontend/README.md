# Sin nombre · Frontend (React + Vite)

Interfaz del MVP de organización inteligente de contenido técnico. Portada desde
el prototipo original en Next.js a una SPA con **React 19 + Vite + TypeScript +
Tailwind v4**.

## Arranque

```bash
npm install
cp .env.example .env   # opcional
npm run dev            # http://localhost:5173
```

Scripts disponibles:

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Chequeo de tipos + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Solo chequeo de tipos |

## Conexión con la API del modelo

El frontend funciona en dos modos según `VITE_API_URL` (en `.env`):

- **Vacía → modo demo.** Se usa el dataset local de `src/lib/demo-data.ts`, con
  un clasificador heurístico simple. La interfaz muestra el aviso "API del modelo
  no configurada".
- **Definida → modo API.** El navegador llama directamente a los endpoints:

  | Endpoint | Uso |
  | --- | --- |
  | `POST /contenido` | Analiza `{ titulo, texto }` y devuelve categoría, probabilidad y palabras clave |
  | `GET /contenidos?q=&categoria=` | Lista y filtra contenidos ya procesados |
  | `GET /contenidos/:id` | Detalle de un contenido y sus relacionados |

El transporte vive en `src/lib/api-client.ts` y cada feature envuelve su endpoint
en su propio `*-service.ts`. Al ser una SPA, las llamadas salen del
navegador: la API debe permitir **CORS** desde el origen del frontend. Como
alternativa en desarrollo, descomenta el bloque `proxy` de `vite.config.ts`.

`VITE_API_KEY` es opcional y se envía como `Authorization: Bearer`. Ojo: en una
SPA queda expuesta en el bundle, úsala solo en entornos de hackatón.

## Estructura

Organización por **features** (dominio) sobre una base compartida, deliberadamente
plana: 12 carpetas para ~2.600 líneas. Cada feature es una carpeta con sus
archivos sueltos; se subdivide cuando crezca, no antes.

```
src/
├── components/            UI reutilizable, sin lógica de dominio
│   ├── common/            content-card, keyword-chips, confidence-meter,
│   │                      json-block, error-notice, demo-notice
│   ├── layout/            site-header, site-footer, language-toggle, main-layout
│   └── ui/                primitivas shadcn sobre @base-ui/react
├── features/              módulos de dominio, cada uno autocontenido
│   ├── analyzer/          analyzer · form · result · hero · use-analyzer ·
│   │                      analyzer-service · examples
│   ├── library/           library · library-search · filter-chip ·
│   │                      use-contenidos · library-service
│   └── contenido/         content-detail · skeleton · use-contenido ·
│                          contenido-service
├── lib/                   infraestructura compartida
│   ├── api-client.ts      fetch tipado + ApiError + timeout
│   ├── demo-*.ts          dataset, motor heurístico y servicio de respaldo
│   ├── cn.ts format.ts    helpers de presentación
│   └── use-debounce.ts    hook transversal
├── pages/                 una ruta por archivo, solo composición
│   └── home · biblioteca · contenido · not-found
├── styles/
│   ├── globals.css        Tailwind v4, @theme y capa base
│   └── variables.css      tokens de color/radio, claro y oscuro
├── config.ts              entorno, ROUTES, ENDPOINTS, límites y constantes
├── types.ts               contratos de dominio, transporte e i18n
├── translations.ts        diccionario es/en (de él deriva TranslationKey)
├── language-context.tsx   provider + useLanguage
├── routes.tsx             mapa de rutas
├── App.tsx                provider + layout + rutas
└── main.tsx               entrada + BrowserRouter
```

Reglas de la organización:

- Un componente vive en `features/` si conoce el dominio; en `components/` si es
  reutilizable y agnóstico.
- Las páginas solo componen: no llaman a servicios ni guardan estado de red.
- Toda llamada a la API pasa por el `*-service.ts` de su feature, que a su vez usa
  `lib/api-client.ts`. Ningún componente hace `fetch`.
- Las rutas se escriben con `ROUTES` de `config.ts`, nunca a mano.
- Cuando una feature pase de ~8 archivos, ahí se parte en `components/` y
  `hooks/`. Mientras tanto, plana.

## Notas del port desde Next.js

- Las API routes (`app/api/*`) se reemplazaron por los servicios de cada feature,
  que llaman a la API desde el cliente. No hay servidor Node en producción: el
  build es estático.
- `next/link` → `Link` de `react-router-dom`; `usePathname` → `useLocation`.
- El detalle de contenido pasó de Server Component a fetch en cliente con estado
  de carga (skeleton) y 404.
- Las fuentes Geist se cargan desde Google Fonts en `index.html` en lugar de
  `next/font`.

## Despliegue

`npm run build` genera `dist/`, servible como sitio estático. Al ser una SPA con
rutas del lado del cliente, el servidor debe hacer *fallback* de cualquier ruta a
`index.html` (en Netlify/Vercel/Nginx: rewrite `/* → /index.html`).
