import { COMPANY_NAME } from '../config/branding';

// "Gema", "Gema Club" y "Club Gema" (en cualquier combinación de mayúsculas).
const LEGACY_BRAND_REGEX = /\b(?:club\s+)?gema(?:\s+club)?\b/gi;

/**
 * Reemplaza el nombre antiguo de la marca por COMPANY_NAME en textos que vienen
 * de la BD (productos, sedes, detalle de cobros…). Solo para RENDERIZAR:
 * nunca usar su resultado como key, value de <option>, filtro o payload.
 *
 * Valores no string (null, undefined, números) se devuelven sin cambios.
 */
export const formatBrandingText = (text) =>
  typeof text === 'string' ? text.replace(LEGACY_BRAND_REGEX, COMPANY_NAME) : text;

export default formatBrandingText;
