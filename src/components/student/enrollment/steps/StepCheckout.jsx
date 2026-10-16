import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { MODALIDAD } from '../../../../hooks/useEnrollmentWizard';
import { cartLines, withQty } from '../../../../utils/merchCart';
import MerchAddOnsSlider from '../../../merch/MerchAddOnsSlider';
import PickupSedeSelect from '../../../merch/PickupSedeSelect';
import EnrollmentSummary from '../EnrollmentSummary';

const StepCheckout = ({ state, derived, extras, onExtrasChange, catalogoMerch, ownedMerchCounts, sedes, sedeRecojoId, precioBase, submitError, onBack }) => {
  const esMensual = state.modalidad === MODALIDAD.MENSUAL;
  const nivelNombre = derived.niveles.find(n => n.id === state.nivelId)?.nombre;
  const horarioUnico = derived.horariosFiltrados.find(h => h.id === state.unica.horarioId);

  // El merch solo se ofrece en matrícula mensual (regla de negocio vigente).
  // El TOTAL del resumen = precioBase + suma de estos extras.
  const extrasElegidos = esMensual
    ? cartLines(catalogoMerch, extras.merchQty).map(({ item, qty, subtotal }) => ({
        label: qty > 1 ? `${item.nombre} × ${qty}` : item.nombre,
        price: subtotal,
      }))
    : [];

  const esMerchSeleccionado = extrasElegidos.length > 0;

  const changeQty = (id, qty) => onExtrasChange({ ...extras, merchQty: withQty(extras.merchQty, id, qty) });

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-brand-primary italic uppercase tracking-tighter leading-none">
        Confirma tu <span className="text-brand-accent">matrícula</span>
      </h2>

      {submitError && (
        <div role="alert" className="flex items-start gap-4 bg-brand-accent-soft border-2 border-brand-accent rounded-[2rem] p-5">
          <AlertTriangle size={22} className="text-brand-accent-dark shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-xs font-black text-brand-primary uppercase italic">No pudimos reservar tu lugar</p>
            <p className="text-[11px] font-bold text-slate-600">{submitError}</p>
            <button
              type="button"
              onClick={onBack}
              className="text-[10px] font-black text-brand-accent-dark uppercase italic tracking-widest underline"
            >
              {esMensual ? 'Revisar mis horarios' : 'Elegir otra fecha'}
            </button>
          </div>
        </div>
      )}

      <EnrollmentSummary
        modalidad={state.modalidad}
        sede={state.sede}
        nivelNombre={nivelNombre}
        horarios={derived.horariosElegidos}
        fechaInicio={state.mensual.fechaInicio}
        fechaUnica={state.unica.fecha}
        horarioUnico={horarioUnico}
        precioBase={precioBase}
        extras={extrasElegidos}
      />

      {esMensual && (
        <MerchAddOnsSlider
          items={catalogoMerch}
          quantities={extras.merchQty}
          onQtyChange={changeQty}
          ownedCounts={ownedMerchCounts}
        />
      )}

      {/* La sede de recojo solo importa si se eligió algún producto */}
      {esMerchSeleccionado && (
        <PickupSedeSelect
          sedes={sedes}
          value={sedeRecojoId}
          onChange={(sedeId) => onExtrasChange({ ...extras, sedeId })}
        />
      )}
    </div>
  );
};

export default StepCheckout;
