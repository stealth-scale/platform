/**
 * States what makes Folio differ from the base theme, and nothing else.
 *
 * `createSystem` merges its configs deeply and in order, so everything left out here is the base's,
 * and a value moved there reaches this theme without an edit here.
 *
 * @packageDocumentation
 */

import {
  config as base,
  createSystem,
  defaultConfig,
  defineConfig,
  heights,
  ramp,
  roles,
  surfaces,
  type SystemContext,
  textScale,
  typeScale,
} from "@stealthscale/theme";

/**
 * States an editorial product: a violet brand, with greys that keep a trace of the violet rather
 * than a trace of the blue.
 */
export const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: surfaces({ dark: 9, light: 98 }, 300, 0.01),
        primary: roles("primary"),
      },

      shadows: heights(295, 1.5),
    },

    tokens: {
      colors: {
        gray: ramp(295, 0.01),
        primary: ramp(295, 0.2),
      },

      fonts: {
        body: { value: "'Literata Variable', Georgia, serif" },
        heading: { value: "'Literata Variable', Georgia, serif" },

        mono: { value: "'Source Code Pro Variable', ui-monospace, monospace" },
      },

      fontSizes: typeScale(1.0625, 1.25),
    },

    textStyles: textScale(1.0625, 1.25),
  },
});

/**
 * Holds Folio's system: Chakra's defaults, the base theme, then this one.
 */
export const system: SystemContext = createSystem(defaultConfig, base, config);
