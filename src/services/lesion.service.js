import apiFetch from "../interceptors/api";
import { API_ROUTES } from "../constants/apiRoutes";
import { parseJsonResponse } from "./httpHelpers";

const lesionService = {
    // --- ALUMNO ---
    crearSolicitud: async (data) => {
        // data = { descripcion, urlEvidencia }
        const response = await apiFetch.post(API_ROUTES.LESIONES.BASE, data);
        const result = await parseJsonResponse(response, "Error al crear solicitud");
        return result.data;
    },

    obtenerMisSolicitudes: async () => {
        const response = await apiFetch.get(`${API_ROUTES.LESIONES.BASE}/mis-solicitudes`);
        const result = await parseJsonResponse(response, "Error al obtener historial");
        return result.data;
    },

    // --- ADMIN ---
    obtenerPendientes: async () => {
        const response = await apiFetch.get(`${API_ROUTES.LESIONES.BASE}/pendientes`);
        const result = await parseJsonResponse(response, "Error al obtener pendientes");
        return result.data;
    },

    evaluarSolicitud: async (id, data) => {
        // data = { estado, notas, tipo, fechaInicio, fechaFin }
        const response = await apiFetch.post(`${API_ROUTES.LESIONES.BASE}/${id}/evaluar`, data);
        const result = await parseJsonResponse(response, "Error al evaluar solicitud");
        return result.data;
    }
};

export default lesionService;