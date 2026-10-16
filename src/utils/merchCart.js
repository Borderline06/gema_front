// Carrito de merch como mapa { [merchId]: cantidad }.

/** { 1: 2, 4: 1 } → [1, 1, 4]. El backend espera el ID repetido por cada unidad. */
export const qtyMapToIds = (qtyMap = {}) =>
  Object.entries(qtyMap).flatMap(([id, qty]) => Array(Math.max(0, Number(qty) || 0)).fill(Number(id)));

/** Líneas del carrito con su catálogo: [{ item, qty, subtotal }]. Ignora cantidades en 0. */
export const cartLines = (catalogo, qtyMap = {}) =>
  catalogo
    .filter(item => (qtyMap[item.id] || 0) > 0)
    .map(item => ({
      item,
      qty: qtyMap[item.id],
      subtotal: Number(item.precio) * qtyMap[item.id],
    }));

export const cartTotal = (lines) => lines.reduce((acc, l) => acc + l.subtotal, 0);
export const cartCount = (qtyMap = {}) => Object.values(qtyMap).reduce((acc, q) => acc + (q || 0), 0);

/** Tope de unidades por ítem: el stock del catálogo (o 99 si no se conoce). */
export const maxQty = (item) => (item.stock != null ? Math.max(0, Number(item.stock)) : 99);

/** Devuelve un nuevo mapa con la cantidad fijada (0 elimina la entrada). */
export const withQty = (qtyMap, id, qty) => {
  const { [id]: _omit, ...rest } = qtyMap;
  return qty > 0 ? { ...rest, [id]: qty } : rest;
};
