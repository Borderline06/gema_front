import React from 'react';
import { CalendarPlus, History } from 'lucide-react';

const RecoveryTabs = ({ activeTab, onChange }) => (
    <div className="flex gap-4 mb-8 border-b border-gray-200 pb-px">
        <button
            onClick={() => onChange('agendar')}
            className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'agendar'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
        >
            <CalendarPlus size={18} /> Agendar Clase
        </button>
        <button
            onClick={() => onChange('historial')}
            className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'historial'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
        >
            <History size={18} /> Mi Historial
        </button>
    </div>
);

export default RecoveryTabs;
