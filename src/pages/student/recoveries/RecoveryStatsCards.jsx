import React from 'react';
import { Activity, ShieldPlus } from 'lucide-react';

const RecoveryStatsCards = ({ stats, alLimite }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className={`p-5 rounded-3xl border flex items-center justify-between ${alLimite ? 'bg-brand-accent-soft border-orange-200' : 'bg-brand-surface border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${alLimite ? 'bg-orange-100 text-brand-accent-dark' : 'bg-brand-primary-soft text-blue-600'}`}>
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Recuperaciones Normales</p>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-black ${alLimite ? 'text-brand-accent-dark' : 'text-slate-800'}`}>
                            {stats.recuperacion_usadas || 0}
                        </span>
                        <span className="text-sm font-bold text-brand-muted">/ {stats.limite_permitido || 2} usadas</span>
                    </div>
                </div>
            </div>
            {alLimite && (
                <span className="text-[10px] font-bold bg-orange-200 text-orange-700 px-3 py-1 rounded-full uppercase">Límite Alcanzado</span>
            )}
        </div>

        <div className="bg-brand-surface border border-gray-200 shadow-sm p-5 rounded-3xl flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldPlus size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Recuperaciones por Lesión</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-emerald-500 uppercase text-[10px]">Sin límite</span>
                </div>
            </div>
        </div>
    </div>
);

export default RecoveryStatsCards;
