import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { formatBrandingText } from '../../../utils/formatBrandingText';

/**
 * Único caso en que las finanzas interrumpen el dashboard: un pago rechazado
 * o una deuda vencida. Lleva al Centro de Pagos, donde ya está el flujo
 * completo (saldo parcial, comprobante, métodos).
 */
const FinanceAlertBanner = ({ debt, rejected }) => {
  if (!debt && !rejected) return null;

  const esRechazo = Boolean(rejected);
  const Icon = esRechazo ? XCircle : AlertCircle;
  const concepto = esRechazo
    ? formatBrandingText(rejected.cuentas_por_cobrar?.catalogo_conceptos?.nombre)
    : formatBrandingText(debt.catalogo_conceptos?.nombre);

  return (
    <div role="alert" className="mb-6 bg-red-50/50 border border-red-200 border-l-4 border-l-red-500 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-red-100 p-2 rounded-xl text-red-600 shrink-0">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[11px] font-black text-red-700 uppercase tracking-tight leading-none">
            {esRechazo ? 'Tu pago fue rechazado' : 'Tienes un pago vencido'}
            {concepto && <span className="font-bold"> · {concepto}</span>}
          </p>
          <p className="text-[10px] text-red-600 font-medium leading-snug mt-1">
            {esRechazo
              ? (rejected.notas_validacion || 'No pudimos validar tu comprobante. Vuelve a reportarlo.')
              : 'Regulariza tu pago para seguir entrenando sin interrupciones.'}
          </p>
        </div>
      </div>

      <Link
        to="/dashboard/student/payments"
        className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors active:scale-95"
      >
        Resolver ahora <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default FinanceAlertBanner;
