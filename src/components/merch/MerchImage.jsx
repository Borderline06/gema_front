import React from 'react';
import { getCategoriaMerch } from '../../config/merch';
import { isSafeImageUrl } from '../../utils/imageUpload';
import { formatBrandingText } from '../../utils/formatBrandingText';

// Imagen del ítem o, si no hay imagen_url (o no es segura), un placeholder por categoría.
// El redondeo lo pone el contenedor padre (overflow-hidden).
const MerchImage = ({ item, className = '', iconSize = 56 }) => {
  if (isSafeImageUrl(item.imagen_url)) {
    return <img src={item.imagen_url} alt={formatBrandingText(item.nombre)} referrerPolicy="no-referrer" className={`w-full h-full object-cover ${className}`} />;
  }
  const { icon: Icon } = getCategoriaMerch(item.categoria);
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-primary-dark ${className}`}>
      <Icon size={iconSize} className="text-brand-gold" strokeWidth={1.5} />
    </div>
  );
};

export default MerchImage;
