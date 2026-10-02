import React from 'react';

/**
 * Título de pantalla: barra de acento + h1 a dos tonos (+ subtítulo opcional).
 *
 * Esta cadena de clases estaba repetida literalmente en 7 cabeceras de admin.
 * Lo que NO entra aquí es el layout que la rodea ni el botón de acción: cada
 * vista los compone distinto, y forzarlos habría cambiado el diseño.
 *
 * Los valores por defecto son los de la variante mayoritaria; las vistas que
 * divergen (AdminCashFlow con la barra grande, el expediente sin barra) pasan
 * sus clases exactas por props para no alterar ni un píxel.
 */
const PageTitle = ({
  title,
  accent,
  subtitle,
  showBar = true,
  barClassName = 'h-6 w-1 bg-brand-accent rounded-full',
  titleClassName = 'text-2xl font-black text-brand-heading uppercase tracking-tight italic',
  accentClassName = 'text-brand-primary',
  subtitleClassName = 'text-[10px] font-bold text-brand-muted uppercase tracking-widest italic ml-1',
  wrapperClassName = 'flex items-center gap-2 mb-1',
}) => (
  <>
    <div className={wrapperClassName}>
      {showBar && <div className={barClassName}></div>}
      <h1 className={titleClassName}>
        {title} <span className={accentClassName}>{accent}</span>
      </h1>
    </div>
    {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
  </>
);

export default PageTitle;
