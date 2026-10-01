import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import InfoTip from '../../../shared/InfoTip';
import { CHART_COLORS } from './chartColors';

const OccupancyChart = ({ sedes, totalAlumnos, alumnosMultiSede }) => (
    <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-5 md:p-8 flex flex-col">
        <div className="mb-6">
            <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic mb-1 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> Ocupación
                <InfoTip
                    text="Cada alumno se cuenta una vez por sede en la que tiene clases activas hoy. Si está matriculado en 2+ sedes, la suma de las sedes será mayor al total real de alumnos — por eso mostramos el aviso de 'alumnos en 2+ sedes' abajo."
                />
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-3.5">Plazas Ocupadas por Sede (Hoy)</p>
        </div>
        <div style={{ width: '100%', height: 200, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                <PieChart>
                    <Pie data={sedes} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="valor" nameKey="nombre" stroke="none">
                        {sedes.map((entry, idx) => (<Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />))}
                    </Pie>
                    <Tooltip
                        isAnimationActive={false}
                        wrapperStyle={{ zIndex: 100 }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value, name, props) => {
                            const fte = props.payload.fte;
                            return fte !== undefined ? [`${value} alumnos (${fte} FTE)`, 'Volumen'] : [`${value} alumnos`, 'Volumen'];
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-[#1e3a8a] italic leading-none">{totalAlumnos}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Plazas Ocupadas</span>
                {alumnosMultiSede > 0 && (
                    <span className="text-[9px] font-bold text-orange-500 uppercase mt-1 text-center leading-tight">
                        {alumnosMultiSede} alumno{alumnosMultiSede > 1 ? 's' : ''} en 2+ sedes
                    </span>
                )}
            </div>
        </div>
        <div className="mt-8 space-y-3">
            {sedes.map((sede, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                        <span className="text-slate-600 font-bold uppercase tracking-tight truncate max-w-[120px]">{sede.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">({sede.fte} FTE)</span>
                        <span className="font-black text-[#1e3a8a] bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">{sede.valor}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default OccupancyChart;
