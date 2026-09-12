import { describe, expect, it } from "vite-plus/test";

import { edges, inks, ramp, surfaces } from "#helpers/color.ts";
import { contrast } from "#helpers/contrast.ts";
import { DARK, entryAt, LIGHT, MODES, valueAt } from "#testing.ts";

/**
 * Holds the base theme's greys, surfaces, ink and rules, built the way the config builds them.
 */
const grey = ramp(262, 0.008);

/**
 * Holds the surfaces the ink is set on.
 */
const stack = surfaces({ dark: 13, light: 97 }, 262, 0.006);

/**
 * Lists the surfaces text is ever set on, which is every one but the popover — a popover is a panel
 * by another name and measures the same.
 */
const SURFACES = ["DEFAULT", "subtle", "muted", "emphasized", "panel"];

/**
 * Names what 1.4.3 asks of normal text.
 */
const TEXT = 4.5;

/**
 * Names what 1.4.11 asks of a control's own edge, and 1.4.3 of text at 24px or over.
 */
const OBJECT = 3;

/**
 * Names the pairs this theme knowingly does not clear, and why each is allowed to stand.
 *
 * An exemption rather than a lowered threshold, because the two say different things: a lower bar
 * hides every failure, and a list of names hides exactly these and breaks on the next one. Anything
 * added here is a decision somebody has to defend in review.
 */
const ALLOWED = new Set([
  // `fg.subtle` is the quietest ink and does not clear the text bar on any surface. It is drawn
  // for punctuation a reader does not have to read — the colon in a JSON tree. Where it sets text
  // somebody reads, that is a bug in the component rather than here.
  "fg.subtle on bg",
  "fg.subtle on bg.subtle",
  "fg.subtle on bg.muted",
  "fg.subtle on bg.emphasized",
  "fg.subtle on bg.panel",

  // `fg.muted` clears the bar on the page, the panel and the quietest fill, and misses it on the
  // two deepest recesses. Only a disabled field and a segmented track are drawn that deep.
  "fg.muted on bg.muted",
  "fg.muted on bg.emphasized",
]);

/**
 * Writes one pair the way the exemptions name it, so the two cannot drift apart.
 *
 * `DEFAULT` is how a token block names the group itself, and `fg`/`bg` is how a stylesheet names
 * the same thing. The exemptions are read by people, so they are written the second way.
 *
 * @param ink - Which ink, as `inks` keys it.
 * @param surface - Which surface, as `surfaces` keys it.
 * @returns The pair's name.
 */
function pairOf(ink: string, surface: string): string {
  return `${named("fg", ink)} on ${named("bg", surface)}`;
}

/**
 * Writes one token the way a stylesheet does.
 *
 * @param prefix - The family, `fg` or `bg`.
 * @param key - The role, as a token block keys it.
 * @returns The token's name.
 */
function named(prefix: string, key: string): string {
  return key === "DEFAULT" ? prefix : `${prefix}.${key}`;
}

/**
 * Reads the grey step an ink or a rule points at, in one colour mode.
 *
 * @param block - The tokens, as `inks` or `edges` writes them.
 * @param name - Which ink or rule.
 * @param mode - Which colour mode.
 * @returns The colour, as the ramp wrote it.
 */
function stepOf(block: ReturnType<typeof inks>, name: string, mode: string): string {
  return valueAt(grey, entryAt(block, name, mode).replaceAll(/^\{colors\.gray\.|\}$/gu, ""));
}

/**
 * Measures one ink against one surface.
 *
 * @param ink - Which ink.
 * @param surface - Which surface.
 * @param mode - Which colour mode.
 * @returns The contrast ratio.
 */
function ratio(ink: string, surface: string, mode: string): number {
  return contrast(stepOf(inks(), ink, mode), entryAt(stack, surface, mode));
}

/**
 * Lists every ink-on-surface pair that misses a bar, naming each so a failure says which.
 *
 * @param ink - Which ink.
 * @param bar - The ratio it has to clear.
 * @returns One line per pair that misses, empty where none do.
 */
function missing(ink: string, bar: number): string[] {
  return MODES.flatMap((mode) =>
    SURFACES.filter((surface) => !ALLOWED.has(pairOf(ink, surface)))
      .map((surface) => [surface, ratio(ink, surface, mode)] as const)
      .filter(([, measured]) => measured < bar)
      .map(
        ([surface, measured]) =>
          `${mode.slice(1)}: ${pairOf(ink, surface)} = ${measured.toFixed(2)}`,
      ),
  );
}

describe("the ink", () => {
  it("sets body text over the line on every surface, in both modes", () => {
    expect(missing("DEFAULT", TEXT)).toEqual([]);
  });

  it("sets secondary text over the line on every surface it is not exempted from", () => {
    expect(missing("muted", TEXT)).toEqual([]);
  });

  it("keeps even the quietest ink visible as an object", () => {
    // Not the text bar: `fg.subtle` is exempted from that. This is the weaker one, and the point
    // is that the exemption is from legibility as prose rather than from being seen at all.
    const unseen = MODES.flatMap((mode) =>
      SURFACES.map((surface) => [mode, surface, ratio("subtle", surface, mode)] as const)
        .filter(([, , measured]) => measured < 1.5)
        .map(([at, surface, measured]) => `${at}: subtle on ${surface} = ${measured.toFixed(2)}`),
    );

    expect(unseen).toEqual([]);
  });

  it("runs from loudest to quietest without turning back", () => {
    for (const mode of MODES) {
      expect(ratio("DEFAULT", "DEFAULT", mode)).toBeGreaterThan(ratio("muted", "DEFAULT", mode));
      expect(ratio("muted", "DEFAULT", mode)).toBeGreaterThan(ratio("subtle", "DEFAULT", mode));
    }
  });
});

describe("the rules", () => {
  it("are drawn to be seen rather than read", () => {
    // 1.4.11 asks 3.0 of a control's own edge. A rule between two rows of a table is not a
    // control, and this records what the border actually measures rather than asserting a bar
    // it was never drawn to clear.
    const onPage = MODES.map((mode) =>
      contrast(stepOf(edges(), "DEFAULT", mode), entryAt(stack, "DEFAULT", mode)),
    );

    for (const measured of onPage) {
      expect(measured).toBeGreaterThan(1);
      expect(measured).toBeLessThan(OBJECT);
    }
  });

  it("grow louder as they are emphasised", () => {
    for (const mode of MODES) {
      const quiet = contrast(stepOf(edges(), "muted", mode), entryAt(stack, "DEFAULT", mode));
      const loud = contrast(stepOf(edges(), "emphasized", mode), entryAt(stack, "DEFAULT", mode));

      expect(loud).toBeGreaterThan(quiet);
    }
  });
});

/**
 * Lists every pair there is, against whether the exemptions name it.
 */
const EVERY = ["DEFAULT", "muted", "subtle"].flatMap((ink) =>
  SURFACES.map((surface) => ({ ink, named: ALLOWED.has(pairOf(ink, surface)), surface })),
);

/**
 * Holds only the pairs the exemptions name.
 */
const EXEMPTED = EVERY.filter((pair) => pair.named);

describe("the exemptions", () => {
  it("name a pair that exists, so a renamed token does not quietly excuse itself", () => {
    expect(EXEMPTED).toHaveLength(ALLOWED.size);
  });

  it("are all still failing, so none outlives the reason it was written for", () => {
    const passing = EXEMPTED.filter((pair) =>
      MODES.every((mode) => ratio(pair.ink, pair.surface, mode) >= TEXT),
    ).map((pair) => pairOf(pair.ink, pair.surface));

    expect(passing).toEqual([]);
  });

  it("measure something rather than answering `NaN`", () => {
    for (const pair of EXEMPTED) {
      expect(ratio(pair.ink, pair.surface, LIGHT)).not.toBeNaN();
      expect(ratio(pair.ink, pair.surface, DARK)).not.toBeNaN();
    }
  });
});
