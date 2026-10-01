import React from 'react';
import { ShieldAlert, Users, Phone } from 'lucide-react';

const EmergencyContactCard = ({ contacto }) => (
    <div className="bg-red-50 rounded-[2.5rem] border border-red-100 p-8 relative overflow-hidden shrink-0">
        <div className="absolute -right-4 -bottom-4 text-red-100 opacity-50">
            <ShieldAlert size={120} />
        </div>
        <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
                <Users size={24} />
                <span className="text-xs font-black uppercase tracking-widest italic">Contacto Emergencia</span>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-[9px] font-black text-red-400 uppercase mb-1">Responsable</p>
                    <p className="text-lg font-black text-red-900 leading-tight uppercase italic">{contacto.nombre}</p>
                    <p className="text-[10px] font-bold text-red-600 uppercase italic mt-1">{contacto.relacion}</p>
                </div>
                <div className="pt-4 border-t border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-red-400 uppercase mb-1">Teléfono Directo</p>
                        <p className="text-xl font-black text-red-900 tracking-tighter">{contacto.telefono}</p>
                    </div>
                    <a href={`tel:${contacto.telefono}`} className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
                        <Phone size={20} />
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default EmergencyContactCard;
