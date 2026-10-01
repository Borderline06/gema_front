import React from 'react';
import { MapPin, Layers, Clock } from 'lucide-react';

const HorarioFilters = ({
    sedes, sedeSelect, onSedeChange,
    niveles, nivelSelect, onNivelChange,
    diasSemana, diaSelect, onDiaChange,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <MapPin size={12} /> Sede
            </label>
            <select
                id="sedeSelect"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#1e3a8a] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase cursor-pointer"
                value={sedeSelect}
                onChange={(e) => onSedeChange(e.target.value)}
            >
                <option value="">SELECCIONAR SEDE</option>
                {sedes.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
            </select>
        </div>
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Layers size={12} /> Nivel
            </label>
            <select
                id="nivelSelect"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#1e3a8a] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase cursor-pointer"
                value={nivelSelect}
                onChange={(e) => onNivelChange(e.target.value)}
            >
                <option value="">SELECCIONAR NIVEL</option>
                {niveles.map((n) => (
                    <option key={n.id} value={n.id}>{n.nombre}</option>
                ))}
            </select>
        </div>
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Clock size={12} /> Día
            </label>
            <select
                id="diaSelect"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#1e3a8a] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase cursor-pointer"
                value={diaSelect}
                onChange={(e) => onDiaChange(e.target.value)}
            >
                <option value="">SELECCIONAR DÍA</option>
                {diasSemana.map((d) => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
            </select>
        </div>
    </div>
);

export default HorarioFilters;
