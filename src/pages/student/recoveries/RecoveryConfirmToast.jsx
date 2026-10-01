import React from 'react';
import toast from 'react-hot-toast';

const RecoveryConfirmToast = ({ t, slot, onConfirm }) => (
    <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirmación de Reserva</span>
            <p className="text-sm font-bold text-[#1e3a8a] leading-tight mt-1">
                ¿Confirmas recuperar tu clase el <span className="text-orange-500">{new Date(slot.fecha).toLocaleDateString()}</span> a las <span className="text-orange-500">{slot.horarioData.hora_inicio.substring(0, 5)}</span>?
            </p>
        </div>

        <div className="flex gap-2">
            <button
                onClick={() => {
                    toast.dismiss(t.id);
                    onConfirm();
                }}
                className="flex-1 bg-orange-500 text-white text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
                Confirmar
            </button>
            <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
                Cancelar
            </button>
        </div>
    </div>
);

export default RecoveryConfirmToast;
