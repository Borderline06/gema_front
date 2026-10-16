import React, { useMemo, useRef, useState } from 'react';
import { Gift, Sparkles, Store, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { useCatalogos } from '../../hooks/useCatalogos';
import { merchService } from '../../services/merch.service';
import { ESTADO_COLECCION, groupCollection } from '../../config/merch';
import { formatSoles } from '../../utils/formatSoles';
import { uniqueById } from '../../utils/uniqueById';
import { cartCount, cartLines, cartTotal, qtyMapToIds, withQty } from '../../utils/merchCart';
import SearchInput from '../../components/shared/SearchInput';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import MerchTabs from '../../components/merch/MerchTabs';
import MerchCard from '../../components/merch/MerchCard';
import CollectionCard from '../../components/merch/CollectionCard';
import MerchOrderModal from '../../components/merch/MerchOrderModal';
import ReportPaymentModal from '../../components/student/Payments/ReportPaymentModal';

const StudentMerch = () => {
    const { userId } = useAuth();
    const [activeTab, setActiveTab] = useState('catalogo');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState({});       // { [merchId]: cantidad }
    const [orderOpen, setOrderOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [debt, setDebt] = useState(null);     // deuda generada → ReportPaymentModal
    const [sedeElegida, setSedeElegida] = useState(null);
    const { sedes: sedesRaw } = useCatalogos(['sedes']);
    const sedes = useMemo(() => uniqueById(sedesRaw), [sedesRaw]);
    // Con una sola sede no hay nada que elegir.
    const sedeId = sedeElegida ?? (sedes.length === 1 ? sedes[0].id : null);

    const { data: catalogo, loading: loadingCatalogo, refetch: refetchCatalogo } = useFetch(
        () => merchService.getCatalogo(), [], { initialData: [], errorMessage: 'No se pudo cargar el catálogo' }
    );
    const { data: coleccion, loading: loadingColeccion, refetch: refetchColeccion } = useFetch(
        () => (userId ? merchService.getColeccion(userId) : []), [userId], { initialData: [], errorMessage: 'No se pudo cargar tu colección' }
    );

    // { [merchId]: unidades que el alumno posee (sin contar las perdidas) }
    const ownedCounts = useMemo(() => coleccion
        .filter(c => c.estado !== ESTADO_COLECCION.PERDIDO)
        .reduce((acc, c) => ({ ...acc, [c.merch_id]: (acc[c.merch_id] || 0) + 1 }), {}),
    [coleccion]);

    // Una tarjeta por producto, no una por unidad.
    const coleccionAgrupada = useMemo(() => groupCollection(coleccion), [coleccion]);

    const catalogoFiltrado = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return term ? catalogo.filter(i => i.nombre?.toLowerCase().includes(term)) : catalogo;
    }, [catalogo, searchTerm]);

    const lines = useMemo(() => cartLines(catalogo, cart), [catalogo, cart]);
    const total = cartTotal(lines);
    const unidades = cartCount(cart);

    const handleQtyChange = (id, qty) => setCart(prev => withQty(prev, id, qty));

    const confirmarOrden = async () => {
        setSubmitting(true);
        try {
            const deuda = await merchService.crearOrden(userId, qtyMapToIds(cart), sedeId);
            setOrderOpen(false);
            setCart({});
            // Si el backend no devuelve el monto, se usa el total que el alumno vio al confirmar.
            setDebt({ ...deuda, monto_final: deuda.monto_final ?? total });
            refetchCatalogo(); // el stock cambió
        } catch (error) {
            toast.error(error.message || 'No se pudo generar tu pedido');
        } finally {
            setSubmitting(false);
        }
    };

    // ReportPaymentModal llama onSuccess y luego onClose: la marca evita avisar
    // "pendiente" justo después de un pago reportado.
    const pagoReportado = useRef(false);
    const cerrarPago = () => {
        setDebt(null);
        if (!pagoReportado.current) {
            toast('Tu pedido quedó pendiente. Puedes pagarlo desde Mis Pagos.', { icon: '🕒' });
        }
        pagoReportado.current = false;
    };

    const loading = activeTab === 'coleccion' ? loadingColeccion : loadingCatalogo;

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-10 animate-fade-in pb-40">
            <div className="mb-10 text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 text-brand-gold justify-center md:justify-start">
                    <Gift size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Edición limitada · Solo para el club</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-brand-primary uppercase tracking-tighter italic leading-none">
                    CLUB <span className="text-brand-gold">MERCH</span>
                </h1>
            </div>

            <MerchTabs
                activeTab={activeTab}
                onChange={setActiveTab}
                counts={{ coleccion: coleccionAgrupada.length, catalogo: catalogo.length }}
            />

            {loading ? (
                <LoadingSpinner size={48} />
            ) : activeTab === 'catalogo' ? (
                <>
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="BUSCAR COLECCIONABLE..."
                        wrapperClassName="relative max-w-md mb-8"
                        className="w-full bg-brand-surface border border-brand-border rounded-xl pl-12 pr-4 py-3 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-brand-gold/30"
                    />
                    {catalogoFiltrado.length === 0 ? (
                        <EmptyState icon={Store} message="No hay coleccionables disponibles" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {catalogoFiltrado.map(item => (
                                <MerchCard
                                    key={item.id}
                                    item={item}
                                    ownedCount={ownedCounts[item.id] || 0}
                                    qty={cart[item.id] || 0}
                                    onQtyChange={handleQtyChange}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : coleccion.length === 0 ? (
                <EmptyState
                    icon={Sparkles}
                    iconSize={64}
                    message="Tu colección está vacía. ¿Cuál será el primero?"
                    className="bg-brand-surface rounded-[3rem] border-4 border-dashed border-brand-border p-16 text-center"
                    messageClassName="text-lg font-black text-brand-muted uppercase italic"
                    as="h3"
                >
                    <button
                        type="button"
                        onClick={() => setActiveTab('catalogo')}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        <Store size={14} /> Explorar el catálogo
                    </button>
                </EmptyState>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {coleccionAgrupada.map(group => <CollectionCard key={group.merch_id} group={group} />)}
                </div>
            )}

            {/* Barra de pedido: aparece solo cuando hay unidades elegidas */}
            {unidades > 0 && (
                <div className="fixed bottom-24 md:bottom-8 inset-x-4 md:left-[calc(16rem+1rem)] md:right-4 z-40 flex justify-center pointer-events-none">
                    <div className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-4 rounded-full border border-brand-gold/50 bg-brand-primary-dark px-6 py-3 shadow-2xl animate-fade-in">
                        <div className="text-white">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-100/60">{unidades} {unidades === 1 ? 'unidad' : 'unidades'}</p>
                            <p className="text-lg font-black italic text-brand-gold leading-none">{formatSoles(total)}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOrderOpen(true)}
                            className="flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-[11px] font-black uppercase italic tracking-widest text-white hover:bg-brand-accent-dark active:scale-95 transition-all"
                        >
                            <ShoppingBag size={16} /> Comprar
                        </button>
                    </div>
                </div>
            )}

            {orderOpen && (
                <MerchOrderModal
                    lines={lines}
                    total={total}
                    sedes={sedes}
                    sedeId={sedeId}
                    onSedeChange={setSedeElegida}
                    submitting={submitting}
                    onClose={() => setOrderOpen(false)}
                    onConfirm={confirmarOrden}
                />
            )}

            {/* Mismo modal que la mensualidad: sube voucher / elige método */}
            {debt && (
                <ReportPaymentModal
                    isOpen
                    debt={debt}
                    monto={debt.monto_final}
                    onClose={cerrarPago}
                    onSuccess={() => { pagoReportado.current = true; refetchColeccion(); }}
                />
            )}
        </div>
    );
};

export default StudentMerch;
