import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import ChangePasswordModal from '../../../components/shared/ChangePasswordModal'; // Ajusta la ruta si es necesario
import apiFetch from '../../../interceptors/api';
import { API_ROUTES } from '../../../constants/apiRoutes';
import StudentProfileCard from './student-details/StudentProfileCard';
import StudentHealthCard from './student-details/StudentHealthCard';
import EmergencyContactCard from './student-details/EmergencyContactCard';
import CicloHistoryPanel from './student-details/CicloHistoryPanel';
import ClaseSueltaDetailModal from './ciclos/ClaseSueltaDetailModal';

const StudentDetails = ({ selectedAlumno, onBack, onStatusHistoryChange }) => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [ciclos, setCiclos] = useState([]);
    const [loadingCiclos, setLoadingCiclos] = useState(true);

    // Clase individual seleccionada para ver su resumen en modal aparte
    const [claseIndividualSeleccionada, setClaseIndividualSeleccionada] = useState(null);

    // Detalle completo del alumno (dirección, salud, contacto, email, etc.)
    // — ya NO viene en selectedAlumno (ese objeto viene de resumen-tabla,
    // que es liviano). Se pide aparte solo al abrir el expediente.
    const [detalle, setDetalle] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(true);

    useEffect(() => {
        if (!selectedAlumno) return;

        const fetchDetalle = async () => {
            try {
                setLoadingDetalle(true);
                const res = await apiFetch.get(API_ROUTES.HISTORIAL_ACADEMICO.ALUMNO_DETALLE(selectedAlumno.id));
                const result = await res.json();
                if (res.ok) {
                    setDetalle(result.data);
                } else {
                    toast.error("No se pudo obtener el detalle del alumno");
                }
            } catch (error) {
                toast.error("Error al conectar con el servidor para obtener el detalle");
            } finally {
                setLoadingDetalle(false);
            }
        };

        fetchDetalle();
    }, [selectedAlumno]);

    // /historial-academico/alumno/:id — el backend YA entrega cada tarjeta
    // agrupada por cuenta_id, con fecha_inicio_real / fecha_fin_real calculadas
    // desde clases realmente generadas en registros_asistencia, ordenadas de
    // más reciente a más antigua (las "sin_registros" van al final).
    useEffect(() => {
        if (!selectedAlumno) return;

        const fetchCiclos = async () => {
            try {
                setLoadingCiclos(true);
                const res = await apiFetch.get(API_ROUTES.HISTORIAL_ACADEMICO.ALUMNO(selectedAlumno.id));
                const result = await res.json();

                if (res.ok) {
                    setCiclos(result.data || []);
                } else {
                    toast.error("No se pudo obtener el historial académico");
                }
            } catch (error) {
                toast.error("Error al conectar con el servidor para obtener el historial");
            } finally {
                setLoadingCiclos(false);
            }
        };

        fetchCiclos();
    }, [selectedAlumno]);

    if (!selectedAlumno) return null;

    // Evita el crash: mientras no haya detalle cargado, no renderiza el
    // cuerpo que depende de direccion/salud/contactoEmergencia/email/etc.
    if (loadingDetalle || !detalle) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="animate-spin text-brand-primary" size={48} />
                <p className="font-black text-brand-primary text-xs uppercase italic tracking-widest animate-pulse">Cargando expediente...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header del Expediente */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="w-12 h-12 bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center hover:bg-brand-bg transition-all shadow-sm">
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-black uppercase italic text-slate-800 leading-none">Expediente <span className="text-brand-primary">Gema</span></h2>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mt-1">Ficha completa del Alumno</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMNA IZQUIERDA (Datos Personales y Médicos) */}
                <div className="lg:col-span-2 space-y-6">
                    <StudentProfileCard
                        alumno={selectedAlumno}
                        detalle={detalle}
                        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
                    />
                    <StudentHealthCard detalle={detalle} onStatusHistoryChange={onStatusHistoryChange} />
                </div>

                {/* COLUMNA DERECHA (Emergencia y Ciclos) */}
                <div className="lg:col-span-1 space-y-6">
                    <EmergencyContactCard contacto={detalle.contactoEmergencia} />
                    <CicloHistoryPanel
                        ciclos={ciclos}
                        loadingCiclos={loadingCiclos}
                        onSelectIndividual={setClaseIndividualSeleccionada}
                    />
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                userId={selectedAlumno.id}
            />

            {claseIndividualSeleccionada && (
                <ClaseSueltaDetailModal
                    ciclo={claseIndividualSeleccionada}
                    onClose={() => setClaseIndividualSeleccionada(null)}
                    title="Resumen de Clase Suelta"
                />
            )}
        </div>
    );
};

export default StudentDetails;
