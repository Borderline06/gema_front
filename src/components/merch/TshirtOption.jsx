import React from 'react';

/**
 * Casilla "¡Quiero mi camiseta!". Controlada y sin conocimiento de la matrícula:
 * no importa servicios, rutas ni el estado del asistente, para poder reutilizarla
 * tal cual en la sección global de Merch.
 */
const TshirtOption = ({ checked, onChange, price, disabled = false, disabledReason }) => (
  <label className={`flex items-center gap-4 px-6 py-3.5 rounded-[1.8rem] border-2 shadow-2xl transition-all group ${disabled
    ? 'bg-slate-800 border-white/10 cursor-not-allowed'
    : 'bg-brand-primary-dark border-white/20 cursor-pointer hover:bg-brand-primary-dark active:scale-95'
    }`}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 accent-brand-accent"
    />
    <div className="flex flex-col">
      <span className={`text-[11px] font-black uppercase italic leading-none ${disabled ? 'text-gray-400' : 'text-white group-hover:text-orange-400'}`}>
        ¡Quiero mi camiseta!
      </span>
      <span className={`text-[8px] font-bold uppercase mt-1 ${disabled ? 'text-gray-500' : 'text-blue-300'}`}>
        {disabled && disabledReason ? disabledReason : `+ S/ ${Number(price).toFixed(2)} ADICIONALES`}
      </span>
    </div>
  </label>
);

export default TshirtOption;
