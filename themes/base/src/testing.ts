/**
 * Holds the readers a theme's specifications are written with.
 *
 * A token is `unknown` at the edges: Chakra types a value as a string or a bag of values per
 * condition, and which one it is depends on the category. Narrowing that in each specification is
 * the same six lines over and over, so it is written once here and the specifications say what they
 * mean instead.
 *
 * Published as `@stealthscale/theme/testing`, and not only used here, because a consumer building a
 * theme on this one has the same things to prove: that their palette is complete enough for
 * `colorPalette` to resolve against it, and that their surfaces are ordered. Both fail silently,
 * and neither is worth reimplementing to find out.
 */

import { type SystemContext } from "@chakra-ui/react";

/**
 * Names the light condition.
 *
 * Written as a constant because the key is Chakra's, and a leading underscore read straight into a
 * specification is a private name as far as the house rules are concerned.
 */
export const LIGHT = "_light";

/**
 * Names the dark condition.
 */
export const DARK = "_dark";

/**
 * Names the unconditional value a new token carries.
 */
export const BASE = "base";

/**
 * Lists both colour modes, for a case that has to hold in either.
 */
export const MODES = [LIGHT, DARK];

/**
 * Describes one token as a specification reads it.
 */
export interface Entry {
  /**
   * Carries the token's value, whose shape depends on the category it came from.
   */
  value?: unknown;
}

/**
 * Describes a block of tokens: a name against a token.
 */
export type Block = Record<string, Entry | undefined>;

/**
 * Reads a value as text, answering nothing for anything that is not a string.
 *
 * @param value - The token value, as it came back.
 * @returns The text, or an empty string.
 */
export function textOf(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Returns `true` for a value written per condition rather than as one string.
 *
 * @param value - The token value, as it came back.
 * @returns `true` for a bag of values.
 */
export function conditioned(value: unknown): value is Record<string, string> {
  return typeof value === "object" && value !== null;
}

/**
 * Reads one token's value, for a category that carries a single string.
 *
 * @param block - The tokens.
 * @param name - The token to read.
 * @returns The value, or an empty string where there is none.
 */
export function valueAt(block: Block, name: string): string {
  return textOf(block[name]?.value);
}

/**
 * Reads one token's value under one condition.
 *
 * @param block - The tokens.
 * @param name - The token to read.
 * @param condition - The condition to read it under, such as {@link LIGHT}.
 * @returns The value, or an empty string where there is none.
 */
export function entryAt(block: Block, name: string, condition: string): string {
  const value = block[name]?.value;
  return conditioned(value) ? (value[condition] ?? "") : "";
}

/**
 * Lists every condition the entries of a block carry, so a case can assert the set rather than each
 * entry.
 *
 * @param block - The tokens.
 * @returns The conditions, sorted.
 */
export function conditionsIn(block: Block): string[] {
  return [
    ...new Set(Object.values(block).flatMap((entry) => Object.keys(entry?.value ?? {}))),
  ].toSorted();
}

/**
 * Reads one token back through a built system, which is the lookup a component makes.
 *
 * @param system - The system to read through.
 * @param path - The token's path, such as `colors.primary.500`.
 * @returns The value, or an empty string where the system has no such token.
 */
export function resolved(system: SystemContext, path: string): string {
  return textOf(system.tokens.getByName(path)?.value);
}

/**
 * Reads the number off the front of a CSS length.
 *
 * @param value - The length, such as `1.0625rem`.
 * @returns The number, or `NaN` where the value carries none.
 */
export function numberOf(value: unknown): number {
  return Number(/^(?<number>[\d.]+)/u.exec(textOf(value))?.groups?.["number"] ?? Number.NaN);
}

/**
 * Reads the lightness out of an OKLCH colour.
 *
 * @param colour - The colour, as CSS writes it.
 * @returns The lightness, or `NaN` where the value is not one.
 */
export function lightnessOf(colour: unknown): number {
  return Number(
    /oklch\((?<lightness>[\d.]+)%/u.exec(textOf(colour))?.groups?.["lightness"] ?? Number.NaN,
  );
}
