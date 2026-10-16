import { useEffect, useCallback, useRef } from 'react';
import { useFetch } from './useFetch';
import { notificacionService } from '../services/notificacion.service';

const POLL_MS = 300000;
const EMPTY = { lista: [], noLeidas: 0 };

/** Notificaciones del alumno: carga inicial, sondeo cada 5 min y marcar como leída. */
export function useStudentNotifications(userId) {
  const ultimo = useRef(EMPTY);

  const { data, setData, refetch } = useFetch(
    async () => {
      if (!userId) return EMPTY;
      try {
        const [lista, noLeidas] = await Promise.all([
          notificacionService.listar(),
          notificacionService.contarNoLeidas(),
        ]);
        ultimo.current = { lista, noLeidas };
      } catch (error) {
        // Sondeo de fondo: un fallo no debe tapar el dashboard con un toast
        // ni vaciar la campana; se conserva lo último que se cargó.
        console.error('Error notificaciones:', error);
      }
      return ultimo.current;
    },
    [userId],
    { initialData: EMPTY },
  );

  useEffect(() => {
    if (!userId) return undefined;
    const id = setInterval(refetch, POLL_MS);
    return () => clearInterval(id);
  }, [userId, refetch]);

  const markAsRead = useCallback(async (id) => {
    setData((prev) => {
      const next = {
        lista: prev.lista.map((n) => (n.id === id ? { ...n, leido: true } : n)),
        noLeidas: Math.max(0, prev.noLeidas - 1),
      };
      ultimo.current = next;
      return next;
    });
    try {
      await notificacionService.marcarLeida(id);
    } catch (error) {
      console.error(error);
    }
  }, [setData]);

  return { notifications: data.lista, unreadCount: data.noLeidas, markAsRead };
}
