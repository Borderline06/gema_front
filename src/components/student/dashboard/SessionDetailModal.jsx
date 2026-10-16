import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Modal from '../../shared/Modal';
import SessionCard from './SessionCard';

const fechaCompleta = (date) =>
  new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);

/**
 * Detalle de una clase abierto desde el calendario. Reutiliza SessionCard para
 * que el alumno vea exactamente la misma ficha que en la lista de próximas.
 */
const SessionDetailModal = ({ sesion, now, onClose }) => {
  useEffect(() => {
    if (!sesion) return undefined;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sesion, onClose]);

  if (!sesion) return null;

  // Portal al body: el calendario tiene overflow-hidden y animaciones con transform,
  // que recortarían o desplazarían un modal fixed renderizado dentro de él.
  return createPortal(
    <Modal
      onBackdropClick={onClose}
      boxClassName="bg-brand-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-brand-border-soft"
    >
      <div role="dialog" aria-modal="true" aria-label="Detalle de la clase">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-brand-border-soft bg-brand-bg/50">
          <h3 className="font-black text-brand-primary uppercase italic tracking-tight text-sm md:text-base first-letter:uppercase">
            {fechaCompleta(sesion.inicio)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-xl bg-brand-surface border border-brand-border-soft text-brand-muted hover:text-brand-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* El padding evita que las cintas de la tarjeta (reposición/recuperación) queden recortadas. */}
        <div className="p-5 pt-6">
          <SessionCard sesion={sesion} now={now} />
        </div>
      </div>
    </Modal>,
    document.body,
  );
};

export default SessionDetailModal;
