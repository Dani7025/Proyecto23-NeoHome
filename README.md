# NeoHome — Sistema de Gestión Financiera y Cobranzas

Aplicación web para la gestión financiera de condominios y conjuntos residenciales. NeoHome centraliza la gestión de pagos, comprobantes, morosidad y alícuotas, utilizando automatización e Inteligencia Artificial para reducir procesos manuales.

**Proyecto individual — Ingeniería de Software I — UNEG 2026**  
**Autora:** Angie Urrieta

---

## Enlaces

| Recurso | URL |
|---|---|
| Aplicación desplegada | https://proyecto23-neo-home.vercel.app |
| Repositorio | https://github.com/Dani7025/Proyecto23-NeoHome |

---

## Problema que resuelve

La administración de condominios suele depender de procesos manuales para revisar comprobantes enviados por WhatsApp o correo, controlar la morosidad y calcular los gastos comunes.

Esto puede generar:

- Demoras en la conciliación de pagos.
- Errores en el cálculo de alícuotas.
- Dificultad para dar seguimiento a la morosidad.
- Riesgo de inconsistencias en los saldos.

**NeoHome centraliza y automatiza estos procesos mediante reglas de negocio, procesamiento financiero e Inteligencia Artificial.**

---

## Funcionalidades

### Residente

- Consulta del saldo pendiente.
- Consulta del apartamento asociado.
- Historial de pagos.
- Carga de comprobantes JPG, PNG y PDF.
- Procesamiento automático del comprobante.
- Consulta del resultado de conciliación.
- Visualización de monto, fecha, referencia y moneda detectados.

### Administrador

- Dashboard de resumen financiero.
- Consulta de recaudación y morosidad.
- Gestión manual de la tasa BCV.
- Conciliación y revisión de pagos.
- Búsqueda y filtrado de comprobantes.
- Visualización de comprobantes.
- Resolución manual de pagos.
- Rechazo de comprobantes.
- Reporte de morosidad.
- Generación de alícuotas por coeficiente.
- Registro de residentes.
- Asignación de residentes a unidades disponibles.

---

## Arquitectura

### Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| UI | Tailwind CSS |
| Base de datos | Supabase / PostgreSQL |
| Autenticación | Supabase Auth |
| Almacenamiento | Supabase Storage |
| Automatización | n8n Cloud |
| Inteligencia Artificial | Google Gemini 3.5 Flash Lite |
| Deploy | Vercel |
| Control de versiones | GitHub + Git |

### Flujo de conciliación

```text
Residente
   ↓
Sube comprobante
   ↓
Supabase Storage
   ↓
Registro del comprobante
   ↓
Webhook de n8n
   ↓
Google Gemini 3.5 Flash Lite
   ↓
Extracción de datos
   ↓
Validación del pago
   ↓
Supabase
   ↓
Resultado al residente
```

El flujo utiliza una arquitectura desacoplada: Next.js inicia el proceso y n8n coordina la extracción, validación y actualización de los datos. :contentReference[oaicite:2]{index=2}

---

## Estados de pago

| Estado | Descripción |
|---|---|
| `conciliado` | El pago cubre la deuda correspondiente. |
| `abono_parcial` | El pago cubre solo una parte de la deuda. |
| `en_revision` | El comprobante no pudo validarse o extraerse correctamente. |
| `rechazado` | El comprobante fue rechazado, por ejemplo por duplicidad o revisión manual. |
| `discrepancia` | Estado legacy mantenido por compatibilidad. |

---

## Base de datos

NeoHome utiliza PostgreSQL mediante Supabase.

### Tablas principales

- `usuarios` — usuarios administradores y residentes.
- `unidades` — apartamentos, coeficiente y saldo deudor.
- `comprobantes` — archivos de comprobantes y su estado.
- `alicuotas` — distribución de gastos comunes por unidad.
- `pagos` — transacciones, montos, referencia, tasa BCV y estado.
- `configuracion` — parámetros configurables, principalmente la tasa BCV.

---

## Seguridad

La base de datos utiliza **Row Level Security (RLS)** para controlar el acceso a la información.

Los residentes deben acceder únicamente a los datos asociados a su propia unidad.

Las credenciales y claves de servicios se manejan mediante variables de entorno y no deben almacenarse en el repositorio. :contentReference[oaicite:6]{index=6}

---

## Setup

### Requisitos

- Node.js 18.18 o superior.
- Cuenta de Supabase.
- Cuenta de n8n Cloud.
- API Key de Google AI Studio.

### Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/Dani7025/Proyecto23-NeoHome.git
cd Proyecto23-NeoHome
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar variables de entorno

Crear el archivo:

```text
.env.local
```

y agregar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Nunca subir `.env.local` al repositorio.**

#### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Aplicación disponible en:

```text
http://localhost:3000
```

#### 5. Verificar compilación

```bash
npm run build
```

---

## Calidad y pruebas

El proyecto contempla pruebas de:

- Interfaz de usuario.
- Integración entre Next.js, n8n, Gemini y Supabase.
- Seguridad mediante RLS.
- Casos límite y validaciones.

Casos principales verificados:

| Prueba | Resultado |
|---|---|
| Comprobante con monto correcto | `conciliado` |
| Referencia duplicada | `rechazado` |
| Monto menor al saldo | `abono_parcial` |
| Comprobante ilegible/corrupto | `en_revision` |
| Generación de alícuotas | Prorrateo por coeficiente |
| Acceso a otra unidad | Bloqueado mediante RLS |

Durante el desarrollo se identificaron y corrigieron 14 bugs relacionados con archivos, duplicados, RLS, Gemini, Supabase, UUID, fechas, webhook y procesamiento de comprobantes. :contentReference[oaicite:7]{index=7}

---

## Limitaciones conocidas

Actualmente el proyecto no incluye:

- Pasarela de pago directa.
- Cargos automáticos.
- Facturación fiscal electrónica.
- Integración en vivo con la API oficial del BCV.

La tasa BCV se administra manualmente desde el panel administrativo. :contentReference[oaicite:8]{index=8}

---

## Trabajo futuro

Se contemplan como posibles mejoras:

- Notificaciones automáticas al residente.
- Manejo de pagos parciales multi-cuota.
- Optimización del consumo de tokens mediante caché semántico.
- Ampliación de funcionalidades de cobranza.
- Futuras integraciones bancarias. :contentReference[oaicite:9]{index=9}

---

## Metodología

Proyecto desarrollado bajo metodología **Agile Scrum**, utilizando historias de usuario, backlog priorizado, criterios de aceptación Given-When-Then y entregas iterativas.

Durante el desarrollo se realizaron pruebas, correcciones y ampliaciones progresivas del alcance según los casos de uso identificados. :contentReference[oaicite:10]{index=10}

---

## Autora

**Angie Urrieta**

Ingeniería en Informática  
Universidad Nacional Experimental de Guayana

Proyecto individual desarrollado para la asignatura **Software I**.

---

## Licencia

Proyecto académico sin fines comerciales.