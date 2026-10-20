// Reglas compartidas del desglose "Merch vs Matrícula" de caja. Las usan la tarjeta de la
// plataforma (MerchRevenueBreakdown) y el reporte Excel (cashFlowUtils), así ambos muestran
// exactamente las mismas cifras, etiquetas y fechas.

/** Porcentaje entero de `parte` sobre `total` (0 si no hay total). */
export const porcentaje = (parte, total) => (total > 0 ? Math.round((parte / total) * 100) : 0);

/** Fecha dd/mm/aaaa en hora de Lima ('—' si no es válida). */
export const fechaCorta = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? '—'
        : d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Lima' });
};

const ETIQUETA_CONCEPTO = { INGRESO_MERCH: 'Merch', INGRESO_MATRICULA: 'Matrícula' };

/** Nombre legible del concepto de una fila automática de caja. */
export const etiquetaConcepto = (concepto) => ETIQUETA_CONCEPTO[concepto] ?? concepto;

/** Un mes sin cobros ni filas no muestra desglose (ni tarjeta ni filas en el Excel). */
export const tieneDesglose = (desglose) =>
    Boolean(desglose) && (desglose.total_cobrado > 0 || (desglose.movimientos?.length ?? 0) > 0);
