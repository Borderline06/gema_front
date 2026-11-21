import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Banknote, Upload, Coins, Copy, CheckCircle2, Landmark, ChevronDown, Phone, User } from "lucide-react";
import apiFetch from "../../../interceptors/api.js";
import toast from "react-hot-toast";
import { API_ROUTES } from "../../../constants/apiRoutes.js";
import { COMPANY_NAME } from '../../../config/branding';
import metodoPagoService from "../../../services/metodoPago.service";

const METODOS_FALLBACK = [
  { nombre: "YAPE" },
  { nombre: "PLIN" },
  { nombre: "TRANSFERENCIA" },
  { nombre: "TARJETA" },
  { nombre: "EFECTIVO" },
];

// `monto` (opcional) fija el importe a pagar. Sin él se usa el saldo restante o el
// monto final de la deuda. Si hay un importe válido el campo es de solo lectura
// (evita errores de tipeo); si no se puede determinar, queda editable como respaldo.
const ReportPaymentModal = ({ isOpen, onClose, debt, monto, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [voucherFile, setVoucherFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const [metodos, setMetodos] = useState(METODOS_FALLBACK);
  const [formData, setFormData] = useState({
    metodo_pago: "YAPE",
    monto: ""
  });

  useEffect(() => {
    if (!isOpen) return;
    let cancelado = false;

    metodoPagoService
      .getAllActivos()
      .then((lista) => {
        if (cancelado || !Array.isArray(lista) || lista.length === 0) return;
        setMetodos(lista);
        setFormData((prev) => {
          const sigueDisponible = lista.some((m) => m.nombre === prev.metodo_pago);
          if (sigueDisponible) return prev;
          const yape = lista.find((m) => m.nombre === "YAPE");
          return { ...prev, metodo_pago: (yape || lista[0]).nombre };
        });
      })
      .catch(() => {
        // Mantiene METODOS_FALLBACK si falla la carga
      });

    return () => {
      cancelado = true;
    };
  }, [isOpen]);

  const montoCalculado = Number(monto ?? debt?.saldoRestante ?? debt?.monto_final);
  const montoFijo = Number.isFinite(montoCalculado) && montoCalculado > 0 ? montoCalculado : null;
  const montoAPagar = montoFijo ?? formData.monto;

  const metodoSeleccionado = metodos.find((m) => m.nombre === formData.metodo_pago) || null;
  const esEfectivo = formData.metodo_pago === "EFECTIVO";
  const esTarjeta = formData.metodo_pago === "TARJETA";

  const tieneTelefono = Boolean(metodoSeleccionado?.numero_telefono);
  const tieneBanco = Boolean(metodoSeleccionado?.numero_cuenta || metodoSeleccionado?.cci || metodoSeleccionado?.banco);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopiedField(""), 2000);
  };

  if (!isOpen || !debt) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!montoAPagar || parseFloat(montoAPagar) <= 0) return toast.error("Ingresa un monto válido");

    // Todos requieren voucher excepto Efectivo
    if (!esEfectivo && !voucherFile) {
      return toast.error(esTarjeta ? "Sube la foto del voucher del POS" : "Sube la captura de tu pago");
    }

    setLoading(true);
    try {
      const paymentData = new FormData();
      paymentData.append('deuda_id', parseInt(debt.id));
      paymentData.append('monto', parseFloat(montoAPagar));
      paymentData.append('metodo_pago', formData.metodo_pago);

      // 🚩 HARDCODEO DE CÓDIGO DE OPERACIÓN PARA LA BASE DE DATOS
      let codigoGenerico = 'POR_VERIFICAR';
      if (esEfectivo) codigoGenerico = 'PAGO_PRESENCIAL';
      if (esTarjeta) codigoGenerico = 'VOUCHER_POS';

      paymentData.append('codigo_operacion', codigoGenerico);

      if (voucherFile && !esEfectivo) paymentData.append('voucher', voucherFile);

      const response = await apiFetch.post(API_ROUTES.PAGOS.REPORTAR, paymentData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al reportar el pago.");
      }

      toast.success("¡Pago reportado con éxito!");
      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message, { duration: 5000, style: { maxWidth: '500px' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-6 bg-brand-primary-dark/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-brand-surface w-full max-w-md max-h-[95vh] overflow-y-auto rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex flex-col border border-white/20 custom-scrollbar">

        <div className="bg-brand-primary p-5 md:p-8 text-white relative">
          <button onClick={onClose} type="button" className="absolute top-5 right-6 text-white/50 hover:text-white"><X size={24} /></button>
          <h3 className="font-black uppercase italic text-lg md:text-2xl tracking-tighter leading-none">Reportar <span className="text-brand-accent">Pago</span></h3>
          <p className="text-[9px] font-black opacity-50 uppercase tracking-[0.2em] mt-1 italic">{COMPANY_NAME} Student Elite</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-4 md:space-y-5 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {/* MONTO */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                <Banknote size={12} className="text-brand-accent" /> Monto (S/)
              </label>
              <input type="number" step="0.01"
                value={montoFijo !== null ? montoFijo.toFixed(2) : formData.monto}
                readOnly={montoFijo !== null}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className={`w-full border-2 border-brand-border-soft rounded-xl px-4 py-2.5 text-lg font-black text-brand-primary outline-none transition-all ${montoFijo !== null ? 'bg-brand-surface-alt cursor-not-allowed' : 'bg-brand-bg focus:border-brand-accent'}`} />
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest ml-1">Método</label>
              <div className="relative">
                <select value={formData.metodo_pago} onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                  className="w-full bg-brand-bg border-2 border-brand-border-soft rounded-xl pl-3 pr-8 py-[14px] text-[10px] font-black outline-none cursor-pointer focus:border-brand-primary appearance-none uppercase italic">
                  {metodos.map((m) => (
                    <option key={m.nombre} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* DATOS DINÁMICOS DEL MÉTODO SELECCIONADO (NO EFECTIVO) */}
          {!esEfectivo && (tieneTelefono || tieneBanco || metodoSeleccionado?.detalle_instrucciones) && (
            <div className="bg-brand-primary-soft/60 border border-brand-primary/15 rounded-2xl p-4 space-y-2.5">
              {metodoSeleccionado?.titular && (
                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                  <User size={14} className="text-brand-accent shrink-0" />
                  <span>Titular: {metodoSeleccionado.titular}</span>
                </div>
              )}

              {tieneTelefono && (
                <div className="bg-brand-surface rounded-xl px-3 py-2 flex items-center justify-between border border-brand-border-soft">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-brand-accent shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-brand-muted uppercase">{formData.metodo_pago}</p>
                      <p className="text-sm font-black text-brand-primary tracking-wide">{metodoSeleccionado.numero_telefono}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(metodoSeleccionado.numero_telefono, "tel")}
                    className="p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors"
                    title="Copiar número"
                  >
                    {copiedField === "tel" ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              )}

              {tieneBanco && (
                <div className="space-y-2">
                  {metodoSeleccionado.banco && (
                    <p className="text-[10px] font-black text-brand-primary uppercase flex items-center gap-1.5">
                      <Landmark size={13} className="text-brand-accent" /> {metodoSeleccionado.banco}
                    </p>
                  )}

                  {metodoSeleccionado.numero_cuenta && (
                    <div className="bg-brand-surface rounded-xl px-3 py-2 flex items-center justify-between border border-brand-border-soft">
                      <div>
                        <p className="text-[8px] font-black text-brand-muted uppercase">Cuenta de Ahorros</p>
                        <p className="text-xs font-black text-brand-primary font-mono">{metodoSeleccionado.numero_cuenta}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(metodoSeleccionado.numero_cuenta, "cuenta")}
                        className="p-1.5 text-brand-muted hover:text-brand-accent transition-colors"
                        title="Copiar cuenta"
                      >
                        {copiedField === "cuenta" ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}

                  {metodoSeleccionado.cci && (
                    <div className="bg-brand-surface rounded-xl px-3 py-2 flex items-center justify-between border border-brand-border-soft">
                      <div>
                        <p className="text-[8px] font-black text-brand-muted uppercase">CCI (Interbancario)</p>
                        <p className="text-xs font-black text-brand-primary font-mono">{metodoSeleccionado.cci}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(metodoSeleccionado.cci, "cci")}
                        className="p-1.5 text-brand-muted hover:text-brand-accent transition-colors"
                        title="Copiar CCI"
                      >
                        {copiedField === "cci" ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {metodoSeleccionado?.detalle_instrucciones && !tieneTelefono && !tieneBanco && (
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {metodoSeleccionado.detalle_instrucciones}
                </p>
              )}
            </div>
          )}

          {/* SECCIÓN VOUCHER */}
          {!esEfectivo && (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest ml-1 flex items-center gap-1">
                {esTarjeta ? "Sube la foto del POS" : "Sube la captura de tu pago"}
              </label>
              <input type="file" accept="image/*" className="hidden" id="voucher-input" onChange={(e) => { if (e.target.files[0]) { setVoucherFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); } }} />
              <label htmlFor="voucher-input" className="block bg-brand-bg border-2 border-dashed border-brand-border rounded-2xl py-8 md:py-10 text-center cursor-pointer hover:bg-brand-accent-soft hover:border-orange-200 transition-all group overflow-hidden">
                {previewUrl ? <img src={previewUrl} className="h-24 md:h-32 mx-auto rounded-lg shadow-md object-contain" alt="Voucher" /> :
                  <div className="py-2"><Upload size={32} className="mx-auto text-slate-300 mb-2 group-hover:text-brand-accent transition-colors" /><p className="text-[10px] font-black text-brand-muted uppercase italic leading-none group-hover:text-brand-accent-dark transition-colors">Seleccionar Imagen</p></div>}
              </label>
            </div>
          )}

          {/* INDICADOR PARA EFECTIVO */}
          {esEfectivo && (
            <div className="bg-brand-accent-soft border border-orange-100 rounded-2xl p-6 text-center space-y-1.5">
              <Coins size={32} className="text-brand-accent mx-auto mb-1" />
              <h4 className="text-orange-700 font-black uppercase tracking-tighter text-sm italic">Pago en Sede</h4>
              <p className="text-[11px] text-brand-accent-dark font-semibold leading-relaxed">
                {metodoSeleccionado?.detalle_instrucciones || "Acércate a recepción para cancelar este monto."}
              </p>
              {metodoSeleccionado?.titular && (
                <p className="text-[10px] text-orange-700/80 font-bold uppercase">
                  Titular: {metodoSeleccionado.titular}
                </p>
              )}
            </div>
          )}

          <div className="pt-2 flex gap-2 pb-2">
            <button onClick={onClose} type="button" className="flex-1 bg-brand-surface-alt hover:bg-slate-200 text-slate-500 font-black py-3.5 rounded-xl transition-all uppercase italic text-[9px] tracking-widest active:scale-95">Cancelar</button>
            <button disabled={loading} className="flex-[2] bg-brand-primary hover:bg-brand-accent-dark text-white font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:active:scale-100">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              <span className="uppercase italic tracking-tighter text-xs">{loading ? "ENVIANDO..." : "REPORTAR PAGO"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPaymentModal;
