import React from 'react';
import { ShoppingBag, AlertTriangle, FileText } from 'lucide-react';
import { getPaymentConcept } from '../../utils/paymentConcept';

// Concepto del pago. `compact` = línea para la tarjeta del listado; si no, panel destacado
// de la revisión. Cuando el detalle es obligatorio y falta, avisa en rojo en vez de omitirlo.
const PaymentConcept = ({ pago, compact = false }) => {
  const { titulo, plan, esMerch, requiereDetalle } = getPaymentConcept(pago);

  if (compact) {
    if (!requiereDetalle) return null;
    return (
      <div className={`flex items-start gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase italic leading-snug ${titulo ? 'bg-brand-gold-soft text-brand-gold-dark' : 'bg-red-50 text-red-600'}`}>
        {titulo ? <ShoppingBag size={14} className="shrink-0 mt-px" /> : <AlertTriangle size={14} className="shrink-0 mt-px" />}
        <span className="break-words min-w-0">{titulo || 'Sin descripción del concepto'}</span>
      </div>
    );
  }

  if (!titulo && !plan && !requiereDetalle) return null;

  const faltaDetalle = requiereDetalle && !titulo;
  return (
    <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm flex items-start gap-5 ${faltaDetalle ? 'bg-red-50 border-red-200' : requiereDetalle ? 'bg-brand-gold-soft border-brand-gold/50' : 'bg-brand-surface border-brand-border-soft'}`}>
      <div className={`p-4 rounded-3xl shrink-0 ${faltaDetalle ? 'bg-red-100 text-red-600' : requiereDetalle ? 'bg-brand-gold text-white' : 'bg-brand-primary-soft text-brand-primary'}`}>
        {faltaDetalle ? <AlertTriangle size={28} /> : esMerch ? <ShoppingBag size={28} /> : <FileText size={28} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black text-brand-muted uppercase italic tracking-widest leading-none mb-1.5">
          {esMerch ? 'Qué estás aprobando · Merch' : 'Concepto del pago'}
        </p>
        <h2 className={`text-xl font-black uppercase italic leading-tight break-words ${faltaDetalle ? 'text-red-600' : 'text-slate-800'}`}>
          {faltaDetalle ? 'Sin descripción del concepto' : titulo || plan}
        </h2>
        {plan && titulo && <p className="text-[10px] font-bold text-brand-muted uppercase mt-1">Plan: {plan}</p>}
        {faltaDetalle && (
          <p className="text-[10px] font-bold text-red-500 uppercase mt-1">La cuenta no tiene detalle ni plan. Verifica con el alumno antes de aprobar.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentConcept;
