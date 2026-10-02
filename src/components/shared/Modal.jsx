import React from 'react';

/**
 * Cáscara de diálogo: overlay + caja.
 *
 * El esqueleto del overlay era idéntico en los 7 modales de admin
 * (`fixed inset-0 z-<N> flex items-center justify-center p-<N> bg-<X>
 * backdrop-blur-<Y>`) y lo que divergía eran justo los tres parámetros que aquí
 * son props: el z-index, el color del backdrop y el difuminado. Antes cada
 * archivo elegía su z-index a ojo, y de ahí salía el bug de apilamiento que
 * documenta la escala en tailwind.config.js.
 *
 * El contenido de cada diálogo (cabecera, cuerpo, pie) sigue siendo propio:
 * aquí no se impone ninguna estructura interna.
 *
 * `onBackdropClick` solo se pasa en los diálogos que ya se cerraban al pulsar
 * fuera; añadirlo donde no existía cambiaría su comportamiento.
 */
const Modal = ({
  children,
  onBackdropClick,
  overlayClassName = 'fixed inset-0 z-modal flex items-center justify-center p-4 bg-brand-primary-dark/70 backdrop-blur-md animate-in fade-in duration-300',
  boxClassName = 'bg-brand-surface w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-border-soft',
}) => (
  <div className={overlayClassName} onClick={onBackdropClick}>
    <div
      className={boxClassName}
      onClick={onBackdropClick ? (e) => e.stopPropagation() : undefined}
    >
      {children}
    </div>
  </div>
);

export default Modal;
