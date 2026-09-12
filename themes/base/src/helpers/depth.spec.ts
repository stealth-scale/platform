import { describe, expect, it } from "vite-plus/test";

import { corners, heights } from "#helpers/depth.ts";
import { conditionsIn, DARK, entryAt, LIGHT, MODES, valueAt } from "#testing.ts";

/**
 * Reads the alpha out of the ink in a shadow.
 */
function alphaOf(shadow: string): number {
  return Number(/\/ (?<alpha>[\d.]+)\)/u.exec(shadow)?.groups?.["alpha"] ?? Number.NaN);
}

/**
 * Reads one elevation in one colour mode.
 */
function shadowAt(step: string, mode: string, hue = 262, depth = 1): string {
  return entryAt(heights(hue, depth), step, mode);
}

describe("corners", () => {
  it("writes the three steps Chakra rounds by", () => {
    expect(Object.keys(corners("1rem"))).toEqual(["l1", "l2", "l3"]);
  });

  it("gives the largest step exactly the corner it was asked for", () => {
    expect(valueAt(corners("1rem"), "l3")).toBe("1rem");
  });

  it("rounds a control less than a card", () => {
    expect(valueAt(corners("1rem"), "l1")).toContain("* 0.5");
  });
});

describe("heights", () => {
  it("writes every elevation", () => {
    expect(Object.keys(heights(262))).toEqual(["xs", "sm", "md", "lg", "xl", "2xl"]);
  });

  it("gives each elevation both colour modes", () => {
    expect(conditionsIn(heights(262))).toEqual(MODES.toSorted());
  });

  it("drops the shadow lower and softer the higher it goes", () => {
    expect(shadowAt("2xl", LIGHT)).toContain("24px 48px");
    expect(shadowAt("xs", LIGHT)).toContain("1px 2px");
  });

  it("inks the shadow in the theme’s own hue", () => {
    expect(shadowAt("md", LIGHT, 70)).toContain(" 70 /");
  });

  it("carries more ink in the dark, where the same shadow is invisible", () => {
    expect(alphaOf(shadowAt("md", DARK))).toBeGreaterThan(alphaOf(shadowAt("md", LIGHT)));
  });

  it("thins every shadow together when the theme draws flatter", () => {
    expect(alphaOf(shadowAt("lg", LIGHT, 262, 0.5))).toBeCloseTo(
      alphaOf(shadowAt("lg", LIGHT)) / 2,
      4,
    );
  });
});
