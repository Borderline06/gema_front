import React, { useState } from 'react';
import { Plus, MapPin, Building2, ChevronRight, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import AdminLocations from './AdminLocations';
import { sedeService } from '../../services/sede.service';
import { useFetch } from '../../hooks/useFetch';
import ConfirmModal from '../../components/shared/ConfirmModal';
import SearchInput from '../../components/shared/SearchInput';
import toast from 'react-hot-toast';

const AdminLocationsManager = () => {
    const [view, setView] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSede, setSelectedSede] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const {
        data: sedes,
        loading,
        refetch: fetchSedes,
    } = useFetch(
        () => sedeService.getAll().then((response) => response.data),
        [],
        { initialData: [], errorMessage: "Error al cargar las sedes" }
    );

    const handleEdit = (sede) => {
        setSelectedSede(sede);
        setView('edit');
    };

    const handleDelete = (id, nombre) => {
        setDeleteTarget({ id, nombre });
    };

    const executeDelete = async () => {
        const { id } = deleteTarget;
        setDeleteTarget(null);
        const loadId = toast.loading("Eliminando sede...");
        try {
            await sedeService.delete(id);
            toast.success("Sede eliminada correctamente", { id: loadId });
            fetchSedes(); // Recargar lista
        } catch (error) {
            toast.error(error.message || "No se pudo eliminar la sede", { id: loadId });
        }
    };

    const filteredSedes = sedes.filter(s =>
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.direcciones?.distrito.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (view === 'create' || view === 'edit') {
        return (
            <AdminLocations
                initialData={selectedSede}
                onBack={() => {
                    setSelectedSede(null);
                    setView('list');
                }}
                onSuccess={() => {
                    setSelectedSede(null);
                    setView('list');
                    fetchSedes();
                }}
            />
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Panel de <span className="text-[#1e3a8a]">Sedes</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Visualiza y gestiona las locaciones del club.</p>
                </div>

                <button
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/20 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Agregar Nueva Sede
                </button>
            </div>

            {/* Buscador */}
            <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="BUSCAR SEDE POR NOMBRE O DISTRITO..."
                wrapperClassName="relative group"
                iconClassName="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors"
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />

            {/* Listado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 text-center font-bold text-slate-400 animate-pulse">CARGANDO SEDES...</div>
                ) : filteredSedes.map((sede) => (
                    <div key={sede.id} className="bg-white rounded-3xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <Building2 size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                                <MapPin size={24} />
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${sede.activo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {sede.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-black text-slate-800 text-lg uppercase italic leading-tight mb-1 group-hover:text-[#1e3a8a] transition-colors">
                                {sede.nombre}
                            </h3>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <MapPin size={12} className="text-orange-500" />
                                {sede.direcciones?.distrito || 'Sin distrito'}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Capacidad</span>
                                <span className="text-sm font-black text-slate-700">
                                    {sede.canchas?.length || 0} Canchas
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(sede)}
                                    className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all">
                                    <Edit3 size={18} />
                                </button>
                                {/* BOTÓN DE TRASH CONECTADO */}
                                <button
                                    onClick={() => handleDelete(sede.id, sede.nombre)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Botón de agregar al final */}
                <div
                    onClick={() => setView('create')}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[#1e3a8a] hover:bg-blue-50/50 cursor-pointer transition-all group"
                >
                    <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1e3a8a]">Nueva Sede</span>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={executeDelete}
                title="¿Eliminar sede?"
                message={deleteTarget ? `Esta acción borrará canchas y direcciones asociadas a "${deleteTarget.nombre}".` : ''}
                iconType="danger"
                confirmText="Eliminar"
            />
        </div>
    );
};

export default AdminLocationsManager;