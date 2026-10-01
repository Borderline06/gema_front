# Club Gema — Frontend

Frontend del sistema de gestión del Club Gema (academia deportiva): matrícula y pagos de
alumnos, control de asistencia y horarios, recuperaciones de clase, y panel administrativo
completo (sedes, niveles, catálogo, beneficios, caja, publicaciones, etc.).

Construido con **React 19 + Vite**, consumiendo una API REST propia vía `fetch`.

## Stack

- **React 19** / **React Router 7** — SPA con rutas protegidas por rol.
- **Vite 7** — build y dev server.
- **Tailwind CSS** — estilos.
- **Recharts** — gráficos del dashboard administrativo.
- **Framer Motion** — animaciones (modales, transiciones).
- **react-hot-toast** — notificaciones y confirmaciones.
- **date-fns** / **dayjs** — manejo de fechas.
- **xlsx / xlsx-js-style** — exportación de reportes a Excel.

## Requisitos

- Node.js `>= 22.12.0`

## Instalación

```bash
npm install
```

Crea un archivo `.env` en la raíz con la URL del backend:

```
VITE_API_URL=http://localhost:5000/api
```

> **Importante**: el backend expone todos sus endpoints bajo el prefijo `/api` (algunas rutas
> como `/horarios` y `/niveles` tienen un alias de compatibilidad en la raíz, pero el resto no).
> `VITE_API_URL` debe incluir siempre `/api` al final — todo el código arma las peticiones como
> `` `${VITE_API_URL}${endpoint}` ``, nunca con el prefijo hardcodeado en el endpoint.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (Vite + HMR). |
| `npm run build` | Compila para producción en `dist/`. |
| `npm run preview` | Sirve el build de producción localmente. |
| `npm run start` | Alias de `preview` (usado en despliegue). |
| `npm run lint` | Corre ESLint sobre todo el proyecto. |

## Estructura del proyecto

```
src/
├── components/
│   ├── shared/         # Componentes reutilizables entre roles (ConfirmModal, SearchInput,
│   │                   # LoadingSpinner, EmptyState, InfoTip, ChangePasswordModal)
│   ├── Admin/           # Componentes específicos del panel administrativo
│   ├── student/         # Componentes específicos del área de alumno
│   └── teacher/         # Componentes específicos del área de coordinador
├── pages/               # Una carpeta por rol (admin/, student/, teacher/) + páginas públicas
├── routes/              # Definición de rutas por rol (ver "Rutas" abajo)
├── layouts/             # Layouts de dashboard (DashboardLayout, StudentLayout, TeacherLayout)
├── hooks/               # Hooks compartidos (useFetch: data + loading + error + refetch)
├── services/            # Un archivo por entidad de dominio, todos sobre apiFetch
├── interceptors/        # apiFetch: fetch con refresh de token automático en 401
├── context/             # AuthContext (sesión, login/logout)
├── constants/           # apiRoutes.js: todas las rutas del backend centralizadas
└── utils/               # Utilidades puras sin dependencia de React
```

### Convenciones

- **Servicios**: cada método de `services/*.js` usa `parseJsonResponse` (en
  `services/httpHelpers.js`) para parsear la respuesta y lanzar un error uniforme —
  no repitas el `if (!response.ok) {...}` a mano.
- **Fetch en componentes**: para un fetch simple (cargar lista, loading, error, refetch tras
  crear/editar/eliminar), usa el hook `useFetch` (`src/hooks/useFetch.js`) en vez de reimplementar
  `useState` + `useEffect` + `try/catch`.
- **Confirmaciones destructivas**: usa `<ConfirmModal>` (`components/shared/ConfirmModal.jsx`)
  para cualquier acción de borrado o irreversible — no agregues otro mecanismo de confirmación
  (no más `window.confirm`, toasts custom, o SweetAlert).
- **Páginas "Manager"**: el patrón admin de lista + crear/editar reutiliza `SearchInput`,
  `LoadingSpinner` y `EmptyState` de `components/shared/` para los bloques de buscador, spinner
  de carga y "sin resultados".

### Rutas

`App.jsx` monta tres grupos de rutas protegidas por rol, cada uno en su propio archivo bajo
`src/routes/`:

- `routes/studentRoutes.jsx` — alumno (`/dashboard/student/*`)
- `routes/teacherRoutes.jsx` — coordinador (`/dashboard/teacher/*`)
- `routes/adminRoutes.jsx` — administrador (`/dashboard/admin/*`)
- `routes/roles.js` — los arrays de alias de rol que consume `<ProtectedRoute allowedRoles={...}>`

Cada archivo exporta una función (`getStudentRoutes()`, etc.) que **se llama**, no se renderiza
como componente — React Router v6 solo reconoce `<Route>`/`<Fragment>` literales al escanear los
hijos de `<Routes>`, así que un `<AdminRoutes />` como componente no funcionaría.

Para agregar una pantalla nueva: crea la página en `pages/<rol>/`, y agrega una línea en el
archivo de rutas de ese rol — no hace falta tocar `App.jsx`.

## Despliegue

El proyecto incluye configuración para **Netlify** (`netlify.toml`) y **Railway**
(`railway.json`, usa `npm run start` tras el build). Recuerda configurar `VITE_API_URL` como
variable de entorno en la plataforma de despliegue, apuntando a la URL del backend en producción
(incluyendo `/api`).
