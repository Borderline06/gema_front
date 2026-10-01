import React from 'react';
import { Stethoscope, User } from 'lucide-react';

const StudentHealthCard = ({ detalle, onStatusHistoryChange }) => (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1e3a8a]">
                <Stethoscope size={20} />
                <span className="text-[11px] font-black uppercase tracking-widest italic">Información de Salud</span>
            </div>
            <span className="bg-[#1e3a8a] text-white text-[8px] font-black px-2 py-1 rounded-md">GRUPO SANGUÍNEO: {detalle.salud.sangre}</span>
        </div>
        <div className="p-8 grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2 italic">Alergias / Condiciones:</p>
                    <p className="text-sm font-bold text-slate-700 italic leading-relaxed">{detalle.salud.condiciones}</p>
                </div>
                <div className="flex justify-between p-5 bg-white border border-slate-100 rounded-3xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Seguro Médico:</span>
                    <span className="text-sm font-black text-[#1e3a8a] italic uppercase">{detalle.salud.seguro}</span>
                </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <User size={14} />
                    <p className="text-[9px] font-black uppercase italic">Historial Deportivo:</p>
                </div>
                <select
                    value={detalle.salud?.historial ?? 'Nuevo'}
                    onChange={(e) => onStatusHistoryChange(e.target.value)}
                    className="w-full text-[11px] font-medium text-slate-500 italic leading-relaxed bg-transparent border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="Antiguo">Antiguo</option>
                    <option value="Nuevo">Nuevo</option>
                </select>
            </div>
        </div>
    </div>
);

export default StudentHealthCard;
