/**
 * What a theme built on this one gets to save it typing. Everything here returns Chakra's own token
 * shapes, so what surrounds a call is ordinary `defineConfig` and Chakra's documentation is the
 * documentation for it.
 */

import { type ThemingConfig } from "@chakra-ui/react";

/**
 * Names the token shape a colour category takes, read off Chakra's own theme config rather than
 * described again here.
 */
type Colors = NonNullable<NonNullable<ThemingConfig["tokens"]>["colors"]>;

/**
 * Names the semantic token shape a colour category takes, in the same way.
 */
type SemanticColors = NonNullable<NonNullable<ThemingConfig["semanticTokens"]>["colors"]>;

/**
 * Holds each step of a palette against how light it is and how much colour it keeps.
 *
 * The ends stop short of white and black, because a step with no hue in it reads as a hole in the
 * ramp. Saturation peaks in the middle rather than running flat, since a colour at either extreme
 * of lightness cannot hold much without leaving the gamut — flat is what makes the pale steps look
 * muddy and the dark ones look neon.
 */
const STOPS: ReadonlyArray<readonly [step: number, lightness: number, saturation: number]> = [
  [50, 97, 0.18],
  [100, 94, 0.32],
  [200, 88, 0.55],
  [300, 80, 0.78],
  [400, 70, 0.94],
  [500, 60, 1],
  [600, 52, 0.98],
  [700, 44, 0.9],
  [800, 35, 0.75],
  [900, 27, 0.58],
  [950, 18, 0.42],
];

/**
 * Writes one OKLCH colour.
 *
 * OKLCH rather than hex, because two steps a fixed distance apart in it look a fixed distance apart
 * to a reader, which is what makes a generated ramp usable at all.
 *
 * @param lightness - How light, 0 to 100.
 * @param chroma - How far from grey.
 * @param hue - Where on the wheel, in degrees.
 * @returns The colour, as CSS writes it.
 */
export function oklch(lightness: number, chroma: number, hue: number): string {
  return `oklch(${lightness.toFixed(1)}% ${chroma.toFixed(4)} ${hue.toFixed(1)})`;
}

/**
 * Names the chroma above which the saturation curve applies in full.
 *
 * The curve exists so a ramp stays inside the display's gamut, and a colour only leaves it when it
 * is both saturated and near an extreme of lightness. Below this a ramp has no such problem, so the
 * curve is eased off in proportion.
 */
const SATURATED = 0.1;

/**
 * Reads how much of its chroma one step keeps.
 *
 * A grey holds its tint from end to end, and a brand colour is pulled in at the extremes. The gamut
 * is the only reason to pull a colour in, and a near-grey is nowhere near the edge of it.
 *
 * @param saturation - The share the curve asks for at this step.
 * @param chroma - The ramp's chroma at its most saturated step.
 * @returns The share of the chroma this step takes, 0 to 1.
 */
function held(saturation: number, chroma: number): number {
  const risk = Math.min(chroma / SATURATED, 1);
  return saturation * risk + (1 - risk);
}

/**
 * Builds the eleven steps of a palette from one hue.
 *
 * Spread it straight into `theme.tokens.colors`. Eleven literals per palette is what this saves,
 * and more to the point it makes a palette a decision somebody can argue with rather than a column
 * of hexes nobody can check.
 *
 * @param hue - Where on the wheel, in degrees.
 * @param chroma - How far from grey at the ramp's most saturated step.
 * @returns Each step against its colour.
 */
export function ramp(hue: number, chroma: number): Colors {
  return Object.fromEntries(
    STOPS.map(([step, lightness, saturation]) => [
      String(step),
      { value: oklch(lightness, chroma * held(saturation, chroma), hue) },
    ]),
  );
}

/**
 * Names the page lightness a theme sits on in each colour mode.
 */
export interface Pages {
  /**
   * The dark page's lightness, 0 to 100.
   */
  dark: number;
  /**
   * The light page's lightness, 0 to 100.
   */
  light: number;
}

/**
 * Builds the surfaces a theme stacks: the page, the quiet fills recessed into it, and the panel and
 * popover raised above it.
 *
 * A raised surface is lighter than the page in both colour modes. A recessed one is darker in a
 * light theme and lighter in a dark one, since a near-black page has nowhere darker to go.
 *
 * @param pages - Where each mode's page sits.
 * @param hue - Where on the wheel, in degrees.
 * @param chroma - How far the surfaces sit from grey. Far less than a brand colour: enough that the
 *   page belongs to the theme, not enough to read as coloured.
 * @returns The `bg` entry, with `panel` and `popover` under it.
 */
export function surfaces(pages: Pages, hue: number, chroma: number): SemanticColors {
  /**
   * Moves off a page by a number of steps, stopping at white.
   *
   * A panel is lighter than the page in both modes — that is what makes it read as sitting on the
   * page rather than cut into it. A recessed fill goes the other way, which in a light theme means
   * darker and in a dark theme means lighter, because there is nowhere darker to go.
   *
   * @param page - The page's lightness.
   * @param steps - How far to move, positive for above the page.
   * @returns The surface, as a colour.
   */
  function at(page: number, steps: number): string {
    return oklch(Math.min(Math.max(page + steps, 0), 100), chroma, hue);
  }

  return {
    DEFAULT: { value: { _dark: at(pages.dark, 0), _light: at(pages.light, 0) } },
    emphasized: { value: { _dark: at(pages.dark, 11), _light: at(pages.light, -7) } },
    muted: { value: { _dark: at(pages.dark, 7), _light: at(pages.light, -4) } },
    panel: { value: { _dark: at(pages.dark, 4), _light: at(pages.light, 3) } },
    popover: { value: { _dark: at(pages.dark, 7), _light: at(pages.light, 3) } },
    subtle: { value: { _dark: at(pages.dark, 4), _light: at(pages.light, -2) } },
  };
}

/**
 * Builds the text colours, from the grey ramp a theme already declares.
 *
 * Ink is never pure black on white or pure white on black: both vibrate, and the near-ends of the
 * ramp read as ink while staying part of the theme.
 *
 * @param name - The grey palette's name, as Chakra calls it.
 * @returns The `fg` entry, with `muted` and `subtle` under it.
 */
export function inks(name = "gray"): SemanticColors {
  return {
    DEFAULT: { value: { _dark: `{colors.${name}.50}`, _light: `{colors.${name}.950}` } },
    muted: { value: { _dark: `{colors.${name}.400}`, _light: `{colors.${name}.600}` } },
    subtle: { value: { _dark: `{colors.${name}.600}`, _light: `{colors.${name}.400}` } },
  };
}

/**
 * Points the quiet fills of the `gray` palette at the theme's surfaces.
 *
 * `gray` is the palette a component falls back to when it names none, and its `subtle`, `muted` and
 * `emphasized` fills are surfaces rather than steps of a colour scale. Each names the surface of
 * the same name, which is what keeps the three in the order their names promise: a hovered row is
 * quieter than a pressed one, in either colour mode.
 *
 * Named once rather than per mode, because the surface it points at already answers to the mode.
 * The neighbouring helpers do write both conditions, and the difference is real: they replace
 * tokens Chakra states conditionally, and a value that is only `base` loses to a condition. A whole
 * token is replaced rather than merged, so naming all three roles here settles them.
 *
 * @returns The `gray` entry's surface roles.
 */
export function quiet(): SemanticColors {
  return {
    emphasized: { value: "{colors.bg.emphasized}" },
    muted: { value: "{colors.bg.muted}" },
    subtle: { value: "{colors.bg.subtle}" },
  };
}

/**
 * Builds the border colours, from the same ramp.
 *
 * A border is the quietest thing on a page and the first to be got wrong: too dark and it boxes
 * everything in, too light and a table loses its rows.
 *
 * @param name - The grey palette's name, as Chakra calls it.
 * @returns The `border` entry, with `muted` and `emphasized` under it.
 */
export function edges(name = "gray"): SemanticColors {
  return {
    DEFAULT: { value: { _dark: `{colors.${name}.800}`, _light: `{colors.${name}.200}` } },
    emphasized: { value: { _dark: `{colors.${name}.700}`, _light: `{colors.${name}.300}` } },
    muted: { value: { _dark: `{colors.${name}.900}`, _light: `{colors.${name}.100}` } },
  };
}

/**
 * Writes the eight semantic entries a palette needs before `colorPalette` resolves against it.
 *
 * Chakra reads `<Button colorPalette="primary">` through exactly these names, so a palette missing
 * one is a palette that silently does nothing on the component that asked for it. That is the
 * contract this exists to make hard to get wrong.
 *
 * The steps `solid` and `contrast` take are chosen so the pair clears WCAG 1.4.3 for every hue the
 * ramp can be built from, and not for how they look on one palette. A fill at `600` in light and
 * `500` in dark reads well and measures between 4.45 and 5.5, which puts a saturated violet under
 * the line while a teal sits over it — a palette that passes by luck of its hue.
 *
 * @param name - The palette's name, as `theme.tokens.colors` holds it.
 * @returns The eight entries, each with a value per colour mode.
 */
export function roles(name: string): SemanticColors {
  return {
    border: { value: { _dark: `{colors.${name}.400}`, base: `{colors.${name}.500}` } },
    contrast: { value: { _dark: `{colors.${name}.950}`, base: `{colors.${name}.50}` } },
    emphasized: { value: { _dark: `{colors.${name}.800}`, base: `{colors.${name}.200}` } },
    fg: { value: { _dark: `{colors.${name}.300}`, base: `{colors.${name}.700}` } },
    focusRing: { value: { _dark: `{colors.${name}.400}`, base: `{colors.${name}.500}` } },
    muted: { value: { _dark: `{colors.${name}.900}`, base: `{colors.${name}.100}` } },
    solid: { value: { _dark: `{colors.${name}.400}`, base: `{colors.${name}.700}` } },
    subtle: { value: { _dark: `{colors.${name}.950}`, base: `{colors.${name}.50}` } },
  };
}
