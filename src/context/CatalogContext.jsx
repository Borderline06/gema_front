import React, { useCallback, useRef, useState } from 'react';
import { CatalogContext, CATALOG_LOADERS } from './catalogStore';

/**
 * Caché de catálogos por sesión.
 *
 * El problema que resuelve: sedes se pedía en 6 archivos, horarios en 5 y
 * niveles en 4, cada vista repitiendo la misma petición al entrar. Aquí cada
 * catálogo se descarga UNA vez y se comparte; las peticiones concurrentes se
 * deduplican con `enVuelo`, así que si dos componentes montan a la vez solo
 * sale una llamada.
 *
 * Son datos que cambian de mes en mes, no de minuto en minuto. Cuando una vista
 * los modifica (crear o editar una sede, por ejemplo) debe llamar a
 * `refrescar(nombre)` para invalidar su entrada.
 */
export const CatalogProvider = ({ children }) => {
  const [catalogos, setCatalogos] = useState({});
  const [errores, setErrores] = useState({});
  // Promesas en curso, para que N consumidores simultaneos no disparen N peticiones.
  const enVuelo = useRef({});

  const cargar = useCallback(async (nombre) => {
    if (!CATALOG_LOADERS[nombre]) throw new Error(`Catálogo desconocido: ${nombre}`);
    if (enVuelo.current[nombre]) return enVuelo.current[nombre];

    const promesa = CATALOG_LOADERS[nombre]()
      .then((datos) => {
        setCatalogos((prev) => ({ ...prev, [nombre]: datos }));
        setErrores((prev) => ({ ...prev, [nombre]: null }));
        return datos;
      })
      .catch((err) => {
        // Se guarda el error para que la vista pueda avisar al usuario en vez de
        // quedarse con un select vacío y sin explicación. Se cachea [] para no
        // reintentar en bucle.
        setErrores((prev) => ({ ...prev, [nombre]: err }));
        setCatalogos((prev) => ({ ...prev, [nombre]: [] }));
        return [];
      })
      .finally(() => {
        delete enVuelo.current[nombre];
      });

    enVuelo.current[nombre] = promesa;
    return promesa;
  }, []);

  const refrescar = useCallback(
    (nombre) => {
      delete enVuelo.current[nombre];
      setCatalogos((prev) => {
        const siguiente = { ...prev };
        delete siguiente[nombre];
        return siguiente;
      });
      return cargar(nombre);
    },
    [cargar]
  );

  return (
    <CatalogContext.Provider value={{ catalogos, errores, cargar, refrescar }}>
      {children}
    </CatalogContext.Provider>
  );
};
