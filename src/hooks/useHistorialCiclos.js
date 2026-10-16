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

// BL-012: variante por mes (/inscripciones/alumno/:id/historial-ciclos/por-mes).
// Misma estrategia de caché/deduplicación, pero con clave alumno + mes + año.
const cachePorMes = new Map();
const enVueloPorMes = new Map();
const claveMes = (alumnoId, mes, anio) => `${alumnoId}:${mes ?? ''}:${anio ?? ''}`;

const pedirPorMes = (alumnoId, mes, anio) => {
  const clave = claveMes(alumnoId, mes, anio);
  if (cachePorMes.has(clave)) return Promise.resolve(cachePorMes.get(clave));
  if (enVueloPorMes.has(clave)) return enVueloPorMes.get(clave);

  const promesa = (async () => {
    const res = await apiFetch.get(API_ROUTES.INSCRIPCIONES.HISTORIAL_CICLOS_POR_MES(alumnoId, mes, anio));
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'No se pudo obtener el historial de ciclos');
    const data = result.data || null;
    cachePorMes.set(clave, data);
    return data;
  })().finally(() => {
    enVueloPorMes.delete(clave);
  });

  enVueloPorMes.set(clave, promesa);
  return promesa;
};

const borrarPorMes = (alumnoId) => {
  const prefijo = `${alumnoId}:`;
  for (const mapa of [cachePorMes, enVueloPorMes]) {
    for (const clave of [...mapa.keys()]) {
      if (clave.startsWith(prefijo)) mapa.delete(clave);
    }
  }
};

export const invalidarHistorialCiclos = (alumnoId) => {
  if (alumnoId === undefined) {
    cache.clear();
    enVuelo.clear();
    cachePorMes.clear();
    enVueloPorMes.clear();
    return;
  }
  cache.delete(alumnoId);
  enVuelo.delete(alumnoId);
  borrarPorMes(alumnoId);
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

/**
 * Historial de ciclos de un alumno para un mes concreto (BL-012).
 * `historial` es el objeto `data` del backend: { mes, anio, etiqueta_mes,
 * meses_disponibles, resumen_mes, ciclos, ... }. Mientras no se elija un mes
 * se pide el mes actual (mes y anio son obligatorios en el backend).
 */
export function useHistorialCiclosPorMes(alumnoId, { activo = true } = {}) {
  const [seleccion, setSeleccion] = useState(null);
  // El backend exige mes y anio: sin selección se parte del mes actual.
  // La selección pertenece a un alumno: si cambia el alumno vuelve al mes actual.
  const hoy = new Date();
  const mes = seleccion?.alumnoId === alumnoId ? seleccion.mes : hoy.getMonth() + 1;
  const anio = seleccion?.alumnoId === alumnoId ? seleccion.anio : hoy.getFullYear();
  const clave = claveMes(alumnoId, mes, anio);

  // Último resultado asentado de una petición (éxito o error). Lo que ya está en
  // caché se lee directo en el render, así no hay setState síncrono en el efecto.
  const [ultimo, setUltimo] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!activo || !alumnoId || cachePorMes.has(clave)) return;
    let vivo = true;

    pedirPorMes(alumnoId, mes, anio)
      .then((datos) => { if (vivo) setUltimo({ alumnoId, clave, datos, error: null }); })
      .catch((err) => {
        if (vivo) setUltimo((prev) => ({ alumnoId, clave, datos: prev?.alumnoId === alumnoId ? prev.datos : null, error: err }));
      });

    return () => { vivo = false; };
  }, [alumnoId, mes, anio, clave, activo, intento]);

  const enCache = cachePorMes.has(clave);
  const previo = ultimo?.alumnoId === alumnoId ? ultimo : null;
  // Mientras carga otro mes se conserva el anterior para que el selector no desaparezca.
  const historial = (enCache ? cachePorMes.get(clave) : null) ?? previo?.datos ?? null;
  const error = previo?.clave === clave ? previo.error : null;
  const loading = activo && !!alumnoId && !enCache && !error;

  const seleccionarMes = useCallback((nuevoMes, nuevoAnio) => {
    setSeleccion({ alumnoId, mes: nuevoMes, anio: nuevoAnio });
  }, [alumnoId]);

  const refetch = useCallback(() => {
    invalidarHistorialCiclos(alumnoId);
    setUltimo((prev) => prev && { ...prev, clave: null, error: null });
    setIntento((n) => n + 1);
  }, [alumnoId]);

  return { historial, loading, error, seleccionarMes, refetch };
}
