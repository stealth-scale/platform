import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import {
  accordionAnatomy,
  menuAnatomy,
  segmentGroupAnatomy,
  switchAnatomy,
  tableAnatomy,
  tabsAnatomy,
  timelineAnatomy,
  treeViewAnatomy,
} from "@chakra-ui/react/anatomy";
import { describe, expect, it } from "vite-plus/test";

import { system } from "#config.ts";

/**
 * Describes what a merged recipe configuration holds, of the parts these cases read.
 */
interface Config {
  /**
   * Which value of each variant a component renders as when nobody says.
   */
  defaultVariants: Record<string, unknown>;

  /**
   * The parts the recipe styles, where it has parts.
   */
  slots: string[];

  /**
   * The knobs it offers, each against the values it accepts.
   */
  variants: Record<string, Record<string, unknown>>;
}

/**
 * Describes one recipe this theme registers, and what it has to answer to.
 */
interface Registered {
  /**
   * The key the component looks the recipe up by. Getting this wrong is silent.
   */
  key: string;

  /**
   * The parts the recipe is expected to style: Chakra's anatomy where it corrects one of Chakra's,
   * or its own list where this kit invented it.
   */
  parts: readonly string[];
}

/**
 * Lists every slot recipe the base theme registers.
 *
 * Written out rather than read off the config, deliberately: this list is the claim, and a recipe
 * that stops being registered should fail here rather than quietly shrink the thing being checked.
 */
const SLOTTED: readonly Registered[] = [
  { key: "accordion", parts: accordionAnatomy.keys() },
  { key: "menu", parts: menuAnatomy.keys() },
  { key: "segmentGroup", parts: segmentGroupAnatomy.keys() },
  { key: "switch", parts: switchAnatomy.keys() },
  { key: "table", parts: tableAnatomy.keys() },
  { key: "tabs", parts: tabsAnatomy.keys() },
  { key: "timeline", parts: timelineAnatomy.keys() },
  { key: "treeView", parts: treeViewAnatomy.keys() },

  // Chakra ships no toggle recipe at all — `createSlotRecipeContext({ key: 'toggle' })` falls
  // back to an empty object and the component renders unstyled. This one is ours, so it names
  // its own parts rather than an anatomy.
  { key: "toggle", parts: ["root", "indicator"] },
];

/**
 * Lists every single-part recipe the base theme registers.
 */
const SINGLE: readonly string[] = ["inputAddon", "kbd"];

/**
 * Names the variants that carry no default on purpose.
 *
 * Two kinds qualify. A boolean variant is absent rather than false, so a default would turn it on
 * for everybody. And a variant whose unset state already draws as one of its values needs no
 * default either — naming one would only restate what the browser does.
 *
 * Anything else without a default is a state nobody asked for and nobody styled.
 */
const OPTIONAL = new Set([
  // Flags.
  "table.interactive",
  "table.stickyHeader",
  "table.striped",
  "table.showColumnBorder",
  "tabs.fitted",
  "treeView.animateContent",

  // A tab list is a flex row, so leaving this unset already lays the tabs out from the start.
  // `justify="start"` sets `justifyContent: flex-start`, which is what it was doing anyway.
  "tabs.justify",
]);

/**
 * Reads a merged recipe configuration, filling in what a recipe may leave out.
 *
 * @param key - Which recipe.
 * @param slotted - Whether it has parts.
 * @returns Its slots, variants and defaults.
 */
function configOf(key: string, slotted: boolean): Config {
  const read = (slotted ? system.getSlotRecipe(key) : system.getRecipe(key)) as Partial<Config>;

  return {
    defaultVariants: read.defaultVariants ?? {},
    slots: read.slots ?? [],
    variants: read.variants ?? {},
  };
}

/**
 * Resolves a recipe and answers the slots it drew.
 *
 * @param key - Which recipe.
 * @param variants - Which knobs to set.
 * @returns The slots that came back with styles.
 */
function drawn(key: string, variants: Record<string, string> = {}): string[] {
  const resolve = system.getSlotRecipeFn(key) as (
    chosen: Record<string, string>,
  ) => Record<string, unknown>;

  return Object.keys(resolve(variants));
}

/**
 * Holds Chakra's own recipes, with nothing of this kit's on top.
 *
 * The variable prefix is matched deliberately. Every resolved style is full of `var(--…)`
 * references, so leaving the prefix alone would make every recipe differ on the name of every token
 * and prove nothing. Matched, two recipes differ only where the styles differ.
 */
const PLAIN = createSystem(defaultConfig, defineConfig({ cssVarsPrefix: "scale" }));

/**
 * Lists every combination of one variant worth resolving: none set, then each value of each.
 *
 * One knob at a time rather than the cross product, because a correction is written against one
 * variant value and the cross product is hundreds of resolutions to prove the same thing.
 *
 * @param key - Which recipe.
 * @returns The combinations.
 */
function combinationsOf(key: string): Array<Record<string, string>> {
  return [
    {},
    ...Object.entries(configOf(key, true).variants).flatMap(([variant, values]) =>
      Object.keys(values).map((value) => ({ [variant]: value })),
    ),
  ];
}

/**
 * Answers whether this theme draws a recipe differently from Chakra, for one combination.
 *
 * @param key - Which recipe.
 * @param chosen - Which variants to set.
 * @returns `true` where the two resolve to different styles.
 */
function corrected(key: string, chosen: Record<string, string>): boolean {
  const ours = system.getSlotRecipeFn(key) as (of: Record<string, string>) => unknown;
  const theirs = PLAIN.getSlotRecipeFn(key) as (of: Record<string, string>) => unknown;

  return JSON.stringify(ours(chosen)) !== JSON.stringify(theirs(chosen));
}

/**
 * Lists every recipe this theme registers that resolves exactly as Chakra's does.
 *
 * A recipe whose correction lands nowhere is the quiet failure this whole file exists for: the
 * override was written, it type-checks, it is registered, and it does nothing. Usually it was put
 * in the base against a rule Chakra states in a variant, so the variant is applied after it and
 * wins.
 */
const INERT = SLOTTED.filter(
  (one) => !combinationsOf(one.key).some((chosen) => corrected(one.key, chosen)),
).map((one) => one.key);

/**
 * Every recipe there is, against the key it answers to and whether it has parts.
 */
const EVERY: ReadonlyArray<readonly [key: string, slotted: boolean]> = [
  ...SLOTTED.map((one) => [one.key, true] as const),
  ...SINGLE.map((key) => [key, false] as const),
];

/**
 * Lists every recipe the system cannot find under the key its component uses.
 */
const UNREACHABLE = EVERY.filter(([key]) => !system.hasRecipe(key)).map(([key]) => key);

/**
 * Lists every recipe the system holds as the wrong kind, which a component cannot read.
 */
const MISKINDED = EVERY.filter(([key, slotted]) =>
  slotted ? !system.isSlotRecipe(key) : !system.isRecipe(key),
).map(([key]) => key);

/**
 * Lists every variant that ought to name a default and does not.
 */
const UNDEFAULTED = EVERY.flatMap(([key, slotted]) => {
  const config = configOf(key, slotted);

  return Object.keys(config.variants)
    .filter((variant) => !(variant in config.defaultVariants))
    .filter((variant) => !OPTIONAL.has(`${key}.${variant}`))
    .map((variant) => `${key}.${variant}`);
});

/**
 * Lists every slot recipe whose slot list is not exactly the parts it is meant to style.
 */
const MISDECLARED = SLOTTED.filter((one) => {
  const declared = new Set(configOf(one.key, true).slots);

  return declared.size !== one.parts.length || one.parts.some((part) => !declared.has(part));
}).map((one) => one.key);

/**
 * Lists every slot a recipe names and then draws nothing for.
 */
const UNDRAWN = SLOTTED.flatMap((one) => {
  const styled = new Set(drawn(one.key));

  return one.parts.filter((part) => !styled.has(part)).map((part) => `${one.key}.${part}`);
});

/**
 * Lists every variant value that resolves to no styles at all.
 */
const UNRESOLVED = SLOTTED.flatMap((one) =>
  Object.entries(configOf(one.key, true).variants).flatMap(([variant, values]) =>
    Object.keys(values)
      .filter((value) => drawn(one.key, { [variant]: value }).length === 0)
      .map((value) => `${one.key}: ${variant}=${value}`),
  ),
);

describe("every registered recipe", () => {
  it("is reachable by the key its component looks it up with", () => {
    // The lookup falls back to an empty object rather than failing, so a key that matches nothing
    // renders the component unstyled and every state looks like every other. That is what Toggle
    // did before this theme supplied the recipe Chakra never wrote.
    expect(UNREACHABLE).toEqual([]);
  });

  it("is registered as the kind of recipe its component reads", () => {
    expect(MISKINDED).toEqual([]);
  });

  it("gives every variant that is not a flag a default to render as", () => {
    expect(UNDEFAULTED).toEqual([]);
  });
});

describe("every slot recipe", () => {
  it("names the whole anatomy rather than the slots it happens to touch", () => {
    // `slots` is replaced rather than merged. A recipe declaring only what it styles drops every
    // other slot's base styling, and the component looks broken for no visible reason. This is
    // the assertion that would have caught Timeline losing its rail.
    expect(MISDECLARED).toEqual([]);
  });

  it("draws something for every slot it names", () => {
    expect(UNDRAWN).toEqual([]);
  });

  it("resolves to styles for every value of every variant", () => {
    expect(UNRESOLVED).toEqual([]);
  });

  it("actually changes what Chakra would have drawn", () => {
    // Registration is not enough. Chakra ships its own recipe under most of these keys, so a
    // correction that never lands leaves the component looking exactly as it did — and every
    // other case in this file still passes.
    expect(INERT).toEqual([]);
  });
});
