import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const STEPS = ['Modalidad y sede', 'Horario y fechas', 'Confirmación'];

const StepIndicator = ({ current }) => (
  <ol className="flex items-center justify-center gap-2 md:gap-4 mb-10">
    {STEPS.map((label, i) => {
      const n = i + 1;
      const done = n < current;
      const active = n === current;
      return (
        <li key={label} className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[11px] font-black italic transition-all duration-300 ${active
              ? 'bg-brand-accent text-white shadow-lg'
              : done
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface-alt text-brand-muted'
              }`}>
              {done ? <CheckCircle2 size={16} /> : n}
            </span>
            <span className={`hidden md:block text-[10px] font-black uppercase italic tracking-widest ${active ? 'text-brand-primary' : 'text-brand-muted'}`}>
              {label}
            </span>
          </div>
          {n < STEPS.length && <div className={`h-1 w-6 md:w-12 rounded-full ${done ? 'bg-brand-primary' : 'bg-brand-surface-alt'}`} />}
        </li>
      );
    })}
  </ol>
);

export default StepIndicator;
