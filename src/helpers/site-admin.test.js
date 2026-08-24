import { isSiteAdminEmail, getSiteAdminEmails } from "./site-admin";

describe("site admin emails", () => {
  test("treats bronco.estd2024@gmail.com as admin regardless of casing", () => {
    expect(isSiteAdminEmail("Bronco.estd2024@gmail.com")).toBe(true);
    expect(isSiteAdminEmail("bronco.estd2024@gmail.com")).toBe(true);
    expect(getSiteAdminEmails().has("bronco.estd2024@gmail.com")).toBe(true);
  });

  test("does not treat other emails as site admin", () => {
    expect(isSiteAdminEmail("petzo.team@gmail.com")).toBe(false);
    expect(isSiteAdminEmail("someone@gmail.com")).toBe(false);
  });
});
