import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Compartido entre InscriptionsModal y StudentDetails: ambos consumen el mismo
// endpoint de historial académico y necesitan formatear/clasificar "ciclos" igual.

export const formatearFecha = (fechaString) => {
    if (!fechaString) return "S/F";
    return format(parseISO(fechaString.slice(0, 10)), "dd MMM yyyy", { locale: es });
};

// Extrae "Abril - Mayo 2026" evaluando inicio y fin REAL (calculado por asistencias)
export const obtenerRangoCiclo = (fechaInicio, fechaFin) => {
    if (!fechaInicio) return "SIN CLASES REGISTRADAS";

    const inicioDate = parseISO(fechaInicio.slice(0, 10));
    const mesInicio = format(inicioDate, "MMMM", { locale: es });
    const anioInicio = format(inicioDate, "yyyy");

    if (!fechaFin) return `${mesInicio} ${anioInicio} · EN CURSO`;

    const finDate = parseISO(fechaFin.slice(0, 10));
    const mesFin = format(finDate, "MMMM", { locale: es });
    const anioFin = format(finDate, "yyyy");

    if (mesInicio === mesFin && anioInicio === anioFin) return `${mesInicio} ${anioInicio}`;
    if (anioInicio === anioFin) return `${mesInicio} - ${mesFin} ${anioInicio}`;
    return `${mesInicio.slice(0, 3)} ${anioInicio} - ${mesFin.slice(0, 3)} ${anioFin}`;
};

export const getEstadoPagoBadge = (estado) => {
    switch (estado?.toUpperCase()) {
        case 'PAGADA':
        case 'PAGADO': return 'bg-green-100 text-green-700 border-green-200';
        case 'PENDIENTE': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'VENCIDO': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-brand-surface-alt text-slate-500 border-brand-border';
    }
};

// BADGE PARA LA(S) INSCRIPCIÓN(ES) — puede haber más de un estado dentro
// de la misma tarjeta si el paquete agrupa varias inscripciones.
export const getEstadoInscripcionBadge = (estado) => {
    switch (estado?.toUpperCase()) {
        case 'ACTIVO': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        case 'INACTIVO': return 'text-slate-500 bg-brand-bg border-brand-border';
        case 'FINALIZADO': return 'text-slate-500 bg-brand-surface-alt border-brand-border';
        case 'PENDIENTE_PAGO': return 'text-amber-600 bg-amber-50 border-amber-100';
        case 'CONGELADO': return 'text-blue-600 bg-blue-50 border-blue-100';
        default: return 'text-brand-muted bg-brand-bg border-brand-border-soft';
    }
};
