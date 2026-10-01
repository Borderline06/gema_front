import React from 'react';
import { Zap, X, MapPin, User, Clock, DollarSign, Info } from 'lucide-react';
import { formatearFecha, obtenerRangoCiclo, getEstadoPagoBadge, getEstadoInscripcionBadge } from './cicloHelpers';

// title es configurable porque InscriptionsModal y StudentDetails lo usan con
// textos ligeramente distintos ("Detalle" vs "Resumen") pero el mismo layout.
const ClaseSueltaDetailModal = ({ ciclo, onClose, title = 'Detalle de Clase Suelta' }) => (
    <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-6 py-5 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-600">
                    <Zap size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest italic">{title}</span>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95"
                >
                    <X size={16} className="text-slate-500" />
                </button>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                        {obtenerRangoCiclo(ciclo.fecha_inicio_real, ciclo.fecha_fin_real)}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getEstadoPagoBadge(ciclo.estado_pago)}`}>
                        {ciclo.estado_pago}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <MapPin size={12} className="text-orange-500 shrink-0" />
                        {ciclo.inscripciones?.[0]?.sede || 'S/D'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <User size={12} className="text-slate-400 shrink-0" />
                        {ciclo.inscripciones?.[0]?.nivel || 'S/D'}
                        {ciclo.inscripciones?.[0]?.profesor ? ` · ${ciclo.inscripciones[0].profesor}` : ''}
                    </div>
                    {ciclo.horarios?.length > 0 && (
                        <div className="flex items-start gap-2 text-[10px] font-bold text-slate-500">
                            <Clock size={12} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words">
                                {ciclo.horarios.map(h => `${h.dia.slice(0, 3)} ${h.hora_inicio}-${h.hora_fin}`).join(' · ')}
                            </span>
                        </div>
                    )}
                </div>

                {(ciclo.inscripciones || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {[...new Set(ciclo.inscripciones.map(i => i.estado))].map((estado, i) => (
                            <span key={i} className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${getEstadoInscripcionBadge(estado)}`}>
                                {estado}
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Inicio</span>
                        <span className="text-[11px] font-black text-slate-700">{formatearFecha(ciclo.fecha_inicio_real)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Fin real</span>
                        <span className="text-[11px] font-black text-slate-700">
                            {ciclo.fecha_fin_real ? formatearFecha(ciclo.fecha_fin_real) : 'EN CURSO'}
                        </span>
                    </div>
                    {ciclo.monto_final > 0 && (
                        <div className="flex flex-col col-span-2">
                            <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Monto</span>
                            <span className="text-[13px] font-black text-emerald-600 flex items-center gap-0.5">
                                <DollarSign size={12} className="shrink-0" />{Number(ciclo.monto_final).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>

                {ciclo.fecha_vencimiento_pago && (
                    <div className="flex items-start gap-1.5 pt-3 border-t border-dashed border-slate-100">
                        <Info size={12} className="text-slate-300 shrink-0 mt-0.5" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest break-words">
                            Plazo de pago: {formatearFecha(ciclo.fecha_vencimiento_pago)}
                        </span>
                    </div>
                )}

                <p className="text-[9px] text-slate-300 font-bold italic pt-1">
                    Cuenta #{ciclo.cuenta_id} · {ciclo.concepto}
                </p>
            </div>
        </div>
    </div>
);

export default ClaseSueltaDetailModal;
