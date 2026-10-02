import apiFetch from "../interceptors/api";
import { API_ROUTES } from "../constants/apiRoutes";
import { parseJsonResponse } from "./httpHelpers";

const alumnoService = {
  // Resumen para la tabla de gestion: el backend ya calcula sede/nivel vigente,
  // deuda pendiente y el flag de plan individual.
  getResumenTabla: async (sedeId) => {
    const response = await apiFetch.get(API_ROUTES.HISTORIAL_ACADEMICO.RESUMEN_TABLA(sedeId));
    const result = await parseJsonResponse(response, 'Error al sincronizar Base Gema');
    return result.data || [];
  },

  getById: async (id) => {
    const response = await apiFetch.get(API_ROUTES.USUARIOS.ALUMNO_BY_ID(id));
    const result = await parseJsonResponse(response, "Error al obtener alumno");
    return result.data || result;
  },

  update: async (id, payload) => {
    const response = await apiFetch.put(API_ROUTES.USUARIOS.ALUMNO_BY_ID(id), payload);
    const result = await parseJsonResponse(response, "Error al actualizar alumno");
    return result.data || result;
  },

  changeStatusHistory: async (payload) => {
    const response = await apiFetch.post(API_ROUTES.ALUMNOS.CAMBIAR_HISTORIAL, payload);
    const result = await parseJsonResponse(response, 'Error al cambiar el historial académico del alumno');
    return result;
  }
};

export default alumnoService;
