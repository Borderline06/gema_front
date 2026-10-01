import React from 'react';
import { Clock, CheckSquare } from 'lucide-react';
import { diasSemana } from './scheduleLabels';

const CurrentScheduleCard = ({ horario, isSelected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`cursor-pointer border-2 rounded-2xl p-4 transition-all relative overflow-hidden group ${isSelected
            ? 'border-brand-accent bg-brand-accent-soft/30'
            : 'border-brand-border-soft hover:border-orange-200 hover:bg-brand-bg'
            }`}
    >
        {isSelected && (
            <div className="absolute top-4 right-4 text-brand-accent">
                <CheckSquare size={20} fill="currentColor" className="text-white bg-brand-accent rounded-lg" />
            </div>
        )}
        <div className="space-y-3">
            <div className="flex gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isSelected ? 'bg-brand-accent text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                    {horario.horarios_clases.niveles_entrenamiento?.nombre || 'Sin Nivel'}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isSelected ? 'bg-orange-200 text-orange-800' : 'bg-brand-surface-alt text-slate-500'
                    }`}>
                    {horario.horarios_clases.canchas.sedes.nombre || 'Sin Sede'}
                </span>
            </div>
            <div>
                <h3 className="font-black text-slate-800 uppercase italic tracking-tight text-base">
                    {diasSemana(horario.horarios_clases.dia_semana)}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                    <Clock size={12} />
                    <span className="text-[11px] font-bold uppercase">{horario.horarios_clases.hora_inicio.slice(11, 16)} - {horario.horarios_clases.hora_fin.slice(11, 16)}</span>
                </div>
            </div>
        </div>
    </div>
);

export default CurrentScheduleCard;
