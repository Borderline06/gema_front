import React from 'react';
import { CalendarClock, History } from 'lucide-react';

const FechaOrigenPicker = ({ modoFechas, onModoFechasChange, fechaOrigen, onChange, disabled, placeholder, fechasDisponibles }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between ml-2">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">3. Fecha a Cancelar</label>
        </div>

        <div className="flex p-1 bg-brand-surface-alt rounded-[1.25rem] border border-brand-border">
            <button
                type="button"
                onClick={() => onModoFechasChange('futuras')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${modoFechas === 'futuras' ? 'bg-brand-surface text-brand-primary shadow-sm' : 'text-brand-muted'}`}
            >
                <CalendarClock size={14} /> Próximas
            </button>
            <button
                type="button"
                onClick={() => onModoFechasChange('pasadas')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${modoFechas === 'pasadas' ? 'bg-brand-surface text-brand-accent-dark shadow-sm' : 'text-brand-muted'}`}
            >
                <History size={14} /> Pasadas
            </button>
        </div>

        <select
            name="fecha_origen"
            value={fechaOrigen || ""}
            onChange={onChange}
            className="w-full p-4 rounded-2xl border-2 border-brand-border-soft bg-brand-bg focus:border-brand-accent transition-all font-black text-brand-body text-xs uppercase"
            disabled={disabled}
            required
        >
            <option value="" disabled={fechasDisponibles.length > 0}>
                {placeholder}
            </option>
            {fechasDisponibles.map((fecha) => (
                <option key={fecha} value={fecha}>{fecha}</option>
            ))}
        </select>
    </div>
);

export default FechaOrigenPicker;
