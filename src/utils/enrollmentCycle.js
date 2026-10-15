import { addDays, format, getISODay, parseISO } from 'date-fns';

export const CYCLE_DAYS = 30;

// Las fechas del backend pueden venir como 'YYYY-MM-DD' o ISO completo.
export const toDateKey = (value) => String(value).slice(0, 10);

/**
 * Previsualización REFERENCIAL del ciclo: cada fecha dentro de los 30 días
 * desde `fechaInicio` cuyo día de semana esté entre `diasSemana` (1=lunes …
 * 7=domingo, igual que `horario.dia_semana`). Las que caen en feriado se
 * devuelven marcadas para que la UI las muestre como "sin clase".
 *
 * El backend sigue siendo autoritativo (enganche de paquetes, reposiciones).
 */
export const buildCyclePreview = ({ fechaInicio, diasSemana, feriados = [], duracionDias = CYCLE_DAYS }) => {
  if (!fechaInicio || diasSemana.length === 0) return [];

  const diasSet = new Set(diasSemana.map(Number));
  const feriadosSet = new Set(feriados.map(toDateKey));
  const inicio = parseISO(fechaInicio);
  const fechas = [];

  for (let i = 0; i < duracionDias; i++) {
    const dia = addDays(inicio, i);
    if (!diasSet.has(getISODay(dia))) continue;
    const key = format(dia, 'yyyy-MM-dd');
    fechas.push({ fecha: key, diaSemana: getISODay(dia), feriado: feriadosSet.has(key) });
  }
  return fechas;
};
