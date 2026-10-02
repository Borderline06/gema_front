import React from 'react';
import { CalendarClock, Loader2, Layers, MapPin, User, Clock, DollarSign, Info } from 'lucide-react';
import ClaseSueltaButton from '../ciclos/ClaseSueltaButton';
import CicloSinRegistrosCard from '../ciclos/CicloSinRegistrosCard';
import { formatearFecha, obtenerRangoCiclo, getEstadoPagoBadge, getEstadoInscripcionBadge } from '../ciclos/cicloHelpers';
import EmptyState from '../../../shared/EmptyState';

const CicloHistoryPanel = ({ ciclos, loadingCiclos, onSelectIndividual }) => (
    <div className="bg-brand-surface rounded-[2.5rem] border border-brand-border-soft shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-brand-accent-soft/50 border-b border-orange-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-accent-dark flex items-center justify-center shrink-0">
                <CalendarClock size={16} />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase italic tracking-widest leading-tight">
                Historial de Ciclos
            </h3>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[500px] space-y-3 bg-brand-bg/30">
            {loadingCiclos ? (
                <div className="flex flex-col justify-center items-center py-10 gap-2">
                    <Loader2 className="animate-spin text-brand-accent" size={24} />
                    <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Cargando ciclos...</span>
                </div>
            ) : ciclos.length > 0 ? (
                ciclos.map((ciclo) => {
                    const estadosInscripcion = [...new Set(
                        (ciclo.inscripciones || []).map(i => i.estado)
                    )];

                    // Tarjeta especial: sin clases registradas (todas CANCELADO o cuenta vieja sin link)
                    if (ciclo.sin_registros) {
                        return <CicloSinRegistrosCard key={ciclo.cuenta_id} ciclo={ciclo} />;
                    }

                    // Tarjeta compacta para CLASE INDIVIDUAL: solo un botón que abre el modal
                    // con el resumen completo. Así no compite en tamaño/detalle con los paquetes.
                    if (ciclo.es_individual) {
                        return (
                            <ClaseSueltaButton
                                key={ciclo.cuenta_id}
                                ciclo={ciclo}
                                onSelect={() => onSelectIndividual(ciclo)}
                            />
                        );
                    }

                    return (
                        <div key={ciclo.cuenta_id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm relative transition-all hover:border-orange-200 hover:shadow-md overflow-hidden">
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest bg-brand-primary-soft px-2 py-1 rounded-md">
                                            {obtenerRangoCiclo(ciclo.fecha_inicio_real, ciclo.fecha_fin_real)}
                                        </span>

                                        {ciclo.horarios?.length > 1 && (
                                            <span className="flex items-center gap-1 text-[8px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-1 rounded-md border border-indigo-100 uppercase">
                                                <Layers size={9} /> x{ciclo.horarios.length} horarios
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5 mt-2 min-w-0">
                                        <MapPin size={10} className="text-brand-accent shrink-0" />
                                        <span className="truncate">{ciclo.inscripciones?.[0]?.sede || 'S/D'}</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-brand-muted flex items-center gap-1.5 mt-1 min-w-0">
                                        <User size={10} className="text-brand-muted shrink-0" />
                                        <span className="truncate">
                                            {ciclo.inscripciones?.[0]?.nivel || 'S/D'}
                                            {ciclo.inscripciones?.[0]?.profesor ? ` · ${ciclo.inscripciones[0].profesor}` : ''}
                                        </span>
                                    </div>

                                    {ciclo.horarios?.length > 0 && (
                                        <div className="text-[9px] font-bold text-brand-muted flex items-start gap-1.5 mt-1 min-w-0">
                                            <Clock size={10} className="text-brand-muted shrink-0 mt-0.5" />
                                            <span className="break-words">
                                                {ciclo.horarios.map(h => `${h.dia.slice(0, 3)} ${h.hora_inicio}-${h.hora_fin}`).join(' · ')}
                                            </span>
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

                            <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-3 border-t border-brand-border-soft">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] text-brand-muted uppercase font-black tracking-widest">Inicio</span>
                                    <span className="text-[10px] font-black text-brand-body truncate">{formatearFecha(ciclo.fecha_inicio_real)}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] text-brand-muted uppercase font-black tracking-widest">Fin real</span>
                                    <span className="text-[10px] font-black text-brand-body truncate">
                                        {ciclo.fecha_fin_real ? formatearFecha(ciclo.fecha_fin_real) : 'EN CURSO'}
                                    </span>
                                </div>
                                {ciclo.monto_final > 0 && (
                                    <div className="flex flex-col min-w-0 col-span-2">
                                        <span className="text-[8px] text-brand-muted uppercase font-black tracking-widest">Monto</span>
                                        <span className="text-[11px] font-black text-emerald-600 flex items-center gap-0.5">
                                            <DollarSign size={10} className="shrink-0" />{Number(ciclo.monto_final).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {ciclo.fecha_vencimiento_pago && (
                                <div className="flex items-start gap-1.5 pt-2 border-t border-dashed border-brand-border-soft" title="Fecha límite administrativa para pagar esta cuenta, no representa el fin de las clases">
                                    <Info size={10} className="text-slate-300 shrink-0 mt-0.5" />
                                    <span className="text-[8px] text-brand-muted font-bold uppercase tracking-widest break-words">
                                        Plazo de pago: {formatearFecha(ciclo.fecha_vencimiento_pago)}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <EmptyState
                    className="text-center py-10 flex flex-col items-center justify-center opacity-60"
                    icon={CalendarClock}
                    iconSize={32}
                    iconClassName="text-slate-300 mb-2"
                    as="span"
                    message="Sin registros de ciclos"
                    messageClassName="text-[10px] font-bold text-brand-muted uppercase tracking-widest"
                />
            )}
        </div>
    </div>
);

export default CicloHistoryPanel;
