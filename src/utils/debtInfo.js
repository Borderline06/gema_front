import { formatBrandingText } from './formatBrandingText';
// El backend marca el detalle de una cuenta de merch como "Merch: 2× Camiseta, ...".
// Una cuenta mixta (matrícula + merch) lo lleva al final tras un " | ".
const PREFIJO_MERCH = /^Merch:/i;

/** Orden de solo merch: es la única que el alumno puede cancelar por su cuenta. */
export const isMerchOrder = (debt) => PREFIJO_MERCH.test(debt?.detalle_adicional || '');

/** Título legible de una cuenta: concepto del catálogo o, si no hay, su detalle. */
export const getDebtTitle = (debt) => {
  if (debt?.catalogo_conceptos?.nombre) return formatBrandingText(debt.catalogo_conceptos.nombre);
  const detalle = debt?.detalle_adicional;
  if (!detalle) return 'Cuenta pendiente';
  return formatBrandingText(isMerchOrder(debt) ? `Orden ${detalle}` : detalle);
};
