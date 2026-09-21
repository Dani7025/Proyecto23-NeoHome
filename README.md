# NeoHome — Sistema de Gestión Financiera y Cobranzas

Aplicación web para la gestión financiera de condominios y conjuntos residenciales. Automatiza la conciliación de pagos con IA, controla la morosidad y calcula las alícuotas automáticamente.

**Proyecto individual — Ingeniería de Software I — UNEG 2026**
**Autora:** Angie Urrieta (C.I. 31.538.385)

---

## 🔗 Enlaces

| Recurso | URL |
|---------|-----|
| 🌐 Aplicación desplegada | https://proyecto23-neo-home.vercel.app |
| 📦 Repositorio | https://github.com/Dani7025/Proyecto23-NeoHome |
| ⚙️ Orquestador n8n | https://dani0725.app.n8n.cloud |

### 👤 Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin@neohome.com` | `neohome123` |
| Residente | `residente1@neohome.com` | `neo123` |

---

## 🎯 ¿Qué problema resuelve?

Los administradores de condominios pierden días revisando manualmente comprobantes de pago enviados por WhatsApp o correo, cruzando visualmente con estados de cuenta bancarios. Esto genera:

- Morosidad acumulada por falta de seguimiento
- Errores en el cálculo de alícuotas (hojas de cálculo)
- Déficits de caja para cubrir servicios básicos (seguridad, limpieza, ascensores)

**NeoHome automatiza los 3 procesos con IA.**

---

## 🏗️ Arquitectura

### Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router) + Tailwind CSS |
| Backend / BaaS | Supabase (Auth, PostgreSQL, Storage) |
| Automatización | n8n Cloud |
| IA | Google Gemini 3.5 Flash Lite |
| Deploy | Vercel |
| Control de versiones | GitHub + Git |

### Flujo de automatización

1. Residente sube comprobante desde `/residente/reportar`
2. Frontend guarda el archivo en Supabase Storage
3. Frontend llama al webhook de n8n
4. n8n descarga la imagen y la envía a Gemini
5. Gemini extrae monto, fecha y referencia en formato JSON
6. n8n calcula el equivalente en USD con la tasa BCV
7. Se llama a la función SQL `procesar_pago` (transacción atómica)
8. Se actualiza el saldo deudor de la unidad
9. Se devuelve el resultado al frontend

---

## 🗄️ Base de Datos

### Tablas principales

- `usuarios` — id, nombre, email, rol
- `unidades` — id, numero_apartamento, coeficiente, saldo_deudor, usuario_id
- `comprobantes` — id, imagen_url, estado_extraccion, unidad_id
- `alicuotas` — id, mes, monto_total_condominio, monto_unidad, unidad_id
- `pagos` — id, monto_extraido_ves, tasa_bcv, monto_equivalente_usd, referencia, estado, mensaje
- `configuracion` — clave, valor (guarda la tasa BCV)

### Estados de un pago

- `conciliado`: pago cubre la deuda completa
- `abono_parcial`: pago cubre parte
- `en_revision`: la IA no pudo leer el monto
- `rechazado`: admin rechaza tras revisión manual

### Seguridad

Row Level Security aplicado a nivel de PostgreSQL. Cada residente solo ve sus propios datos. El admin tiene acceso total.

---

## 🚀 Setup (instalación local)

### Requisitos

- Node.js 18.18 o superior
- Cuenta en Supabase
- Cuenta en n8n Cloud
- API key de Google AI Studio

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/Dani7025/Proyecto23-NeoHome.git
cd Proyecto23-NeoHome