// Cuánto debe llamar la atención la situación financiera del alumno en el
// Dashboard. Solo lo crítico interrumpe; el resto se resume en una línea.

export const FINANCE_LEVEL = {
  CRITICAL: 'CRITICAL', // pago rechazado o deuda vencida
  PENDING: 'PENDING',   // deuda en plazo
  REVIEW: 'REVIEW',     // pago esperando validación
  OK: 'OK',
};

const DEUDA_ABIERTA = ['PENDIENTE', 'PARCIAL'];

// La API devuelve fecha_vencimiento_pago en los ciclos; si la cuenta por cobrar
// no la trae, una deuda nunca se considera vencida (se queda en PENDING).
const estaVencida = (deuda, now) => {
  const venc = deuda.fecha_vencimiento_pago;
  if (!venc) return false;
  const [y, m, d] = String(venc).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59) < now;
};

/**
 * @returns {{ level: string, debt: object|null, rejected: object|null, pendingCount: number }}
 *   `debt` es la deuda a pagar (la vencida si la hay); `rejected` el último pago rechazado.
 */
export const getFinanceStatus = (debts = [], payments = [], now = new Date()) => {
  const abiertas = debts.filter((d) => DEUDA_ABIERTA.includes(d.estado));
  const vencida = abiertas.find((d) => estaVencida(d, now)) || null;
  // Un rechazo solo es crítico mientras su deuda siga abierta; el historial
  // conserva rechazos viejos que el alumno ya resolvió pagando de nuevo.
  const idsAbiertas = new Set(abiertas.map((d) => d.id));
  const rechazado = payments.find((p) =>
    p.estado_validacion === 'RECHAZADO' && idsAbiertas.has(p.cuentas_por_cobrar?.id)
  ) || null;
  const enRevision = payments.some((p) => p.estado_validacion === 'PENDIENTE' || p.estado_validacion === 'POR_VALIDAR')
    || debts.some((d) => d.estado === 'POR_VALIDAR');

  let level = FINANCE_LEVEL.OK;
  if (vencida || rechazado) level = FINANCE_LEVEL.CRITICAL;
  else if (abiertas.length > 0) level = FINANCE_LEVEL.PENDING;
  else if (enRevision) level = FINANCE_LEVEL.REVIEW;

  return {
    level,
    debt: vencida || abiertas[0] || null,
    rejected: rechazado,
    pendingCount: abiertas.length,
  };
};
