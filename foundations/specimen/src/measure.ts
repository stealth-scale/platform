/**
 * How wide a column of prose is allowed to run.
 */

/**
 * How wide a column of prose is allowed to run.
 *
 * Stated here rather than in each thing that reads text, because a page whose paragraphs, tables
 * and code blocks each stop at a different width reads as three pages side by side.
 *
 * Apart from `Prose` itself so that file exports a component and nothing else, which is what lets a
 * change to it reload in place rather than reloading the page.
 */
export const MEASURE = "42rem";
