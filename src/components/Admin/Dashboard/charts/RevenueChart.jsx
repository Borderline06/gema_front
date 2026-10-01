import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import InfoTip from '../../../shared/InfoTip';
import { CHART_COLORS } from './chartColors';

const RevenueChart = ({ metodosPago }) => (
    <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-5 md:p-8 flex flex-col mt-6">
        <div className="mb-6 flex justify-between items-start">
            <div>
                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic mb-1 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-red-500 rounded-full"></div> Recaudación Anual
                    <InfoTip
                        text="Solo suma pagos con estado APROBADO dentro del año seleccionado. Pagos pendientes de validación o rechazados no aparecen aquí."
                    />
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-3.5">Ingresos por Canales de Pago</p>
            </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
            {metodosPago.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                    <BarChart data={metodosPago} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} dy={15} angle={-15} textAnchor="end" />
                        <YAxis axisLine={false} tickLine={false} width={80} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => val === 0 ? 'S/ 0' : `S/ ${val.toLocaleString()}`} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`S/ ${value.toLocaleString()}`, 'Total Recaudado']} />
                        <Bar dataKey="monto" radius={[8, 8, 0, 0]} barSize={50}>
                            {metodosPago.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#1e3a8a' : index === 1 ? '#f97316' : CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-sm uppercase bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center p-4">
                    No hay pagos registrados
                </div>
            )}
        </div>
    </div>
);

export default RevenueChart;
