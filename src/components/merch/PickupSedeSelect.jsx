import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { uniqueById } from '../../utils/uniqueById';

// Selector de "Sede de recojo": dónde retirará el alumno sus productos.
// Controlado por el padre; `value` es el id de la sede (o null/'' si aún no eligió).
const PickupSedeSelect = ({ sedes, value, onChange, id = 'sede-recojo' }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="flex items-center gap-1.5 text-[9px] font-black text-brand-muted uppercase tracking-widest">
      <MapPin size={12} className="text-brand-gold" /> Sede de recojo
    </label>
    <div className="relative">
      <select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="w-full appearance-none bg-brand-bg border-2 border-brand-border-soft rounded-xl pl-4 pr-10 py-3 text-xs font-black uppercase text-brand-primary outline-none cursor-pointer focus:border-brand-gold transition-colors"
      >
        <option value="">Elige dónde recogerlo…</option>
        {uniqueById(sedes).map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
    </div>
  </div>
);

export default PickupSedeSelect;
