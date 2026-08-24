import { omitUndefinedFields } from "./firestore-safe";

describe("omitUndefinedFields", () => {
  test("removes undefined keys", () => {
    expect(
      omitUndefinedFields({
        title: "וטרינר",
        breed: undefined,
        price: "",
        animals: ["כלבים"],
      })
    ).toEqual({
      title: "וטרינר",
      price: "",
      animals: ["כלבים"],
    });
  });

  test("keeps null and dates", () => {
    const date = new Date("2026-01-01");
    expect(omitUndefinedFields({ video: null, createdAt: date })).toEqual({
      video: null,
      createdAt: date,
    });
  });
});
