import React from 'react';
import { Info } from 'lucide-react';

// Ícono "i" con tooltip al hacer hover/tap. Sin dependencias nuevas, solo Tailwind + estado local.
const InfoTip = ({ text, width = 'w-64' }) => (
    <div className="relative inline-flex group">
        <button
            type="button"
            aria-label="Más información"
            className="text-slate-300 hover:text-[#1e3a8a] transition-colors focus:outline-none"
        >
            <Info size={14} strokeWidth={2.5} />
        </button>
        <div
            className={`pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 ${width}
                        bg-slate-800 text-white text-[11px] font-semibold leading-snug rounded-xl px-3 py-2
                        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity
                        shadow-lg normal-case tracking-normal`}
        >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
    </div>
);

export default InfoTip;
