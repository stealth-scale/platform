/**
 * Builds the type scale. A theme states the size body text is set at and how fast the scale climbs,
 * and every step follows from those two numbers — which is what makes a type ramp something a
 * person can argue about rather than fourteen literals nobody checks.
 */

import { type ThemingConfig } from "@chakra-ui/react";

/**
 * Names the token shape a font-size category takes, read off Chakra's own theme config.
 */
type Sizes = NonNullable<NonNullable<ThemingConfig["tokens"]>["fontSizes"]>;

/**
 * Names the shape the text styles take.
 */
type TextStyles = NonNullable<ThemingConfig["textStyles"]>;

/**
 * Holds every step against how many rungs it sits from body text.
 *
 * The names are Chakra's own, so a component written against the default theme keeps working. Body
 * text is `md` and sits at zero: every other step is that size multiplied by the ratio, raised to
 * its distance from it.
 *
 * The rungs stop being whole numbers above `2xl`, because a display size is chosen for the room it
 * fills rather than for its place in a ramp, and a strict geometric scale runs out of usable sizes
 * long before it runs out of names.
 */
const STEPS: ReadonlyArray<readonly [name: string, rungs: number]> = [
  ["2xs", -3],
  ["xs", -2],
  ["sm", -1],
  ["md", 0],
  ["lg", 1],
  ["xl", 2],
  ["2xl", 3],
  ["3xl", 4.5],
  ["4xl", 6],
  ["5xl", 8],
  ["6xl", 10],
  ["7xl", 12],
  ["8xl", 15],
  ["9xl", 18],
];

/**
 * Holds the line height each size is set at, largest size first.
 *
 * Large text needs proportionally less leading than small text: a heading set at the same ratio as
 * body copy looks loose and falls apart into separate lines.
 */
const LEADING: ReadonlyArray<readonly [ceiling: number, height: number]> = [
  [1.25, 1.5],
  [2, 1.35],
  [3, 1.2],
];

/**
 * Holds the leading anything above the largest band takes.
 */
const TIGHTEST = 1.1;

/**
 * Reads the size one step is set at.
 *
 * @param rungs - How far the step sits from body text.
 * @param base - The size body text is set at, in rem.
 * @param ratio - How fast the scale climbs.
 * @returns The size, in rem.
 */
function sized(rungs: number, base: number, ratio: number): number {
  return base * ratio ** rungs;
}

/**
 * Reads the line height for one size.
 *
 * @param rem - The size, in rem.
 * @returns The line height, unitless.
 */
function leading(rem: number): number {
  return LEADING.find(([ceiling]) => rem <= ceiling)?.[1] ?? TIGHTEST;
}

/**
 * Reads the tracking for one size.
 *
 * Large text is set tighter, because the space between letters grows with the type while the space
 * a reader wants between them does not.
 *
 * @param rem - The size, in rem.
 * @returns The letter spacing, in em.
 */
function tracking(rem: number): string {
  if (rem >= 2) return "-0.02em";
  if (rem >= 1.25) return "-0.01em";
  return "0em";
}

/**
 * Builds every font size from the size body text is set at.
 *
 * @param base - The size body text is set at, in rem. An editorial page reads better at `1.0625`; a
 *   dense console sometimes wants `0.9375`.
 * @param ratio - How fast the scale climbs. `1.125` is a major second, which holds up in a dense
 *   interface; `1.25` is a major third and suits a page that is read.
 * @returns Every step, named as Chakra names them.
 */
export function typeScale(base = 1, ratio = 1.125): Sizes {
  return Object.fromEntries(
    STEPS.map(([name, rungs]) => [name, { value: `${sized(rungs, base, ratio).toFixed(4)}rem` }]),
  );
}

/**
 * Builds the named text styles, so a heading is one word rather than four properties.
 *
 * Derived from the same two numbers the sizes are, so a theme that moves its base size moves these
 * with it and nothing falls out of step.
 *
 * @param base - The size body text is set at, in rem.
 * @param ratio - How fast the scale climbs.
 * @returns One style per step, each with its size, leading and tracking.
 */
export function textScale(base = 1, ratio = 1.125): TextStyles {
  return Object.fromEntries(
    STEPS.map(([name, rungs]) => {
      const rem = sized(rungs, base, ratio);

      return [
        name,
        {
          value: {
            fontSize: `${rem.toFixed(4)}rem`,
            letterSpacing: tracking(rem),
            lineHeight: String(leading(rem)),
          },
        },
      ];
    }),
  );
}
