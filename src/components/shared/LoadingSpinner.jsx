import React from 'react';
import { Loader2 } from 'lucide-react';

// Spinner de carga centrado, repetido casi idéntico en varias páginas Manager de admin.
const LoadingSpinner = ({
  size = 40,
  className = 'flex justify-center py-20',
  colorClassName = 'text-brand-primary',
}) => (
  <div className={className}>
    <Loader2 className={`animate-spin ${colorClassName}`} size={size} />
  </div>
);

export default LoadingSpinner;
