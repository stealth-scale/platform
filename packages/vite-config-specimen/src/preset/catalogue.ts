/**
 * What an application showing a catalogue is configured with.
 *
 * Two things, so there is no block directory to keep them in: the contribution that appends the
 * plugin, and the composition a config extends, which adds what the plugin cannot say for itself.
 */

import { deps } from "@stealthscale/vite-config";
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
 * The specimens are named as crawl entries beside the page. The dev server works out what to
 * pre-bundle by crawling from the page, and a specimen is reached from the index by a dynamic
 * import of a file outside the root, which no crawl follows; left alone, the first page opened
 * finds what it depends on, re-bundles, and reloads the whole catalogue. Naming the entries turns
 * the page's own inference off, which is why the page is named again beside them.
 *
 * Owned, so a repository takes one back by a name that says where it came from.
 *
 * @param options - Where to look. `Options` documents every member.
 * @returns Each layer a catalogue needs, in the order they compose.
 */
export function layers(options: Options): readonly Layer[] {
  return owned("specimen", [
    indexed(options),
    ...deps.crawled({
      because:
        "a specimen is reached from the index by a dynamic import, which the dev server's crawl " +
        "does not follow, so its dependencies would be found by the first page opened and cost a " +
        "reload",
      from: ["**/*.html", ...options.patterns],
    }),
  ]);
}
