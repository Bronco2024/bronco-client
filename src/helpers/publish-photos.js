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
