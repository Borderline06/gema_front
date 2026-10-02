import React from 'react';
import { Loader2 } from 'lucide-react';

// Spinner de carga centrado, repetido casi idéntico en varias páginas Manager de admin.
// `label` cubre la variante "spinner + texto" que estaba duplicada en 8 vistas más,
// cada una con su propio copy y su propia clase para el párrafo.
const LoadingSpinner = ({
  size = 40,
  className = 'flex justify-center py-20',
  colorClassName = 'text-brand-primary',
  label,
  labelClassName = '',
}) => (
  <div className={className}>
    <Loader2 className={`animate-spin ${colorClassName}`} size={size} />
    {label && <p className={labelClassName}>{label}</p>}
  </div>
);

export default LoadingSpinner;
