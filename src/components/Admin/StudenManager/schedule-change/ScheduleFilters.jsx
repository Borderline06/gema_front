import React from 'react';
import { Filter } from 'lucide-react';

const ScheduleFilters = ({ filtroSede, setFiltroSede, sedesUnicas, filtroNivel, setFiltroNivel, nivelesUnicos }) => (
    <div className="flex flex-col sm:flex-row gap-3 mb-4 bg-brand-bg p-3 rounded-2xl border border-brand-border-soft">
        <div className="flex items-center gap-2 text-brand-muted pr-2 border-r border-brand-border hidden sm:flex">
            <Filter size={16} />
        </div>
        <select
            value={filtroSede}
            onChange={(e) => setFiltroSede(e.target.value)}
            className="flex-1 bg-brand-surface border border-brand-border text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all cursor-pointer"
        >
            <option value="">Todas las Sedes</option>
            {sedesUnicas.map((sede, idx) => (
                <option key={idx} value={sede}>{sede}</option>
            ))}
        </select>
        <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="flex-1 bg-brand-surface border border-brand-border text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all cursor-pointer"
        >
            <option value="">Todos los Niveles</option>
            {nivelesUnicos.map((nivel, idx) => (
                <option key={idx} value={nivel}>{nivel}</option>
            ))}
        </select>
    </div>
);

export default ScheduleFilters;
