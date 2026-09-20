\# Pruebas de Calidad (SQA) — NeoHome



\## Casos de Prueba Ejecutados



| ID | Requisito / HU | Descripción | Resultado Obtenido | Estado |

|----|----------------|-------------|---------------------|--------|

| CP-01 | RF-03 / HU-01 | Subir comprobante con monto inválido (0.00) | Estado `en\_revision` + mensaje "Monto inválido detectado, requiere revisión manual" | ✅ Pasó |

| CP-02 | RF-03 / HU-01 | Subir comprobante con misma referencia que uno anterior | Estado `rechazado` + mensaje "Esta referencia ya fue registrada previamente. Comprobante duplicado." | ✅ Pasó |

| CP-03 | RF-03 / HU-01 | Subir comprobante con monto menor al saldo deudor | Estado `abono\_parcial` + saldo restante calculado correctamente | ✅ Pasó |

| CP-04 | RF-01 / HU-01 | Subir comprobante con monto que cubre el saldo total | Estado `conciliado` + saldo reducido a $0.00 | ✅ Pasó |

| CP-05 | RF-01 / HU-01 | Intento de subir archivo con formato no permitido (.docx) | El sistema rechaza el archivo. Bug detectado durante pruebas y corregido con validación de MIME type en el frontend. | ✅ Pasó (post-fix) |



\## Bugs Detectados y Corregidos Durante las Pruebas



| # | Bug | Causa | Solución |

|---|-----|-------|----------|

| 1 | Archivos no permitidos (.docx) se subían al sistema | No había validación de MIME type en el frontend | Agregado `TIPOS\_PERMITIDOS = \['image/jpeg', 'image/png', 'application/pdf']` + validación en `handleFileChange` y en `handleUpload` |

| 2 | Referencia "N/A" generaba falsos duplicados | Gemini devolvía "N/A" cuando no podía leer la referencia | Filtro en nodo "Parsear Gemini" y "Guardar en BD": `referencia !== 'N/A' \&\& referencia !== 'null'` |



\## Pruebas de Humo Post-Deploy



1\. App carga en `proyecto23-neo-home.vercel.app` ✅

2\. Login funciona con credenciales de prueba ✅

3\. Dashboard admin muestra los 4 KPIs ✅

4\. Reportar Pago procesa comprobantes en menos de 10 segundos ✅

5\. Webhook de n8n responde correctamente ✅

6\. Políticas RLS bloquean accesos no autorizados ✅



\## Pruebas de Seguridad



| Verificación | Resultado |

|--------------|-----------|

| Residente A no puede ver datos del Residente B | ✅ Bloqueado por RLS |

| Residente no puede modificar saldos manualmente | ✅ Bloqueado por RLS |

| Admin tiene acceso total | ✅ Funciona |

| Variables de entorno nunca expuestas al cliente | ✅ Solo `NEXT\_PUBLIC\_\*` |

| API keys no commiteadas al repo | ✅ `.gitignore` bloquea `\*.json` y `.env\*.local` |

