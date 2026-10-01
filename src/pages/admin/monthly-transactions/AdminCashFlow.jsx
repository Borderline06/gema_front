import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { apiFetch } from '../../../interceptors/api';
import { API_ROUTES } from '../../../constants/apiRoutes';

import { MonthAccordion } from '../../../components/Admin/Components-monthly-transactions/MonthAccordion';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { formatLocalToUTC, formatUTCtoLocalInput, consolidarDatosMes, construirFilasExcel } from './cashFlowUtils';

const currentYear = new Date().getFullYear();
const MESES = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

const AdminCashFlow = () => {
    const [datosPorMes, setDatosPorMes] = useState({});
    const [loadingMeses, setLoadingMeses] = useState({});
    const [sedes, setSedes] = useState([]);

    const [filtroAnio, setFiltroAnio] = useState(currentYear);
    const [mesesAbiertos, setMesesAbiertos] = useState([]);

    // Estados de edición y creación
    const [inlineEditId, setInlineEditId] = useState(null);
    const [inlineData, setInlineData] = useState({ concepto: '', monto: '', fecha: '', sede_id: '' });
    const [addingMonth, setAddingMonth] = useState(null);
    const [addingType, setAddingType] = useState(null);
    const [newData, setNewData] = useState({ concepto: '', monto: '', fecha: '', sede_id: '' });
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // movimiento pendiente de eliminar

    // 1. Cargar las sedes al iniciar
    useEffect(() => {
        const fetchSedes = async () => {
            try {
                const response = await apiFetch.get(API_ROUTES.SEDES.ACTIVOS);
                if (response.ok) {
                    const data = await response.json();
                    setSedes(data.data || []);
                }
            } catch (error) {
                console.error("No se pudieron cargar las sedes", error);
            }
        };
        fetchSedes();
    }, []);

    // 2. Fetch de un mes: la consolidación de la respuesta cruda vive en cashFlowUtils.js
    const fetchMes = async (mesNum, anio, mostrarError = true) => {
        try {
            setLoadingMeses(prev => ({ ...prev, [mesNum]: true }));
            const url = API_ROUTES.CAJA ? `${API_ROUTES.CAJA.RESUMEN}?mes=${mesNum}&anio=${anio}` : `/caja/resumen?mes=${mesNum}&anio=${anio}`;

            const response = await apiFetch.get(url);
            const data = await response.json();

            if (response.ok && data.success && data.data) {
                setDatosPorMes(prev => ({
                    ...prev,
                    [mesNum]: consolidarDatosMes(data.data)
                }));
            } else {
                if (mostrarError) toast.error(data.message || `Error al cargar mes ${mesNum}`);
            }
        } catch (error) {
            if (mostrarError) toast.error(`Error al cargar el mes ${mesNum}`);
        } finally {
            setLoadingMeses(prev => ({ ...prev, [mesNum]: false }));
        }
    };

    // 3. Cargar todo el año
    const cargarTodoElAnio = async () => {
        setDatosPorMes({});
        const promesas = MESES.map((_, index) => fetchMes(index + 1, filtroAnio, false));
        await Promise.all(promesas);

        const mesActual = new Date().getMonth() + 1;
        setMesesAbiertos([mesActual]);
    };

    useEffect(() => {
        cargarTodoElAnio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtroAnio]);

    const toggleMes = (mesNum) => {
        setMesesAbiertos(prev => prev.includes(mesNum) ? prev.filter(m => m !== mesNum) : [...prev, mesNum]);
    };

    // 4. Lógicas de Edición
    const startInlineEdit = (movimiento) => {
        setInlineEditId(movimiento.id);
        const sedeEncontrada = sedes.find(s => s.nombre === movimiento.sede);
        setInlineData({
            concepto: movimiento.concepto,
            monto: movimiento.monto,
            fecha: formatUTCtoLocalInput(movimiento.fecha),
            sede_id: sedeEncontrada ? sedeEncontrada.id : ''
        });
    };

    const saveInlineEdit = async (id, mesNum) => {
        if (!inlineData.concepto || !inlineData.monto) return toast.error("Complete concepto y monto");
        try {
            setSubmitting(true);
            const endpoint = `${API_ROUTES.CAJA?.BASE || '/caja'}/${id}`;
            const payload = {
                concepto: inlineData.concepto,
                monto: parseFloat(inlineData.monto),
                fecha_movimiento: formatLocalToUTC(inlineData.fecha),
                sede_id: inlineData.sede_id ? parseInt(inlineData.sede_id) : null
            };
            const response = await apiFetch.put(endpoint, payload);
            if (response.ok) {
                toast.success("Movimiento actualizado");
                setInlineEditId(null);
                await fetchMes(mesNum, filtroAnio);
            } else {
                const err = await response.json();
                toast.error(err.message || "Error al actualizar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    const startAddNew = (mesNum, tipoMovimiento) => {
        const mesStr = String(mesNum).padStart(2, '0');
        setAddingMonth(mesNum);
        setAddingType(tipoMovimiento);
        setNewData({ concepto: '', monto: '', fecha: `${filtroAnio}-${mesStr}-01`, sede_id: '' });
    };

    const saveNewMovimiento = async (mesNum) => {
        if (!newData.concepto || !newData.monto || !newData.fecha) return toast.error("Complete los datos requeridos");
        try {
            setSubmitting(true);
            const endpoint = API_ROUTES.CAJA?.BASE || '/caja';
            const payload = {
                tipo_movimiento: addingType,
                concepto: newData.concepto,
                monto: parseFloat(newData.monto),
                fecha_movimiento: formatLocalToUTC(newData.fecha),
                sede_id: newData.sede_id ? parseInt(newData.sede_id) : null
            };
            const response = await apiFetch.post(endpoint, payload);
            if (response.ok) {
                toast.success(`${addingType} registrado correctamente`);
                setAddingMonth(null);
                setAddingType(null);
                await fetchMes(mesNum, filtroAnio);
            } else {
                const err = await response.json();
                toast.error(err.message || "Error al registrar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    const movimientoDelete = (movimiento) => {
        setDeleteTarget(movimiento);
    };

    const executeMovimientoDelete = async () => {
        const movimiento = deleteTarget;
        setDeleteTarget(null);
        try {
            const response = await apiFetch.delete(`/caja/${movimiento.id}`);
            if (response.ok) {
                toast.success(`${movimiento.tipo} eliminado correctamente.`)
                await cargarTodoElAnio();
            } else {
                const err = await response.json();
                toast.error(err.message || 'Error al eliminar.')
            }
        } catch (e) {
            toast.error(e.message || 'Internal Error Server')
        }
    }

    // 5. Excel: el aplanado de filas vive en cashFlowUtils.js
    const exportToExcel = () => {
        const dataToExport = construirFilasExcel(datosPorMes, filtroAnio, MESES);

        if (dataToExport.length === 0) return toast.error("No hay datos para exportar.");

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Resumen ${filtroAnio}`);
        XLSX.writeFile(workbook, `Resumen_Financiero_${filtroAnio}.xlsx`);
    };

    // Objeto memoizado
    const tableProps = useMemo(() => ({
        sedes, inlineEditId, inlineData, setInlineData, submitting, saveInlineEdit,
        setInlineEditId, startInlineEdit, addingMonth, addingType, newData,
        setNewData, startAddNew, saveNewMovimiento, setAddingMonth, setAddingType, movimientoDelete
    }), [sedes, inlineEditId, inlineData, submitting, addingMonth, addingType, newData]);

    return (
        <div className="space-y-6 animate-fade-in-up p-2 max-w-[1400px] mx-auto">
            {/* Header del Admin */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-8 w-1.5 bg-[#f97316] rounded-full"></div>
                        <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight italic">
                            Libro Diario <span className="text-[#f97316]">Mensual</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-70 ml-4">
                        Control de caja y reportes financieros por sede
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3 py-1.5 shadow-sm hover:border-orange-300 transition-colors">
                        <Calendar size={14} className="text-slate-400" />
                        <select
                            value={filtroAnio}
                            onChange={(e) => setFiltroAnio(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-black uppercase text-[#0f172a] outline-none cursor-pointer py-2 pl-2 pr-4 focus:ring-0"
                        >
                            <option value="2024">Año 2024</option>
                            <option value="2025">Año 2025</option>
                            <option value="2026">Año 2026</option>
                            <option value="2027">Año 2027</option>
                        </select>
                    </div>

                    <button onClick={exportToExcel} className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2">
                        <FileSpreadsheet size={16} /> Descargar Excel
                    </button>
                </div>
            </div>

            {/* Listado de Meses */}
            <div className="space-y-3">
                {MESES.map((nombre, index) => (
                    <MonthAccordion
                        key={index + 1}
                        mesNum={index + 1}
                        mesNombre={nombre}
                        isOpen={mesesAbiertos.includes(index + 1)}
                        isLoading={loadingMeses[index + 1]}
                        toggleMes={toggleMes}
                        datosMes={datosPorMes[index + 1]}
                        tableProps={tableProps}
                    />
                ))}
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={executeMovimientoDelete}
                title={deleteTarget ? `¿Eliminar ${deleteTarget.tipo}?` : ''}
                message="Esta acción no se puede deshacer."
                iconType="danger"
                confirmText="Sí, eliminar"
            />
        </div>
    );
};

export default AdminCashFlow;
