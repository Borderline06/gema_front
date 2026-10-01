import React from 'react';
import { Zap } from 'lucide-react';
import { formatearFecha, getEstadoPagoBadge } from './cicloHelpers';

const ClaseSueltaButton = ({ ciclo, onSelect }) => (
    <button
        onClick={onSelect}
        className="w-full bg-white border border-purple-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm hover:border-purple-300 hover:shadow-md transition-all text-left active:scale-[0.98]"
    >
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Zap size={16} />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Clase Suelta</p>
                <p className="text-[11px] font-bold text-slate-600 truncate">
                    {formatearFecha(ciclo.fecha_inicio_real)} · {ciclo.inscripciones?.[0]?.sede || 'S/D'}
                </p>
            </div>
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border shrink-0 ${getEstadoPagoBadge(ciclo.estado_pago)}`}>
            {ciclo.estado_pago}
        </span>
    </button>
);

export default ClaseSueltaButton;
