import { withCurrentOption, withCurrentSelectOption } from "./select-options";

describe("withCurrentOption", () => {
  test("appends orphan value so the select stays valid", () => {
    expect(withCurrentOption(["תל אביב", "חיפה"], "סחנין")).toEqual([
      "סחנין",
      "תל אביב",
      "חיפה",
    ]);
  });

  test("keeps list unchanged when value already exists", () => {
    expect(withCurrentOption(["סחנין", "חיפה"], "סחנין")).toEqual([
      "סחנין",
      "חיפה",
    ]);
  });
});

describe("withCurrentSelectOption", () => {
  test("adds orphan object option", () => {
    expect(
      withCurrentSelectOption(
        [{ value: "dogs", label: "כלבים" }],
        "legacy",
        (value) =>
          typeof value === "string"
            ? { value, label: value }
            : value
      )
    ).toEqual([
      { value: "legacy", label: "legacy" },
      { value: "dogs", label: "כלבים" },
    ]);
  });
});
