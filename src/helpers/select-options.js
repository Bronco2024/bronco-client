/**
 * Keep a controlled <select> submittable when the saved value is missing
 * from the current options list (renamed cities/breeds/categories).
 */
export const withCurrentOption = (options = [], value = "") => {
  const current = String(value || "").trim();
  if (!current) return options;
  if (options.some((option) => String(option) === current)) return options;
  return [current, ...options];
};

export const withCurrentSelectOption = (options = [], value = "", mapOption) => {
  const current = String(value || "").trim();
  if (!current) return options;
  const exists = options.some((option) => {
    const optionValue =
      typeof mapOption === "function" ? mapOption(option) : option?.value ?? option;
    return String(optionValue) === current;
  });
  if (exists) return options;
  if (typeof mapOption === "function") {
    return [mapOption(current), ...options];
  }
  return [{ value: current, label: current }, ...options];
};
