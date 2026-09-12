/**
 * States what makes Forge differ from the base theme, and nothing else.
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
} from "@stealthscale/theme";

/**
 * States a warm, dense product: an orange brand on greys tinted to match, so a rule between two
 * rows belongs to the same page as the cream it sits on.
 */
export const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: surfaces({ dark: 14, light: 96 }, 75, 0.02),
        primary: roles("primary"),
      },

      shadows: heights(70, 0.5),
    },

    tokens: {
      colors: {
        gray: ramp(70, 0.014),
        primary: ramp(45, 0.17),
      },

      fonts: {
        body: { value: "'Jost Variable', ui-sans-serif, system-ui, sans-serif" },
        heading: { value: "'Jost Variable', ui-sans-serif, system-ui, sans-serif" },

        mono: { value: "'Fira Code Variable', ui-monospace, monospace" },
      },
    },
  },
});

/**
 * Holds Forge's system: Chakra's defaults, the base theme, then this one.
 */
export const system: SystemContext = createSystem(defaultConfig, base, config);
