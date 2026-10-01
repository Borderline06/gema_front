import React from 'react';
import { Clock, CalendarDays, MapPin } from 'lucide-react';
import { BRAND_COLORS } from "../../config/themeColors.js";

const WeeklyTimelineEnrollment = ({ agendaSeleccionada = [] }) => {
  const diasSemana = [
    { id: 1, label: 'Lunes', short: 'LUN' },
    { id: 2, label: 'Martes', short: 'MAR' },
    { id: 3, label: 'Miércoles', short: 'MIE' },
    { id: 4, label: 'Jueves', short: 'JUE' },
    { id: 5, label: 'Viernes', short: 'VIE' },
    { id: 6, label: 'Sábado', short: 'SAB' },
    { id: 7, label: 'Domingo', short: 'DOM' }
  ];

  // Rango solicitado: 08:00 a 00:00
  const startDay = 8;
  const endDay = 24;
  const totalHours = endDay - startDay;

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    // Normalizar 00:00 como 24 para el cálculo
    const normalizedHrs = hrs === 0 ? 24 : hrs;
    const totalMins = (normalizedHrs * 60) + mins;

    // Calculamos la posición relativa al inicio (8 AM)
    const position = ((totalMins - (startDay * 60)) / (totalHours * 60)) * 100;
    return Math.max(0, position); // Evita valores negativos si hay clases antes de las 8
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${BRAND_COLORS['border-soft']};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: all 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${BRAND_COLORS.accent};
        }
      `}} />

      <section className="mb-8 bg-brand-surface rounded-[2rem] p-1 shadow-xl border border-brand-border relative overflow-hidden font-sans mx-auto max-w-7xl animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary-soft opacity-50 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent-soft opacity-50 blur-[80px] rounded-full pointer-events-none" />

        <div className="p-3 md:p-6 relative z-10">
          <div className="flex items-center justify-between mb-6 gap-4 px-2">
            <div className="space-y-0.5">
              <h2 className="text-xl md:text-3xl font-black italic text-brand-primary uppercase tracking-tighter leading-none">
                GEMA <span className="text-brand-accent">PLANNER</span>
              </h2>
              <div className="flex items-center gap-2">
                <CalendarDays size={12} className="text-brand-muted" />
                <p className="text-[8px] md:text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">Semana Completa</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-brand-primary-soft px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
              <Clock className="text-brand-primary" size={14} />
              <span className="text-[10px] md:text-xs font-black text-brand-primary italic tracking-tighter">08:00 — 00:00</span>
            </div>
          </div>

          <div className="relative flex overflow-x-auto pb-4 custom-scrollbar border border-brand-border-soft rounded-2xl bg-brand-bg/50">
            {/* Gutter de Horas */}
            <div className="flex-none w-10 md:w-14 pt-12 border-r border-brand-border sticky left-0 bg-white/80 backdrop-blur-md z-30">
              {Array.from({ length: totalHours + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="text-[8px] md:text-[9px] font-black text-brand-muted pr-2 flex justify-end italic"
                  style={{ height: `${100 / totalHours}%`, transform: 'translateY(-50%)' }}
                >
                  {startDay + i}:00
                </div>
              ))}
            </div>

            {/* Grid de 7 Columnas (Lunes a Domingo) */}
            <div className="flex-grow grid grid-cols-7 min-w-[850px] md:min-w-full">
              {diasSemana.map((dia) => {
                const clasesDelDia = agendaSeleccionada.filter(h => Number(h.dia_semana) === dia.id);

                return (
                  <div key={dia.id} className="relative border-r border-brand-border-soft last:border-r-0 min-h-[500px] group/day hover:bg-white/50 transition-colors">
                    <div className="h-12 flex items-center justify-center border-b border-brand-border-soft bg-white/30">
                      <span className="text-[10px] md:text-[12px] font-black text-brand-primary italic uppercase tracking-widest group-hover/day:text-brand-accent transition-colors">
                        {dia.short}
                      </span>
                    </div>

                    <div className="relative h-full px-1">
                      {Array.from({ length: totalHours }).map((_, i) => (
                        <div key={i} className="absolute w-full border-t border-brand-border/50" style={{ top: `${(i / totalHours) * 100}%` }} />
                      ))}

                      {clasesDelDia.map((clase) => {
                        const top = getPosition(clase.hora_inicio);
                        const bottom = getPosition(clase.hora_fin);
                        const height = bottom - top;

                        // Si la clase empieza antes de las 8am, no la renderizamos o la ajustamos
                        if (top < 0 && (top + height) <= 0) return null;

                        return (
                          <div
                            key={clase.id}
                            className="absolute left-1 right-1 rounded-xl overflow-hidden group/item transition-all duration-300 hover:z-40 hover:scale-[1.04] shadow-md border border-brand-border hover:border-orange-200"
                            style={{
                              top: `${Math.max(0, top)}%`,
                              height: `${top < 0 ? height + top : height}%`,
                              marginTop: '1.5px',
                              marginBottom: '1.5px'
                            }}
                          >
                            <div className="absolute inset-0 bg-brand-surface group-hover/item:bg-brand-accent-soft transition-colors duration-500" />
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary group-hover/item:bg-brand-accent transition-colors" />

                            <div className="relative p-2 h-full flex flex-col justify-between">
                              <div className="flex flex-col">
                                <span className="text-[8px] md:text-[10px] font-black text-brand-primary italic uppercase truncate leading-none mb-1 group-hover/item:text-brand-accent-dark">
                                  {clase.nivel?.nombre || 'CLASE'}
                                </span>

                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-brand-accent" />
                                    <span className="text-[7px] md:text-[8px] font-bold text-slate-500">{clase.hora_inicio}</span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-60">
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[7px] md:text-[8px] font-bold text-slate-500">{clase.hora_fin}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <MapPin size={10} className="text-blue-100 group-hover/item:text-orange-200 transition-colors" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-brand-border-soft pt-4 px-2">
            <div className="flex items-center gap-2 bg-brand-primary-soft px-3 py-1 rounded-lg border border-blue-100">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <span className="text-[9px] font-black text-brand-primary uppercase italic tracking-widest opacity-70">Club Gema</span>
            </div>
            <p className="text-[8px] font-bold text-brand-muted uppercase italic">
              Horario de Lunes a Domingo • 08:00 - 00:00
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default WeeklyTimelineEnrollment;