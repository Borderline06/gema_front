import React from 'react';
import { Fingerprint, Phone, Mail, Calendar, User, MapPin, KeyRound } from 'lucide-react';

const StudentProfileCard = ({ alumno, detalle, onOpenPasswordModal }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        <div className="w-28 h-28 bg-[#1e3a8a] text-white rounded-3xl flex items-center justify-center font-black text-5xl italic shadow-2xl relative z-10 shrink-0">
            {alumno.nombres.charAt(0)}
        </div>
        <div className="flex-1 space-y-6 relative z-10 w-full">
            <div className='flex items-center gap-4'>
                <div className='flex-1'>
                    <h3 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">{alumno.full_name}</h3>
                    <div className="flex gap-2 mt-2">
                        {alumno.sedes.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[9px] font-black uppercase italic border border-orange-200">{s}</span>
                        ))}
                    </div>
                </div>
                <button onClick={onOpenPasswordModal} className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-black text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 active:scale-95 font-black text-[10px] sm:text-xs uppercase tracking-widest border-2 border-slate-800 hover:border-white">
                    <KeyRound size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Contraseña</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-tighter">
                    <Fingerprint size={16} className="text-blue-500" /> {alumno.dni}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold lowercase">
                    <Mail size={16} className="text-blue-500" /> {detalle.email}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-tighter">
                    <Calendar size={16} className="text-blue-500" /> {detalle.cumpleanos}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-tighter">
                    <Phone size={16} className="text-blue-500" /> {alumno.telefono}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold tracking-tighter">
                    <User size={16} className="text-blue-500" /> {detalle.username || 'Sin nombre de usuario'}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Dirección Registrada</p>
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <MapPin size={20} className="text-orange-500 shrink-0 mt-1" />
                    <div>
                        <p className="text-sm font-black text-slate-700 uppercase italic leading-tight">
                            {detalle.direccion.distrito} <span className="text-slate-300 font-normal mx-2">|</span> {detalle.direccion.completa}
                        </p>
                        {detalle.direccion.referencia && (
                            <p className="text-[10px] text-slate-400 mt-1 font-bold italic tracking-wide">Ref: {detalle.direccion.referencia}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default StudentProfileCard;
