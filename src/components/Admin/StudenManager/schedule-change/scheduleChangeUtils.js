import { toDateKey } from '../../../../utils/enrollmentCycle';

// Solo estas inscripciones admiten cambio de horario; vencidas/anuladas se descartan.
export const ESTADOS_CAMBIABLES = ['ACTIVO', 'PENDIENTE_PAGO'];

export const esClaseUnica = (insc) => insc?.tipo_inscripcion === 'INDIVIDUAL';

// El link de deuda guarda la fecha exacta de la clase (inicio = fin); fecha_inscripcion es solo respaldo.
export const fechaClaseUnica = (insc) => {
    const fecha = insc.inscripciones_deudas_link?.[0]?.fecha_inicio_ciclo ?? insc.fecha_inscripcion;
    return fecha ? toDateKey(fecha) : null;
};

// Clases únicas primero y por fecha ascendente; luego las mensuales en el orden original.
export const filtrarCambiables = (inscripciones = []) => {
    const cambiables = inscripciones.filter(i => ESTADOS_CAMBIABLES.includes(i.estado));
    const unicas = cambiables
        .filter(esClaseUnica)
        .sort((a, b) => String(fechaClaseUnica(a)).localeCompare(String(fechaClaseUnica(b))));
    return [...unicas, ...cambiables.filter(i => !esClaseUnica(i))];
};
