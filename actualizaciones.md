# Actualizaciones — NeoHome Rediseño Visual

Este archivo es el registro permanente del rediseño visual de NeoHome.
Cada entrada documenta una etapa: decisiones visuales, archivos modificados, validaciones y pendientes.
La funcionalidad de la aplicación NO se modifica en ninguna etapa.

Orden de etapas planificado:
1. ETAPA 0 — Preparación del sistema visual
2. ETAPA 1 — Landing Page
3. ETAPA 2 — Login
4. ETAPA 3 — Dashboard y experiencia del Residente
5. ETAPA 4 — Dashboard y experiencia del Administrador
6. ETAPA 5 — Auditoría visual final y consistencia

---

## 2026-09-19 — Etapa 0: Preparación del sistema visual

### Archivos modificados
- app/globals.css
- app/layout.tsx
- app/components/ThemeToggle.tsx

### Cambios visuales
- Definición del sistema de diseño NeoHome como tokens de Tailwind v4 (`@theme`):
  - Paleta de marca `brand` (Púrpura #463181 como primario).
  - Paleta `navy` (Azul profundo #082674 como estructura/profundidad).
  - Paleta `royal` (Azul #3365CA como acciones secundarias).
  - Paleta `lavender` (Lavanda #9681D9 como acento, NO para botones primarios con texto blanco).
  - Paleta `teal` personalizada (Teal #2C7B91 + Teal oscuro #0F4456) que reemplaza el teal por defecto de Tailwind.
  - Escala de sombras propia: `shadow-card`, `shadow-card-hover`, `shadow-pop`.
- Carga real de la tipografía Inter mediante `next/font/google` (antes solo estaba referenciada en CSS sin cargarse) y vinculada a la variable `--font-sans` de Tailwind.
- Estilos base: antialiasing de fuentes, color de selección con la marca, animación `fade-in-up` nueva además de `fade-in` existente.
- ThemeToggle: se reemplazaron los emojis ☀️/🌙 por iconos SVG consistentes (sol/luna). Misma lógica, mismos estados, mismo comportamiento.

### Cambios funcionales
NINGUNO. No se tocaron consultas a Supabase, autenticación, rutas, n8n ni lógica de negocio. En layout.tsx solo se añadió la importación/uso de la fuente y clases visuales. En ThemeToggle solo cambió el contenido visual del botón.

### Validaciones
- Compilación correcta (next build) — pendiente de confirmar en siguiente etapa si es necesario.
- Tipografía Inter cargada correctamente desde el layout raíz.

### Problemas encontrados
- Inter no se estaba cargando realmente en el navegador (solo referencia CSS huérfana). Corregido con next/font/google.

### Pendientes
- Etapa 1: Landing Page.
- Reutilizar el sistema de tokens en las pantallas restantes (login, residente, dashboard, módulos admin).

---

## 2026-09-19 — Etapa 1: Landing Page

### Archivos modificados
- app/page.tsx
- actualizaciones.md (esta entrada)

### Cambios visuales
- Rediseño completo de la landing desde el nuevo sistema de tokens NeoHome.
- Header `sticky` con fondo translúcido + `backdrop-blur`, marca NeoHome mejorada (logo + tagline horizontal), enlaces de navegación por anclas y botón "Iniciar sesión" en estilo secundario (outline `brand`).
- Hero con titular `text-6xl` extrabold, palabra clave con gradiente de marca (`brand → navy → teal`), subtítulo descriptivo, pill de estado con punto teal, y dos CTAs jerárquicos (primario `brand-600`/hover `brand-700` + secundario blanco).
- Fondo del hero con gradientes radiales suaves de marca (lavanda/teal/púrpura a muy baja opacidad), respetando la regla 80% neutrales.
- Franja de estadísticas en tarjeta blanca (Automático / En segundos / + Transparente) con separadores verticales y `shadow-card`.
- Sección "Funciones": 3 tarjetas blancas con iconos SVG inline (brillo/IA, escudo/morosidad, calculadora/alícuotas) en recuadros coloreados con ring suave; microinteracciones hover (elevación `-translate-y-0.5` + `shadow-card-hover` + escala de icono).
- Sección "Cómo funciona": 3 pasos numerados con número decorativo en background y recuadro de icono en gradiente `brand→navy`.
- Sección "Para quién": dos paneles de gradiente (residentes = teal→navy, administradores = brand→navy) con listas de beneficios con checks circulares.
- CTA final: banda de gradiente `brand→navy→teal` con glow radial y botón blanco con contraste correcto.
- Footer renovado con marca y copyright.
- Todos los emojis eliminados de la landing (se reemplazaron por SVG inline).

### Cambios funcionales
NINGUNO. Se conservaron los enlaces a `/login`, el ThemeToggle y el Logo. No hay consultas ni lógica en esta página.

### Validaciones
- `npm run build` exitoso, TypeScript sin errores.
- Se confirmó en el CSS compilado que los nuevos tokens (`brand-600` = `#463181`, `navy-600` = `#082674`, `teal-600` = `#2c7b91`, `royal`, `lavender`) se emiten correctamente.
- Responsive: grillas `1/2/3` columnas (mobile/tablet/desktop), CTAs apilados en mobile, nav oculta en mobile con acceso vía botón.
- Dark mode: todas las secciones tienen variantes `dark:`.

### Problemas encontrados
- `npm run lint` no funciona: el repositorio no tiene `eslint.config.(js|mjs|cjs)` (requerido por ESLint v9). Es un problema pre-existente, no introducido en este rediseño. `next build` sí valida la compilación y TypeScript, y pasó correctamente.

### Pendientes
- Etapa 2: Login.
- Revisar en etapa 2 que el botón de acceso móvil del header cumpla la misma función que el de escritorio.

---

## 2026-09-19 — Etapa 2: Login

### Objetivo
Rediseño visual de la pantalla de acceso.

### Archivos modificados
- app/login/page.tsx
- actualizaciones.md (esta entrada)

### Cambios visuales
- Nueva composición dividida en dos zonas en desktop:
  - Panel izquierdo de branding con gradiente `brand → navy`, glows radiales sutiles de lavanda y teal, geometría abstracta residencial (círculos concéntricos y bloque de "ventanas") y alturas plenas.
  - Panel derecho con el formulario de acceso sobre tarjeta blanca.
- En mobile la pantalla se apila en una sola columna: branding compacto arriba y formulario prioritario debajo, sin overflow horizontal.
- Curso: branding izquierdo con logo NeoHome, tagline "Gestión Financiera Residencial", titular "Tu condominio, bajo control.", párrafo institucional y lista de 3 capacidades reales de la plataforma (conciliación IA, control de morosidad, alícuotas por coeficiente) con iconos SVG.
- Formulario premium: inputs con altura cómoda (`py-3`), radios `rounded-xl`, iconos SVG de correo/candado dentro del input, labels claras, foco con ring `brand` visible y transición sutil.
- Botón mostrar/ocultar contraseña reemplazado por iconos SVG (ojo / ojo tachado) que controlan exactamente el mismo estado `showPassword`.
- Botón "Iniciar sesión" ahora con color de marca púrpura `#463181`, hover/active más profundos, estados disabled y loading (spinner SVG + "Ingresando...").
- Mensaje de error convertido en alerta visual elegante: icono de alerta SVG, fondo rojo sutil, borde y texto legible. El texto del error no cambia.
- Texto de nota inferior en el formulario ("Acceso para administradores y residentes de NeoHome") reemplaza al contenido plano previo.
- Link "Volver" estilizado como píldora translúcida sobre el gradiente, accesible en desktop y mobile.
- Animación de entrada `fade-in-up` para la tarjeta del formulario.
- Eliminados todos los emojis y el botón textual "Ver/Ocultar".

### Cambios funcionales
NINGUNO. `signInWithPassword`, consulta de la tabla `usuarios`, validación de rol, redirección según rol, manejo de errores, estados `loading`/`showPassword`, navegación y rutas permanecen idénticas. Solo cambió el JSX visual y las clases.

### Validaciones
- `npm run build` exitoso, TypeScript sin errores.
- Login: se preservó la lógica completa del formulario.
- Error: la alerta muestra el texto original con nueva presentación visual.
- Loading: el botón conserva `disabled` + texto "Ingresando..." con spinner.
- Mostrar/ocultar contraseña: sigue alternando el `type` del input vía `showPassword`.
- Responsive: grilla 2 columnas en desktop, apilado en mobile/tablet sin desbordes; controles (Volver, ThemeToggle) accesibles en todos los tamaños.
- Light mode: panel claro de formulario sobre fondo `slate-50`.
- Dark mode: panel oscuro en formulario y variantes `dark:` en toda la pantalla; el panel de branding mantiene su identidad en ambos modos.
- Navegación: enlace de vuelta a `/` y ThemeToggle funcionan igual.

### Observaciones
- El branding del panel izquierdo se compuso con la misma imagen del logo (`logo-badge.png`) y el mismo nombre/tagline que el componente `Logo`, pero en disposición horizontal para adaptarse al gradiente. No se creó una marca nueva.
- No fueron necesarios cambios en archivos globales compartidos.

### Pendientes
- Etapa 3: Dashboard y experiencia del Residente.

---