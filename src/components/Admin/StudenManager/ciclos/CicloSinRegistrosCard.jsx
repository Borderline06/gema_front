import React from 'react';
import { CircleAlert } from 'lucide-react';
import { getEstadoPagoBadge } from './cicloHelpers';

const CicloSinRegistrosCard = ({ ciclo }) => (
    <div className="bg-brand-bg border border-dashed border-slate-300 rounded-2xl p-4 flex flex-col gap-2 opacity-80">
        <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-1.5 text-slate-500 min-w-0">
                <CircleAlert size={14} className="shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest truncate">Sin clases registradas</span>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border shrink-0 ${getEstadoPagoBadge(ciclo.estado_pago)}`}>
                {ciclo.estado_pago}
            </span>
        </div>
        <p className="text-[9px] text-brand-muted font-bold italic leading-relaxed">
            Cuenta #{ciclo.cuenta_id} · {ciclo.concepto} · S/ {Number(ciclo.monto_final).toFixed(2)}
        </p>
    </div>
);

export default CicloSinRegistrosCard;
