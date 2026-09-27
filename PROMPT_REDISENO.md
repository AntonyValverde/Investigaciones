# Prompt: Rediseño completo del sitio "Investigaciones" de Antony Valverde

## 0. Rol y objetivo

Eres un ingeniero frontend senior y diseñador de interfaces con experiencia en sitios editoriales/académicos premium, motion design y rendimiento web. Vas a **rediseñar y reconstruir por completo** el sitio web de este repositorio: un portafolio informativo donde Antony Valverde publica sus síntesis, trabajos de investigación y artículos científicos en PDF.

El resultado debe sentirse como un **archivo de investigación digital de alta gama**: serio y legible como una revista académica, pero moderno, vivo e interactivo. Debe funcionar de forma impecable en **monitores grandes (1920px+), laptops (1280–1440px), tablets (768–1024px, vertical y horizontal) y móviles (360–430px)**.

Todo el contenido visible del sitio va en **español**.

---

## 1. Estado actual (lo que existe hoy)

Stack: React 18 + Create React App (`react-scripts 5`), CSS plano con variables. Sin librerías de UI ni de animación.

Archivos:
- `src/App.js`: define tres arrays en línea (`sintesis`, `investigaciones`, `articulos`), importa 10 PDFs desde `src/Documents/` y renderiza tres `<Section>`.
- `src/components/Header.js`: encabezado sticky con blur; solo título "Investigaciones" (15px) y subtítulo.
- `src/components/DocumentList.js` + `DocumentItem.js`: grid `auto-fit minmax(280px,1fr)` de tarjetas con título, descripción y botones "Ver" / "Descargar".
- `src/components/Footer.js`: dos cajas ("Sobre el creador", "Contacto") con email, LinkedIn y GitHub.
- `src/index.css`: tokens de diseño (colores claro/oscuro vía `prefers-color-scheme`, radios, sombras, `--ease`), foco visible y soporte de `prefers-reduced-motion`.

### 1.1 Problemas de diseño detectados
1. **Sin jerarquía visual**: el `h1` mide 15px, los títulos de sección 16px, las tarjetas 14px y el texto 12–12.5px. Todo tiene el mismo peso; nada invita a leer.
2. **No hay hero ni propuesta de valor**: el visitante no sabe quién es el autor, de qué tratan las investigaciones ni por qué importan.
3. **Tarjetas genéricas**: todas iguales, sin portada ni miniatura del PDF, sin año, sin temática, sin número de páginas ni etiquetas. "Investigación 1..6" como título no aporta información; el título real está escondido en la descripción.
4. **Sin navegación, búsqueda ni filtros**: con 10 documentos ya cuesta encontrar algo, y va a empeorar al crecer.
5. **Paleta monocromática** (azul `#2563eb` + grises slate): correcta pero sin personalidad; las tres categorías no se distinguen.
6. **Movimiento casi nulo**: solo un `translateY(-1px)` en hover.
7. **Modo oscuro solo automático**: no hay botón para cambiar el tema.
8. **Breakpoints inconsistentes** (420px, 520px, 760px dispersos en distintos archivos) y sin un sistema fluido de espaciado o tipografía.
9. **Footer pobre**: © 2024 escrito a mano y ningún llamado a la acción.

### 1.2 Bugs y deuda técnica a corregir durante el rediseño
- `DocumentItem.css`: `-webkit-line-clam: 2` tiene un error tipográfico (debe ser `-webkit-line-clamp`), así que el recorte de títulos no funciona. Agrega también `line-clamp`.
- `App.js`: el componente `Section` está definido **dentro** de `App`, así que se recrea en cada render. Muévelo a su propio archivo.
- `DocumentList.js`: usa `key={index}`; usa un `id`/`slug` estable.
- `public/index.html`: `lang="en"` (debe ser `es`), `meta description` por defecto de CRA y `theme-color #000000`.
- `public/manifest.json`: sigue siendo "React App / Create React App Sample".
- `src/App.test.js`: busca el texto "learn react", que no existe, así que la prueba falla.
- `src/logo.svg` no se usa.
- Los nombres de los PDFs tienen espacios, tildes y `^`, lo que da URLs frágiles. Renómbralos a slugs ASCII (ej. `investigacion-3-ia-pymes-cr-2021-2023.pdf`) usando `git mv` para conservar el historial.
- Create React App está deprecado. Migra a **Vite**.

### 1.3 Inventario de contenido (conservar TODO, reestructurado)

| # | Categoría | Título actual | Descripción/tema real | Archivo |
|---|---|---|---|---|
| 1 | Síntesis | Síntesis 1 | Sociedad de la Información, Sociedad Digital, Sociedad de Control | `LagunaJordan_ValverdeAntony_Síntesis^N1.pdf` |
| 2 | Síntesis | Síntesis 2 | Contaminación del agua por metales pesados | `Contaminación del agua por metales pesados.pdf` |
| 3 | Síntesis | Síntesis 3 | De tecnologías digitales y usos. Un recorrido por los desafíos actuales | `LagunaJordan_ValverdeAntony_SíntesisN^N2.pdf` |
| 4 | Investigación | Investigación 1 | IMAS: desigualdad en acceso a la tecnología en Costa Rica 2019-2024 | `LagunaJordan_ValverdeRojas_Trabajo_Investigación^N1.pdf` |
| 5 | Investigación | Investigación 2 | Presentación sobre diseños de investigación | `Presentación sobre diseños de investigación.pdf` |
| 6 | Investigación | Investigación 3 | IA en el desarrollo laboral en Pymes de Costa Rica (2021-2023) | `Uso de la Inteligencia artificial ... (3).pdf` |
| 7 | Investigación | Investigación 4 | Librerías de visión computacional aplicadas a dermatología | `Librerías informáticas utilizadas en análisis de imágenes dermatológicas ....pdf` |
| 8 | Investigación | Investigación 5 | Tecnología digital para habilidades en educación costarricense 2019-2024 | `LagunaJordan_ValverdeRojas_Trabajo_Investigación^N3.pdf` |
| 9 | Investigación | Investigación 6 | Tecnología inteligente para desarrollo industrial agrícola 2019-2024 | `LagunaJordan_ValverdeRojas_Trabajo_Investigación^NN4.pdf` |
| 10 | Artículo científico | Artículo científico 1 | IA en el desarrollo laboral en Pymes de Costa Rica (2021-2023) | `Uso de la Inteligencia artificial ...(1).pdf` |

Notas sobre el contenido:
- Usa el **tema real como título principal** de cada tarjeta. "Síntesis 1" / "Investigación 3" pasan a ser una etiqueta secundaria (ej. `INV · 03`).
- La "Investigación 2" es una **presentación**: márcala con el tipo `presentación`.
- La Investigación 3 y el Artículo 1 tratan el mismo tema en formatos distintos. Enlázalos entre sí ("Ver también la versión artículo científico").
- **No inventes** años, autores ni páginas. Extrae de cada PDF su número de páginas, su tamaño, su año y sus autores (con `pdfjs-dist`, leyendo la portada o los metadatos). Si un dato no se puede verificar, deja el campo vacío y márcalo con `// TODO: confirmar`.

---

## 2. Stack y arquitectura objetivo

- **React 18 + Vite** (JavaScript; TypeScript es opcional si no complica la migración).
- **Estilos**: CSS Modules + un archivo global de design tokens (`src/styles/tokens.css`). Mantén el enfoque actual con variables CSS; no uses Tailwind.
- **Animación**: `motion` (Framer Motion) para las animaciones de layout, `AnimatePresence`, los reveals y los gestos. `lenis` para scroll suave **solo en dispositivos con puntero fino** (en táctil se usa el scroll nativo).
- **Íconos**: `lucide-react`.
- **Fuentes auto-alojadas** con `@fontsource-variable/*` (sin depender de Google Fonts en tiempo de ejecución).
- **Datos**: saca el contenido a `src/data/documents.js` con este esquema:
  ```js
  {
    id: "inv-03",
    slug: "ia-pymes-costa-rica-2021-2023",
    category: "investigacion",   // "sintesis" | "investigacion" | "articulo"
    format: "documento",          // "documento" | "presentación"
    number: 3,
    title: "IA en el desarrollo laboral en Pymes de Costa Rica",
    summary: "Descripción de 1–2 frases…",
    period: "2021–2023",
    year: 2024,                   // TODO: confirmar
    authors: ["Antony Valverde Rojas"], // TODO: confirmar
    tags: ["Inteligencia artificial", "Pymes", "Empleo"],
    pages: 24,                    // lo genera el script
    sizeKB: 812,                  // lo genera el script
    file: "/documents/investigacion-3-ia-pymes-cr-2021-2023.pdf",
    thumbnail: "/thumbnails/inv-03.webp",
    related: ["art-01"],
  }
  ```
- Mueve los PDFs a `public/documents/` con nombres slug, para tener URLs estables y enlazables.
- **Script de build** `scripts/generate-thumbnails.mjs` (con `pdfjs-dist` + `@napi-rs/canvas`): renderiza la página 1 de cada PDF en WebP (600px de ancho, y otra de 1200px para pantallas retina), calcula páginas y tamaño y escribe `src/data/documents.meta.json`. Se ejecuta con `npm run thumbs` y también en `prebuild`.
- Estructura sugerida:
  ```
  src/
    components/  (layout/, hero/, explorer/, card/, viewer/, background/, ui/)
    hooks/       (useTheme, useReducedMotion, useMediaQuery, usePointer)
    data/
    styles/      (tokens.css, global.css, typography.css)
  ```

---

## 3. Dirección de arte

**Concepto: "Constelación del conocimiento".** Cada documento es un nodo de una red de ideas sobre tecnología, sociedad y Costa Rica. El fondo interactivo, los colores por categoría y las transiciones refuerzan esa idea: conexiones que se iluminan al explorar.

### 3.1 Tipografía
- **Display / títulos**: `Fraunces Variable`, una serif editorial con carácter académico. Usa sus ejes `opsz` y `SOFT` en los titulares grandes.
- **Texto / UI**: `Inter Variable` (o `Geist`).
- **Metadatos, números y etiquetas**: `JetBrains Mono Variable`, en mayúsculas con tracking amplio (`0.08em`).
- **Escala fluida** con `clamp()`, de 360px a 1920px:
  - `--fs-hero: clamp(2.5rem, 1.2rem + 6vw, 6.5rem)`
  - `--fs-h2: clamp(1.75rem, 1.2rem + 2.4vw, 3.25rem)`
  - `--fs-h3: clamp(1.125rem, 1rem + .5vw, 1.375rem)`
  - `--fs-body: clamp(1rem, .96rem + .2vw, 1.125rem)`
  - `--fs-meta: .75rem`
- Largo de línea máximo de 68ch en los párrafos. `text-wrap: balance` en los títulos y `text-wrap: pretty` en los párrafos.

### 3.2 Color (tokens semánticos; tema oscuro por defecto)
Oscuro, "noche de observatorio":
- `--bg: #07090F`, `--bg-elev: #0D111A`, `--surface: rgb(255 255 255 / .04)`, `--surface-hover: rgb(255 255 255 / .07)`
- `--text: #E8ECF4`, `--text-muted: #A3ACBD`, `--border: rgb(255 255 255 / .08)`
- Acento principal: `--accent: #5EEAD4` (turquesa)
- Colores por categoría: **Síntesis** `#A78BFA` (violeta), **Investigaciones** `#22D3EE` (cian), **Artículos** `#FBBF24` (ámbar)

Claro, "papel de archivo":
- `--bg: #F6F5F1`, `--bg-elev: #FFFFFF`, `--text: #111418`, `--text-muted: #4B5261`, `--border: rgb(17 20 24 / .10)`
- Categorías en versiones oscurecidas para cumplir el contraste AA: Síntesis `#6D28D9`, Investigaciones `#0E7490`, Artículos `#B45309`; acento `#0F766E`

Reglas:
- **Todo par texto/fondo debe cumplir WCAG AA** (4.5:1 para texto normal y 3:1 para texto grande y elementos de UI). Verifícalo con una herramienta; no lo supongas.
- Agrega un **botón de tema** (claro / oscuro / sistema) que se guarde en `localStorage`. Aplica el tema antes del primer pintado con un script en línea en `index.html` para evitar el parpadeo.
- La transición entre temas usa la **View Transitions API** con una revelación circular que sale desde el botón. Si el navegador no la soporta, se hace un crossfade.
- Una capa de **grano/ruido** muy sutil (SVG `feTurbulence`, opacidad de 3–5%) sobre todo el sitio da textura de papel.

### 3.3 Forma y profundidad
- Radios: `--r-sm: 8px`, `--r-md: 14px`, `--r-lg: 22px`, `--r-pill: 999px`.
- Superficies de cristal: `backdrop-filter: blur(16px) saturate(140%)` con un borde de 1px y un brillo interior (`inset 0 1px 0 rgb(255 255 255 / .06)`).
- Espaciado en una escala de 4px (`--space-1` … `--space-12`) y espaciado de sección fluido (`clamp(4rem, 8vw, 9rem)`).

---

## 4. Fondo interactivo (pieza central)

Crea `<ConstellationBackground />` con Canvas 2D (sin WebGL, para no pesar), fijo a pantalla completa detrás del contenido (`position: fixed; inset: 0; z-index: -1`).

Comportamiento:
1. **Nodos** que flotan con deriva browniana suave. Cuando dos nodos quedan cerca (menos de ~140px), se dibuja una línea entre ellos cuya opacidad depende de la distancia.
2. **Interacción con el cursor**: los nodos dentro de un radio de ~180px se atraen suavemente hacia el puntero, sus conexiones se iluminan con el color de acento y el cursor actúa como un nodo más, conectado a los cercanos.
3. **Clic o toque**: emite una onda expansiva que empuja los nodos y se desvanece en unos 800ms.
4. **El color responde al scroll**: con un `IntersectionObserver` sobre cada sección, el color dominante de nodos y líneas hace una interpolación suave (lerp) hacia el color de la categoría visible (violeta en Síntesis, cian en Investigaciones, ámbar en Artículos, turquesa en el hero).
5. **Capa inferior**: 2–3 manchas de gradiente muy desenfocadas (`filter: blur(120px)`) que se desplazan lentamente con CSS, con un leve parallax ligado al scroll.
6. **Parallax del puntero**: la red entera se desplaza unos ±12px según la posición del mouse, para dar sensación de profundidad.

Reglas de rendimiento (obligatorias):
- Cantidad de nodos proporcional al área: `min(140, floor(ancho * alto / 11000))`. Tablet: máximo 70. Móvil: máximo 40, sin atracción al cursor (solo onda al tocar y deriva).
- Limita el `devicePixelRatio` a 2. Recalcula en `resize` con debounce.
- Búsqueda de vecinos con una **rejilla espacial** (spatial hashing) para no hacer comparaciones O(n²) cuando hay muchos nodos.
- Presupuesto: **menos de 3ms por frame** en una laptop media. Mídelo con la pestaña Performance.
- Pausa el `requestAnimationFrame` cuando `document.hidden` es verdadero.
- Con `prefers-reduced-motion: reduce`, dibuja un único frame estático (red congelada y gradiente fijo), sin animación.
- Si `navigator.hardwareConcurrency <= 4` o `saveData` está activo, usa la mitad de los nodos.
- El canvas lleva `aria-hidden="true"` y `pointer-events: none`. Los eventos del puntero se escuchan en `window` con `{ passive: true }`.
- El texto encima del fondo siempre debe cumplir el contraste AA. Si hace falta, agrega un velo o scrim detrás de los bloques de texto.

---

## 5. Estructura de la página y componentes

### 5.1 Barra de navegación (sticky)
- Monograma "AV" a la izquierda (SVG propio, animado al cargar con un trazado `stroke-dashoffset`).
- Enlaces: Síntesis · Investigaciones · Artículos · Sobre mí, más el botón de tema.
- Un **indicador de sección activa**: una píldora que se desliza con `layoutId` entre enlaces según la sección visible.
- **Al hacer scroll**, la barra se compacta (menos alto, más blur, borde visible). Se oculta al bajar y reaparece al subir.
- **Barra de progreso de lectura** de 2px en el borde inferior, con el color de la sección actual.
- **En móvil y tablet vertical**: botón hamburguesa animado (se transforma en X) que abre un menú a pantalla completa con los enlaces en tipografía display grande, entrada escalonada y cierre con Esc, con el enlace o tocando fuera. Bloquea el scroll del body mientras está abierto.

### 5.2 Hero
- Eyebrow en mono: `ARCHIVO DE INVESTIGACIÓN · 2019 — 2024`.
- Titular grande (Fraunces), por ejemplo: *"Tecnología, sociedad y futuro en Costa Rica"* (proponlo, pero déjalo configurable en `src/data/site.js`).
- Animación de entrada: el titular se revela **palabra por palabra** (máscara + `translateY` + blur a 0) con un stagger de 60ms. Después aparecen el subtítulo y los CTA.
- Subtítulo: una frase que presenta a Antony y el propósito del archivo.
- CTA primario **"Explorar documentos"**, que hace scroll suave al explorador, y CTA secundario **"Sobre el autor"**. Los botones son **magnéticos** en desktop (siguen levemente al cursor, máximo 8px).
- **Contadores animados** que cuentan de 0 al valor al entrar en pantalla: `10 documentos`, `3 categorías`, `6 años cubiertos`. Calcúlalos a partir de los datos, no los escribas a mano.
- **Chips de temas** que se desplazan en una marquesina infinita lenta ("Inteligencia artificial", "Pymes", "Educación", "Agricultura", "Visión computacional", "Brecha digital", "Medio ambiente"…), sacados de los `tags`. Se pausa al pasar el cursor por encima y con reduced-motion.
- Indicador de "scroll" animado en la parte inferior (solo desktop).
- Altura: `min-height: 100svh` en móvil (usa `svh`/`dvh`, no `vh`) y alrededor de 88vh en desktop.

### 5.3 Explorador de documentos
**Barra de herramientas** (se queda fija, sticky, justo debajo del nav mientras recorres la sección):
- **Tabs segmentados**: Todos · Síntesis · Investigaciones · Artículos, cada uno con su contador. La píldora activa se desliza con `layoutId` y toma el color de la categoría.
- **Buscador** con ícono y atajo de teclado `/` para enfocarlo (el atajo se muestra como `<kbd>`). Filtra en vivo por título, resumen y tags, sin distinguir tildes (normaliza con `NFD`), y resalta la coincidencia con `<mark>`.
- **Orden**: Número · Más reciente · A–Z.
- Selector de vista **cuadrícula / lista** (en desktop y tablet).
- El filtro y la búsqueda se reflejan en la URL (`?cat=investigacion&q=ia`) para poder compartir y volver con el botón atrás.
- Texto de resultados con `aria-live="polite"`: "Mostrando 6 de 10 documentos".
- Estado vacío ilustrado ("No encontramos documentos para «xyz»") con un botón para limpiar los filtros.

**Agrupación**: en la vista "Todos", separa por categoría con encabezados editoriales grandes: `01 — Síntesis`, `02 — Investigaciones`, `03 — Artículos científicos`, cada uno con una línea descriptiva y el número en mono, en el color de la categoría. Al filtrar, las tarjetas se reordenan con **animación de layout** (`motion` `layout` + `AnimatePresence`: las que salen se escalan a 0.96 y se desvanecen; las que quedan se deslizan a su nueva posición).

### 5.4 Tarjeta de documento (`<DocCard />`)
Contenido:
- **Miniatura** de la primera página del PDF (ratio 4:3, con recorte superior), con `loading="lazy"`, `srcset` 1x/2x y un placeholder borroso o de color mientras carga.
- **Badge de categoría** con un punto de color y la etiqueta mono (`SÍN · 01`, `INV · 03`, `ART · 01`). Un badge extra "Presentación" cuando corresponda.
- **Título real** (Fraunces, hasta 3 líneas con `line-clamp`) y **resumen** (hasta 3 líneas).
- **Metadatos** en mono: período · páginas · tamaño (ej. `2021–2023 · 24 págs · 812 KB`).
- **Tags** (máximo 3 visibles y "+N").
- **Acciones**: `Leer` (primario, abre el visor), `Descargar` (ícono y texto) y `Copiar enlace` (ícono, con un toast "Enlace copiado").

Microinteracciones, solo en desktop y **solo bajo `@media (hover: hover) and (pointer: fine)`**:
- **Tilt 3D** según la posición del cursor (máximo ±6°, `perspective: 900px`, con spring al volver).
- **Spotlight**: un gradiente radial que sigue al cursor dentro de la tarjeta, usando las variables `--mx`/`--my`.
- **Borde luminoso**: un borde con `conic-gradient` en el color de la categoría que se ilumina cerca del cursor.
- La miniatura hace un zoom leve (1.04) y un desplazamiento de parallax interno.
- Toda la tarjeta es un objetivo de clic grande (patrón "stretched link" hacia `Leer`), pero los botones internos siguen funcionando por separado.

En táctil: sin tilt ni spotlight; la tarjeta se comprime a `scale(.98)` al presionar.

**Tarjeta destacada**: el Artículo científico ocupa 2 columnas en desktop, con una miniatura más grande y la etiqueta "Publicación destacada".

**Vista de lista**: filas compactas con miniatura pequeña, título, metadatos y acciones alineadas a la derecha.

**Entrada en scroll**: las tarjetas aparecen con fade, `translateY(24px)` y blur a 0, en stagger de 70ms por fila, **una sola vez** (`viewport: { once: true, amount: .2 }`).

### 5.5 Visor de PDF (modal)
- Al pulsar `Leer`, la miniatura se expande hacia el modal con un **shared element transition** (`layoutId` compartido entre la tarjeta y el visor).
- El modal es un `<dialog>` nativo o un componente accesible: atrapa el foco, cierra con Esc, cierra al hacer clic en el fondo y devuelve el foco a la tarjeta de origen.
- Barra superior: badge, título, `Descargar`, `Abrir en pestaña nueva` y `Cerrar`.
- Cuerpo: `<iframe src="/documents/…pdf#view=FitH">` a toda la altura disponible.
- **Deep link**: abrir el visor actualiza la URL a `#/doc/<slug>`; cargar esa URL abre el documento directamente.
- Navegación entre documentos con los botones anterior/siguiente y las flechas ← →.
- Bloque de "Relacionados" al pie (usa el campo `related`).
- **Móvil (<768px) y cualquier navegador sin visor de PDF embebido** (Chrome en Android e iOS no renderizan bien PDFs dentro de un iframe): en lugar del iframe, muestra una **hoja inferior** (bottom sheet que se arrastra para cerrar) con la miniatura, los metadatos y dos botones grandes, "Abrir PDF" y "Descargar".

### 5.6 Sección "Sobre el autor"
- Layout de dos columnas en desktop y apilado en móvil.
- Foto o avatar (deja un placeholder `public/avatar.webp` si no existe), con un marco que gira lentamente en un gradiente cónico.
- Bio basada en el texto actual: *"Apasionado por la tecnología y la investigación. Desarrollador web enfocado en construir soluciones claras y útiles."* Amplíala con un tono profesional, sin inventar datos (usa `TODO`).
- Chips de áreas de interés sacados de los tags.
- Botones de contacto con ícono: Email (`antonyvalverde2003@gmail.com`), LinkedIn (`https://www.linkedin.com/in/antony-valverde-26a709274/`) y GitHub (`https://github.com/AntonyValverde`). El email incluye un botón de "copiar".
- Opcional: una **línea de tiempo** horizontal (vertical en móvil) que ubica cada documento en su período 2019–2024, con nodos que se iluminan al hacer scroll (con una línea SVG que se dibuja mediante `pathLength`).

### 5.7 Footer
- Un CTA grande en tipografía display: *"¿Colaboramos en una investigación?"* con un botón de email magnético.
- Enlaces de navegación y redes.
- `© {año actual} Antony Valverde R.`, calculado con `new Date().getFullYear()`.
- Botón "Volver arriba" que aparece después de 1.5 pantallas de scroll y dibuja un anillo de progreso en SVG a su alrededor.

---

## 6. Sistema de animación (reglas globales)

- **Curvas**: `--ease-out: cubic-bezier(.16, 1, .3, 1)` para entradas y `--ease-in-out: cubic-bezier(.65, 0, .35, 1)` para cambios de estado. Springs de `motion`: `{ stiffness: 260, damping: 26 }` para layout y `{ stiffness: 150, damping: 15, mass: .1 }` para el tilt y los botones magnéticos.
- **Duraciones**: microinteracciones de 120–180ms, entradas de 400–700ms y transiciones de modal o página de 350–500ms.
- Anima **solo `transform`, `opacity` y `filter`**. Nunca animes `width`, `height`, `top` ni `left`.
- Usa `will-change` solo durante la animación, no de forma permanente.
- **`prefers-reduced-motion: reduce`** desactiva el tilt, el parallax, la marquesina, el scroll suave, los contadores (muestran el valor final), el fondo animado y los reveals (el contenido aparece directamente, como mucho con un fade de 150ms). Centraliza esta lógica en el hook `useReducedMotion()`.
- **Pantalla de carga**: no uses loaders artificiales. La primera pintura debe ser inmediata y la secuencia de entrada del hero dura menos de 1.2s en total.
- Transiciones de sección: al cruzar a una nueva sección cambian el color del fondo interactivo, la barra de progreso y el indicador del nav, todos sincronizados.

---

## 7. Responsive (pensado para cada dispositivo)

Breakpoints centralizados en tokens y hooks, pensando primero en móvil: `sm 480` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536` · `3xl 1920`.

| Rango | Contenedor | Grid de tarjetas | Particularidades |
|---|---|---|---|
| 360–479 (móvil) | 100% − 2×16px | 1 columna | Menú a pantalla completa, bottom sheet en vez de modal, toolbar con tabs en scroll horizontal y buscador que se expande, botones de ancho completo, fondo con ≤40 nodos |
| 480–767 (móvil grande) | 100% − 2×20px | 1 columna (o 2 en vista compacta) | Igual que móvil, con más aire |
| 768–1023 (tablet) | 100% − 2×32px | 2 columnas | En horizontal ya aparece el nav completo; el modal con iframe está disponible si hay soporte; ≤70 nodos |
| 1024–1279 (laptop pequeña) | 960px | 3 columnas | Tilt y spotlight activos si hay puntero fino |
| 1280–1535 (laptop) | 1200px | 3 columnas, el destacado ocupa 2 | Experiencia completa |
| 1536–1919 (desktop) | 1360px | 4 columnas | El hero puede usar layout asimétrico (texto a la izquierda y un "cluster" de miniaturas flotantes a la derecha) |
| ≥1920 (pantalla grande o ultrawide) | 1520px máximo | 4 columnas | Tipografía hero al máximo del `clamp`; el contenido no se estira más allá del máximo, el fondo sí |

Reglas:
- Objetivos táctiles de **44×44px como mínimo**.
- Todos los efectos de hover van dentro de `@media (hover: hover)`.
- Usa `svh`/`dvh` para las alturas en móvil y `env(safe-area-inset-*)` para el notch y la barra inferior de iOS.
- Nada de scroll horizontal accidental en ningún ancho: verifica con `overflow-x` desde 320px.
- Prueba la orientación horizontal en móvil (unos 740×360): el hero no debe cortarse.
- Container queries (`@container`) en la tarjeta para que se adapte a su columna y no solo al viewport.

---

## 8. Accesibilidad (WCAG 2.2 AA obligatorio)
- `lang="es"`, HTML semántico (`header`, `nav`, `main`, `section` con `aria-labelledby`, `article` para las tarjetas, `footer`).
- Enlace "Saltar al contenido" visible al recibir foco.
- Foco visible y consistente en todo lo interactivo (anillo de 2px con el color de acento y offset).
- Etiquetas accesibles específicas: "Leer «IA en el desarrollo laboral en Pymes…» (PDF, 24 páginas)" y "Descargar …".
- Los tabs de filtro siguen el patrón ARIA de tabs o de grupo de toggles, navegables con las flechas.
- El modal cumple el patrón de diálogo (foco atrapado, `aria-modal`, título asociado).
- Todo contenido animado se puede pausar o está sujeto a reduced-motion.
- Las miniaturas tienen un `alt` descriptivo ("Portada de …").
- Contraste verificado en ambos temas, también sobre el fondo animado.

## 9. Rendimiento y SEO
- Objetivos en **Lighthouse móvil**: Performance ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95. **LCP < 2.5s, CLS < 0.1, INP < 200ms.**
- El JS inicial (gzip) no debe pasar de unos 150KB. Carga con lazy loading el visor de PDF, Lenis y la sección de línea de tiempo.
- Precarga la fuente display del hero (`<link rel="preload">`, `font-display: swap`) y usa subsets `latin` y `latin-ext`.
- Miniaturas en WebP con `width`/`height` explícitos, para no provocar CLS.
- En `index.html`: `<title>`, `meta description` real, Open Graph y Twitter Card (con una imagen OG de 1200×630 generada con el estilo del sitio), `theme-color` para ambos temas y favicon SVG con el monograma "AV".
- JSON-LD: `Person` para Antony y `ScholarlyArticle` / `CreativeWork` para cada documento.
- Actualiza `manifest.json` con el nombre real, los colores y los íconos.
- Revisa si el sitio se despliega en una subruta (por ejemplo GitHub Pages) y configura el `base` de Vite en consecuencia.

## 10. Calidad y pruebas
- Sustituye la prueba rota por **Vitest + Testing Library**: que renderice sin errores, que el filtro por categoría muestre N tarjetas, que la búsqueda sin tildes encuentre "Investigación" al escribir "investigacion", que el visor abra y cierre con Esc devolviendo el foco, y que `?cat=` se sincronice con la URL.
- Opcional: **Playwright** con capturas en 360, 390, 768, 1024, 1440 y 1920 px, en ambos temas y con reduced-motion activado.
- ESLint y Prettier configurados. Sin warnings en la consola.

---

## 11. Plan de ejecución (en este orden)
1. Migrar de CRA a Vite, sin cambiar la UI todavía. Verificar que `npm run dev` y `npm run build` funcionan.
2. Renombrar los PDFs a slugs (con `git mv`) y moverlos a `public/documents/`. Crear `src/data/documents.js` y el script de miniaturas y metadatos.
3. Implementar los tokens (color, tipografía, espaciado, motion), el tema claro/oscuro con toggle y las fuentes.
4. Construir el layout base: nav, hero, explorador con tarjetas estáticas, sobre mí y footer, todo responsive **sin animaciones**.
5. Añadir filtros, búsqueda, orden, sincronización con la URL y el visor de PDF con deep links.
6. Añadir la capa de animación (reveals, layout, tilt, magnéticos, contadores, transición de tema).
7. Construir el fondo interactivo con todas sus reglas de rendimiento.
8. Hacer la pasada de accesibilidad, rendimiento (Lighthouse) y SEO; corregir hasta cumplir los objetivos.
9. Escribir las pruebas y hacer QA visual en todos los breakpoints.
10. Hacer commits pequeños y descriptivos por cada paso.

## 12. Criterios de aceptación (checklist final)
- [ ] Los 10 documentos se ven, se abren y se descargan correctamente desde sus nuevas URLs.
- [ ] Cada tarjeta muestra la miniatura real, el título real, la categoría con su color y metadatos verificados (o `TODO`).
- [ ] Filtros, búsqueda (sin distinguir tildes), orden y vista cuadrícula/lista funcionan y se reflejan en la URL.
- [ ] El visor funciona en desktop y tablet; en móvil se usa la hoja inferior. Los deep links `#/doc/<slug>` funcionan.
- [ ] El fondo interactivo responde al cursor, al toque y al scroll; cuesta menos de 3ms por frame; se pausa en segundo plano y es estático con reduced-motion.
- [ ] Tema claro/oscuro con toggle persistente, sin parpadeo, y con transición circular.
- [ ] Sin scroll horizontal entre 320 y 2560px. Se ve bien en 360, 390, 768, 1024, 1440 y 1920 px, tanto en vertical como en horizontal.
- [ ] Lighthouse móvil ≥ 90 / 95 / 95 / 95 y Core Web Vitals dentro del objetivo.
- [ ] WCAG 2.2 AA: contraste verificado, navegación completa con teclado y lector de pantalla coherente.
- [ ] Corregidos todos los bugs de la sección 1.2.
- [ ] Las pruebas pasan (`npm test`) y el build pasa (`npm run build`) sin warnings.

**Al terminar**, entrega un resumen con: lo que se cambió, las decisiones tomadas y su porqué, los `TODO` de contenido que Antony debe confirmar (años, autores, foto, bio) y las capturas de los breakpoints clave.
