import { useMemo, useState } from 'react';

/**
 * Paginación en cliente: estado de página + recorte de la lista.
 *
 * La misma pareja `Math.ceil(len / N)` + `.slice((page-1)*N, page*N)` estaba
 * triplicada en AdminScheduleManager, AdminStudentManager y DashboardOperations,
 * cada una con su tamaño de página.
 *
 * Deliberadamente NO incluye la UI: los tres paginadores se ven distintos (uno
 * con números y elipsis, dos con solo prev/next) y unificarlos cambiaría el
 * diseño de dos pantallas. Aquí se comparte la lógica, no el aspecto.
 *
 * `totalPages` se deja como `Math.ceil` sin forzar un mínimo de 1: con la lista
 * vacía vale 0, que es justo lo que esperan los tres llamadores para no pintar
 * el paginador.
 */
export function usePagination(items = [], perPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / perPage);

  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * perPage, currentPage * perPage),
    [items, currentPage, perPage]
  );

  return { currentPage, setCurrentPage, totalPages, pageItems };
}
