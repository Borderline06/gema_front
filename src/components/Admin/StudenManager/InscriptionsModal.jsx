import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

import { useHistorialCiclos } from '../../../hooks/useHistorialCiclos';
import CicloRegularCard from './inscriptions-modal/CicloRegularCard';
import ClaseSueltaButton from './ciclos/ClaseSueltaButton';
import CicloSinRegistrosCard from './ciclos/CicloSinRegistrosCard';
import ClaseSueltaDetailModal from './ciclos/ClaseSueltaDetailModal';

const InscriptionsModal = ({ isOpen, data, onClose }) => {

    // Misma fuente que StudentDetails: el endpoint rico por cuenta (monto,
    // profesor, cuenta_id, concepto, vencimiento), ahora cacheado y compartido.
    const { ciclos, loading: loadingCiclos } = useHistorialCiclos(data?.id, { activo: isOpen });
    const [individualSeleccionada, setIndividualSeleccionada] = useState(null);

    // Reset de la selección al cerrar, para no arrastrar estado a la próxima
    // apertura. Se hace en el handler y no en un useEffect.
    const cerrar = () => {
        setIndividualSeleccionada(null);
        onClose();
    };

    // Separamos regulares (con clases) vs individuales vs sin_registros,
    // igual que en StudentDetails, para mantener el mismo orden visual.
    // Va antes del early return: los hooks no pueden quedar detras de un return.
    const { ciclosRegulares, ciclosIndividuales, ciclosSinRegistros } = useMemo(() => ({
        ciclosRegulares: ciclos.filter(c => !c.sin_registros && !c.es_individual),
        ciclosIndividuales: ciclos.filter(c => !c.sin_registros && c.es_individual),
        ciclosSinRegistros: ciclos.filter(c => c.sin_registros),
    }), [ciclos]);

    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-brand-primary-dark/40 backdrop-blur-sm animate-fade-in">
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
                        onClick={cerrar}
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
