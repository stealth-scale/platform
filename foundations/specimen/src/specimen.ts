/**
 * What a page of the catalogue declares about itself.
 *
 * A file states one component and the scenes that show it. The file's default export is the page;
 * every named export is a scene, drawn in the order the file declares them.
 */

import { type FC } from "react";

/**
 * Describes one thing on show: a caption, what it is for, and the thing itself.
 */
export interface Scene {
  /**
   * What this scene shows, where the title alone does not say it. Drawn under the caption at a
   * readable measure.
   */
  about?: string;

  /**
   * Draws it.
   *
   * A component rather than a node, so a scene that has to hold state — a control that replays an
   * animation, a form that gets filled in — declares its hooks in its own render. Called as a
   * function, those hooks would belong to whatever drew it.
   */
  draw: FC;

  /**
   * What it is called, as the caption over it.
   */
  title: string;
}

/**
 * Describes one page: where it belongs, what it is called, and what is said before the scenes.
 *
 * Every part of it is stated rather than read off the file's path. A path only ever hints at where
 * a page belongs — one repository keeps a package per directory, another keeps every component
 * under a single `src` — and a rule written for the first is silently wrong for the second. Four
 * lines in the file that knows the answer beats a guess in the reader that does not.
 */
export interface Specimen {
  /**
   * What the page opens on, in a sentence or two.
   */
  about?: string;

  /**
   * Which group the rail lists it under. Left out, it is listed on its own.
   */
  group?: string;

  /**
   * What addresses the page, and what an i18n catalogue keys its words by.
   *
   * Stable and never displayed, so a title can be rewritten or translated without a link moving.
   * Unique across the catalogue: two pages sharing one is two pages at one address, and only the
   * first can be reached.
   */
  id: string;

  /**
   * What is on the page, in the order it is drawn.
   *
   * Listed rather than gathered from the file's own exports. A module hands its names back
   * alphabetically — the language says so — so a page written Variants, States, Anatomy would be
   * read back Anatomy, States, Variants, quietly, in every catalogue built on it. Recovering the
   * order meant reading the file's own text, and the cure was worse: a second glob over the same
   * files, which had to stay identical to the first or the ordering broke with nothing to show for
   * it.
   *
   * Each scene is usually a named export as well, so one can be imported on its own — for a
   * snapshot of a single state, or a case that renders just the loading one.
   */
  scenes: readonly Scene[];

  /**
   * What it is called. Left out, it is read from the last part of the identifier.
   */
  title?: string;
}

/**
 * States what a page is.
 *
 * A function rather than a bare object so that what a specimen may declare is checked at the point
 * it is written, rather than wherever the catalogue happens to read it.
 *
 * @param page - The identifier, the group and the prose the page opens on.
 * @returns The same, checked.
 */
export function specimen(page: Specimen): Specimen {
  return page;
}

/**
 * States one scene.
 *
 * @param shown - The caption, the prose and the drawing.
 * @returns The same, checked.
 */
export function scene(shown: Scene): Scene {
  return shown;
}
