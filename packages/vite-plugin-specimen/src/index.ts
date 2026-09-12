/**
 * Indexing specimens without loading them.
 *
 * A catalogue lists every page it holds from metadata parsed out of the source, and loads a page's
 * components when somebody opens it. The plugin finds the files, reads what each one states about
 * itself, and emits a module holding that beside a loader per page.
 *
 * @packageDocumentation
 */

export { ID, index, type Options, specimenIndex } from "#plugin.ts";
export { type Entry, read, type Source } from "#read.ts";
