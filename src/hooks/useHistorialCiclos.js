import { useCallback, useEffect, useState } from 'react';
import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * Historial académico de un alumno (/historial-academico/alumno/:id).
 *
 * StudentDetails e InscriptionsModal pedían este mismo endpoint por separado y
 * mantenían dos copias del array `ciclos` en estado local. Aquí hay una sola
 * fuente: la respuesta se cachea por alumno y las peticiones concurrentes se
 * deduplican, así que abrir el modal y luego el expediente del mismo alumno ya
 * no son dos llamadas.
 *
 * Tras una mutación que toque inscripciones hay que llamar a
 * `invalidarHistorialCiclos(alumnoId)` para que la próxima lectura vuelva a pedir.
 */
const cache = new Map();
const enVuelo = new Map();

const pedir = (alumnoId) => {
  if (cache.has(alumnoId)) return Promise.resolve(cache.get(alumnoId));
  if (enVuelo.has(alumnoId)) return enVuelo.get(alumnoId);

  const promesa = (async () => {
    const res = await apiFetch.get(API_ROUTES.HISTORIAL_ACADEMICO.ALUMNO(alumnoId));
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'No se pudo obtener el historial académico');
    const ciclos = result.data || [];
    cache.set(alumnoId, ciclos);
    return ciclos;
  })().finally(() => {
    enVuelo.delete(alumnoId);
  });

  enVuelo.set(alumnoId, promesa);
  return promesa;
};

export const invalidarHistorialCiclos = (alumnoId) => {
  if (alumnoId === undefined) {
    cache.clear();
    enVuelo.clear();
    return;
  }
  cache.delete(alumnoId);
  enVuelo.delete(alumnoId);
};

export function useHistorialCiclos(alumnoId, { activo = true } = {}) {
  const [ciclos, setCiclos] = useState(() => cache.get(alumnoId) || []);
  const [loading, setLoading] = useState(activo && !cache.has(alumnoId));
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    if (!alumnoId) return;
    setLoading(true);
    setError(null);
    try {
      const datos = await pedir(alumnoId);
      setCiclos(datos);
      return datos;
    } catch (err) {
      setError(err);
      setCiclos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [alumnoId]);

  useEffect(() => {
    if (!activo || !alumnoId) return;
    let vivo = true;

    if (cache.has(alumnoId)) {
      setCiclos(cache.get(alumnoId));
      setLoading(false);
      return;
    }

    setLoading(true);
    pedir(alumnoId)
      .then((datos) => { if (vivo) { setCiclos(datos); setError(null); } })
      .catch((err) => { if (vivo) { setError(err); setCiclos([]); } })
      .finally(() => { if (vivo) setLoading(false); });

    return () => { vivo = false; };
  }, [alumnoId, activo]);

  const refetch = useCallback(() => {
    invalidarHistorialCiclos(alumnoId);
    return cargar();
  }, [alumnoId, cargar]);

  return { ciclos, loading, error, refetch };
}
