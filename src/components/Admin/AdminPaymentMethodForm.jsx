import React, { useState } from 'react';
import { Save, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import metodoPagoService from '../../services/metodoPago.service';

const AdminPaymentMethodForm = ({ onBack, initialData }) => {
    const [loading, setLoading] = useState(false);
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        activo: initialData?.activo ?? true,
        titular: initialData?.titular || '',
        numero_telefono: initialData?.numero_telefono || '',
        numero_cuenta: initialData?.numero_cuenta || '',
        cci: initialData?.cci || '',
        banco: initialData?.banco || '',
        detalle_instrucciones: initialData?.detalle_instrucciones || '',
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim()) return toast.error('El nombre del método es obligatorio');

        setLoading(true);
        const payload = {
            nombre: formData.nombre.trim().toUpperCase(),
            activo: Boolean(formData.activo),
            titular: formData.titular.trim() || null,
            numero_telefono: formData.numero_telefono.trim() || null,
            numero_cuenta: formData.numero_cuenta.trim() || null,
            cci: formData.cci.trim() || null,
            banco: formData.banco.trim() || null,
            detalle_instrucciones: formData.detalle_instrucciones.trim() || null,
        };

        try {
            if (isEdit) {
                await metodoPagoService.update(initialData.id, payload);
                toast.success('¡Método de pago actualizado!');
            } else {
                await metodoPagoService.create(payload);
                toast.success('¡Método de pago creado!');
            }
            onBack();
        } catch (error) {
            toast.error(error.message || 'Error al guardar el método de pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-10 h-10 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center hover:text-brand-accent transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black text-brand-heading uppercase">
                        {isEdit ? 'Modificar' : 'Nuevo'} <span className="text-brand-primary">Método de Pago</span>
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-brand-primary-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEdit ? 'ACTUALIZAR' : 'REGISTRAR'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-brand-surface rounded-3xl border border-brand-border overflow-hidden shadow-sm">
                <div className="p-6 border-b border-brand-border-soft bg-brand-bg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="text-brand-primary" size={20} />
                        <span className="font-black text-slate-800 text-xs uppercase">Datos del Método de Pago</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={formData.activo}
                            onChange={handleChange('activo')}
                            className="w-4 h-4 accent-brand-primary rounded"
                        />
                        <span className="text-xs font-black uppercase text-slate-700">Activo</span>
                    </label>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-brand-muted uppercase">Nombre *</label>
                        <input
                            value={formData.nombre}
                            onChange={handleChange('nombre')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: YAPE, PLIN, TRANSFERENCIA"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-brand-muted uppercase">Titular</label>
                        <input
                            value={formData.titular}
                            onChange={handleChange('titular')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: Gerardo Melchor"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-brand-muted uppercase">Número Yape / Plin</label>
                        <input
                            value={formData.numero_telefono}
                            onChange={handleChange('numero_telefono')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: 980243257"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-brand-muted uppercase">Banco (opcional)</label>
                        <input
                            value={formData.banco}
                            onChange={handleChange('banco')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: BCP, BBVA, Interbank"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-brand-muted uppercase">Cuenta de Ahorros</label>
                        <input
                            value={formData.numero_cuenta}
                            onChange={handleChange('numero_cuenta')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: 193-32599827-0-16"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-brand-muted uppercase">CCI (Interbancaria)</label>
                        <input
                            value={formData.cci}
                            onChange={handleChange('cci')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: 00219313259982701619"
                        />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase">Instrucciones / Detalle para el alumno</label>
                        <textarea
                            rows={3}
                            maxLength={1000}
                            value={formData.detalle_instrucciones}
                            onChange={handleChange('detalle_instrucciones')}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            placeholder="Ej: Se paga en la misma sede donde entrena, hablando con el coordinador..."
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminPaymentMethodForm;
