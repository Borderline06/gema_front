import { useState, useEffect, useMemo } from 'react';
import { useFetch } from './useFetch';
import { asistenciaService } from '../services/asistencia.service';
import recuperacionService from '../services/recuperacion.service';
import { inscripcionService } from '../services/inscripcion.service';
import { buildSesiones, partitionAgenda, getNextClass, filtrarAsistenciasVigentes } from '../utils/studentAgenda';

const REFRESCO_RELOJ_MS = 60000;

/**
 * Agenda del alumno lista para pintar: una sola petición por recurso, sesiones
 * normalizadas y separadas en próximas / pasadas. Es la única fuente de datos
 * de hero, lista de clases y calendario.
 *
 * El reloj interno avanza cada minuto para que una clase pase de "próxima" a
 * "pasada" (y el hero cambie de clase) sin recargar la página.
 */
export function useStudentAgenda(userId) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REFRESCO_RELOJ_MS);
    return () => clearInterval(id);
  }, []);

  const { data, loading, refetch } = useFetch(
    async () => {
      if (!userId) return { asistencias: [], recuperaciones: [] };
      // Si las recuperaciones o las inscripciones fallan, la agenda regular debe
      // seguir viéndose (sin filtrar, en el segundo caso).
      const [asistencias, recuperaciones, inscripciones] = await Promise.all([
        asistenciaService.getHistorialAlumno(userId),
        recuperacionService.obtenerHistorial().catch(() => []),
        inscripcionService.listarPorAlumno(userId).catch((error) => {
          console.error('No se pudieron cargar las inscripciones:', error);
          return null;
        }),
      ]);
      return {
        asistencias: filtrarAsistenciasVigentes(asistencias, inscripciones),
        recuperaciones: recuperaciones || [],
      };
    },
    [userId],
    { errorMessage: 'No se pudo cargar tu agenda' },
  );

  const sesiones = useMemo(
    () => (data ? buildSesiones(data.asistencias, data.recuperaciones) : []),
    [data],
  );

  const { proximas, pasadas } = useMemo(() => partitionAgenda(sesiones, now), [sesiones, now]);
  const nextClass = useMemo(() => getNextClass(proximas), [proximas]);

  return { sesiones, proximas, pasadas, nextClass, now, loading, refetch };
}
