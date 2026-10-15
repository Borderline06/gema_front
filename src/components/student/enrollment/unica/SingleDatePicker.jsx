import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addMonths, eachDayOfInterval, endOfMonth, format, getISODay,
  isSameMonth, startOfMonth, isAfter, startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';

const DIAS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

/**
 * Calendario mensual de selección única. Es puramente visual: la regla de qué
 * día se puede elegir llega en `isAvailable(fechaKey)` y el rango en min/maxDate.
 */
const SingleDatePicker = ({ value, onSelect, isAvailable, minDate, maxDate }) => {
  const [mes, setMes] = useState(() => startOfMonth(minDate));

  const dias = eachDayOfInterval({ start: startOfMonth(mes), end: endOfMonth(mes) });
  const offset = getISODay(dias[0]) - 1;
  const hayAnterior = isAfter(startOfMonth(mes), startOfMonth(minDate));
  const haySiguiente = isAfter(startOfMonth(maxDate), startOfMonth(mes));

  return (
    <div className="bg-brand-surface rounded-[2.5rem] p-6 border-2 border-brand-border-soft max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button type="button" disabled={!hayAnterior} onClick={() => setMes(addMonths(mes, -1))} className="p-2 rounded-full bg-brand-surface-alt text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-black text-brand-primary uppercase italic tracking-tighter">{format(mes, 'MMMM yyyy', { locale: es })}</p>
        <button type="button" disabled={!haySiguiente} onClick={() => setMes(addMonths(mes, 1))} className="p-2 rounded-full bg-brand-surface-alt text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS.map(d => <span key={d} className="text-center text-[8px] font-black text-brand-muted tracking-widest">{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <span key={`pad-${i}`} />)}
        {dias.map(dia => {
          const key = format(dia, 'yyyy-MM-dd');
          const fueraDeRango = !isSameMonth(dia, mes) || dia < startOfDay(minDate) || dia > maxDate;
          const disponible = !fueraDeRango && isAvailable(key);
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              disabled={!disponible}
              onClick={() => onSelect(key)}
              className={`aspect-square rounded-xl text-[11px] font-black transition-all ${selected
                ? 'bg-brand-primary text-white shadow-lg scale-105'
                : disponible
                  ? 'bg-brand-bg text-brand-primary border-2 border-brand-border-soft hover:border-brand-accent'
                  : 'text-slate-300 cursor-not-allowed'
                }`}
            >
              {format(dia, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SingleDatePicker;
