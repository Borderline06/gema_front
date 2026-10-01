import React from 'react';
import { Clock, MapPin, User, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

const StudentEnrollment = ({ schedule, isSelected, onSelect }) => {
  const days = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div
      onClick={() => onSelect(schedule.id)}
      className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden group ${isSelected
        ? 'border-brand-primary bg-brand-surface shadow-2xl shadow-brand-primary/10 scale-[1.02]'
        : 'border-brand-border-soft bg-brand-surface hover:border-blue-200 hover:shadow-xl'
        }`}
    >
      {/* Fondo decorativo: El trofeo solo se ilumina sutilmente */}
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transition-all duration-700 group-hover:scale-110 ${isSelected ? 'text-brand-primary opacity-[0.05]' : 'text-brand-heading'}`}>
        <Trophy size={120} />
      </div>

      {/* Indicador visual superior */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-colors duration-300 shadow-sm ${isSelected ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white'
          }`}>
          {schedule.nivel?.nombre || 'General'}
        </span>

        {/* Checkmark en Azul en lugar de Naranja para reducir saturación */}
        <div className={`transition-all duration-500 ${isSelected ? 'scale-110 opacity-100' : 'opacity-0 scale-50'}`}>
          <div className="bg-brand-primary rounded-full p-1 shadow-lg shadow-brand-primary/20">
            <CheckCircle2 size={24} className="text-white" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="relative z-10 space-y-6">
        <div>
          <h3 className={`text-3xl font-black uppercase italic leading-none tracking-tighter transition-colors duration-300 ${isSelected ? 'text-brand-primary' : 'text-brand-muted'
            }`}>
            {days[schedule.dia_semana]}
          </h3>
          <div className="flex items-center gap-2 text-brand-muted mt-3 font-black uppercase text-[10px] tracking-widest">
            {/* El naranja aquí sirve como acento de lectura rápida */}
            <div className={`p-1 rounded-md transition-colors ${isSelected ? 'bg-orange-100 text-brand-accent-dark' : 'bg-brand-surface-alt'}`}>
              <Clock size={12} strokeWidth={3} />
            </div>
            {schedule.hora_inicio} <ChevronRight size={10} className="text-brand-accent" /> {schedule.hora_fin}
          </div>
        </div>

        {/* Divisor: Solo una pequeña sección en naranja si está seleccionado */}
        <div className="flex items-center gap-2">
          <div className={`h-1 rounded-full transition-all duration-500 ${isSelected ? 'w-12 bg-brand-accent' : 'w-6 bg-slate-200'}`} />
          <div className="h-1 w-full bg-brand-surface-alt rounded-full" />
        </div>

        {/* Detalles de la sesión */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-primary-soft text-brand-primary'
              }`}>
              <MapPin size={18} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-brand-muted font-black uppercase tracking-widest mb-0.5">Sede / Cancha</p>
              <p className={`text-xs font-black leading-tight transition-colors ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                {schedule.cancha?.sede?.nombre} <span className="text-brand-accent mx-1">/</span> {schedule.cancha?.nombre}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-accent-soft text-brand-accent-dark'
              }`}>
              <User size={18} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-brand-muted font-black uppercase tracking-widest mb-0.5">Entrenador</p>
              <p className={`text-xs font-black leading-tight transition-colors ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                {schedule.coordinador?.nombre_completo || 'Staff Gema'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borde inferior: Ahora es Azul Gema, solo con un toque naranja al final */}
      <div className={`absolute bottom-0 left-0 h-1.5 transition-all duration-500 flex ${isSelected ? 'w-full' : 'w-0'}`}>
        <div className="h-full w-3/4 bg-brand-primary" />
        <div className="h-full w-1/4 bg-brand-accent" />
      </div>
    </div>
  );
};

export default StudentEnrollment;