# Pendientes de manejo de errores en `services/` (requiere revisión con backend)

Detectado durante la refactorización de `src/services/*.js` (ver `src/services/httpHelpers.js`).
Son inconsistencias de comportamiento, no duplicación de código — por eso no se tocaron en esa
tarea. Antes de corregirlas hay que confirmar con backend qué devuelve cada endpoint en caso de
error (¿siempre `{ message }`? ¿qué status codes usa?).

## 1. Sin verificación de `response.ok` (errores tratados como éxito)

- **`src/services/catalogo.service.js` → `getAll()`**: no comprueba `response.ok`. Si el backend
  responde con error, el código actual devuelve el body de error como si fueran datos válidos.
- **`src/services/feriado.service.js`**: los 3 métodos (`listarTodos`, `crear`, `eliminar`) tienen
  el mismo problema.
- **`src/services/sede.service.js` → `getAll()`**: mismo problema.

**Riesgo**: un error de backend (ej. 500, 404) no se refleja como error en la UI; el componente que
llama puede intentar renderizar un objeto de error como si fuera la lista/entidad esperada.

## 2. Verifican `response.ok` pero ignoran el mensaje del backend

- **`src/services/asistencia.service.js`**: `getAgenda`, `marcarAsistenciaMasiva`,
  `marcarAsistencia` — comprueban `!response.ok` **antes** de parsear el body, así que nunca leen
  `result.message`; siempre lanzan un texto fijo en español.
- **`src/services/catalogo.service.js` → `getVigentes()`**: mismo patrón.

**Riesgo**: si el backend manda un mensaje específico y accionable (ej. "No puedes marcar
asistencia de una clase ya cerrada"), la UI lo descarta y muestra siempre el mensaje genérico.

## Recomendación (a validar con backend antes de aplicar)

Una vez confirmado el contrato de error del backend (shape de `{ message }` en todos los casos de
error, incluyendo 401/403/500), unificar estos 5 archivos al mismo helper
`parseJsonResponse(response, defaultMessage)` ya usado en el resto de `services/`. Esto es
intencionalmente un cambio de **comportamiento** (empieza a fallar donde antes fallaba en
silencio), por lo que conviene probarlo método por método, no en bloque.
