/**
 * Reading a specimen's metadata out of its source, without running it.
 *
 * A page states what it is called and where it belongs as string literals, which the source text
 * holds and a parser can lift. Its scenes hold components, which it cannot, and which are the whole
 * reason an index is worth building: a rail listing 123 pages has no business loading 123
 * components to find out what to call them.
 *
 * The tree is walked under the parser's own types rather than read a field at a time. A Vite
 * upgrade that reshapes a node then fails to compile here, instead of reading every page as empty.
 */

import { type ESTree, parseSync } from "vite";

/**
 * One specimen file, as the reader takes it.
 */
export interface Source {
  /**
   * Where the file is, absolute.
   */
  path: string;

  /**
   * Its text, unparsed.
   */
  text: string;
}

/**
 * One page, as a navigation rail knows it before anything loads.
 */
export interface Entry {
  /**
   * What the page opens on. Empty where the file stated none.
   */
  about: string;

  /**
   * Which group a rail lists it under. Empty where the file stated none.
   */
  group: string;

  /**
   * What addresses the page.
   */
  id: string;

  /**
   * Where the file is, which is what the emitted loader imports.
   */
  path: string;

  /**
   * What it is called, taken from the identifier where the file stated none.
   */
  title: string;
}

/**
 * One file that matched a pattern and could not be read as a page.
 */
export interface Refused {
  /**
   * Where the file is, absolute.
   */
  path: string;

  /**
   * What was wrong with it, as a catalogue shows it.
   */
  wrong: string;
}

/**
 * The page a file states, or why it states none.
 */
export type Read = Entry | Refused;

/**
 * Answers whether the reader refused a file.
 *
 * @param held - The reader's answer for one file.
 * @returns Whether it is a refusal rather than a page.
 */
export function isRefused(held: Read): held is Refused {
  return "wrong" in held;
}

/**
 * Finds the one object literal a call is made with.
 *
 * `satisfies` and `as` are looked through, being annotations on the object rather than a change
 * to what it holds.
 *
 * @param call - The call the default export states.
 * @returns The object literal, or nothing where the call takes anything else.
 */
function argued(call: ESTree.CallExpression): ESTree.ObjectExpression | undefined {
  let [only] = call.arguments;

  while (only?.type === "TSSatisfiesExpression" || only?.type === "TSAsExpression") {
    only = only.expression;
  }

  return only?.type === "ObjectExpression" && call.arguments.length === 1 ? only : undefined;
}

/**
 * Finds the object literal a file's default export is called with, or says why there is none.
 *
 * Three conditions, checked in the order a reader would notice them failing. Neither the name of
 * the function nor where it was imported from is checked: the conditions already refuse everything
 * an index cannot use, and insisting on a name would need the plugin told which one to expect.
 *
 * @param path - Where the file is.
 * @param text - Its source.
 * @returns The object literal, or the reason the file has none.
 */
function declared(path: string, text: string): ESTree.ObjectExpression | string {
  const parsed = parseSync(path, text);

  if (parsed.errors.length > 0) return `could not be parsed: ${parsed.errors[0]?.message}`;

  const found = parsed.program.body.find((one) => one.type === "ExportDefaultDeclaration");

  if (found === undefined) return "states no default export";

  const call = found.declaration;

  if (call.type !== "CallExpression") return "states a default export that is not a call";

  return argued(call) ?? "calls with something other than one object";
}

/**
 * Reads the name a property is stated under, where the source holds it as text.
 *
 * @param property - One property of the object literal.
 * @returns Its name, or nothing where the name is computed.
 */
function nameOf(property: ESTree.ObjectProperty): string | undefined {
  const { computed, key } = property;

  if (key.type === "Identifier" && !computed) return key.name;
  if (key.type === "Literal" && typeof key.value === "string") return key.value;

  return undefined;
}

/**
 * Reads the string literals an object states, by the names it states them under.
 *
 * A field holding anything but a string literal is left out rather than guessed at, which is what
 * makes a missing `id` and a computed one the same answer to the caller.
 *
 * @param object - The object literal.
 * @returns Each string-literal field, by name.
 */
function stated(object: ESTree.ObjectExpression): Record<string, string> {
  const found: Record<string, string> = {};

  for (const one of object.properties) {
    if (one.type !== "Property") continue;

    const name = nameOf(one);
    const { value } = one;

    if (name !== undefined && value.type === "Literal" && typeof value.value === "string") {
      found[name] = value.value;
    }
  }

  return found;
}

/**
 * Reads a name into the heading a reader sees.
 *
 * @param name - The last part of a page's identifier.
 * @returns The same, as a heading.
 */
function headingOf(name: string): string {
  const words = name.replaceAll("-", " ");

  return words.slice(0, 1).toUpperCase() + words.slice(1);
}

/**
 * Reads one file into the page it states, or the reason it states none.
 *
 * @param file - The file, with its text.
 * @returns The page, or the refusal.
 */
function entry(file: Source): Read {
  const object = declared(file.path, file.text);

  if (typeof object === "string") return { path: file.path, wrong: object };

  const fields = stated(object);
  const id = fields["id"];

  if (id === undefined)
    return { path: file.path, wrong: "states no id the source holds as a literal" };

  return {
    about: fields["about"] ?? "",
    group: fields["group"] ?? "",
    id,
    path: file.path,
    title: fields["title"] ?? headingOf(id.slice(id.lastIndexOf("/") + 1)),
  };
}

/**
 * Reads specimen files into what an index lists.
 *
 * Answers one thing per file rather than stopping at the first it cannot read, so a build can
 * name every wrong file at once and a dev server can list the page and say what is wrong with it.
 * Two files stating one identifier are the same kind of wrong: the second is refused, naming the
 * first, because two pages at one address leave the second unreachable and nothing to say so.
 *
 * @param files - Every file the patterns matched.
 * @returns One page or refusal per file, in the order given.
 */
export function read(files: readonly Source[]): readonly Read[] {
  const seen = new Map<string, string>();

  return files.map((file) => {
    const held = entry(file);

    if (isRefused(held)) return held;

    const already = seen.get(held.id);

    if (already !== undefined) {
      return { path: file.path, wrong: `states the id ${held.id}, which ${already} states too` };
    }

    seen.set(held.id, file.path);

    return held;
  });
}
