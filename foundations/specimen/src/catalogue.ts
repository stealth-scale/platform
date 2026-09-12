/**
 * What an application states once, so that everything else can be read rather than wired.
 *
 * One file, the way a bundler or a test runner takes one file: where the specimens are, which
 * themes to offer, and how to read a path. Everything the catalogue needs to draw itself comes from
 * here, so an application that wants the same catalogue over its own components writes this and
 * nothing else.
 *
 * The globs cannot live in this package. A glob is expanded by the bundler at build time and its
 * pattern has to be a literal in the file that owns it, so the application writes them and hands
 * the result over — which is the whole reason this shape exists.
 */

import { type SystemContext } from "@chakra-ui/react";

import { type Found } from "#collect.ts";

/**
 * Describes one theme a catalogue can be drawn in.
 */
export interface Wearable {
  /**
   * Names it, as the picker lists it.
   */
  name: string;

  /**
   * The resolved theme, which is what the provider is given.
   */
  system: SystemContext;
}

/**
 * Describes everything an application states about its own catalogue.
 */
export interface Catalogue {
  /**
   * Where the specimens are, and how to read a path into a group and a name.
   */
  specimens: Found;

  /**
   * The themes to offer, first one worn.
   *
   * More than one on purpose. A palette looks deliberate on its own page and reveals itself as
   * another palette with one hue swapped the moment it is put beside that one.
   */
  themes: readonly [Wearable, ...Wearable[]];
}

/**
 * States what a catalogue is made of.
 *
 * A function rather than a bare object so that what an application may state is checked where it is
 * written, rather than wherever the catalogue happens to read it.
 *
 * @param stated - The specimens and the themes. `Catalogue` documents every member.
 * @returns The same, checked.
 */
export function defineCatalogue(stated: Catalogue): Catalogue {
  return stated;
}
