import {
  getPublishCategoryGroups,
  PUBLIC_SERVICE_CATEGORIES,
  resolvePublishCategoryFromQuery,
  getServicePublishCopy,
  isPublishServiceCategory,
} from "./publish-categories";

describe("publish categories", () => {
  test("exposes service categories to every publisher group list", () => {
    const groups = getPublishCategoryGroups(false);
    const labels = groups.flatMap((group) =>
      group.options.map((option) => option.label)
    );

    expect(labels).toContain("וטרינרים");
    expect(labels).toContain("פנסיון");
    expect(labels).toContain("הסעות");
    expect(labels).not.toContain("חנות");
    expect(PUBLIC_SERVICE_CATEGORIES.some((c) => c.label === "וטרינרים")).toBe(
      true
    );
  });

  test("admin groups include store category", () => {
    const labels = getPublishCategoryGroups(true).flatMap((group) =>
      group.options.map((option) => option.label)
    );
    expect(labels).toContain("חנות");
  });

  test("resolves category from query slug", () => {
    expect(resolvePublishCategoryFromQuery({ slug: "boarding" })).toBe("פנסיון");
    expect(resolvePublishCategoryFromQuery({ category: "כלבים" })).toBe("כלבים");
  });

  test("service publish copy is branded per category", () => {
    const copy = getServicePublishCopy("וטרינרים");
    expect(copy.titlePlaceholder).toContain("וטרינרים");
    expect(copy.hint).toBeTruthy();
    expect(isPublishServiceCategory("וטרינרים")).toBe(true);
  });
});
