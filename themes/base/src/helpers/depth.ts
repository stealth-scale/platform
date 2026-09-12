/**
 * Builds the corner scale and the elevation scale. Both are semantic in Chakra's own theme, so both
 * have to be stated as semantic tokens: a raw value under the same name is shadowed by the semantic
 * one and changes nothing a reader can see.
 */

import { type ThemingConfig } from "@chakra-ui/react";

/**
 * Names the semantic shape a radius category takes, read off Chakra's own theme config.
 */
type SemanticRadii = NonNullable<NonNullable<ThemingConfig["semanticTokens"]>["radii"]>;

/**
 * Names the semantic shape a shadow category takes.
 */
type SemanticShadows = NonNullable<NonNullable<ThemingConfig["semanticTokens"]>["shadows"]>;

/**
 * Holds how much of the largest corner each step takes.
 *
 * Three steps and not more: `l1` is what a control rounds by, `l2` what a group of controls does,
 * `l3` what a card does. A card has to be visibly rounder than the control inside it or it stops
 * reading as containing it, which is the whole job of the scale.
 */
const CORNERS: ReadonlyArray<readonly [name: string, share: number]> = [
  ["l1", 0.5],
  ["l2", 0.75],
  ["l3", 1],
];

/**
 * Holds every elevation against how far it is lifted and how far the shadow spreads.
 *
 * Both grow together: a thing further from the page casts a shadow that is both lower and softer,
 * and moving only one of them reads as a sticker rather than as height.
 */
const HEIGHTS: ReadonlyArray<readonly [name: string, offset: number, blur: number, alpha: number]> =
  [
    ["xs", 1, 2, 0.05],
    ["sm", 2, 4, 0.06],
    ["md", 4, 8, 0.08],
    ["lg", 8, 16, 0.1],
    ["xl", 16, 28, 0.12],
    ["2xl", 24, 48, 0.16],
  ];

/**
 * Builds the corner scale from the roundest corner a theme uses.
 *
 * @param largest - The corner a card rounds by, as a CSS length.
 * @returns The three steps Chakra's own components round by.
 */
export function corners(largest: string): SemanticRadii {
  return Object.fromEntries(
    CORNERS.map(([name, share]) => [
      name,
      { value: share === 1 ? largest : `calc(${largest} * ${String(share)})` },
    ]),
  );
}

/**
 * Builds the elevation scale.
 *
 * The ink is the theme's own rather than neutral black, so a shadow on a warm page is a warm
 * shadow. In the dark mode it is black and roughly three times as strong: the same shadow that
 * reads as depth on paper is invisible against a near-black page.
 *
 * @param hue - The shadow ink's hue, in degrees. The theme's neutral hue is the one that belongs.
 * @param depth - How much ink every shadow carries against the default weight. Below 1 is flatter,
 *   which suits a dense screen showing many surfaces at once.
 * @returns Every elevation, per colour mode.
 */
export function heights(hue: number, depth = 1): SemanticShadows {
  /**
   * Writes one shadow.
   *
   * @param height - The step, as `HEIGHTS` holds it.
   * @param weight - How much the mode multiplies the ink by.
   * @param lightness - The ink's lightness.
   * @returns The shadow, as CSS writes it.
   */
  function cast(
    height: readonly [string, number, number, number],
    weight: number,
    lightness: number,
  ): string {
    const [, offset, blur, alpha] = height;
    const ink = `oklch(${String(lightness)}% 0.02 ${String(hue)} / ${(alpha * weight * depth).toFixed(3)})`;
    return `0 ${String(offset)}px ${String(blur)}px ${ink}`;
  }

  return Object.fromEntries(
    HEIGHTS.map((height) => [
      height[0],
      { value: { _dark: cast(height, 3, 0), _light: cast(height, 1, 20) } },
    ]),
  );
}
