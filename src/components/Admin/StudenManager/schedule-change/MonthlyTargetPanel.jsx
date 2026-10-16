import React, { useState } from 'react';
import { AlertCircle, Filter } from 'lucide-react';
import ScheduleFilters from './ScheduleFilters';
import AvailableScheduleCard from './AvailableScheduleCard';

// Destino de un cambio MENSUAL: lista de horarios (patrón semanal) filtrable por sede y nivel.
const MonthlyTargetPanel = ({ horariosDisponibles, selectedHorarioNuevo, onSelect }) => {
    const [filtroSede, setFiltroSede] = useState('');
    const [filtroNivel, setFiltroNivel] = useState('');

    const sedesUnicas = [...new Set(horariosDisponibles.map(h => h.cancha?.sede?.nombre).filter(Boolean))];
    const nivelesUnicos = [...new Set(horariosDisponibles.map(h => h.nivel?.nombre).filter(Boolean))];

    const horariosFiltrados = horariosDisponibles.filter(horario => {
        const matchSede = filtroSede === '' || horario.cancha?.sede?.nombre === filtroSede;
        const matchNivel = filtroNivel === '' || horario.nivel?.nombre === filtroNivel;
        return matchSede && matchNivel;
    });

    return (
        <>
            <ScheduleFilters
                filtroSede={filtroSede}
                setFiltroSede={setFiltroSede}
                sedesUnicas={sedesUnicas}
                filtroNivel={filtroNivel}
                setFiltroNivel={setFiltroNivel}
                nivelesUnicos={nivelesUnicos}
            />

            {horariosDisponibles.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 p-8 bg-brand-bg rounded-2xl border border-brand-border-soft border-dashed">
                    <AlertCircle size={32} className="text-slate-300 mb-3" />
                    <p className="text-slate-500 font-bold uppercase text-xs text-center tracking-wide">No hay horarios disponibles</p>
                </div>
            ) : horariosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 p-8 bg-brand-bg rounded-2xl border border-brand-border-soft border-dashed">
                    <Filter size={32} className="text-slate-300 mb-3" />
                    <p className="text-slate-500 font-bold uppercase text-xs text-center tracking-wide">No hay resultados para estos filtros</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '300px' }}>
                    {horariosFiltrados.map((horario) => (
                        <AvailableScheduleCard
                            key={horario.id}
                            horario={horario}
                            isSelected={selectedHorarioNuevo?.id === horario.id}
                            onSelect={() => onSelect(horario)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default MonthlyTargetPanel;
