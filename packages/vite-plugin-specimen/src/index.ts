/**
 * Indexing specimens without loading them.
 *
 * A catalogue lists every page it holds from metadata parsed out of the source, and loads a page's
 * components when somebody opens it. This finds the files, reads what each one states about itself,
 * and emits a module holding that beside a loader per page.
 *
 * A plain Vite plugin, naming no configuration package. What states it as a layer, and what a
 * specimen file is checked as, belong to the repository's configuration rather than to the plugin.
 * What the module exports is declared by `@stealthscale/vite-plugin-specimen/client`, which a
 * catalogue names in a triple-slash directive.
 *
 * @packageDocumentation
 */

export { ID, type Indexed, type Options, type Raw, specimenIndex } from "#plugin.ts";
export { type Entry, isRefused, type Read, read, type Refused, type Source } from "#read.ts";
