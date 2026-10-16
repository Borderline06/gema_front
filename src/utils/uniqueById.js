/** Quita elementos repetidos por `id`, conservando el primero y el orden original. */
export const uniqueById = (items = []) => {
  const vistos = new Set();
  return items.filter((item) => {
    if (vistos.has(item.id)) return false;
    vistos.add(item.id);
    return true;
  });
};
