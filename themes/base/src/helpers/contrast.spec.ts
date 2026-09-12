import { describe, expect, it } from "vite-plus/test";

import { ramp, roles } from "#helpers/color.ts";
import { contrast, luminance, readable } from "#helpers/contrast.ts";
import { entryAt, textOf, valueAt } from "#testing.ts";

/**
 * Holds white and black as this design system writes them.
 */
const WHITE = "oklch(100.0% 0.0000 0.0)";

/**
 * Holds black.
 */
const BLACK = "oklch(0.0% 0.0000 0.0)";

/**
 * Reads the step a role points at, as `roles` writes the reference.
 */
function stepOf(name: string, condition: string): string {
  return entryAt(roles("primary"), name, condition).replaceAll(/^\{colors\.primary\.|\}$/gu, "");
}

/**
 * Measures the label against the fill for one palette in one colour mode.
 */
function onFill(hue: number, chroma: number, condition: string): number {
  const palette = ramp(hue, chroma);
  return contrast(
    valueAt(palette, stepOf("contrast", condition)),
    valueAt(palette, stepOf("solid", condition)),
  );
}

/**
 * Lists every theme in the repository, so none of them can drift below the line unnoticed.
 */
const THEMES: ReadonlyArray<readonly [name: string, hue: number, chroma: number]> = [
  ["base", 258, 0.19],
  ["forge", 45, 0.17],
  ["fathom", 185, 0.12],
  ["folio", 295, 0.2],
];

describe("luminance", () => {
  it("answers the ends of the scale", () => {
    expect(luminance(WHITE)).toBeCloseTo(1, 3);
    expect(luminance(BLACK)).toBeCloseTo(0, 3);
  });

  it("reads the four ways a colour reaches it", () => {
    // A theme writes the first. A browser hands back the second for the same colour, and the
    // fourth for anything that started as the third. All four have to measure the same, or a
    // page reporting a ratio disagrees with the specification asserting it.
    expect(luminance("oklch(100.0% 0.0000 0.0)")).toBeCloseTo(1, 3);
    expect(luminance("oklch(1 0 0)")).toBeCloseTo(1, 3);
    expect(luminance("#ffffff")).toBeCloseTo(1, 3);
    expect(luminance("rgb(255, 255, 255)")).toBeCloseTo(1, 3);
  });

  it("reads a short hex as the pairs it stands for", () => {
    expect(luminance("#fff")).toBeCloseTo(luminance("#ffffff"), 6);
    expect(luminance("#f00")).toBeCloseTo(luminance("#ff0000"), 6);
  });

  it("reads the space-separated `rgb()` a browser may serialise", () => {
    expect(luminance("rgb(255 255 255 / 1)")).toBeCloseTo(1, 3);
  });

  it("answers `NaN` for a colour it has no reader for", () => {
    expect(luminance("rebeccapurple")).toBeNaN();
    expect(luminance("var(--scale-colors-red-500)")).toBeNaN();
  });
});

describe("contrast", () => {
  it("measures the widest pair there is", () => {
    expect(contrast(WHITE, BLACK)).toBeCloseTo(21, 2);
  });

  it("measures a colour against itself as no contrast at all", () => {
    expect(contrast(WHITE, WHITE)).toBeCloseTo(1, 4);
  });

  it("does not care which colour is in front", () => {
    expect(contrast(WHITE, BLACK)).toBeCloseTo(contrast(BLACK, WHITE), 6);
  });

  it("answers `NaN` where either colour cannot be read", () => {
    expect(contrast("rebeccapurple", WHITE)).toBeNaN();
  });

  it("measures the same pair however each colour is written", () => {
    const target = contrast("#ef4444", "#ffffff");

    expect(contrast("rgb(239, 68, 68)", "oklch(100% 0 0)")).toBeCloseTo(target, 2);
    expect(contrast("#EF4444", "rgb(255 255 255)")).toBeCloseTo(target, 6);
  });

  it("agrees with the figure WCAG publishes for a known pair", () => {
    // #767676 on white is the canonical example of a pair that just clears AA.
    expect(contrast("#767676", "#ffffff")).toBeCloseTo(4.54, 1);
  });
});

describe("readable", () => {
  it("holds a pair to the level it was asked for", () => {
    const mid = "oklch(52.0% 0.1862 258.0)";

    expect(readable(WHITE, mid)).toBe(true);
    expect(readable(WHITE, mid, "AAA")).toBe(false);
  });

  it("clears nothing for a colour that cannot be read", () => {
    expect(readable("rebeccapurple", WHITE)).toBe(false);
  });

  it("holds white against white to no contrast, whichever way each is written", () => {
    expect(readable("#fff", WHITE)).toBe(false);
  });
});

describe("every theme’s primary", () => {
  it("carries a readable label in both colour modes", () => {
    const failing = THEMES.flatMap(([name, hue, chroma]) =>
      [
        ["light", onFill(hue, chroma, "base")],
        ["dark", onFill(hue, chroma, "_dark")],
      ]
        .filter(([, ratio]) => Number(ratio) < 4.5)
        .map(([mode, ratio]) => `${name} ${textOf(mode)}: ${Number(ratio).toFixed(2)}`),
    );

    expect(failing).toEqual([]);
  });
});
