import React, { useState } from 'react';
import { Gift, GraduationCap, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { formatSoles } from '../../../utils/formatSoles';
import { porcentaje, fechaCorta, etiquetaConcepto, tieneDesglose } from '../../../utils/desgloseIngresos';

// Solo el color vive aquí; el texto sale de etiquetaConcepto (compartido con el Excel).
const CLASE_CONCEPTO = {
    INGRESO_MERCH: 'bg-brand-gold-soft text-brand-gold-dark',
    INGRESO_MATRICULA: 'bg-brand-primary-soft text-brand-primary',
};

const Tile = ({ icon: Icon, titulo, monto, detalle, acento }) => (
    <div className={`rounded-2xl border p-4 flex flex-col gap-1 ${acento}`}>
        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-muted">
            <Icon size={12} /> {titulo}
        </span>
        <span className="text-xl font-black text-brand-heading">{formatSoles(monto)}</span>
        {detalle && <span className="text-[10px] font-bold text-brand-muted">{detalle}</span>}
    </div>
);

/**
 * Ingresos del mes separados en Matrícula vs Merch (por fecha de cobro) + la tabla de
 * auditoría con cada fila automática y el pago del que salió. `desglose` viene de
 * GET /caja/desglose-ingresos; si no cargó (null) no se muestra nada.
 */
export const MerchRevenueBreakdown = ({ desglose }) => {
    const [verDetalle, setVerDetalle] = useState(false);
    if (!tieneDesglose(desglose)) return null;
    const { total_cobrado: total, ingresos_merch: merch, ingresos_matricula: matricula, movimientos = [] } = desglose;

    const pctMerch = porcentaje(merch, total);

    return (
        <section className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-5 space-y-4" aria-label="Ingresos por Merch y Matrícula">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-heading">
                    <Gift className="text-brand-gold" size={16} /> Ingresos por Merch vs Matrícula
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">
                    Cobrado en el mes (por fecha de pago)
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Tile icon={GraduationCap} titulo="Ingresos por Matrícula" monto={matricula} detalle={`${100 - pctMerch}% de lo cobrado`} acento="border-brand-primary/20 bg-brand-primary-soft/50" />
                <Tile icon={Gift} titulo="Ingresos por Merch" monto={merch} detalle={`${pctMerch}% de lo cobrado`} acento="border-brand-gold/40 bg-brand-gold-soft" />
                <Tile icon={Wallet} titulo="Total cobrado" monto={total} acento="border-brand-border bg-brand-bg" />
            </div>

            {/* Barra de proporción */}
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-brand-surface-alt" role="img" aria-label={`Merch ${pctMerch}%, matrícula ${100 - pctMerch}%`}>
                <div className="h-full bg-gold-premium" style={{ width: `${pctMerch}%` }} />
                <div className="h-full bg-brand-primary/70 flex-1" />
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => setVerDetalle((v) => !v)}
                    aria-expanded={verDetalle}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-primary-dark"
                >
                    {verDetalle ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    Detalle de auditoría ({movimientos.length} {movimientos.length === 1 ? 'fila' : 'filas'})
                </button>

                {verDetalle && (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-brand-border">
                        {movimientos.length === 0 ? (
                            <p className="p-4 text-[11px] font-bold text-brand-muted">
                                No hay filas automáticas este mes. Los pagos anteriores al split de ingresos se regularizan con
                                <span className="font-black"> npm run db:repair:ingresos-mixtos</span>.
                            </p>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[520px]">
                                <thead>
                                    <tr className="bg-brand-primary-dark text-white text-[10px] uppercase tracking-widest">
                                        <th className="p-3 font-black w-24">Fecha</th>
                                        <th className="p-3 font-black">Alumno</th>
                                        <th className="p-3 font-black w-28">Concepto</th>
                                        <th className="p-3 font-black w-20">Pago</th>
                                        <th className="p-3 font-black text-right w-28">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border-soft text-[11px]">
                                    {movimientos.map((m) => {
                                        const clase = CLASE_CONCEPTO[m.concepto] ?? 'bg-brand-surface-alt text-brand-body';
                                        return (
                                            <tr key={m.id} className="hover:bg-brand-bg">
                                                <td className="p-3 font-bold text-slate-500">{fechaCorta(m.fecha)}</td>
                                                <td className="p-3 font-black uppercase text-brand-heading">{m.alumno}</td>
                                                <td className="p-3">
                                                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-black uppercase ${clase}`}>
                                                        {etiquetaConcepto(m.concepto)}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-bold text-slate-500">#{m.pago_id}</td>
                                                <td className="p-3 text-right font-black text-green-600 whitespace-nowrap">+ {formatSoles(m.monto)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
