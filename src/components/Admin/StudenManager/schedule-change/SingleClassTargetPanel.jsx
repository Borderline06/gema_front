import React, { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import EmptyState from '../../../shared/EmptyState';
import UnicaSchedule from '../../../student/enrollment/unica/UnicaSchedule';
import ScheduleFilters from './ScheduleFilters';

// Destino de un cambio de CLASE ÚNICA: el mismo calendario con cupo que usa el alumno al comprar.
// Parte de la sede y nivel de la clase actual (editables) para no consultar la disponibilidad de todo el club.
const SingleClassTargetPanel = ({ inscripcionActual, horariosDisponibles, unica, onSelectFecha, onSelectHorario }) => {
    const [filtroSede, setFiltroSede] = useState(inscripcionActual.horarios_clases.canchas.sedes.nombre || '');
    const [filtroNivel, setFiltroNivel] = useState(inscripcionActual.horarios_clases.niveles_entrenamiento?.nombre || '');

    const sedesUnicas = [...new Set(horariosDisponibles.map(h => h.cancha?.sede?.nombre).filter(Boolean))];
    const nivelesUnicos = [...new Set(horariosDisponibles.map(h => h.nivel?.nombre).filter(Boolean))];

    const horarios = useMemo(() => {
        if (!filtroSede || !filtroNivel) return [];
        return horariosDisponibles.filter(h =>
            h.id !== inscripcionActual.horario_id &&
            h.cancha?.sede?.nombre === filtroSede &&
            h.nivel?.nombre === filtroNivel
        );
    }, [horariosDisponibles, filtroSede, filtroNivel, inscripcionActual.horario_id]);

    // Cambiar un filtro cambia el universo de horarios: la fecha/horario elegidos ya no son válidos.
    const cambiarSede = (valor) => { setFiltroSede(valor); onSelectFecha(null, null); };
    const cambiarNivel = (valor) => { setFiltroNivel(valor); onSelectFecha(null, null); };

    const horarioElegido = horarios.find(h => h.id === unica.horarioId);

    return (
        <div className="space-y-4">
            <ScheduleFilters
                filtroSede={filtroSede}
                setFiltroSede={cambiarSede}
                sedesUnicas={sedesUnicas}
                filtroNivel={filtroNivel}
                setFiltroNivel={cambiarNivel}
                nivelesUnicos={nivelesUnicos}
            />

            {!filtroSede || !filtroNivel ? (
                <EmptyState message="Selecciona una sede y un nivel para ver el calendario." className="py-10 text-center text-brand-muted font-bold italic uppercase text-xs tracking-widest" />
            ) : (
                <UnicaSchedule
                    horarios={horarios}
                    unica={unica}
                    onSelectFecha={onSelectFecha}
                    onSelectHorario={onSelectHorario}
                />
            )}

            {unica.fecha && horarioElegido && (
                <div className="flex items-center gap-2 bg-brand-primary-soft/30 border-2 border-brand-primary rounded-2xl px-4 py-3 capitalize">
                    <Calendar size={14} className="text-brand-primary" />
                    <span className="text-[11px] font-black text-brand-primary">
                        {format(parseISO(unica.fecha), "EEEE dd 'de' MMMM", { locale: es })} · {horarioElegido.hora_inicio.slice(0, 5)} - {horarioElegido.hora_fin.slice(0, 5)} · {horarioElegido.cancha?.nombre}
                    </span>
                </div>
            )}
        </div>
    );
};

export default SingleClassTargetPanel;
