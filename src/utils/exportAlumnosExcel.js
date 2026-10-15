// Arma y descarga el Excel de alumnos (BL-013).
// Las llaves del JSON del backend son, tal cual, los encabezados de las columnas:
// el orden sale de la primera fila y no hay lista fija, asi que un campo nuevo del
// backend llega al archivo sin tocar este modulo.
export const exportAlumnosExcel = async (rows) => {
  // XLSX se carga con import() dentro del handler: son 870 kB (323 kB gzip) que solo
  // hacen falta al pulsar el botón de exportar, no al abrir la vista.
  const XLSX = await import('xlsx-js-style');

  // Union de llaves de todas las filas, conservando el orden de primera aparicion,
  // por si alguna fila no trae todas.
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  worksheet['!cols'] = headers.map((header) => ({
    wch: Math.min(
      Math.max(header.length, ...rows.map((row) => String(row[header] ?? '').length)) + 2,
      50
    ),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');
  XLSX.writeFile(workbook, `Reporte_Alumnos_${new Date().toISOString().split('T')[0]}.xlsx`);
};
