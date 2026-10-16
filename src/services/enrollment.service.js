import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

// Adaptador de extras → payload. Es el ÚNICO punto donde la matrícula conoce
// los extras (hoy solo la camiseta); los componentes de merch no lo importan.
const extrasToPayload = (extras = {}) => ({
    incluye_camiseta: Boolean(extras.camiseta),
});

export const enrollmentService = {
    /** Deuda PENDIENTE/PARCIAL del alumno, o null si está al día. */
    deudaPendiente: async (alumnoId) => {
        const response = await apiFetch.get(API_ROUTES.CUENTAS_POR_COBRAR.HISTORIAL(alumnoId));
        const result = await parseJsonResponse(response, 'Error al consultar la deuda');
        return result.data?.find(c =>
            c.alumno_id == alumnoId && (c.estado === 'PENDIENTE' || c.estado === 'PARCIAL')
        ) || null;
    },

    /**
     * Fechas de arranque posibles para los horarios elegidos.
     * Devuelve un array por horario: [inmediata, siguiente].
     */
    previsualizarFechas: async (alumnoId, horarioIds) => {
        const response = await apiFetch.post(API_ROUTES.ASISTENCIAS.PREVISUALIZAR, {
            alumno_id: alumnoId,
            horario_ids: horarioIds,
        });
        const result = await parseJsonResponse(response, 'Error al previsualizar las fechas');
        return result.data;
    },

    inscribirMensual: async ({ alumnoId, horarioIds, fechaInicio, extras }) => {
        const response = await apiFetch.post(API_ROUTES.INSCRIPCIONES.BASE, {
            alumno_id: alumnoId,
            horario_ids: horarioIds,
            fecha_inicio_electiva: fechaInicio,
            ...extrasToPayload(extras),
        });
        return parseJsonResponse(response, 'Error al procesar la matrícula');
    },

    inscribirUnica: async ({ alumnoId, horarioId, fecha }) => {
        const response = await apiFetch.post(API_ROUTES.INSCRIPCIONES.INDIVIDUAL, {
            alumno_id: alumnoId,
            idHorario: horarioId,
            fecha_inicio_electiva: fecha,
        });
        return parseJsonResponse(response, 'Error al procesar la clase única');
    },

    /**
     * Disponibilidad por fecha de un horario (BL-003):
     * [{ fecha, ocupados, capacidad_max, disponible, es_feriado }].
     * Solo trae fechas en las que el horario tiene clase.
     */
    disponibilidadPorFecha: async (horarioId, desde, hasta) => {
        const response = await apiFetch.get(API_ROUTES.HORARIOS.DISPONIBILIDAD(horarioId, desde, hasta));
        const result = await parseJsonResponse(response, 'Error al consultar la disponibilidad');
        return result.data;
    },
};
