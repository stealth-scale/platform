/**
 * States what makes Fathom differ from the base theme, and nothing else.
 *
 * `createSystem` merges its configs deeply and in order, so everything left out here is the base's,
 * and a value moved there reaches this theme without an edit here.
 *
 * @packageDocumentation
 */

import {
  config as base,
  corners,
  createSystem,
  defaultConfig,
  defineConfig,
  heights,
  ramp,
  roles,
  surfaces,
  type SystemContext,
} from "@stealthscale/theme";

/**
 * States a deep teal product. Its greys are tinted towards the sea rather than the sky, which is
 * what stops it reading as the base theme with a teal button in it.
 */
export const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: surfaces({ dark: 11, light: 96 }, 195, 0.016),
        primary: roles("primary"),
      },

      radii: corners("1rem"),

      shadows: heights(200),
    },

    tokens: {
      colors: {
        gray: ramp(200, 0.012),
        primary: ramp(185, 0.12),
      },

      fonts: {
        body: { value: "'Space Grotesk Variable', ui-sans-serif, system-ui, sans-serif" },
        heading: { value: "'Space Grotesk Variable', ui-sans-serif, system-ui, sans-serif" },

        mono: { value: "'Spline Sans Mono Variable', ui-monospace, monospace" },
      },
    },
  },
});

/**
 * Holds Fathom's system: Chakra's defaults, the base theme, then this one.
 */
export const system: SystemContext = createSystem(defaultConfig, base, config);
