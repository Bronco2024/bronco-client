import {
  appendPublishPhotos,
  removePublishPhotoAt,
  clampCoverPhotoIndex,
  orderPhotosWithCoverFirst,
  MAX_PUBLISH_PHOTOS,
} from "./publish-photos";

describe("publish photos helpers", () => {
  test("appends new files without replacing existing ones", () => {
    const existing = [{ name: "a.jpg" }, { name: "b.jpg" }];
    const next = appendPublishPhotos(existing, [{ name: "c.jpg" }]);
    expect(next.map((f) => f.name)).toEqual(["a.jpg", "b.jpg", "c.jpg"]);
  });

  test("respects max photo count", () => {
    const existing = Array.from({ length: MAX_PUBLISH_PHOTOS }, (_, i) => ({
      name: `${i}.jpg`,
    }));
    const next = appendPublishPhotos(existing, [{ name: "extra.jpg" }]);
    expect(next).toHaveLength(MAX_PUBLISH_PHOTOS);
  });

  test("removes a photo by index", () => {
    const photos = [{ name: "a.jpg" }, { name: "b.jpg" }, { name: "c.jpg" }];
    expect(removePublishPhotoAt(photos, 1).map((f) => f.name)).toEqual([
      "a.jpg",
      "c.jpg",
    ]);
  });

  test("clamps cover index", () => {
    expect(clampCoverPhotoIndex(5, 3)).toBe(2);
    expect(clampCoverPhotoIndex(-1, 3)).toBe(0);
    expect(clampCoverPhotoIndex(1, 0)).toBe(0);
  });

  test("orders chosen cover photo first", () => {
    const photos = ["a", "b", "c"];
    expect(orderPhotosWithCoverFirst(photos, 2)).toEqual(["c", "a", "b"]);
    expect(orderPhotosWithCoverFirst(photos, 0)).toEqual(["a", "b", "c"]);
  });
});
