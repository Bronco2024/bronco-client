/** Client-side image shrink before Firebase Storage upload. */

export const COMPRESS_MAX_EDGE = 1600;
export const COMPRESS_QUALITY = 0.82;
export const COMPRESS_SKIP_UNDER_BYTES = 350 * 1024;

const loadImageFromFile = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error || new Error("image load failed"));
    };
    img.src = url;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

/**
 * Resize/compress a photo File for faster Storage uploads.
 * Returns the original file when compression is unnecessary or fails.
 */
export const compressImageForUpload = async (
  file,
  {
    maxEdge = COMPRESS_MAX_EDGE,
    quality = COMPRESS_QUALITY,
    skipUnderBytes = COMPRESS_SKIP_UNDER_BYTES,
  } = {}
) => {
  if (!file || !file.type?.startsWith("image/")) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  if (typeof file.size === "number" && file.size > 0 && file.size <= skipUnderBytes) {
    return file;
  }

  try {
    const img = await loadImageFromFile(file);
    const longest = Math.max(img.width || 0, img.height || 0);
    if (!longest) return file;

    const scale = longest > maxEdge ? maxEdge / longest : 1;
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    if (scale >= 1 && file.size <= skipUnderBytes * 2) {
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const outputType =
      file.type === "image/png" || file.type === "image/webp"
        ? file.type
        : "image/jpeg";
    const blob = await canvasToBlob(canvas, outputType, quality);
    if (!blob || blob.size >= file.size) return file;

    const name =
      outputType === file.type
        ? file.name
        : String(file.name || "photo").replace(/\.\w+$/, "") + ".jpg";

    return new File([blob], name, {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch (_error) {
    return file;
  }
};

export const compressImagesForUpload = async (files = [], options) => {
  const list = Array.from(files || []).filter(Boolean);
  return Promise.all(list.map((file) => compressImageForUpload(file, options)));
};
