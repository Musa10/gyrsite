import { describe, it, expect } from "vitest";
import { pickLocalized } from "./pick-localized";

describe("pickLocalized", () => {
  it("returns English for the en locale", () => {
    expect(pickLocalized("Hello", "مرحبا", "en")).toBe("Hello");
  });

  it("returns Arabic for the ar locale when present", () => {
    expect(pickLocalized("Hello", "مرحبا", "ar")).toBe("مرحبا");
  });

  it("falls back to English when Arabic is null", () => {
    expect(pickLocalized("Hello", null, "ar")).toBe("Hello");
  });

  it("falls back to English when Arabic is empty/whitespace", () => {
    expect(pickLocalized("Hello", "   ", "ar")).toBe("Hello");
  });

  it("handles JSON body values (objects) for ar", () => {
    const en = { type: "doc", en: true };
    const ar = { type: "doc", ar: true };
    expect(pickLocalized(en, ar, "ar")).toBe(ar);
  });

  it("falls back to English JSON when Arabic JSON is null", () => {
    const en = { type: "doc" };
    expect(pickLocalized(en, null, "ar")).toBe(en);
  });
});
