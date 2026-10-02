import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import apiFetch from '../../../interceptors/api';
import { API_ROUTES } from '../../../constants/apiRoutes';
import CicloRegularCard from './inscriptions-modal/CicloRegularCard';
import ClaseSueltaButton from './ciclos/ClaseSueltaButton';
import CicloSinRegistrosCard from './ciclos/CicloSinRegistrosCard';
import ClaseSueltaDetailModal from './ciclos/ClaseSueltaDetailModal';

const InscriptionsModal = ({ isOpen, data, onClose }) => {

    // Ya NO se arma desde data.historialInscripciones (pobre en datos).
    // Ahora pide el mismo endpoint rico que usa StudentDetails, con monto,
    // profesor, cuenta_id, concepto y fecha de vencimiento por cuenta.
    const [ciclos, setCiclos] = useState([]);
    const [loadingCiclos, setLoadingCiclos] = useState(true);
    const [individualSeleccionada, setIndividualSeleccionada] = useState(null);

    useEffect(() => {
        if (!isOpen || !data?.id) return;

        const fetchCiclos = async () => {
            try {
                setLoadingCiclos(true);
                const res = await apiFetch.get(API_ROUTES.HISTORIAL_ACADEMICO.ALUMNO(data.id));
                const result = await res.json();

                if (res.ok) {
                    setCiclos(result.data || []);
                } else {
                    toast.error("No se pudo obtener el detalle de inscripciones");
                }
            } catch (error) {
                toast.error("Error al conectar con el servidor para obtener el detalle");
            } finally {
                setLoadingCiclos(false);
            }
        };

        fetchCiclos();
    }, [isOpen, data?.id]);

    // Reset de la selección al cerrar, para no arrastrar estado a la próxima apertura
    useEffect(() => {
        if (!isOpen) setIndividualSeleccionada(null);
    }, [isOpen]);

    if (!isOpen || !data) return null;

    // Separamos regulares (con clases) vs individuales vs sin_registros,
    // igual que en StudentDetails, para mantener el mismo orden visual.
    const ciclosRegulares = ciclos.filter(c => !c.sin_registros && !c.es_individual);
    const ciclosIndividuales = ciclos.filter(c => !c.sin_registros && c.es_individual);
    const ciclosSinRegistros = ciclos.filter(c => c.sin_registros);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-dark/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-brand-surface rounded-[2rem] w-full max-w-lg shadow-2xl border border-brand-border-soft overflow-hidden animate-fade-in-up">
                <div className="bg-brand-bg p-6 border-b border-brand-border-soft flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                            Detalle de <span className="text-brand-primary">Inscripciones</span>
                        </h3>
                        <p className="text-[10px] font-bold text-brand-muted uppercase mt-1">
                            {data.full_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center text-brand-muted hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {loadingCiclos ? (
                        <div className="flex flex-col justify-center items-center py-10 gap-2">
                            <Loader2 className="animate-spin text-brand-accent" size={24} />
                            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Cargando inscripciones...</span>
                        </div>
                    ) : ciclos.length === 0 ? (
                        <p className="text-center text-sm font-bold text-brand-muted py-8">No hay registros de inscripciones.</p>
                    ) : (
                        <>
                            {/* TARJETAS REGULARES (paquetes) — con TODO el detalle: monto, profesor, plazo de pago */}
                            {ciclosRegulares.map((ciclo) => (
                                <CicloRegularCard key={ciclo.cuenta_id} ciclo={ciclo} />
                            ))}

                            {/* SECCIÓN DE CLASES SUELTAS (individuales): botones compactos */}
                            {ciclosIndividuales.length > 0 && (
                                <div className="space-y-2">
                                    {ciclosRegulares.length > 0 && (
                                        <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest pt-2">
                                            Clases Sueltas
                                        </p>
                                    )}
                                    {ciclosIndividuales.map((ciclo) => (
                                        <ClaseSueltaButton
                                            key={ciclo.cuenta_id}
                                            ciclo={ciclo}
                                            onSelect={() => setIndividualSeleccionada(ciclo)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* TARJETAS SIN CLASES REGISTRADAS */}
                            {ciclosSinRegistros.map((ciclo) => (
                                <CicloSinRegistrosCard key={ciclo.cuenta_id} ciclo={ciclo} />
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* MODAL DE DETALLE DE LA CLASE SUELTA (segundo nivel, sobre el modal principal) */}
            {individualSeleccionada && (
                <ClaseSueltaDetailModal
                    ciclo={individualSeleccionada}
                    onClose={() => setIndividualSeleccionada(null)}
                />
            )}
        </div>
    );
};

export default InscriptionsModal;
