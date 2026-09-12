/**
 * The design system's base theme, the helpers a theme built on it uses, and the four names from the
 * styling engine that writing one takes.
 *
 * `config` is exported beside `system` on purpose: that is what lets somebody extend the theme
 * rather than fork it, by passing it to `createSystem` ahead of their own.
 *
 * @packageDocumentation
 */

export { createSystem, defaultConfig, defineConfig, type SystemContext } from "#chakra.ts";
export { config, system } from "#config.ts";
export {
  contrast,
  corners,
  edges,
  heights,
  inks,
  type Level,
  luminance,
  oklch,
  type Pages,
  quiet,
  ramp,
  readable,
  roles,
  surfaces,
  textScale,
  typeScale,
} from "#helpers/index.ts";
