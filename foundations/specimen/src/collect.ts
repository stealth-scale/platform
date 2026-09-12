/**
 * Reads a set of specimen modules into the pages a rail can list.
 *
 * It is handed what was found rather than going to find it, and that is not fussiness: a glob is
 * expanded by the bundler at build time, so its pattern has to be a literal in the file that owns
 * it. A shared package cannot glob a consumer's source. What it can do is take the result, which is
 * what this does — an application points a glob at its own components and gets the same catalogue
 * back.
 *
 * Nothing here reads a path and nothing reads a file's own text. Where a page belongs, what it is
 * called and what is on it are all stated by the page: a path only ever hints at the first two, and
 * the third cannot be recovered from a module at all, because a module hands its names back in
 * alphabetical order rather than the order they were written in.
 */

import { type Scene } from "#specimen.ts";

/**
 * Describes one page, once it has been read.
 */
export interface Documented {
  /**
   * What the page opens on, where it says anything.
   */
  about: string;

  /**
   * Which group the rail lists it under. Empty where the page named none.
   */
  group: string;

  /**
   * What addresses it, and what an i18n catalogue would key its words by.
   */
  id: string;

  /**
   * What is on the page, in the order the page lists it.
   */
  scenes: readonly Scene[];

  /**
   * What it is called.
   */
  title: string;
}

/**
 * Describes what an application hands over, having globbed its own source.
 */
export interface Found {
  /**
   * Every specimen module, keyed by the path it was read from.
   *
   * One glob, because one is all it takes: a page states what is on it, so nothing here has to go
   * back to the file to find out.
   */
  modules: Record<string, unknown>;
}

/**
 * Reads a name into the heading a reader sees.
 *
 * @param name - The last part of a page's identifier.
 * @returns The same, as a sentence.
 */
export function headingOf(name: string): string {
  const words = name.replaceAll("-", " ");

  return words.slice(0, 1).toUpperCase() + words.slice(1);
}

/**
 * Answers whether a value is a scene rather than something else a page listed.
 *
 * @param value - One entry of a page's scenes.
 * @returns `true` where it can be drawn.
 */
function isScene(value: unknown): value is Scene {
  return typeof value === "object" && value !== null && "draw" in value && "title" in value;
}

/**
 * Reads one field of a declared page, where it stated one as text.
 *
 * Read a field at a time rather than asserted whole. What comes back from a module is whatever the
 * file exported, and a shape claimed for it is a claim nothing checked — a specimen written wrong
 * would then reach the rail as a page with an undefined address.
 *
 * @param stated - The default export.
 * @param field - Which field to read.
 * @returns The text it stated, or nothing where it stated none.
 */
function textIn(stated: object, field: string): string | undefined {
  const held: unknown = Reflect.get(stated, field);

  return typeof held === "string" ? held : undefined;
}

/**
 * Reads the scenes a page listed, keeping any that can be drawn.
 *
 * @param stated - The default export.
 * @returns The scenes, in the order the page listed them.
 */
function scenesIn(stated: object): Scene[] {
  const listed: unknown = Reflect.get(stated, "scenes");

  return Array.isArray(listed) ? listed.filter((value) => isScene(value)) : [];
}

/**
 * Reads what a module's default export says about the page, everything filled in.
 *
 * @param value - The default export, whatever it turned out to be.
 * @returns The page it declared, or nothing where it named no address or listed no scene.
 */
function pageOf(value: unknown): Documented | undefined {
  if (typeof value !== "object" || value === null) return undefined;

  const id = textIn(value, "id");
  if (id === undefined) return undefined;

  const scenes = scenesIn(value);
  if (scenes.length === 0) return undefined;

  return {
    about: textIn(value, "about") ?? "",
    group: textIn(value, "group") ?? "",
    id,
    scenes,
    title: textIn(value, "title") ?? headingOf(id.slice(id.lastIndexOf("/") + 1)),
  };
}

/**
 * Reads the default export out of one module.
 *
 * @param module - The value the glob handed back for one path.
 * @returns Its default export, or nothing where it had none.
 */
function defaultIn(module: unknown): unknown {
  return typeof module === "object" && module !== null ? Reflect.get(module, "default") : undefined;
}

/**
 * Reads every specimen an application found into the pages a rail can list.
 *
 * A file that names no address, or lists no scene, is skipped rather than guessed at. Both are a
 * file half written, and the catalogue saying nothing about it is easier to notice than the
 * catalogue inventing a page for it.
 *
 * @param found - The modules. `Found` documents every member.
 * @returns One page per file, each knowing which group it belongs to.
 */
export function collect(found: Found): Documented[] {
  return Object.values(found.modules).flatMap((module) => {
    const page = pageOf(defaultIn(module));

    return page === undefined ? [] : [page];
  });
}
