import React from 'react';
import { Filter } from 'lucide-react';

const HorarioSelectionList = ({ filterDay, filteredHorarios, horariosSeleccionados, onToggleHorario, onToggleTodos, diasSemana }) => (
    <div className={`col-span-full space-y-2 transition-opacity duration-300 ${!filterDay ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex justify-between items-center ml-2 mb-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                2. Horarios Afectados <span className="text-orange-500">({horariosSeleccionados.length} seleccionados)</span>
            </label>
            <button
                type="button"
                onClick={onToggleTodos}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline uppercase tracking-widest transition-colors"
                disabled={!filterDay || filteredHorarios.length === 0}
            >
                {horariosSeleccionados.length === filteredHorarios.length && filteredHorarios.length > 0 ? "Deseleccionar Todos" : "Seleccionar Todos"}
            </button>
        </div>

        <div className="max-h-56 overflow-y-auto bg-slate-50 border-2 border-slate-100 rounded-2xl p-2 space-y-1 custom-scrollbar">
            {filteredHorarios.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                    <Filter className="mx-auto mb-2 opacity-50" size={24} />
                    <p className="text-xs font-bold uppercase tracking-widest">
                        {!filterDay ? "Elige un día arriba para ver horarios" : "No hay horarios para este filtro"}
                    </p>
                </div>
            ) : (
                filteredHorarios.map(h => (
                    <label key={h.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${horariosSeleccionados.includes(h.id) ? 'bg-blue-100/50 border-blue-200 shadow-sm' : 'hover:bg-slate-200/50 border-transparent border'}`}>
                        <input
                            type="checkbox"
                            checked={horariosSeleccionados.includes(h.id)}
                            onChange={() => onToggleHorario(h.id)}
                            className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 transition-all"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-700 uppercase">
                                [{diasSemana[h.dia_semana]}] {h.hora_inicio}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {h.nivel?.nombre} | {h.cancha?.nombre}
                            </span>
                        </div>
                    </label>
                ))
            )}
        </div>
    </div>
);

export default HorarioSelectionList;
