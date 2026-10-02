import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Encapsula el patrón fetch + loading + error + toast que se repetía
 * inline en cada página: ejecuta `fetcher` al montar (y cuando cambie
 * algo en `deps`, igual que un useEffect normal) y expone refetch()
 * para volver a llamarlo tras un create/update/delete.
 *
 * IMPORTANTE — en `deps` pasa SOLO primitivas (strings, números, booleanos).
 * `refetch` es un useCallback sobre `deps` y el useEffect de abajo depende de
 * `refetch`, así que un objeto, array o función creada en el render cambia de
 * identidad en cada render y el efecto entra en BUCLE INFINITO de peticiones.
 * Si necesitas pasar algo compuesto, estabilízalo antes con useMemo/useCallback
 * o deriva una primitiva (p. ej. `alumno.id` en vez de `alumno`).
 */
export function useFetch(fetcher, deps = [], { initialData = null, errorMessage } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      toast.error(errorMessage || err.message || 'Ocurrió un error al cargar los datos');
      return undefined;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, setData, loading, error, refetch };
}
