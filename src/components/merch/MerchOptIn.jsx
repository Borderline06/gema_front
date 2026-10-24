import React from 'react';
import { Gift, CheckCircle2 } from 'lucide-react';
import { COMPANY_NAME } from '../../config/branding';

const OPCIONES = [
  { value: true, label: 'Sí, agregar' },
  { value: false, label: 'No, gracias' },
];

// Pregunta previa al catálogo de merch en la inscripción: controlada por el padre.
// `value` = true (quiere merch) | false (no) | null (aún no responde; equivale a "no").
const MerchOptIn = ({ value, onChange }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2">
      <Gift size={18} className="text-brand-gold" />
      <h3 id="merch-optin-label" className="text-sm font-black text-brand-primary uppercase italic tracking-widest">
        ¿Deseas agregar artículos exclusivos de {COMPANY_NAME} a tu matrícula?
      </h3>
    </div>

    <div role="radiogroup" aria-labelledby="merch-optin-label" className="grid grid-cols-2 gap-3">
      {OPCIONES.map(({ value: v, label }) => {
        const selected = value === v;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(v)}
            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-[1.5rem] border-2 font-black uppercase italic tracking-widest text-[11px] transition-all duration-300 ${selected
              ? 'border-brand-primary bg-brand-primary text-white shadow-lg'
              : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-primary'
              }`}
          >
            {selected && <CheckCircle2 size={16} />}
            {label}
          </button>
        );
      })}
    </div>
  </section>
);

export default MerchOptIn;
