import React, { useRef } from 'react';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';

// Extraído tal cual del selector de sedes de enrollment.jsx (mismas clases).
const SedeSelector = ({ sedes, active, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      <button type="button" onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-brand-surface p-3 rounded-full shadow-xl hidden md:group-hover:flex hover:bg-brand-primary hover:text-white transition-all -ml-6 border border-brand-border-soft">
        <ChevronLeft size={20} />
      </button>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide py-4 px-2 scroll-smooth">
        {sedes.map(sede => (
          <button key={sede} type="button" onClick={() => onSelect(sede)} className={`px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase italic transition-all duration-500 border-2 flex-shrink-0 ${active === sede ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-brand-surface border-brand-border-soft text-brand-muted'}`}>
            <Building2 size={16} /> {sede}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-brand-surface p-3 rounded-full shadow-xl hidden md:group-hover:flex hover:bg-brand-primary hover:text-white transition-all -mr-6 border border-brand-border-soft">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default SedeSelector;
