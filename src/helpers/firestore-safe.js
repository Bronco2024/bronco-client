/** Strip undefined so Firestore setDoc/updateDoc does not throw. */
export const omitUndefinedFields = (value) => {
  if (Array.isArray(value)) {
    return value.map(omitUndefinedFields);
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    // Keep Firestore Timestamps / special objects as-is when they have toDate
    if (typeof value.toDate === "function") return value;

    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, omitUndefinedFields(v)])
    );
  }
  return value;
};
