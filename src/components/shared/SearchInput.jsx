import React from 'react';
import { Search } from 'lucide-react';

// Buscador con ícono superpuesto, reutilizado por las páginas Manager de admin.
// Sin estilos "por defecto" propios: cada caller pasa sus clases exactas para no alterar el look actual.
const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  iconClassName = 'absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted',
  iconSize = 18,
  wrapperClassName = 'relative',
}) => (
  <div className={wrapperClassName}>
    <Search className={iconClassName} size={iconSize} />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  </div>
);

export default SearchInput;
