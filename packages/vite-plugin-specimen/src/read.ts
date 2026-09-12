/**
 * Reading a specimen's metadata out of its source, without running it.
 *
 * A page states what it is called and where it belongs as string literals, which the source text
 * holds and a parser can lift. Its scenes hold components, which it cannot, and which are the whole
 * reason an index is worth building: a rail listing 123 pages has no business loading 123
 * components to find out what to call them.
 */

import { parseSync } from "vite";

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
 * Holds an AST node, whose shape is read a field at a time rather than asserted whole.
 */
type Node = Record<string, unknown>;

/**
 * Answers whether a value is a node this reader can look into.
 *
 * @param value - The value the parser put at that position.
 * @returns Whether it holds fields.
 */
function walkable(value: unknown): value is Node {
  return typeof value === "object" && value !== null;
}

/**
 * Reads one field of a node, where it holds a node there.
 *
 * @param node - The node to read.
 * @param field - Which field.
 * @returns The node at that field, or nothing where there is none.
 */
function at(node: Node, field: string): Node | undefined {
  const held: unknown = Reflect.get(node, field);

  return walkable(held) ? held : undefined;
}

/**
 * Answers whether a node is of a kind.
 *
 * @param node - The node to test.
 * @param kind - The `type` it would carry.
 * @returns Whether it is that kind.
 */
function isa(node: Node | undefined, kind: string): boolean {
  return node !== undefined && Reflect.get(node, "type") === kind;
}

/**
 * Refuses a file, naming it and what was wrong with it.
 *
 * @param path - Where the file is.
 * @param wrong - The reason it could not be accepted.
 * @throws Error Always. That is the point of it.
 */
function refuse(path: string, wrong: string): never {
  throw new Error(`${path}: ${wrong}`);
}

/**
 * Finds a program's default export, where it states one.
 *
 * @param program - The parsed program, whose shape is read rather than asserted.
 * @returns The declaration, or nothing where the file exports no default.
 */
function exported(program: unknown): Node | undefined {
  const body: unknown = walkable(program) ? Reflect.get(program, "body") : undefined;

  for (const one of Array.isArray(body) ? body : []) {
    if (walkable(one) && isa(one, "ExportDefaultDeclaration")) return one;
  }

  return undefined;
}

/**
 * Finds the object literal a file's default export is called with.
 *
 * Three conditions, checked in the order a reader would notice them failing. Neither the name of
 * the function nor where it was imported from is checked: the conditions already refuse everything
 * an index cannot use, and insisting on a name would need the plugin told which one to expect.
 *
 * @param path - Where the file is.
 * @param text - Its source.
 * @returns The object literal, as a node.
 * @throws Error Where the file meets none of the three conditions.
 */
function declared(path: string, text: string): Node {
  const parsed = parseSync(path, text, { lang: "tsx" });

  if (parsed.errors.length > 0) refuse(path, `could not be parsed: ${parsed.errors[0]?.message}`);

  const found = exported(parsed.program);

  if (found === undefined) refuse(path, "states no default export");

  const call = at(found, "declaration");

  if (call === undefined || !isa(call, "CallExpression")) {
    refuse(path, "states a default export that is not a call");
  }

  const args: unknown = Reflect.get(call, "arguments");
  const given: readonly unknown[] = Array.isArray(args) ? args : [];
  const only = given.length === 1 ? given[0] : undefined;

  if (!walkable(only) || !isa(only, "ObjectExpression")) {
    refuse(path, "calls with something other than one object");
  }

  return only;
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
function stated(object: Node): Record<string, string> {
  const properties: unknown = Reflect.get(object, "properties");
  const found: Record<string, string> = {};

  for (const one of Array.isArray(properties) ? properties : []) {
    if (!walkable(one) || !isa(one, "Property")) continue;

    const key = at(one, "key");
    const value = at(one, "value");
    const name: unknown = key === undefined ? undefined : Reflect.get(key, "name");
    const held: unknown = value === undefined ? undefined : Reflect.get(value, "value");

    if (typeof name === "string" && isa(value, "Literal") && typeof held === "string") {
      found[name] = held;
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
 * Reads specimen files into the entries an index lists.
 *
 * Answers the entries rather than writing them, so one reading serves the virtual module the plugin
 * emits and whatever destination another caller needs.
 *
 * @param files - Every file the patterns matched.
 * @returns One entry per file, in the order given.
 * @throws Error Where a file states no readable page, or two files state one identifier.
 */
export function read(files: readonly Source[]): readonly Entry[] {
  const entries: Entry[] = [];
  const seen = new Map<string, string>();

  for (const file of files) {
    const fields = stated(declared(file.path, file.text));
    const id = fields["id"];

    if (id === undefined) refuse(file.path, "states no id the source holds as a literal");

    const already = seen.get(id);

    if (already !== undefined)
      refuse(file.path, `states the id ${id}, which ${already} states too`);

    seen.set(id, file.path);
    entries.push({
      about: fields["about"] ?? "",
      group: fields["group"] ?? "",
      id,
      path: file.path,
      title: fields["title"] ?? headingOf(id.slice(id.lastIndexOf("/") + 1)),
    });
  }

  return entries;
}
