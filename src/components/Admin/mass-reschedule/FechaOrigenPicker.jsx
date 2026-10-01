import React from 'react';
import { CalendarClock, History } from 'lucide-react';

const FechaOrigenPicker = ({ modoFechas, onModoFechasChange, fechaOrigen, onChange, disabled, placeholder, fechasDisponibles }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between ml-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">3. Fecha a Cancelar</label>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-[1.25rem] border border-slate-200">
            <button
                type="button"
                onClick={() => onModoFechasChange('futuras')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${modoFechas === 'futuras' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-slate-400'}`}
            >
                <CalendarClock size={14} /> Próximas
            </button>
            <button
                type="button"
                onClick={() => onModoFechasChange('pasadas')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${modoFechas === 'pasadas' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
            >
                <History size={14} /> Pasadas
            </button>
        </div>

        <select
            name="fecha_origen"
            value={fechaOrigen || ""}
            onChange={onChange}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-orange-500 transition-all font-black text-slate-700 text-xs uppercase"
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
