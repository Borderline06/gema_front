import apiFetch from "../interceptors/api";
import { API_ROUTES } from "../constants/apiRoutes";
import { parseJsonResponse } from "./httpHelpers";

const alumnoService = {
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
    const response = await apiFetch.post('/alumno/gestion/cambiar-historial', payload);
    const result = await parseJsonResponse(response, 'Error al cambiar el historial académico del alumno');
    return result;
  }
};

export default alumnoService;
