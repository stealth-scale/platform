import { describe, expect, it } from "vite-plus/test";

import { textScale, typeScale } from "#helpers/type.ts";
import { type Block, entryAt, numberOf, valueAt } from "#testing.ts";

/**
 * Reads one property off one named text style. A style's body is a bag of properties, which is the
 * same shape a token written per colour mode has.
 */
function styleAt(styles: Block, name: string, property: string): string {
  return entryAt(styles, name, property);
}

describe("typeScale", () => {
  it("names every step Chakra names", () => {
    expect(Object.keys(typeScale())).toEqual([
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
      "5xl",
      "6xl",
      "7xl",
      "8xl",
      "9xl",
    ]);
  });

  it("sets body text at exactly the size it was given", () => {
    expect(numberOf(valueAt(typeScale(1.0625), "md"))).toBeCloseTo(1.0625, 4);
  });

  it("climbs without turning back", () => {
    const sizes = Object.values(typeScale()).map((step) => numberOf(step?.value));

    expect(sizes).toEqual(sizes.toSorted((first, second) => first - second));
  });

  it("spreads further at a wider ratio", () => {
    const tight = numberOf(valueAt(typeScale(1, 1.125), "4xl"));
    const wide = numberOf(valueAt(typeScale(1, 1.25), "4xl"));

    expect(wide).toBeGreaterThan(tight);
  });
});

describe("textScale", () => {
  it("covers the same steps as the sizes", () => {
    expect(Object.keys(textScale())).toEqual(Object.keys(typeScale()));
  });

  it("sets each style at the size the scale gives that step", () => {
    const sizes = typeScale(1.0625, 1.25);
    const styles = textScale(1.0625, 1.25);
    const drifted = Object.keys(styles).filter(
      (name) => styleAt(styles, name, "fontSize") !== valueAt(sizes, name),
    );

    expect(drifted).toEqual([]);
  });

  it("leads large text tighter than small text", () => {
    const styles = textScale();

    expect(Number(styleAt(styles, "6xl", "lineHeight"))).toBeLessThan(
      Number(styleAt(styles, "sm", "lineHeight")),
    );
  });

  it("tracks large text tighter than small text, in three bands", () => {
    const styles = textScale();

    expect(styleAt(styles, "6xl", "letterSpacing")).toBe("-0.02em");
    expect(styleAt(styles, "xl", "letterSpacing")).toBe("-0.01em");
    expect(styleAt(styles, "sm", "letterSpacing")).toBe("0em");
  });

  it("leads the display sizes tighter than the largest band", () => {
    const styles = textScale();

    expect(Number(styleAt(styles, "9xl", "lineHeight"))).toBeLessThan(
      Number(styleAt(styles, "2xl", "lineHeight")),
    );
  });
});
