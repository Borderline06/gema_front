import React from 'react';
import { MapPin } from 'lucide-react';
import MerchImage from './MerchImage';
import { formatBrandingText } from '../../utils/formatBrandingText';

// Una tarjeta por producto (ver groupCollection): `group` trae las cantidades.
// "Posees: N" cuenta las unidades no perdidas; si todas se perdieron la tarjeta se apaga.
const CollectionCard = ({ group }) => {
  const sinUnidades = group.poseidas === 0;
  return (
    <div className={`bg-brand-surface rounded-[2rem] border overflow-hidden shadow-sm flex flex-col ${sinUnidades ? 'border-brand-border opacity-80' : 'border-brand-gold/40'}`}>
      <div className={`relative h-40 overflow-hidden ${sinUnidades ? 'grayscale' : ''}`}>
        <MerchImage item={group} />
        <span className={`absolute top-3 right-3 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow ${sinUnidades ? 'bg-brand-surface-alt text-brand-muted' : 'bg-brand-gold text-brand-primary-dark'}`}>
          {sinUnidades ? 'Perdido' : `Posees: ${group.poseidas}`}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-black text-brand-heading uppercase italic leading-tight">{formatBrandingText(group.nombre)}</h3>

        {group.porEntregar > 0 && (
          <p className="flex items-start gap-1.5 text-[10px] font-black uppercase tracking-wide text-brand-accent-dark">
            <MapPin size={12} className="shrink-0 mt-px" />
            <span>
              {group.porEntregar} por recoger{group.sedesRecojo.length > 0 && ` · ${group.sedesRecojo.join(', ')}`}
            </span>
          </p>
        )}
        {group.perdidas > 0 && !sinUnidades && (
          <p className="text-[10px] font-bold uppercase text-brand-muted">{group.perdidas} perdido{group.perdidas > 1 ? 's' : ''}</p>
        )}
        {group.desde && (
          <p className="text-[10px] font-bold text-brand-muted mt-auto">
            Desde {new Date(group.desde).toLocaleDateString('es-PE')}
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;
