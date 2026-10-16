import { Shirt, Backpack, Trophy, Package } from 'lucide-react';

// Placeholder visual por categoría, usado cuando el ítem no trae imagen_url.
// Reemplazar por imágenes reales no requiere tocar componentes: basta con que
// el backend envíe imagen_url.
export const MERCH_CATEGORIAS = {
  POLO: { label: 'Polos', icon: Shirt },
  BALON: { label: 'Balones', icon: Trophy },
  MOCHILA: { label: 'Mochilas', icon: Backpack },
  OTRO: { label: 'Otros', icon: Package },
};

export const getCategoriaMerch = (categoria) =>
  MERCH_CATEGORIAS[String(categoria || '').toUpperCase()] || MERCH_CATEGORIAS.OTRO;

// POR_ENTREGAR = pagado, pendiente de recoger en la sede elegida · ENTREGADO = ya recogido.
export const ESTADO_COLECCION = {
  POSEE: 'POSEE',
  POR_ENTREGAR: 'POR_ENTREGAR',
  ENTREGADO: 'ENTREGADO',
  PERDIDO: 'PERDIDO',
};

/**
 * Agrupa la colección plana por producto: una entrada por merch_id con sus cantidades.
 * `poseidas` = unidades no perdidas (las que cuentan para "Posees: N").
 */
export const groupCollection = (items) => {
  const porProducto = new Map();
  for (const item of items) {
    const grupo = porProducto.get(item.merch_id) || {
      merch_id: item.merch_id,
      nombre: item.nombre,
      imagen_url: item.imagen_url,
      categoria: item.categoria,
      poseidas: 0,
      perdidas: 0,
      porEntregar: 0,
      sedesRecojo: new Set(),
      desde: item.fecha_adquisicion,
    };
    if (item.estado === ESTADO_COLECCION.PERDIDO) grupo.perdidas += 1;
    else grupo.poseidas += 1;
    if (item.estado === ESTADO_COLECCION.POR_ENTREGAR) {
      grupo.porEntregar += 1;
      if (item.sede) grupo.sedesRecojo.add(item.sede);
    }
    if (item.fecha_adquisicion && (!grupo.desde || item.fecha_adquisicion < grupo.desde)) grupo.desde = item.fecha_adquisicion;
    porProducto.set(item.merch_id, grupo);
  }
  return [...porProducto.values()].map(g => ({ ...g, sedesRecojo: [...g.sedesRecojo] }));
};
