import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

// GET /merch/alumno/:id devuelve un objeto agrupado por estado, no un array:
//   { alumno_id, posee: [...], perdido: [...], devuelto: [...], reservado: [...], resumen }
// donde cada ítem es { id, merch_id, estado_item, fecha_adquisicion, monto_pagado, merch: { id, nombre, imagen_url } }.
// Se aplana a lo que pinta la UI. Son visibles los ítems ya pagados (POSEE, POR_ENTREGAR,
// ENTREGADO) y los PERDIDO: RESERVADO aún no se pagó y DEVUELTO ya se reembolsó.
const ESTADOS_VISIBLES = ['posee', 'por_entregar', 'entregado', 'perdido'];

const normalizarColeccion = (data) => {
    const grupos = Array.isArray(data) ? { posee: data } : (data || {});
    return ESTADOS_VISIBLES.flatMap((estado) =>
        (grupos[estado] ?? grupos[estado.toUpperCase()] ?? []).map((item) => ({
            id: item.id,
            merch_id: item.merch_id ?? item.merch?.id,
            nombre: item.merch?.nombre ?? item.nombre,
            imagen_url: item.merch?.imagen_url ?? item.imagen_url ?? null,
            categoria: item.merch?.categoria ?? item.categoria,
            estado: String(item.estado_item ?? estado).toUpperCase(),
            fecha_adquisicion: item.fecha_adquisicion,
            monto_pagado: item.monto_pagado,
            sede: item.sedes?.nombre ?? item.sede?.nombre ?? null, // sede de recojo
        }))
    );
};

// Fila de GET /merch/entregas → lo que pinta la pantalla de recepción. Tolera que el
// alumno venga como `alumno` o como `alumnos.usuarios`.
const normalizarEntrega = (row) => {
    const usuario = row.alumno ?? row.alumnos?.usuarios ?? {};
    return {
        id: row.id,
        alumnoId: row.alumno_id ?? usuario.usuario_id ?? usuario.id,
        nombres: usuario.nombres ?? '',
        apellidos: usuario.apellidos ?? '',
        documento: usuario.numero_documento ?? '',
        nombre: row.merch?.nombre ?? row.nombre,
        imagen_url: row.merch?.imagen_url ?? row.imagen_url ?? null,
        categoria: row.merch?.categoria ?? row.categoria,
        sede: row.sedes?.nombre ?? row.sede?.nombre ?? null,
        fecha_adquisicion: row.fecha_adquisicion,
    };
};

export const merchService = {
    /** Catálogo activo: [{ id, nombre, descripcion, precio, imagen_url, stock, estado }]. */
    getCatalogo: async () => {
        const response = await apiFetch.get(API_ROUTES.MERCH.CATALOGO);
        const result = await parseJsonResponse(response, 'Error al cargar el catálogo');
        return result.data || [];
    },

    /** Colección del alumno, aplanada (ver normalizarColeccion). */
    getColeccion: async (alumnoId) => {
        const response = await apiFetch.get(API_ROUTES.MERCH.COLECCION_ALUMNO(alumnoId));
        const result = await parseJsonResponse(response, 'Error al cargar tu colección');
        return normalizarColeccion(result.data);
    },

    /**
     * Orden del alumno (contrato asumido): crea una deuda PENDIENTE por los ítems.
     * `merchIds` repite el ID por cada unidad ([1, 1] = 2 unidades del ítem 1).
     * Devuelve la deuda con la forma que espera ReportPaymentModal: { id, monto_final }.
     */
    crearOrden: async (alumnoId, merchIds, sedeId) => {
        const response = await apiFetch.post(API_ROUTES.MERCH.ORDEN, {
            alumno_id: alumnoId,
            merch_ids: merchIds,
            // Zod exige número: el valor puede llegar como string desde un <select>.
            sede_recojo_id: Number(sedeId),
        });
        const result = await parseJsonResponse(response, 'Error al generar tu pedido');
        const data = result.data || {};
        const cuenta = data.cuenta ?? data.deuda ?? data;
        return {
            ...cuenta,
            id: cuenta.cuenta_id ?? cuenta.id,
            monto_final: cuenta.monto_final ?? cuenta.total ?? data.total,
        };
    },

    /** Cancela una orden de merch pendiente (sin pagos): libera el stock reservado. */
    cancelarOrden: async (cuentaId) => {
        const response = await apiFetch.delete(API_ROUTES.MERCH.ORDEN_BY_ID(cuentaId));
        return parseJsonResponse(response, 'Error al cancelar la orden');
    },

    // --- Recepción / logística ---

    /**
     * Ítems POR_ENTREGAR (ya pagados) de una sede. `busqueda` filtra por nombre o DNI del
     * alumno. Sin sedeId trae todas las sedes.
     */
    getEntregasPendientes: async ({ sedeId, busqueda } = {}) => {
        const params = new URLSearchParams();
        if (sedeId) params.set('sede_id', sedeId);
        if (busqueda) params.set('busqueda', busqueda);
        const query = params.toString();
        const response = await apiFetch.get(`${API_ROUTES.MERCH.LOGISTICA}${query ? `?${query}` : ''}`);
        const result = await parseJsonResponse(response, 'Error al cargar las entregas pendientes');
        return (result.data || []).map(normalizarEntrega);
    },

    /** Marca un ítem como ENTREGADO. */
    entregarItem: async (itemId) => {
        const response = await apiFetch.patch(API_ROUTES.MERCH.ENTREGAR_ITEM(itemId));
        return parseJsonResponse(response, 'Error al registrar la entrega');
    },

    /** Deshace una entrega: el ítem vuelve a POR_ENTREGAR. */
    revertirEntrega: async (itemId) => {
        const response = await apiFetch.patch(API_ROUTES.MERCH.REVERTIR_ENTREGA(itemId));
        return parseJsonResponse(response, 'Error al revertir la entrega');
    },

    // --- Solo Administrador (el backend responde 403 al resto) ---

    /** Compra independiente: nace cobrada. Requiere metodo_pago_id. */
    comprar: async ({ alumnoId, merchIds, metodoPagoId, codigoOperacion, notas }) => {
        const response = await apiFetch.post(API_ROUTES.MERCH.COMPRAR, {
            alumno_id: alumnoId,
            merch_ids: merchIds,
            metodo_pago_id: metodoPagoId,
            ...(codigoOperacion && { codigo_operacion: codigoOperacion }),
            ...(notas && { notas }),
        });
        return parseJsonResponse(response, 'Error al registrar la compra');
    },

    /** estado: 'POSEE' | 'PERDIDO' | 'DEVUELTO'. */
    cambiarEstadoItem: async (itemId, estado) => {
        const response = await apiFetch.patch(API_ROUTES.MERCH.ESTADO_ITEM(itemId), { estado_item: estado });
        return parseJsonResponse(response, 'Error al cambiar el estado del ítem');
    },

    /** Catálogo completo, con productos dados de baja. */
    getCatalogoCompleto: async () => {
        const response = await apiFetch.get(API_ROUTES.MERCH.CATALOGO_COMPLETO);
        const result = await parseJsonResponse(response, 'Error al cargar el inventario');
        return result.data || [];
    },

    /** `producto` es un FormData (multipart) cuando lleva imagen: apiFetch deja el Content-Type al navegador. */
    crear: async (producto) => {
        const response = await apiFetch.post(API_ROUTES.MERCH.CATALOGO, producto);
        return parseJsonResponse(response, 'Error al crear el producto');
    },

    /** Actualiza solo los campos enviados (precio, stock, estado, etc.). Acepta FormData (con imagen) u objeto JSON. */
    actualizar: async (id, cambios) => {
        const response = await apiFetch.put(API_ROUTES.MERCH.BY_ID(id), cambios);
        return parseJsonResponse(response, 'Error al actualizar el producto');
    },

    /** Borra el producto y su imagen en la nube. El backend responde 409 si ya tiene ventas. */
    eliminar: async (id) => {
        const response = await apiFetch.delete(API_ROUTES.MERCH.BY_ID(id));
        return parseJsonResponse(response, 'Error al eliminar el producto');
    },
};
