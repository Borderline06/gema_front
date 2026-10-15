// Resuelve el precio de la matrícula desde el catálogo vigente
// (catalogoService.getVigentes → [{ nombre, precio_base, cantidad_clases_semanal }]).
//
// Heurística heredada de Pricing.jsx, que es la única que hoy distingue los
// conceptos: la sesión unitaria se reconoce por su nombre y los planes
// mensuales por `cantidad_clases_semanal`. Debe sustituirse por un código de
// concepto explícito cuando el backend lo exponga.

const esUnitaria = (plan) => /UNITARIA|SESI[ÓO]N/i.test(plan.nombre || '');

export const precioClaseUnica = (planes = []) => {
  const plan = planes.find(esUnitaria);
  return plan ? Number(plan.precio_base) : null;
};

export const precioMensual = (planes = [], clasesPorSemana) => {
  const plan = planes.find(p => !esUnitaria(p) && Number(p.cantidad_clases_semanal) === clasesPorSemana);
  return plan ? Number(plan.precio_base) : null;
};
