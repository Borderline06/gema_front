// Catálogo de merch. Hoy solo lo consume el checkout de matrícula; la sección
// global de Merch lo reutilizará, por eso vive fuera de los componentes.
// TODO: el precio sigue hardcodeado (antes estaba en el JSX de enrollment.jsx);
// moverlo al catálogo/parámetros cuando el backend lo exponga.
export const MERCH = {
  camiseta: { label: '¡Quiero mi camiseta!', price: 50 },
};
