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

## 2026-09-19 — Etapa 3A: Dashboard Residente

### Objetivo
Rediseño visual de la experiencia principal del residente (layout y dashboard de saldo/historial).

### Archivos modificados
- app/residente/layout.tsx
- app/residente/page.tsx
- actualizaciones.md (esta entrada)

### Cambios visuales
- Header rediseñado: fijo con `backdrop-blur`, marca NeoHome consistente con la landing, nombre del residente con rol, avatar circular con inicial en gradiente `brand→navy`, ThemeToggle y logout como icono SVG (antes emoji 🚪) con hover rojo.
- Bienvenida visual: titular "Hola, este es el resumen de tu cuenta" + subtítulo institucional.
- Tarjeta finananciera premium: gradiente `brand→navy` con glows radiales, icono residencial SVG, label "Saldo actual pendiente" + apartamento, saldo de gran jerarquía tipográfica con `tabular-nums` y CTA principal "Reportar Pago" en blanco sobre la tarjeta (alto contraste y mucha presencia).
- Indicador visual de estado según saldo (sin cambiar datos ni cálculos): si saldo > 0 muestra pill ámbar "Saldo pendiente"; si saldo es 0 muestra pill verde "Cuenta al día"; mientras carga muestra estado intermedio.
- Historial de pagos elegante: cada pago con barra lateral de color según estado, badge de estado con punto de color, fecha, monto Bs principal, equivalente USD, referencia y mensaje, con jerarquía clara y contador de pagos.
- Estados actualizados visualmente: conciliado (verde), abono_parcial (azul royal), discrepancia (ámbar), en_revision (ámbar), rechazado (rojo), pendiente (gris). Se añadió la entrada `pendiente` al mapa de estilos (antes el fallback caía a rechazado).
- Loading reemplazado por skeleton UI (sin llamadas adicionales, mismo `loadingPagos`).
- Empty state profesional con icono SVG, título, descripción y CTA "Reportar Pago" sin agregar funcionalidades.
- Iconografía: se reemplazaron emojis por SVG (logout, reportar pago, residencia, check, arrow).

### Cambios funcionales
NINGUNO. Consultas a supabase (`usuarios`, `unidades`, `pagos`, relación `comprobantes.unidad_id`, orden por fecha), validación de sesión, rol residente, redirecciones, logout, y estados `saldo`/`pagos`/`loadingPagos` permanecen idénticos. Solo se cambió el JSX visual y las clases.

### Validaciones
- `npm run build` exitoso, TypeScript sin errores.
- Desktop: tarjeta con CTA a la derecha y header completo.
- Tablet/Mobile: tarjeta apilada, CTA accesible a ancho completo, header compacto con avatar (el nombre se oculta en pantallas pequeñas), sin overflow horizontal.
- Light mode: superficies claras y jerarquía sobre fondo `slate-50`.
- Dark mode: variantes `dark:` en toda la pantalla, buena legibilidad y contraste.
- Historial de pagos: todos los campos (estado, fecha, montos, referencia, mensaje) se siguen mostrando.
- Estados de pago: los valores lógicos no cambiaron; solo la presentación visual.
- Botón Reportar Pago: conserva `href="/residente/reportar"`.
- Loading: skeleton con el mismo estado `loadingPagos`.
- Empty state: la información "Aún no has reportado pagos." se conserva.
- Logout y autenticación: funciones intactas.

### Observaciones
- Se añadió `pendiente` como estado visual gris dentro del mapa de presentación porque el fallback anterior representaba casos no mapeados como rechazado (rojo). Ningún dato cambió; solo la representación.
- No fueron necesarios cambios en archivos globales ni en otras páginas.

### Pendientes
- Etapa 3B — Reportar Pago.

---

## 2026-09-19 — Etapa 3B: Reportar Pago

### Objetivo
Rediseño visual del flujo de Reportar Pago para que se sienta simple, seguro, inteligente, moderno y confiable, sin modificar la lógica existente ni la integración con n8n/Supabase.

### Archivos modificados
- app/residente/reportar/page.tsx

### Cambios visuales
- Pantalla de subida premium: zona de carga con borde punteado de marca, icono de documento en gradiente `brand→navy`, título, explicación breve, chips JPG/PNG/PDF y botón "Seleccionar archivo" con input oculto (sin agregar lógica de drag & drop inexistente).
- Archivo seleccionado: tarjeta con icono de documento, nombre, tipo y tamaño formateado (KB/MB), indicador "Listo para enviar" (verde) y botón "Cambiar archivo"; en mobile el indicador pasa a texto compacto.
- Botón "Enviar comprobante": color de marca `#463181` con hover, icono SVG de subida, `disabled` suave cuando no hay archivo.
- Estado de procesamiento: panel dedicado con anillo giratorio (spinner SVG no numérico), icono de documento pulsante, "Analizando con IA..." y tres puntos animados con retardo (sin porcentajes ni progreso simulado).
- Resultado con 4 tratamientos visuales diferenciados: conciliado (verde + check), abono_parcial (azul royal + billete), discrepancia (ámbar + triángulo), en_revision (neutro slate + reloj, no se presenta como rechazo).
- "Información detectada": tarjeta destacada con monto Bs y equivalente USD, y filas secundarias para referencia y fecha (se muestran solo si existen).
- Botones finales conservados: "Reportar otro" (outline neutro) e "Ir al inicio" (marca púrpura), mismas rutas y comportamiento.
- Error convertido en alerta visual elegante (icono de alerta SVG + fondo/borde rojo), sin modificar su contenido ni lógica.
- Enlace "Volver" con icono SVG de flecha y hover de marca, manteniendo ruta `/residente`.
- Nota de confianza inferior del flujo: "Procesado de forma segura" + "Conciliación asistida por IA" con iconos SVG.
- Todos los emojis eliminados (📎 ✅ 💰 ⚠️ ❌ y "←") y sustituidos por iconografía SVG inline consistente.

### Cambios funcionales
NINGUNO. Se conservan exactamente: `WEBHOOK_URL`, `handleUpload` completo (auth, consulta de unidad, subida a Storage, nombre del archivo, inserción en `comprobantes`, `imagen_url`/`unidad_id`/`estado_extraccion`, llamada al webhook de n8n con `comprobante_id`/`imagen_url`/`unidad_id`, captura del resultado, `monto_extraido`/`monto_usd`/`referencia`/`fecha`/`mensaje`), estados, `loading`, `error`. Solo cambió el JSX visual y las clases.

### Validaciones
- Selección de archivo: se mantiene el `input` con `accept` original y el mismo `onChange`.
- Loading: `subiendo` conserva su lógica; solo cambia la presentación visual.
- Error: se muestran los mensajes originales en alerta elegante.
- Conciliado / Abono parcial / Discrepancia / En revisión: 4 escenarios intactos con presentaciones diferenciadas.
- Responsive: pantalla centrada `max-w-xl`, sin overflow; botones apilados en mobile, tarjeta de resultado flexible, upload accesible en pantallas pequeñas.
- Light mode: superficies claras y jerarquía consistente.
- Dark mode: variantes `dark:` en toda la pantalla con contraste correcto.
- Navegación: "Volver", "Reportar otro" e "Ir al inicio" conservan rutas y comportamiento.
- `npm run build` exitoso, TypeScript sin errores.

### Observaciones
- Se corrigió el uso de `royal-950` (inexistente en la paleta) por `royal-900` en el fondo oscuro del escenario abono_parcial.
- La paleta `royal` solo llega hasta `900`; se usaron tonos existentes para los fondos oscuros (`royal-900`).
- No se tocaron archivos globales ni otras pantallas.

### Pendientes
Etapa 4 — Administrador

---

## 2026-09-19 — Etapa 4A: Layout Administrador

### Objetivo
Rediseñar visualmente el layout administrativo como un centro de control financiero SaaS premium, conservando toda la lógica.

### Archivos modificados
- app/dashboard/layout.tsx

### Cambios visuales
- Rediseño del sidebar: fondo degradado sofisticado `navy→teal` (de `navy-800` a `teal-900`, no una barra negra genérica), con marca Neohome bien integrada (logo con dot de estado, nombre y tagline "Gestión Financiera Residencial") y encabezado con jerarquía y espacio.
- Nueva navegación visual: agrupada en "Principal" (Resumen, Conciliación, Morosidad) y "Administración" (Alícuotas, Residentes) con labels en mayúsculas espaciadas; sin agregar rutas.
- Nuevos estados activos: pill con fondo `bg-white/10`, ring sutil, icono destacado en `lavender`, indicador lateral (barra vertical lavanda) y `aria-current`.
- Nueva iconografía: se reemplazaron los emojis (📊 🧾 ⚠️ 🧮 👥 🚪 👤) por SVG inline consistentes (grid, file-check, trending-down, calculator, users, power, menu, close, chevron, camera, phone, check). No se instaló librería.
- Rediseño del header: barra superior con `backdrop-blur`, título de la sección activa derivado de `NAV_ITEMS`, divisor vertical, ThemeToggle integrado y botón de perfil refinado (nombre + rol + avatar con anillo e inicial en gradiente `brand→navy` como fallback).
- Rediseño del perfil: dropdown premium con avatar grande, hover de cámara para cambiar foto, nombre, rol, campo de teléfono agrupado con icono, foco con ring de marca, botón "Guardar cambios" en `#463181` y feedback "Datos actualizados" con icono de check. Se conserva el mecanismo original del input de archivo.
- Cerrar sesión: discreto en el footer del sidebar, separado del menú con borde, icono de poder y rojo solo en interacción (hover).
- Mejoras responsive: en desktop el sidebar es fijo (`lg`), en mobile/mobile-tablet se convierte en drawer deslizante con overlay oscuro `backdrop-blur`, botón de menú en el header y cierre al navegar o tocar afuera.
- Mejor integración de dark mode en todos los componentes nuevos con variantes `dark:`.
- Microinteracciones suaves: transiciones de color y elevación en la navegación, apertura del perfil con `fade-in` y `shadow-pop`.
- Accesibilidad: `aria-label`, `aria-expanded`, `aria-current` en navegación, botones con `focus-visible:ring`.

### Cambios funcionales
NINGUNO. Autenticación, consulta de `usuarios`, validación de rol `admin`, `setNombre`, logout (`signOut` + `router.push('/')`), selección de avatar, panel de perfil, teléfono, guardado de perfil, mensaje "Datos actualizados", ThemeToggle, `pathname` para estado activo, `NAV_ITEMS` (hrefs y labels) y `{children}` permanecen idénticos. Solo cambió el JSX visual y las clases. Se añadió únicamente un estado de UI (`menuOpen`) para el drawer móvil, sin afectar la lógica existente.

### Validaciones
- Autenticación: `getUser` y redirección intactas.
- Rol administrador: validación `perfil.rol !== 'admin'` intacta.
- Navegación: las 5 rutas del sidebar permanecen y `pathname === item.href` sigue determinando el estado activo.
- Logout: `Cerrar sesión` conserva la misma función.
- Perfil: panel funcional con nombre, rol, avatar, teléfono y Guardar cambios.
- Avatar: subir/cambiar foto conserva el mecanismo (FileReader + input oculto).
- Guardar perfil: `handleSaveProfile` y setTimeout intactos.
- ThemeToggle: completamente funcional e integrado al header.
- Desktop: sidebar fijo de 288px con navegación agrupada.
- Tablet/Mobile: drawer deslizante accesible, sin overflow horizontal, perfil y logout funcionales.
- Dark mode: variantes `dark:` coherentes en sidebar, header, perfil y menú.
- `npm run build` exitoso, TypeScript sin errores.

### Observaciones
- Los `�` que puedan verse en consola al hacer grep son un artefacto de codificación de PowerShell; el archivo está en UTF-8 y los acentos se confirmaron correctos.
- El título del header (sección actual) se deriva de los labels existentes de `NAV_ITEMS`; no se añadió contenido nuevo.
- El dot decorativo junto al logo y el agrupamiento por secciones son solo presentación.

### Pendientes
Etapa 4B — Dashboard financiero

---

## 2026-09-19 — Etapa 4B: Dashboard Financiero

### Objetivo
Rediseñar visualmente el Dashboard financiero del administrador como un centro de control financiero premium, conservando la lógica y los datos reales.

### Archivo modificado
- app/dashboard/page.tsx

### Cambios visuales
- Nueva jerarquía visual: encabezado con kicker "Panel del administrador", título "Resumen financiero" y subtítulo "Control económico del condominio · Período del mes en curso".
- Nueva composición del dashboard: fondo con glows radiales sutiles (brand/teal/lavanda a baja opacidad) que envuelven el contenido sin competir con las tarjetas.
- Rediseño de KPIs con jerarquía entre ellos:
  - Total cobrado → KPI principal de doble ancho, tarjeta elevada con decoración abstracta (glow brand, forma geométrica rotada), icono en gradiente `brand→navy`, monto extragrande y contexto "Recaudación actual · Pagos conciliados del mes".
  - % de morosidad → KPI de atención con icono ámbar localizado (recuadro `amber`) y contexto "Unidades con saldo pendiente"; sin clasificaciones inventadas ni barras ficticias.
  - Alícuota promedio → KPI operativo con icono azul royal y contexto "Alícuotas generadas en el mes".
  - Tasa BCV → tarjeta especial de ancho completo (configurable) con icono teal y acento de identidad.
- Rediseño de tasa BCV (misma funcionalidad): estado normal con valor grande teal y botón "Editar" discreto; estado edición con input premium (`focus:ring` teal), botón "Guardar" en `#463181` (con spinner "Guardando" mientras `guardandoTasa`) y botón "Cancelar" con icono X; feedback de éxito/error en alerta elegante con iconos SVG.
- Mejoras de loading: skeleton UI que replica la composición (header + grilla de KPIs + franja tasa), con el mismo estado `loading`.
- Mejoras de errores: alertas con fondo/borde/icono diferenciado (verde éxito, rojo error), conservando los mensajes originales.
- Nueva iconografía: SVG inline (banknote, trending-down, calculator, exchange, edit, x, check, alert-triangle, spinner, info) en lugar de emojis.
- Sección informativa descriptiva: "Cómo se compone este resumen" con las 3 métricas explicadas (contenido derivado de los datos existentes, sin estadísticas nuevas).
- Responsive: grilla 1 columna en mobile, 2 en tablet (total a doble ancho), 4 en desktop con jerarquía; la tasa BCV es totalmente usable en todos los tamaños.
- Dark mode: superficies `dark:` diferenciadas, glows atenuados y contraste correcto; no es una inversión simple.

### Cambios funcionales
NINGUNO. Estados, `cargarTasa`, consultas de `configuracion`/`pagos`/`unidades`/`alicuotas`, filtros, cálculos, `guardarTasa` (update, validación, mensajes "✓ Tasa actualizada"/"Error: ..."/"Ingresa un valor válido."), `setEditandoTasa`, `setMensajeTasa`, `setLoading` y valores con `toFixed(2)` permanecen idénticos. Solo cambió la presentación.

### Datos preservados
- Total cobrado del mes (pagos conciliados).
- Porcentaje de morosidad (unidades con saldo pendiente).
- Alícuota promedio (alícuotas del mes).
- Tasa BCV (configuración editable).

### Validaciones
- Total cobrado aparece correctamente con los datos reales.
- Morosidad aparece correctamente.
- Alícuota promedio aparece correctamente.
- Tasa BCV aparece correctamente.
- Editar tasa funciona.
- Guardar tasa funciona (spinner mientras guarda).
- Cancelar funciona (vuelve al valor de la BD con `cargarTasa`).
- Validación de valor inválido funciona ("Ingresa un valor válido.").
- Mensaje de éxito funciona ("✓ Tasa actualizada").
- Mensaje de error funciona ("Error: ...").
- Loading (skeleton) funciona.
- Supabase sigue funcionando (sin nuevas consultas).
- El layout administrativo sigue funcionando (no se modificó).
- Navegación sigue funcionando.
- `npm run build` exitoso, TypeScript sin errores.

### Observaciones
- El periodo "mes en curso" es textual/derivado de los filtros existentes; no se añadió una fecha inventada.
- La sección informativa es contenido descriptivo del cálculo real, sin datos nuevos.
- La morosidad mantiene su valor sin clasificación inventada (no "baja/media/alta").
- El feedback de éxito conserva el mensaje original con "✓" (el icono mostrado es un SVG derivado del mismo `startsWith('✓')`).

### Pendientes
Etapa 4C — Conciliación de pagos

---

## 2026-09-19 — Etapa 4C: Conciliación de Pagos

### Objetivo
Rediseñar visualmente la experiencia de conciliación como un centro profesional de revisión y validación de comprobantes, sin cambiar la lógica financiera.

### Archivo modificado
- app/dashboard/conciliacion/page.tsx

### Cambios visuales
- Rediseño de encabezado: kicker "Centro de revisión", título "Conciliación de pagos" y descripción del propósito de la sección.
- Rediseño de filtros: búsqueda con icono SVG y focus/ring de marca; select con icono de chevron y `appearance-none`; ambos con `rounded-xl`, borde sutil y transiciones.
- Franja de resumen derivada del array cargado: pill principal con total de comprobantes y pills por estado (solo estados presentes) con punto de color; sin métricas nuevas.
- Rediseño de tabla: encabezado en mayúsculas espaciadas, filas con `py-4` y hover sutil, unidad como pill ("Apt XX" con icono), residente con avatar de inicial en gradiente `brand→navy`, monto en negrita `tabular-nums`, fecha formateada `es-VE`, badge de estado con punto de color, "Ver comprobante" como enlace con icono de documento y "Resolver" como botón de marca.
- Mejora de badges: semántica visual corregida — conciliado (verde), abono_parcial (royal), discrepancia (ámbar), en_revision (ámbar/advertencia), rechazado (rojo), pendiente (gris). Los valores de estado no cambiaron (antes en el código `en_revision` se mostraba en rojo y `rechazado` en gris; corrección solo de presentación).
- Mejora de acciones: "Resolver" como botón `brand` con icono; "Ver comprobante" con ícono y `target="_blank"`.
- Rediseño del modal en secciones: A) encabezado sticky con título y contexto "Apt XX · Residente"; B) visor del comprobante con marco, imagen a ancho y enlace "Abrir comprobante en otra pestaña"; C) ficha de datos del pago (Unidad, Residente, Monto detectado, Referencia, Saldo actual, Estado actual con badge); D) "Mensaje del sistema" en zona diferenciada con icono; E) advertencia financiera ámbar ("Si concilias, se descontará $X del saldo..."); F) acciones: Rechazar (outline rojo, secundaria) y "Marcar como Conciliado" (`#463181`, principal), con spinner "Procesando..." mientras `processing`.
- Cierre del modal: botón X con SVG y click fuera, respetando `!processing`.
- Empty state premium con icono, mensaje original y explicación breve.
- Responsive: tabla con scroll horizontal (`overflow-x-auto`, `min-w-[900px]`) en mobile/tablet sin perder información; modal ocupa el viewport con scroll interno y botones apilados en mobile.
- Dark mode: superficies `dark:` diferenciadas en tabla, filtros, badges y modal.
- Iconografía: SVG inline (search, chevron, home, file-text, external-link, x, check, alert-triangle, sparkles, inbox, spinner) en lugar de la "✕" y emojis.

### Cambios funcionales
NINGUNO. `cargar()`, `handleResolver()` (conciliado: pago→conciliado + mensaje, comprobante→extraido, descuento de saldo con `Math.max(0, ...)`; rechazado: pago→rechazado + mensaje, comprobante→rechazado, sin tocar saldo), `puedeResolver`, `setSelected`, `setProcessing`, `setLoading`, `busqueda/setBusqueda`, `filtroEstado/setFiltroEstado`, el filtro `filtradas`, la reload post-resolución y el cierre con `!processing` permanecen idénticos. Solo cambió el JSX visual y las clases.

### Lógica financiera preservada
- Conciliación: mismo pago actualizado, mismo comprobante actualizado, mismo cálculo de saldo y misma unidad actualizada.
- Rechazo: mismo pago actualizado, mismo comprobante actualizado, saldo NO alterado.

### Validaciones
- Búsqueda: filtra por unidad (mismo `apto.includes(busqueda)`).
- Filtro por estado: mismo `filtroEstado`.
- Abrir comprobante: `href={imagen_url}` con `target="_blank"`.
- Resolver: abre el modal con `setSelected(f)`.
- Conciliar: `handleResolver('conciliado')` con descuento de saldo.
- Rechazar: `handleResolver('rechazado')` sin modificar saldo.
- Processing: spinner en ambos botones, `disabled`, sin cierre accidental (`!processing`).
- Cierre de modal: X y click fuera con `stopPropagation`.
- Empty state: mensaje "No hay comprobantes que coincidan." conservado.
- Desktop: tabla completa con acción visible.
- Tablet/Mobile: scroll horizontal de tabla, modal usable, botones accesibles.
- Light mode / Dark mode: contrastes y superficies correctas.
- `npm run build` exitoso, TypeScript sin errores.

### Observaciones
- Los conteos del resumen se derivan directamente de `filas` (array ya cargado), sin nuevas consultas ni datos ficticios.
- Se corrigió solo la presentación de `en_revision` y `rechazado` (valores lógicos intactos).
- Se agregó `dot` como campo visual del mapa de estados.
- El archivo se construyó en partes por límite de tamaño del editor; el resultado compilado es único y correcto.

### Pendientes
Etapa 4D — Morosidad

---