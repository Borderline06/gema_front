import React from 'react';
import { CalendarDays, Ticket, CheckCircle2 } from 'lucide-react';
import { MODALIDAD } from '../../../../hooks/useEnrollmentWizard';

const OPCIONES = [
  { value: MODALIDAD.MENSUAL, icon: CalendarDays, title: 'Mensual', desc: 'Ciclo de 30 días con tus días fijos de la semana' },
  { value: MODALIDAD.UNICA, icon: Ticket, title: 'Clase Única', desc: 'Asiste por un único día, el que tú elijas' },
];

const ModalityChoice = ({ value, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {OPCIONES.map(({ value: v, icon: Icon, title, desc }) => {
      const selected = value === v;
      return (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 ${selected
            ? 'border-brand-primary bg-brand-surface shadow-2xl shadow-brand-primary/10 scale-[1.02]'
            : 'border-brand-border-soft bg-brand-surface hover:border-blue-200 hover:shadow-xl'
            }`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${selected ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-primary-soft text-brand-primary'}`}>
              <Icon size={22} strokeWidth={2.5} />
            </div>
            <div className={`transition-all duration-500 ${selected ? 'scale-110 opacity-100' : 'opacity-0 scale-50'}`}>
              <div className="bg-brand-primary rounded-full p-1 shadow-lg shadow-brand-primary/20">
                <CheckCircle2 size={24} className="text-white" fill="currentColor" />
              </div>
            </div>
          </div>
          <h3 className={`text-3xl font-black uppercase italic leading-none tracking-tighter ${selected ? 'text-brand-primary' : 'text-brand-muted'}`}>{title}</h3>
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mt-3">{desc}</p>
        </button>
      );
    })}
  </div>
);

export default ModalityChoice;
