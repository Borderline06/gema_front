import React, { useState, useMemo, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import InfoTip from '../../../shared/InfoTip';
import { CHART_COLORS } from './chartColors';
import { BRAND_COLORS } from "../../../../config/themeColors.js";
import ChartHeader from '../../../shared/ChartHeader';

const LevelsBySedeChart = ({ vigentesPorSedeNivel }) => {
    const [sedeSeleccionada, setSedeSeleccionada] = useState([]);
    const [nivelesSeleccionados, setNivelesSeleccionados] = useState([]);

    const nivelesUnicos = useMemo(() => {
        if (!vigentesPorSedeNivel) return [];
        const niveles = new Set();
        vigentesPorSedeNivel.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'sede' && !key.includes('_')) niveles.add(key);
            });
        });
        return Array.from(niveles);
    }, [vigentesPorSedeNivel]);

    useEffect(() => {
        if (nivelesUnicos.length > 0) {
            setNivelesSeleccionados(nivelesUnicos);
        }
    }, [nivelesUnicos]);

    const toggleSede = (sede) => {
        setSedeSeleccionada(prev => prev.includes(sede) ? prev.filter(s => s !== sede) : [...prev, sede]);
    };

    const toggleNivel = (nivel) => {
        setNivelesSeleccionados(prev => prev.includes(nivel) ? prev.filter(n => n !== nivel) : [...prev, nivel]);
    };

    return (
        <div className="lg:col-span-3 bg-brand-surface rounded-[2.5rem] border border-brand-border-soft shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-5 md:p-8 flex flex-col mt-6">
            <div className="mb-8 flex flex-col gap-6">
                <div>
                    <ChartHeader
                        barClassName="w-1.5 h-6 bg-teal-500 rounded-full"
                        title="Niveles x Sede (FTE)"
                        subtitle="Distribución Académica en Equivalentes (Hoy)"
                    >
                        <InfoTip
                            text="Las barras muestran FTE (0.5 por horario), no alumnos físicos. Pasa el mouse sobre una barra para ver el equivalente en alumnos reales entre paréntesis."
                        />
                    </ChartHeader>
                </div>

                <div className="flex flex-col md:flex-row gap-6 bg-brand-bg/50 p-4 rounded-2xl border border-brand-border-soft">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-brand-muted uppercase mb-2">Filtrar Niveles</p>
                        <div className="flex flex-wrap gap-2">
                            {nivelesUnicos.map((nivel) => {
                                const isSelected = nivelesSeleccionados.includes(nivel);
                                return (
                                    <button
                                        key={nivel}
                                        onClick={() => toggleNivel(nivel)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-brand-primary text-white shadow-md' : 'bg-brand-surface text-brand-muted border border-brand-border hover:bg-brand-surface-alt'}`}
                                    >
                                        {nivel}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-[2]">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-bold text-brand-muted uppercase">Filtrar Sedes</p>
                            {sedeSeleccionada.length > 0 && (
                                <button onClick={() => setSedeSeleccionada([])} className="text-[9px] font-bold text-teal-600 hover:text-teal-700 underline">
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                            {(vigentesPorSedeNivel || []).map(item => {
                                const isSelected = sedeSeleccionada.length === 0 || sedeSeleccionada.includes(item.sede);
                                return (
                                    <label
                                        key={item.sede}
                                        className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors select-none ${isSelected ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-brand-surface border-brand-border text-brand-muted hover:bg-brand-bg'} border`}
                                    >
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSede(item.sede)} className="hidden" />
                                        {item.sede}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%', height: 380 }}>
                {vigentesPorSedeNivel?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                        <BarChart
                            data={sedeSeleccionada.length > 0 ? vigentesPorSedeNivel.filter(s => sedeSeleccionada.includes(s.sede)) : vigentesPorSedeNivel}
                            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BRAND_COLORS['border-soft']} />
                            <XAxis dataKey="sede" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} angle={-45} textAnchor="end" interval={0} dx={-5} dy={5} height={90} />
                            <YAxis axisLine={false} tickLine={false} width={40} tick={{ fontSize: 10, fill: BRAND_COLORS.muted, fontWeight: 'bold' }} />
                            <Tooltip
                                formatter={(value, name, props) => {
                                    const fisicos = props.payload[`${name}_Fisicos`];
                                    return fisicos !== undefined ? [`${value} FTE (${fisicos} alumnos)`, name] : [`${value} FTE`, name];
                                }}
                                cursor={{ fill: BRAND_COLORS.bg }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />

                            {nivelesUnicos
                                .filter(nivel => nivelesSeleccionados.includes(nivel))
                                .map((nivel, idx) => (
                                    <Bar key={nivel} dataKey={nivel} name={nivel} stackId="a" fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[0, 0, 0, 0]} barSize={40} />
                                ))}
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-brand-muted font-bold text-sm uppercase bg-brand-bg/50 rounded-2xl border border-dashed border-brand-border">
                        Sin volumen activo
                    </div>
                )}
            </div>
        </div>
    );
};

export default LevelsBySedeChart;
