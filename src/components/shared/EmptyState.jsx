import React from 'react';

// Mensaje de "sin resultados" para listados filtrados, idéntico en varias Manager de admin.
const EmptyState = ({
  message,
  className = 'py-20 text-center text-brand-muted font-bold italic uppercase text-xs tracking-widest',
}) => (
  <div className={className}>
    {message}
  </div>
);

export default EmptyState;
