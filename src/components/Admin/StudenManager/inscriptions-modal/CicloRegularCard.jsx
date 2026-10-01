import React from 'react';
import { Clock, User, DollarSign, Info, Layers } from 'lucide-react';
import { formatearFecha, obtenerRangoCiclo, getEstadoPagoBadge, getEstadoInscripcionBadge } from '../ciclos/cicloHelpers';

const CicloRegularCard = ({ ciclo }) => {
    const estadosInscripcion = [...new Set((ciclo.inscripciones || []).map(i => i.estado))];

    return (
        <div className="bg-white border-2 border-slate-50 rounded-2xl p-5 hover:border-blue-100 hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                            {obtenerRangoCiclo(ciclo.fecha_inicio_real, ciclo.fecha_fin_real)}
                        </span>
                        {ciclo.horarios?.length > 1 && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-1 rounded-md border border-indigo-100 uppercase">
                                <Layers size={9} /> x{ciclo.horarios.length} horarios
                            </span>
                        )}
                    </div>

                    <p className="text-sm font-black text-slate-700 uppercase italic mt-2">
                        SEDE {ciclo.inscripciones?.[0]?.sede || 'S/D'}
                    </p>

                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 min-w-0">
                        <User size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate">
                            {ciclo.inscripciones?.[0]?.nivel || 'S/D'}
                            {ciclo.inscripciones?.[0]?.profesor ? ` · ${ciclo.inscripciones[0].profesor}` : ''}
                        </span>
                    </div>

                    {ciclo.horarios?.length > 0 && (
                        <div className="flex flex-col gap-1 mt-2">
                            {ciclo.horarios.map((h, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                    <Clock size={12} className="text-blue-400" />
                                    {h.dia} {h.hora_inicio}-{h.hora_fin}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border whitespace-nowrap ${getEstadoPagoBadge(ciclo.estado_pago)}`}>
                        {ciclo.estado_pago}
                    </span>
                    {estadosInscripcion.map((estado, i) => (
                        <span key={i} className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border whitespace-nowrap ${getEstadoInscripcionBadge(estado)}`}>
                            {estado}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-3 mt-3 border-t border-slate-100">
                <div className="flex flex-col min-w-0">
                    <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Inicio</span>
                    <span className="text-[10px] font-black text-slate-700 truncate">{formatearFecha(ciclo.fecha_inicio_real)}</span>
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Fin real</span>
                    <span className="text-[10px] font-black text-slate-700 truncate">
                        {ciclo.fecha_fin_real ? formatearFecha(ciclo.fecha_fin_real) : 'EN CURSO'}
                    </span>
                </div>
                {ciclo.monto_final > 0 && (
                    <div className="flex flex-col min-w-0 col-span-2">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Monto</span>
                        <span className="text-[11px] font-black text-emerald-600 flex items-center gap-0.5">
                            <DollarSign size={10} className="shrink-0" />{Number(ciclo.monto_final).toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {ciclo.fecha_vencimiento_pago && (
                <div className="flex items-start gap-1.5 pt-2 mt-2 border-t border-dashed border-slate-100">
                    <Info size={10} className="text-slate-300 shrink-0 mt-0.5" />
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest break-words">
                        Plazo de pago: {formatearFecha(ciclo.fecha_vencimiento_pago)}
                    </span>
                </div>
            )}

            <p className="text-[8px] text-slate-300 font-bold italic pt-2">
                Cuenta #{ciclo.cuenta_id} · {ciclo.concepto}
            </p>
        </div>
    );
};

export default CicloRegularCard;
