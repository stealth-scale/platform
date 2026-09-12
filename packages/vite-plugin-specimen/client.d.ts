/**
 * What the index plugin emits, declared so that importing it type-checks.
 *
 * A catalogue reaches this with a triple-slash directive naming
 * `@stealthscale/vite-plugin-specimen/client`, from a file it already compiles. The module exists
 * only in a build the plugin takes part in, which is what a catalogue importing it without that
 * reference is told.
 */
declare module "virtual:specimen-index" {
  import { type Indexed } from "@stealthscale/vite-plugin-specimen";

  /**
   * Every page found, in the order the patterns matched.
   */
  export const pages: readonly Indexed[];
}
