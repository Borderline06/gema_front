import React from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';
import { formatSoles } from '../../utils/formatSoles';
import Modal from '../shared/Modal';
import PickupSedeSelect from './PickupSedeSelect';

// Resumen del pedido antes de generar la deuda. `lines` = [{ item, qty, subtotal }].
const MerchOrderModal = ({ lines, total, sedes, sedeId, onSedeChange, submitting, onClose, onConfirm }) => (
  <Modal
    overlayClassName="fixed inset-0 z-modal flex items-center justify-center p-4 bg-brand-primary-dark/70 backdrop-blur-md"
    onBackdropClick={submitting ? undefined : onClose}
  >
    <div className="p-8 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-brand-gold-soft text-brand-gold-dark flex items-center justify-center">
          <ShoppingBag size={30} />
        </div>
        <h3 className="text-xl font-black text-brand-heading uppercase italic tracking-tight">Tu pedido</h3>
        <p className="text-[11px] font-bold text-brand-muted mt-1">Al confirmar, subirás tu voucher de pago.</p>
      </div>

      <ul className="space-y-2 max-h-56 overflow-y-auto">
        {lines.map(({ item, qty, subtotal }) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-xs font-bold text-brand-body">
            <span className="uppercase italic">{item.nombre} <span className="text-brand-muted">× {qty}</span></span>
            <span className="font-black text-brand-primary">{formatSoles(subtotal)}</span>
          </li>
        ))}
      </ul>

      <PickupSedeSelect sedes={sedes} value={sedeId} onChange={onSedeChange} />

      <div className="flex items-center justify-between border-t border-brand-border pt-4">
        <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Total</span>
        <span className="text-2xl font-black italic text-brand-primary">{formatSoles(total)}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={onClose} disabled={submitting} className="flex-1 px-6 py-4 rounded-2xl bg-brand-surface-alt text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors order-2 sm:order-1">
          Cancelar
        </button>
        <button type="button" onClick={onConfirm} disabled={submitting || !sedeId} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-brand-primary text-white font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all disabled:opacity-60 order-1 sm:order-2">
          {submitting && <Loader2 size={14} className="animate-spin" />}
          Confirmar y pagar
        </button>
      </div>
    </div>
  </Modal>
);

export default MerchOrderModal;
