// ORDEN FIJO DE NIVELES: ajusta/agrega aquí si tienes más niveles.
// Cualquier nivel que NO esté en esta lista se ubicará al final (antes de PLAN INDIVIDUAL),
// ordenado alfabéticamente, para que nunca "desaparezca" un nivel nuevo silenciosamente.
const ORDEN_NIVELES = ['BÁSICO', 'PRE INTERMEDIO', 'INTERMEDIO', 'AVANZADO'];

// Ordena los niveles de una sede: sigue ORDEN_NIVELES y deja PLAN INDIVIDUAL siempre al final.
export const ordenarNiveles = (detalles) => {
    return [...detalles].sort((a, b) => {
        // PLAN INDIVIDUAL (esIndividual: true) siempre al final
        if (a.esIndividual && !b.esIndividual) return 1;
        if (!a.esIndividual && b.esIndividual) return -1;
        if (a.esIndividual && b.esIndividual) return 0;

        const idxA = ORDEN_NIVELES.indexOf((a.nivel || '').toUpperCase());
        const idxB = ORDEN_NIVELES.indexOf((b.nivel || '').toUpperCase());
        const posA = idxA === -1 ? ORDEN_NIVELES.length : idxA;
        const posB = idxB === -1 ? ORDEN_NIVELES.length : idxB;

        if (posA !== posB) return posA - posB;
        // Si ambos son "desconocidos" (no están en ORDEN_NIVELES), orden alfabético
        return (a.nivel || '').localeCompare(b.nivel || '');
    });
};

export const formatLocalToUTC = (fechaStr) => {
    if (!fechaStr) return new Date().toISOString();
    const [yyyy, mm, dd] = fechaStr.split('-');
    return new Date(yyyy, mm - 1, dd, 12, 0, 0).toISOString();
};

export const formatUTCtoLocalInput = (fechaISO) => {
    if (!fechaISO) return '';
    const d = new Date(fechaISO);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Toma el objeto crudo { Sede: { niveles: {...}, egresos: [...], ingresosManuales: [...] } }
// que devuelve /caja/resumen y lo consolida en la forma que consume MonthAccordion.
export const consolidarDatosMes = (data) => {
    let ingresosConsolidadosObj = {};
    let ingresosManualesFlats = [];
    let egresosFlats = [];

    // Iterar sobre la estructura: Sede -> niveles -> ingresos / egresos
    Object.entries(data).forEach(([sedeNombre, sedeData]) => {

        // AGRUPACIÓN: SOLO POR SEDE
        if (sedeData.niveles) {
            const groupKey = sedeNombre;

            if (!ingresosConsolidadosObj[groupKey]) {
                ingresosConsolidadosObj[groupKey] = {
                    id: `auto-${groupKey}`,
                    sede: sedeNombre,
                    monto: 0,
                    cantidad: 0,
                    fteTotal: 0,
                    detallesNiveles: []
                };
            }

            // Contadores globales para agrupar TODOS los planes individuales de esta sede
            let cantidadSedeIndividual = 0;
            let montoSedeIndividual = 0;
            let fteSedeIndividual = 0;

            Object.entries(sedeData.niveles).forEach(([nivelNombre, nivelData]) => {
                const ingresosDelNivel = Array.isArray(nivelData.ingresos) ? nivelData.ingresos : [];
                let cantidadNivel = 0;
                let fteNivel = 0;
                let montoNivel = 0;

                ingresosDelNivel.forEach(ing => {
                    const montoIngreso = parseFloat(ing.monto || 0);

                    // Sumar al gran total de la sede (Esto se mantiene igual)
                    ingresosConsolidadosObj[groupKey].monto += montoIngreso;
                    ingresosConsolidadosObj[groupKey].cantidad += 1;

                    const matchFte = ing.concepto?.match(/([\d.]+)\s*FTE/i);
                    const currentFte = matchFte ? parseFloat(matchFte[1]) : (ing.es_plan_individual ? 0 : 0.5);

                    ingresosConsolidadosObj[groupKey].fteTotal += currentFte;

                    // SEPARACIÓN CLAVE: Si es individual, suma al contador "Individual", si no, al del "Nivel Normal"
                    if (ing.es_plan_individual) {
                        cantidadSedeIndividual += 1;
                        montoSedeIndividual += montoIngreso;
                        fteSedeIndividual += currentFte; // (Aunque sea 0, lo sumamos por si acaso)
                    } else {
                        cantidadNivel += 1;
                        montoNivel += montoIngreso;
                        fteNivel += currentFte;
                    }
                });

                // Agregamos el nivel normal (Solo si tuvo pagos que NO son individuales)
                if (cantidadNivel > 0) {
                    ingresosConsolidadosObj[groupKey].detallesNiveles.push({
                        nivel: nivelNombre,
                        fte: fteNivel,
                        cantidad: cantidadNivel,
                        monto: montoNivel,
                        esIndividual: false
                    });
                }
            });

            // CREACIÓN DEL "FALSO NIVEL": Agregamos la fila de PLAN INDIVIDUAL al final
            if (cantidadSedeIndividual > 0) {
                ingresosConsolidadosObj[groupKey].detallesNiveles.push({
                    nivel: 'PLAN INDIVIDUAL',
                    fte: fteSedeIndividual,
                    cantidad: cantidadSedeIndividual,
                    monto: montoSedeIndividual,
                    esIndividual: true
                });
            }

            // Forzar orden fijo de niveles (BÁSICO, PRE INTERMEDIO, INTERMEDIO...)
            // y dejar PLAN INDIVIDUAL siempre al final, sin importar el orden en que
            // vinieron las niveles desde el backend.
            ingresosConsolidadosObj[groupKey].detallesNiveles = ordenarNiveles(
                ingresosConsolidadosObj[groupKey].detallesNiveles
            );
        }

        // Procesar Egresos de la sede
        if (sedeData.egresos) {
            sedeData.egresos.forEach(egr => {
                egresosFlats.push({ ...egr, sede: sedeNombre, tipo: 'EGRESO' });
            });
        }

        // Procesar ingresos manuales (Si existen)
        if (sedeData.ingresosManuales) {
            sedeData.ingresosManuales.forEach(ing => {
                ingresosManualesFlats.push({ ...ing, sede: sedeNombre, tipo: 'INGRESO' });
            });
        }
    });

    // INYECTAR EL TEXTO MULTILÍNEA
    const ingresosConsolidadosArray = Object.values(ingresosConsolidadosObj).map(item => {
        // Línea principal (Ej: INGRESOS ACUMULADOS | 7.5 FTE (15 PAGOS))
        let conceptoStr = `INGRESOS ACUMULADOS | ${item.fteTotal} FTE (${item.cantidad} PAGO${item.cantidad !== 1 ? 'S' : ''})`;

        // Agregar una línea por cada nivel (Ej: ↳ BÁSICO: 2 FTE (4 PAGOS))
        item.detallesNiveles.forEach(det => {
            conceptoStr += `\n  ↳ ${det.nivel}: ${det.fte} FTE (${det.cantidad} PAGO${det.cantidad !== 1 ? 'S' : ''})`;
        });

        return {
            ...item,
            concepto: conceptoStr,
            detallesRender: item.detallesNiveles // Lo dejamos por si a futuro quieres mapearlo con React
        };
    });

    return {
        ingresosConsolidados: ingresosConsolidadosArray,
        ingresosManuales: ingresosManualesFlats,
        egresos: egresosFlats
    };
};

// Aplana el estado ya consolidado `datosPorMes` a filas para el Excel de resumen anual.
export const construirFilasExcel = (datosPorMes, filtroAnio, meses) => {
    const dataToExport = [];

    Object.entries(datosPorMes).forEach(([mesNum, dataMes]) => {
        const nombreMes = meses[parseInt(mesNum) - 1];

        // 1. Procesar Ingresos Automáticos (ya vienen consolidados por sede + detalle por nivel)
        if (dataMes.ingresosConsolidados) {
            dataMes.ingresosConsolidados.forEach(item => {
                // Fila principal de la Sede
                dataToExport.push({
                    "AÑO": filtroAnio,
                    "MES": nombreMes,
                    "SEDE": item.sede,
                    "NIVEL": "TOTAL SEDE",
                    "CONCEPTO": "TOTAL ACUMULADO",
                    "CANTIDAD PAGOS": item.cantidad,
                    "TOTAL FTE": item.fteTotal,
                    "MONTO (S/)": parseFloat(item.monto)
                });

                // Filas detalladas por nivel (dentro de la misma sede)
                if (item.detallesRender) {
                    item.detallesRender.forEach(det => {
                        dataToExport.push({
                            "AÑO": filtroAnio,
                            "MES": nombreMes,
                            "SEDE": item.sede,
                            "NIVEL": det.nivel,
                            "CONCEPTO": `DESGLOSE: ${det.nivel}`,
                            "CANTIDAD PAGOS": det.cantidad,
                            "TOTAL FTE": det.fte,
                            "MONTO (S/)": "" // El monto total ya está arriba
                        });
                    });
                }
            });
        }

        // 2. Ingresos Manuales y Egresos
        if (dataMes.ingresosManuales) {
            dataMes.ingresosManuales.forEach(ing => {
                dataToExport.push({
                    "AÑO": filtroAnio,
                    "MES": nombreMes,
                    "SEDE": ing.sede,
                    "NIVEL": "N/A",
                    "CONCEPTO": ing.concepto,
                    "CANTIDAD PAGOS": 1,
                    "TOTAL FTE": 0,
                    "MONTO (S/)": parseFloat(ing.monto)
                });
            });
        }

        if (dataMes.egresos) {
            dataMes.egresos.forEach(egr => {
                dataToExport.push({
                    "AÑO": filtroAnio,
                    "MES": nombreMes,
                    "SEDE": egr.sede,
                    "NIVEL": "N/A",
                    "CONCEPTO": egr.concepto,
                    "CANTIDAD PAGOS": 1,
                    "TOTAL FTE": 0,
                    "MONTO (S/)": -Math.abs(parseFloat(egr.monto))
                });
            });
        }
    });

    return dataToExport;
};
