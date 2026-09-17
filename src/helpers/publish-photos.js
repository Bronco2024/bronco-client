/** Pure helpers for selecting / editing photos before publish. */

export const MAX_PUBLISH_PHOTOS = 12;

export const appendPublishPhotos = (currentPhotos = [], incomingFiles = [], max = MAX_PUBLISH_PHOTOS) => {
  const current = Array.isArray(currentPhotos) ? currentPhotos : [];
  const incoming = Array.from(incomingFiles || []).filter(Boolean);
  if (!incoming.length) return current;

  const room = Math.max(0, max - current.length);
  if (room === 0) return current;
  return [...current, ...incoming.slice(0, room)];
};

export const removePublishPhotoAt = (currentPhotos = [], index) => {
  const current = Array.isArray(currentPhotos) ? currentPhotos : [];
  if (index < 0 || index >= current.length) return current;
  return current.filter((_, i) => i !== index);
};

/** Clamp cover index after add/remove. */
export const clampCoverPhotoIndex = (coverIndex = 0, photoCount = 0) => {
  if (photoCount <= 0) return 0;
  const idx = Number.isFinite(coverIndex) ? Math.floor(coverIndex) : 0;
  return Math.min(Math.max(0, idx), photoCount - 1);
};

/**
 * Put the chosen cover photo first so listing cards / gallery default to it.
 * photos[0] is the display image across the site.
 */
export const orderPhotosWithCoverFirst = (photos = [], coverIndex = 0) => {
  const list = Array.isArray(photos) ? [...photos] : [];
  if (list.length <= 1) return list;
  const idx = clampCoverPhotoIndex(coverIndex, list.length);
  if (idx === 0) return list;
  const [cover] = list.splice(idx, 1);
  return [cover, ...list];
};
