import React from 'react';
import { Minus, Plus } from 'lucide-react';

// Selector [ - | n | + ]. `max` limita por stock; `tone="dark"` es para tarjetas oscuras.
const QuantitySelector = ({ value, onChange, min = 0, max = 99, tone = 'light', label = 'cantidad' }) => {
  const btn = tone === 'dark'
    ? 'text-brand-gold hover:bg-brand-gold/15'
    : 'text-brand-primary hover:bg-brand-surface-alt';
  return (
    <div
      className={`inline-flex items-center rounded-xl border overflow-hidden ${tone === 'dark' ? 'border-brand-gold/40 bg-white/5' : 'border-brand-border bg-brand-surface'}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Quitar una unidad"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={`w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${btn}`}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite" className={`min-w-[2rem] text-center text-sm font-black ${tone === 'dark' ? 'text-white' : 'text-brand-heading'}`}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Añadir una unidad"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={`w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${btn}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
