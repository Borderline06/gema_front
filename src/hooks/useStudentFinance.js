import { useMemo } from 'react';
import { useFetch } from './useFetch';
import { pagosService } from '../services/pagos.service';
import { getFinanceStatus } from '../utils/financeAlert';

const EMPTY = { debts: [], payments: [] };

/** Resumen financiero del alumno ya clasificado por nivel de urgencia. */
export function useStudentFinance(userId) {
  const { data, loading } = useFetch(
    async () => (userId ? pagosService.getResumenFinanciero(userId) : EMPTY),
    [userId],
    { errorMessage: 'No se pudo cargar tu estado de pagos' },
  );

  const status = useMemo(
    () => getFinanceStatus(data?.debts, data?.payments),
    [data],
  );

  return { ...status, loading };
}
