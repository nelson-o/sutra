import { describe, expect, it } from "vitest";
import sutra from "../data/sutra/diamond-sutra/sanskrit-devanagari.txt?raw";
import { createSutraPages } from "./sutra";

describe("sutra data integrity", () => {
  it("contains exactly 32 ordered Devanagari marker pages", () => {
    const pages = createSutraPages(sutra);

    expect(pages).toHaveLength(32);
    expect(pages.map((page) => page.markerNumber)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1)
    );
    expect(pages[0]?.marker).toBe("॥१॥");
    expect(pages.at(-1)?.marker).toBe("॥३२॥");
    expect(pages.every((page) => page.passages.length > 0)).toBe(true);
  });
});
