import React from 'react';
import toast from 'react-hot-toast';
import { diasSemana } from './scheduleLabels';

const ChangeScheduleConfirmToast = ({ t, selectedHorarioActual, selectedHorarioNuevo, onConfirm }) => (
    <div className="flex flex-col gap-4 p-2 w-full">
        <div className="text-center pb-2 border-b border-brand-border-soft">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Confirmar Cambio de Horario</span>
        </div>

        <div className="grid grid-cols-2 gap-4 divide-x divide-brand-border">

            <div className="flex flex-col gap-2 pr-2">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Horario Actual</span>
                <div className="flex flex-col gap-1.5 text-xs">
                    <p className="flex flex-col">
                        <span className="text-[9px] text-brand-primary uppercase">Sede</span>
                        <span className="font-bold text-brand-body">{selectedHorarioActual.horarios_clases?.canchas?.sedes?.nombre}</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-[9px] text-brand-primary uppercase">Nivel</span>
                        <span className="font-bold text-brand-body">{selectedHorarioActual.horarios_clases?.niveles_entrenamiento?.nombre}</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-[9px] text-brand-primary uppercase">Día y Hora</span>
                        <span className="font-bold text-brand-body">
                            {diasSemana(selectedHorarioActual.horarios_clases?.dia_semana)} <br />
                            <span className="font-normal text-slate-800">{selectedHorarioActual.horarios_clases?.hora_inicio.slice(11, 16)} - {selectedHorarioActual.horarios_clases?.hora_fin.slice(11, 16)}</span>
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2 pl-4">
                <span className="text-[10px] font-black text-brand-accent-dark uppercase tracking-widest">Horario Destino</span>
                <div className="flex flex-col gap-1.5 text-xs">
                    <p className="flex flex-col">
                        <span className="text-[9px] text-brand-accent-dark uppercase">Sede</span>
                        <span className="font-bold text-slate-800">{selectedHorarioNuevo.cancha?.sede?.nombre}</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-[9px] text-brand-accent-dark uppercase">Nivel</span>
                        <span className="font-bold text-slate-800">{selectedHorarioNuevo.nivel?.nombre}</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-[9px] text-brand-accent-dark uppercase">Día y Hora</span>
                        <span className="font-bold text-slate-800">
                            {diasSemana(selectedHorarioNuevo.dia_semana)} <br />
                            <span className="font-normal text-slate-800">{selectedHorarioNuevo.hora_inicio} - {selectedHorarioNuevo.hora_fin}</span>
                        </span>
                    </p>
                </div>
            </div>

        </div>

        <div className="flex gap-2 mt-2 pt-3 border-t border-brand-border-soft">
            <button
                onClick={() => {
                    toast.dismiss(t.id);
                    onConfirm();
                }}
                className="flex-1 bg-brand-accent text-white text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-brand-accent-dark transition-colors shadow-sm"
            >
                Confirmar
            </button>
            <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 bg-brand-surface-alt text-slate-500 text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
                Cancelar
            </button>
        </div>
    </div>
);

export default ChangeScheduleConfirmToast;
