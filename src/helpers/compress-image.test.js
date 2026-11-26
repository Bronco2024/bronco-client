import { compressImageForUpload, COMPRESS_SKIP_UNDER_BYTES } from "./compress-image";

describe("compressImageForUpload", () => {
  test("passes through non-image files", async () => {
    const file = new File(["x"], "note.txt", { type: "text/plain" });
    await expect(compressImageForUpload(file)).resolves.toBe(file);
  });

  test("skips already-small images without canvas work", async () => {
    const file = new File([new Uint8Array(100)], "tiny.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(file, "size", { value: COMPRESS_SKIP_UNDER_BYTES - 10 });
    await expect(compressImageForUpload(file)).resolves.toBe(file);
  });
});
