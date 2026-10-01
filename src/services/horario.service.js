import apiFetch from "../interceptors/api";
import { API_ROUTES } from "../constants/apiRoutes";
import { parseJsonResponse } from "./httpHelpers";

const horarioService = {
    // Obtener todos los horarios base del club
    obtenerDisponibles: async () => {
        const response = await apiFetch.get(API_ROUTES.HORARIOS.BASE);
        const result = await parseJsonResponse(response, "Error al obtener horarios");
        return result.data;
    },

    obtenerDisponiblesPorNivel: async () => {
        const response = await apiFetch.get('/horarios/nivel');
        const result = await parseJsonResponse(response, "Error al obtener horarios por nivel");
        return result.data;
    }
};

export default horarioService;