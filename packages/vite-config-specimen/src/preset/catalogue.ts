/**
 * What an application showing a catalogue is configured with.
 *
 * One layer, so there is no block directory to keep it in: the contribution that appends the plugin
 * and the composition a config extends sit together until there is a second of either.
 */

import { contribute, type Contribution, type Layer, owned } from "@stealthscale/vite-config-core";
import { type Options, specimenIndex } from "@stealthscale/vite-plugin-specimen";

/**
 * Indexes the specimens the patterns match, for a catalogue to list.
 *
 * Stated rather than defaulted. A pattern is relative to the application's own root, and an
 * application showing a catalogue of a workspace's components sits beside them rather than above
 * them, so any default here would be wrong for the arrangement it was not written for.
 *
 * @param options - Where to look. `Options` documents every member.
 * @returns The contribution appending the plugin.
 */
export function indexed(options: Options): Contribution {
  return contribute({
    at: "plugins",
    because:
      "a catalogue lists every page it holds before it loads one, which needs each specimen's " +
      "metadata read out of the source rather than off a module that has run",
    item: specimenIndex(options),
    name: "specimen.indexed",
  });
}

/**
 * The layers a catalogue is built on.
 *
 * Answered as a list rather than bound to a tier, because a catalogue is an ordinary application
 * first: it picks whichever tier its framework calls for and adds these.
 *
 * Owned, so a repository takes one back by a name that says where it came from.
 *
 * @param options - Where to look. `Options` documents every member.
 * @returns Each layer a catalogue needs, in the order they compose.
 */
export function layers(options: Options): readonly Layer[] {
  return owned("specimen", [indexed(options)]);
}
