import React, { useState } from 'react';
import { Plus, CreditCard, Edit3, Trash2, Phone, Landmark, User } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTitle from '../../components/shared/PageTitle';
import ConfirmModal from '../../components/shared/ConfirmModal';
import SearchInput from '../../components/shared/SearchInput';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { useFetch } from '../../hooks/useFetch';
import metodoPagoService from '../../services/metodoPago.service';
import AdminPaymentMethodForm from '../../components/Admin/AdminPaymentMethodForm';

const AdminPaymentMethodsManager = () => {
    const [view, setView] = useState('list');
    const [selectedMetodo, setSelectedMetodo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const {
        data: metodos,
        loading,
        refetch: fetchMetodos,
    } = useFetch(
        () => metodoPagoService.getAllAdmin(),
        [],
        { initialData: [], errorMessage: 'No se pudieron cargar los métodos de pago' }
    );

    const executeDelete = async () => {
        const id = deleteTargetId;
        setDeleteTargetId(null);

        const deletePromise = async () => {
            const res = await metodoPagoService.remove(id);
            fetchMetodos();
            return res.message || 'Método de pago eliminado';
        };

        toast.promise(deletePromise(), {
            loading: 'Eliminando método de pago...',
            success: (msg) => <b>{msg}</b>,
            error: (err) => <b>{err.message}</b>,
        });
    };

    const handleEdit = (metodo) => {
        setSelectedMetodo(metodo);
        setView('edit');
    };

    const filteredMetodos = Array.isArray(metodos)
        ? metodos.filter((m) =>
            `${m.nombre} ${m.titular || ''} ${m.numero_telefono || ''} ${m.banco || ''}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        : [];

    if (view === 'create' || view === 'edit') {
        return (
            <AdminPaymentMethodForm
                onBack={() => {
                    setView('list');
                    setSelectedMetodo(null);
                    fetchMetodos();
                }}
                initialData={selectedMetodo}
            />
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1 pb-20">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <PageTitle title="Métodos de" accent="Pago" />
                <button
                    onClick={() => setView('create')}
                    className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-brand-accent transition-all group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Nuevo Método
                </button>
            </div>

            <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="BUSCAR MÉTODO, TITULAR O TELÉFONO..."
                wrapperClassName="relative group"
                className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            {loading ? (
                <LoadingSpinner className="flex justify-center p-20" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMetodos.map((m) => (
                        <div
                            key={m.id}
                            className="bg-brand-surface rounded-3xl border border-brand-border p-6 hover:shadow-xl transition-all group flex flex-col justify-between gap-4"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-brand-primary-soft text-brand-primary rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                            <CreditCard size={22} />
                                        </div>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                m.activo
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}
                                        >
                                            {m.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(m)}
                                            className="p-2 text-slate-300 hover:text-brand-primary transition-colors"
                                            title="Editar método"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTargetId(m.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            title="Eliminar método"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-black text-slate-800 text-lg uppercase italic leading-tight mb-3">
                                    {m.nombre}
                                </h3>

                                <div className="space-y-1.5 text-xs text-slate-600">
                                    {m.titular && (
                                        <p className="flex items-center gap-2 font-semibold">
                                            <User size={14} className="text-brand-primary shrink-0" />
                                            <span>{m.titular}</span>
                                        </p>
                                    )}
                                    {m.numero_telefono && (
                                        <p className="flex items-center gap-2 font-semibold">
                                            <Phone size={14} className="text-brand-accent shrink-0" />
                                            <span>{m.numero_telefono}</span>
                                        </p>
                                    )}
                                    {(m.banco || m.numero_cuenta) && (
                                        <p className="flex items-center gap-2 font-medium">
                                            <Landmark size={14} className="text-brand-primary shrink-0" />
                                            <span>
                                                {m.banco ? `${m.banco}: ` : ''}
                                                {m.numero_cuenta || ''}
                                            </span>
                                        </p>
                                    )}
                                    {m.cci && (
                                        <p className="text-[11px] text-slate-500 font-mono pl-6">
                                            CCI: {m.cci}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {m.detalle_instrucciones && (
                                <p className="text-[11px] text-slate-500 bg-brand-bg border border-brand-border-soft rounded-xl p-3 line-clamp-3">
                                    {m.detalle_instrucciones}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {filteredMetodos.length === 0 && !loading && (
                <EmptyState message="No se encontraron métodos de pago registrados" />
            )}

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={executeDelete}
                title="¿Eliminar método de pago?"
                message="Si tiene pagos registrados, no podrá eliminarse pero podrás desactivarlo desde Editar."
                iconType="danger"
                confirmText="Eliminar Método"
            />
        </div>
    );
};

export default AdminPaymentMethodsManager;
