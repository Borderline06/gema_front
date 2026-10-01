// Alias de rol aceptados por cada grupo de rutas protegidas.
// Centralizado para no repetir estos arrays en cada <ProtectedRoute>.
export const ROLES = {
  STUDENT: ['Alumno', 'student', 'alumno'],
  TEACHER: ['Coordinador', 'teacher', 'profesor'],
  ADMIN: ['Administrador', 'admin', 'administrador'],
};
