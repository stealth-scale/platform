import { createSystem, defaultConfig, defineConfig, type SystemContext } from "@chakra-ui/react";

import {
  corners,
  edges,
  heights,
  inks,
  quiet,
  ramp,
  surfaces,
  textScale,
  typeScale,
} from "#helpers/index.ts";
import {
  accordion,
  inputAddon,
  kbd,
  menu,
  segmentGroup,
  switchRecipe,
  table,
  tabs,
  timeline,
  toggle,
  treeView,
} from "#recipes/index.ts";

/**
 * What a page is set in when nobody has said otherwise: whatever the reader's own system uses.
 *
 * The emoji families sit at the end because a symbol in a label falls through to them.
 */
const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

/**
 * The same for anything set in a fixed pitch: a figure, a key, a line of code.
 */
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/**
 * States the base theme: a blue primary on cool, almost-white greys.
 *
 * Ordinary `defineConfig`, so Chakra's documentation is the documentation for this file.
 *
 * It states every category that carries an opinion — the palettes, the surfaces, the ink, the
 * borders, the type scale, the corners, the elevation — and leaves alone the ones that are physics
 * rather than design. Chakra's spacing is a 4px base, its z-indices are an ordering, its cursors
 * and aspect ratios are names for CSS values: replacing any of those buys nothing and has to be
 * maintained forever.
 *
 * The greys are named `gray`, which is the palette a component falls back to when it names none.
 * `radii` and `shadows` sit under `semanticTokens`, which is where Chakra declares them.
 *
 * There is no brand colour here. A theme that has one states both halves of it — the ramp and the
 * roles `colorPalette` reads — and a product with none is drawn in the greys.
 *
 * The fonts are the reader's own. This theme ships no typeface and asks for no download, so the
 * stacks are stated here rather than left to Chakra, whose defaults open on `Inter`.
 */
export const config = defineConfig({
  cssVarsPrefix: "scale",

  theme: {
    recipes: { inputAddon, kbd },

    semanticTokens: {
      colors: {
        bg: surfaces({ dark: 13, light: 97 }, 262, 0.006),
        border: edges(),
        fg: inks(),
        gray: quiet(),
      },

      radii: corners("0.625rem"),
      shadows: heights(262),
    },

    slotRecipes: {
      accordion,
      menu,
      segmentGroup,
      switch: switchRecipe,
      table,
      tabs,
      timeline,
      toggle,
      treeView,
    },

    textStyles: textScale(),

    tokens: {
      colors: {
        gray: ramp(262, 0.008),
      },

      fontSizes: typeScale(),

      fonts: {
        body: { value: SANS },
        heading: { value: SANS },
        mono: { value: MONO },
      },
    },
  },
});

/**
 * Holds the base theme's system, which is what a product with no brand of its own uses.
 *
 * A theme built on this one passes the exported {@link config} to `createSystem` ahead of its own
 * rather than reaching for this: `createSystem` is variadic and merges deeply, in order, so
 * inheritance is Chakra's mechanism with nothing of ours in between.
 */
export const system: SystemContext = createSystem(defaultConfig, config);
