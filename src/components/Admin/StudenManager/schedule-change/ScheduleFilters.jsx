import React from 'react';
import { Filter } from 'lucide-react';

const ScheduleFilters = ({ filtroSede, setFiltroSede, sedesUnicas, filtroNivel, setFiltroNivel, nivelesUnicos }) => (
    <div className="flex flex-col sm:flex-row gap-3 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 text-slate-400 pr-2 border-r border-slate-200 hidden sm:flex">
            <Filter size={16} />
        </div>
        <select
            value={filtroSede}
            onChange={(e) => setFiltroSede(e.target.value)}
            className="flex-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer"
        >
            <option value="">Todas las Sedes</option>
            {sedesUnicas.map((sede, idx) => (
                <option key={idx} value={sede}>{sede}</option>
            ))}
        </select>
        <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="flex-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer"
        >
            <option value="">Todos los Niveles</option>
            {nivelesUnicos.map((nivel, idx) => (
                <option key={idx} value={nivel}>{nivel}</option>
            ))}
        </select>
    </div>
);

export default ScheduleFilters;
