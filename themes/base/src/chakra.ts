/**
 * The vocabulary a theme is written in, under this design system's own name.
 *
 * A theme built on this one declares its config, merges it over the base and hands the result to a
 * provider, which takes these four names and nothing else. Re-exporting them here is what lets such
 * a theme import this package alone: the styling engine stays this repository's to swap.
 */

export { createSystem, defaultConfig, defineConfig, type SystemContext } from "@chakra-ui/react";
