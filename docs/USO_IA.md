\# Uso de Inteligencia Artificial en NeoHome



\## Identificación y Propósito



\*\*IA utilizada:\*\* Google Gemini 3.5 Flash Lite



\*\*Propósito dentro del producto:\*\* Extracción automática de datos desde comprobantes de pago venezolanos (imagen o PDF) para el flujo de conciliación automática (HU-01, RF-02, RF-03), eliminando la transcripción manual por parte del administrador.



\*\*Propósito como asistente de arquitectura:\*\* Estructuración de requerimientos, refinamiento de diagramas UML, análisis de factibilidad y diseño del modelo entidad-relación.



\*\*Skills aplicadas:\*\* Ingeniería de prompts, análisis crítico de arquitecturas, modelado de bases de datos relacionales, diseño de flujos de trabajo.



\## Prompt de Extracción (dentro del producto)



> "Analiza esta imagen de comprobante de pago venezolano. Extrae: el monto (número), la fecha del pago en formato YYYY-MM-DD (por ejemplo 2026-09-19), el número de referencia, la moneda (VES o USD), y confirma si es un comprobante válido."



\## Response Schema forzado (JSON estricto)



```json

{

&#x20; "es\_comprobante": boolean,

&#x20; "moneda": "VES" | "USD",

&#x20; "monto": number,

&#x20; "fecha": string,

&#x20; "referencia": string

}





Forzar un responseSchema estricto evita que el modelo devuelva texto conversacional o explicaciones adicionales, reduciendo directamente el consumo de tokens de salida.



\## Optimizaciones de Consumo de Tokens



1\. \*\*Modelo Flash Lite:\*\* menor costo por token que modelos Pro, suficiente para extracción estructurada.

2\. \*\*Response Schema forzado:\*\* evita tokens de salida innecesarios (texto libre o explicaciones).

3\. \*\*Deduplicación previa:\*\* antes de invocar a Gemini, se verifica si la referencia del comprobante ya existe en la tabla `pagos`. Si ya existe, el flujo corta con estado `rechazado` sin gastar tokens.



\## Consumo Estimado



Cada llamada consume aproximadamente 800-1200 tokens (imagen en base64 como input + JSON de salida). No hay panel de facturación público de Gemini integrado; la estimación se basa en el tamaño típico de las imágenes de prueba.



\## Flujo de IA (paso a paso)



1\. Residente sube comprobante en `/residente/reportar`

2\. Frontend guarda en Supabase Storage + crea registro en tabla `comprobantes`

3\. Frontend llama al webhook de n8n

4\. n8n descarga la imagen y la convierte a base64

5\. Nodo "Armar Body Gemini" construye el body con prompt + responseSchema

6\. Nodo "Gemini API (Code)" envía a Gemini vía HTTP Request

7\. Nodo "Parsear Gemini" normaliza la respuesta JSON

8\. Se llama a la función SQL `procesar\_pago` (transacción atómica)

9\. Resultado vuelve al frontend y se muestra al residente



\## Capturas del flujo



\[Insertar aquí las 3 capturas de n8n:

\- Canvas completo del workflow

\- Nodo "Armar Body Gemini"

\- Nodo "Gemini API (Code)"]

