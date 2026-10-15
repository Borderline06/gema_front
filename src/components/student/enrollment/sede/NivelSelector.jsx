import React from 'react';
import { Trophy } from 'lucide-react';

// Mismo estilo de botón que SedeSelector.
const NivelSelector = ({ niveles, activeId, onSelect }) => (
  <div className="flex gap-3 overflow-x-auto scrollbar-hide py-4 px-2">
    {niveles.map(nivel => (
      <button key={nivel.id} type="button" onClick={() => onSelect(nivel.id)} className={`px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase italic transition-all duration-500 border-2 flex-shrink-0 ${activeId === nivel.id ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-brand-surface border-brand-border-soft text-brand-muted'}`}>
        <Trophy size={16} /> {nivel.nombre}
      </button>
    ))}
  </div>
);

export default NivelSelector;
