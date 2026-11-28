import { ensureCheckoutUser } from "./checkout-auth";

jest.mock("../firebase", () => ({
  auth: { currentUser: null },
}));

jest.mock("firebase/auth", () => ({
  signInAnonymously: jest.fn(),
}));

const { auth } = require("../firebase");
const { signInAnonymously } = require("firebase/auth");

describe("ensureCheckoutUser", () => {
  beforeEach(() => {
    auth.currentUser = null;
    signInAnonymously.mockReset();
  });

  test("returns existing signed-in user without anonymous sign-in", async () => {
    const user = { uid: "u1", isAnonymous: false };
    auth.currentUser = user;
    await expect(ensureCheckoutUser()).resolves.toBe(user);
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  test("signs in anonymously when no user is present", async () => {
    const guest = { uid: "anon-1", isAnonymous: true };
    signInAnonymously.mockResolvedValue({ user: guest });
    await expect(ensureCheckoutUser()).resolves.toBe(guest);
    expect(signInAnonymously).toHaveBeenCalledWith(auth);
  });
});
