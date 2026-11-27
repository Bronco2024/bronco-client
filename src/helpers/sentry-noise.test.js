import {
  isFirestoreConnectionNoise,
  isExpectedAuthNoise,
} from "./sentry-noise";

describe("isExpectedAuthNoise", () => {
  test("filters auth/invalid-credential from Login mistakes", () => {
    expect(
      isExpectedAuthNoise(
        {
          code: "auth/invalid-credential",
          message: "Firebase: Error (auth/invalid-credential).",
        },
        null
      )
    ).toBe(true);
  });

  test("keeps unexpected auth config errors", () => {
    expect(
      isExpectedAuthNoise(
        { code: "auth/invalid-api-key", message: "bad key" },
        null
      )
    ).toBe(false);
  });
});

describe("isFirestoreConnectionNoise", () => {
  test("filters FirebaseError Connection failed from webchannel", () => {
    const error = { name: "FirebaseError", message: "Connection failed." };
    const event = {
      exception: {
        values: [
          {
            type: "FirebaseError",
            value: "Connection failed.",
            stacktrace: {
              frames: [
                {
                  filename:
                    "../node_modules/@firebase/firestore/src/platform/browser/webchannel_connection.ts",
                },
              ],
            },
          },
        ],
      },
    };

    expect(isFirestoreConnectionNoise(error, event)).toBe(true);
  });

  test("filters offline client messages", () => {
    expect(
      isFirestoreConnectionNoise(
        { message: "Failed to get document because the client is offline." },
        null
      )
    ).toBe(true);
  });

  test("does not filter unrelated Firebase errors", () => {
    expect(
      isFirestoreConnectionNoise(
        {
          name: "FirebaseError",
          message: "Missing or insufficient permissions.",
          code: "permission-denied",
        },
        null
      )
    ).toBe(false);
  });
});
