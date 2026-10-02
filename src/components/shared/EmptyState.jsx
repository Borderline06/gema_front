import React from 'react';

/**
 * Mensaje de "sin resultados" para listados vacíos o filtrados.
 *
 * La variante dominante en el módulo admin no era solo texto: era contenedor
 * con borde `dashed` + icono de lucide + etiqueta en mayúsculas, repetida en 5
 * vistas con 5 combinaciones de clases. `icon`, `messageClassName` y `as`
 * cubren esas variantes sin tocar el diseño de ninguna.
 *
 * Sin `messageClassName` el mensaje se renderiza suelto dentro del contenedor,
 * igual que hacía la versión anterior, para no alterar a quien ya lo usaba.
 */
const EmptyState = ({
  message,
  icon: Icon,
  iconSize = 40,
  iconClassName = 'mx-auto text-slate-300 mb-2',
  className = 'py-20 text-center text-brand-muted font-bold italic uppercase text-xs tracking-widest',
  messageClassName,
  as: MessageTag = 'p',
  children,
}) => (
  <div className={className}>
    {Icon && <Icon size={iconSize} className={iconClassName} />}
    {messageClassName ? <MessageTag className={messageClassName}>{message}</MessageTag> : message}
    {children}
  </div>
);

export default EmptyState;
