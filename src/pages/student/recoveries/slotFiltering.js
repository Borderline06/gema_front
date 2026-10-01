import { generarClasesDisponibles } from '../../../utils/schedulerUtils';

// Genera los slots disponibles para el ticket seleccionado, quitando los que el alumno
// ya tiene ocupados ('PROGRAMADA') o que corresponden a un horario regular protegido.
export const calcularSlotsDisponibles = (horariosPatron, historial, stats) => {
    const rawSlots = generarClasesDisponibles(horariosPatron, 4);

    return rawSlots.filter(slot => {
        const fechaSlotTexto = slot.fecha.split('T')[0];

        // Buscamos si el alumno ya tiene algo agendado ('PROGRAMADA') en este mismo día y a esta misma hora
        const yaLoTieneOcupado = historial.some(ticket => {
            if (ticket.estado !== 'PROGRAMADA') return false;

            const fechaTicketTexto = ticket.fecha_programada.split('T')[0];
            const mismaFecha = fechaTicketTexto === fechaSlotTexto;
            const mismoHorario = ticket.horario_destino_id === slot.horarioData.id;

            return mismaFecha && mismoHorario;
        });

        const esHorarioRegularProtegido = stats.fechas_clases_regulares.some(
            f => f.fecha_clase === slot.fecha && f.id_horario === slot.horarioData.id
        );

        return !yaLoTieneOcupado && !esHorarioRegularProtegido;
    });
};
