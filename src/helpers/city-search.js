/** Normalize Hebrew city names for typeahead search. */
export const normalizeCityQuery = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['׳`"״]/g, "")
    .replace(/[־–—-]/g, "")
    .replace(/\s+/g, "");

export const filterCitiesByQuery = (cities = [], query = "", limit = 80) => {
  const q = normalizeCityQuery(query);
  if (!q) return (cities || []).slice(0, limit);
  const starts = [];
  const contains = [];
  for (const city of cities || []) {
    const n = normalizeCityQuery(city);
    if (!n) continue;
    if (n.startsWith(q)) starts.push(city);
    else if (n.includes(q)) contains.push(city);
  }
  return [...starts, ...contains].slice(0, limit);
};
