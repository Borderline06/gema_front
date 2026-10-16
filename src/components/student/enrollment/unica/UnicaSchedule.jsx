import React, { useCallback, useMemo } from 'react';
import { addDays, format, getISODay, parseISO } from 'date-fns';
import { useFetch } from '../../../../hooks/useFetch';
import { enrollmentService } from '../../../../services/enrollment.service';
import { toDateKey } from '../../../../utils/enrollmentCycle';
import EmptyState from '../../../shared/EmptyState';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import SingleDatePicker from './SingleDatePicker';

const DIAS_VENTANA = 60;

const UnicaSchedule = ({ horarios, unica, onSelectFecha, onSelectHorario }) => {
  const hoy = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => addDays(hoy, DIAS_VENTANA), [hoy]);
  const idsKey = horarios.map(h => h.id).sort((a, b) => a - b).join(',');

  // El backend decide qué fechas están disponibles (cupo y feriados):
  // { [horarioId]: { [fecha]: { disponible, es_feriado, ... } } }.
  // Una fecha que no aparece es un día sin clase para ese horario.
  const { data: disponibilidad, loading } = useFetch(
    async () => {
      if (!idsKey) return null;
      const desde = format(hoy, 'yyyy-MM-dd');
      const hasta = format(maxDate, 'yyyy-MM-dd');
      const porHorario = await Promise.all(horarios.map(h => enrollmentService.disponibilidadPorFecha(h.id, desde, hasta)));
      return Object.fromEntries(horarios.map((h, i) => [
        h.id,
        Object.fromEntries(porHorario[i].map(d => [toDateKey(d.fecha), d])),
      ]));
    },
    [idsKey],
    { errorMessage: 'No se pudo consultar la disponibilidad' }
  );

  // Bloques reservables ese día: el backend marca disponible, y si es hoy
  // la clase no debe haber empezado ya (eso no lo conoce el backend por fecha).
  const bloquesDelDia = useCallback((fechaKey) => {
    const dia = parseISO(fechaKey);
    const esHoy = fechaKey === format(hoy, 'yyyy-MM-dd');
    const horaActual = format(hoy, 'HH:mm');

    return horarios.filter(h => {
      if (h.dia_semana !== getISODay(dia)) return false;
      if (esHoy && h.hora_inicio.slice(0, 5) <= horaActual) return false;
      const dato = disponibilidad?.[h.id]?.[fechaKey];
      return Boolean(dato?.disponible) && !dato.es_feriado;
    });
  }, [horarios, disponibilidad, hoy]);

  const handleSelect = (fechaKey) => {
    const bloques = bloquesDelDia(fechaKey);
    onSelectFecha(fechaKey, bloques.length === 1 ? bloques[0].id : null);
  };

  if (horarios.length === 0) return <EmptyState message="No hay horarios activos para esta sede y nivel." />;
  if (loading) return <LoadingSpinner className="flex justify-center py-10" />;

  const opciones = unica.fecha ? bloquesDelDia(unica.fecha) : [];

  return (
    <div className="space-y-8">
      <SingleDatePicker
        value={unica.fecha}
        onSelect={handleSelect}
        isAvailable={(key) => bloquesDelDia(key).length > 0}
        minDate={hoy}
        maxDate={maxDate}
      />

      {opciones.length > 1 && (
        <div>
          <h2 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-4 ml-2">¿En qué horario?</h2>
          <div className="flex flex-wrap gap-3">
            {opciones.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => onSelectHorario(h.id)}
                className={`px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase italic transition-all duration-500 border-2 ${unica.horarioId === h.id ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-brand-surface border-brand-border-soft text-brand-muted'}`}
              >
                {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)} · {h.cancha?.nombre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnicaSchedule;
