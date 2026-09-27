# Archivo de investigación · Antony Valverde R.

Sitio que reúne las síntesis, investigaciones y artículos científicos de Antony Valverde Rojas (Universidad Nacional de Costa Rica).

## Stack

React 18 + Vite · `motion` (animaciones) · `lenis` (scroll suave en escritorio) · CSS Modules con design tokens · Vitest.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `build/` |
| `npm run preview` | Sirve el build localmente |
| `npm test` | Pruebas (Vitest + Testing Library) |
| `npm run thumbs` | Regenera miniaturas y `src/data/documents.meta.json` desde los PDFs |
| `npm run icons` | Regenera `logo192/512.png` y `og-image.png` |

## Agregar un documento

1. Copia el PDF a `public/documents/` con un nombre slug (`investigacion-7-tema.pdf`).
2. Ejecuta `npm run thumbs`.
3. Añade la entrada en `src/data/documents.js` (con el mismo `slug`).

## Estructura

```
src/
  components/   background · layout · hero · explorer · card · viewer · timeline · about · ui
  data/         documents.js (contenido) · site.js (textos) · documents.meta.json (generado)
  hooks/        tema, filtros en URL, visor (#/doc/<slug>), sección activa, media queries
  lib/          búsqueda sin tildes, scroll
  styles/       tokens.css · global.css
```
