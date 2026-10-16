import React from 'react';
import { Sparkles, Store } from 'lucide-react';

// El catálogo va primero: el objetivo es despertar el deseo, no mostrar una lista vacía.
const TABS = [
  { id: 'catalogo', label: 'Catálogo', icon: Store },
  { id: 'coleccion', label: 'Mi Colección', icon: Sparkles },
];

const MerchTabs = ({ activeTab, onChange, counts = {} }) => (
  <div className="flex gap-4 mb-8 border-b border-gray-200 pb-px">
    {TABS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === id
          ? 'border-brand-gold text-brand-primary'
          : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
      >
        <Icon size={18} /> {label}
        {counts[id] != null && (
          <span className="text-[10px] bg-brand-surface-alt text-slate-500 rounded-full px-2 py-0.5">{counts[id]}</span>
        )}
      </button>
    ))}
  </div>
);

export default MerchTabs;
