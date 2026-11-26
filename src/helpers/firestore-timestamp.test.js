import { Timestamp } from "firebase/firestore";
import { toFirestoreTimestamp } from "./firestore-timestamp";

describe("toFirestoreTimestamp", () => {
  test("keeps Firestore Timestamp instances", () => {
    const stamp = Timestamp.fromDate(new Date("2026-01-15T12:00:00Z"));
    expect(toFirestoreTimestamp(stamp)).toBe(stamp);
  });

  test("accepts plain seconds objects", () => {
    const stamp = toFirestoreTimestamp({ seconds: 1700000000, nanoseconds: 5 });
    expect(stamp.seconds).toBe(1700000000);
    expect(stamp.nanoseconds).toBe(5);
  });

  test("accepts Date values", () => {
    const date = new Date("2026-06-01T10:00:00Z");
    const stamp = toFirestoreTimestamp(date);
    expect(stamp.toDate().toISOString()).toBe(date.toISOString());
  });

  test("falls back when value is missing", () => {
    const fallback = Timestamp.fromDate(new Date("2026-11-01T00:00:00Z"));
    expect(toFirestoreTimestamp(null, () => fallback)).toBe(fallback);
    expect(toFirestoreTimestamp(undefined, () => fallback)).toBe(fallback);
  });
});
