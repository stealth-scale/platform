/**
 * The plugin: finding specimen files, and emitting what a catalogue lists them from.
 *
 * Everything here is about where the reading goes. Finding files is a glob, reading them is
 * `read`, and what is left is generating a module holding the metadata beside a loader per page.
 * A loader is a dynamic import, which is what makes the bundler split a chunk behind each file and
 * keeps every component out of the chunk a rail draws from.
 */

import { globSync, readFileSync } from "node:fs";
import { relative } from "node:path";
import { type Plugin, type ResolvedConfig } from "vite";

import { type Entry, read, type Source } from "#read.ts";

/**
 * What a catalogue imports to reach the index.
 */
export const ID = "virtual:specimen-index";

/**
 * What the module answers to once it has been resolved, which marks it as this plugin's.
 */
const RESOLVED = `\0${ID}`;

/**
 * Configures a specimen index.
 */
export interface Options {
  /**
   * Where to look, as globs resolved against the project root.
   *
   * More than one, because a catalogue gathers directories that share no parent, and because a
   * pattern pointing into `node_modules` is how an installed package's specimens would be found.
   */
  patterns: readonly string[];
}

/**
 * What this plugin reads off a resolved configuration.
 *
 * Narrowed from Vite's own, so a specification can state one in two fields rather than building a
 * whole configuration to drive one hook.
 */
type Resolved = Pick<ResolvedConfig, "command" | "root">;

/**
 * Reads every file the patterns matched, in a stable order.
 *
 * Sorted rather than left as the filesystem answered, so two machines building the same tree emit
 * the same module and a diff of the output says something.
 *
 * @param root - The directory patterns resolve against.
 * @param patterns - Where to look.
 * @returns Each file, with its text.
 * @throws Error Where the patterns together matched nothing.
 */
function found(root: string, patterns: readonly string[]): readonly Source[] {
  const paths = [...new Set(globSync([...patterns], { cwd: root }))].toSorted();

  if (paths.length === 0) {
    throw new Error(`specimen: ${patterns.join(", ")} matched no file under ${root}`);
  }

  return paths.map((path) => {
    const at = `${root}/${path}`;

    return { path: at, text: readFileSync(at, "utf8") };
  });
}

/**
 * Says where a file is, as a catalogue should show it.
 *
 * Relative to the root, and with forward slashes whatever the platform separates with. An absolute
 * path would bake one machine's directory layout into the bundle, and two machines building the
 * same tree would answer different output.
 *
 * @param path - Where the file is, absolute.
 * @param root - The directory to say it against.
 * @returns The path a reader sees.
 */
function shown(path: string, root: string): string {
  return relative(root, path).replaceAll("\\", "/");
}

/**
 * Writes one entry, with the loaders a catalogue opens it through.
 *
 * The import stays absolute, being what the bundler resolves. Only what a catalogue reads is said
 * against the root.
 *
 * @param entry - The entry the reader answered.
 * @param root - The directory paths are shown against.
 * @returns The entry, as source.
 */
function listed(entry: Entry, root: string): string {
  const held = JSON.stringify(
    {
      about: entry.about,
      group: entry.group,
      id: entry.id,
      path: shown(entry.path, root),
      title: entry.title,
    },
    null,
    2,
  );
  const body = held.slice(1, -1).trimEnd();

  return `  {${body},\n    load: () => import(${JSON.stringify(entry.path)}),\n    source: () => import(${JSON.stringify(`${entry.path}?raw`)}),\n  }`;
}

/**
 * Writes an entry standing in for a file the reader refused.
 *
 * Listed rather than left out, so a rail still shows the page and opening it says what is wrong
 * with it. Taking the whole catalogue down because one file is half-written is the wrong trade in
 * the loop where files are half-written most often.
 *
 * @param path - Where the file is, absolute.
 * @param wrong - The reason the reader refused it.
 * @param root - The directory paths are shown against.
 * @returns The entry, as source.
 */
function refused(path: string, wrong: string, root: string): string {
  const at = shown(path, root);
  const name = at.slice(at.lastIndexOf("/") + 1);
  const held = JSON.stringify({ about: wrong, group: "", id: at, path: at, title: name }, null, 2);
  const body = held.slice(1, -1).trimEnd();

  return `  {${body},\n    load: () => Promise.reject(new Error(${JSON.stringify(wrong)})),\n    source: () => import(${JSON.stringify(`${path}?raw`)}),\n  }`;
}

/**
 * Reads the files one at a time, so one refusal costs one page rather than the catalogue.
 *
 * @param files - Every file the patterns matched.
 * @param root - The directory paths are shown against.
 * @returns One listing per file, in the order given.
 */
function serving(files: readonly Source[], root: string): readonly string[] {
  return files.map((file) => {
    try {
      const [entry] = read([file]);

      return entry === undefined ? refused(file.path, "read nothing", root) : listed(entry, root);
    } catch (error) {
      return refused(file.path, error instanceof Error ? error.message : String(error), root);
    }
  });
}

/**
 * Writes the index for a root, reading every file the patterns matched.
 *
 * Separate from the hook that calls it, and exported, so a specification drives the whole of this
 * without a bundler and without reaching through `ObjectHook` to find a function.
 *
 * A build stops on the first file it cannot read. A dev server lists that file with a loader that
 * throws instead, leaving every other page of the catalogue working.
 *
 * @param resolved - The root and command the bundler settled on.
 * @param patterns - Where to look.
 * @returns The virtual module's source.
 * @throws Error Where the patterns matched nothing, or a build met a file it cannot read.
 */
export function index(resolved: Resolved, patterns: readonly string[]): string {
  const files = found(resolved.root, patterns);
  const entries =
    resolved.command === "serve"
      ? serving(files, resolved.root)
      : read(files).map((one) => listed(one, resolved.root));

  return `export const pages = [\n${entries.join(",\n")},\n];\n`;
}

/**
 * Indexes specimens, and emits that index as a virtual module.
 *
 * @param options - Where to look. `Options` documents every member.
 * @returns The plugin, as any Vite or rolldown build takes one.
 */
export function specimenIndex(options: Options): Plugin {
  let resolved: Resolved = { command: "build", root: process.cwd() };

  return {
    /**
     * Remembers the root patterns resolve against, and what the bundler is doing.
     *
     * Asked of the build rather than of the caller. A plugin reading the working directory
     * describes wherever the command was typed, and the bundler has already worked out the answer.
     *
     * @param config - The resolved configuration.
     */
    configResolved(config: Resolved): void {
      resolved = config;
    },

    /**
     * Writes the index, reading every file the patterns matched.
     *
     * A build stops on the first file it cannot read. A dev server lists that file with a loader
     * that throws instead, leaving every other page of the catalogue working.
     *
     * @param id - Whichever module is being loaded.
     * @returns The module's source, or nothing where the module is not this one.
     */
    load(id: string): string | undefined {
      return id === RESOLVED ? index(resolved, options.patterns) : undefined;
    },

    name: "stealthscale:specimen-index",

    /**
     * Claims the index's identifier, and leaves every other import alone.
     *
     * @param id - Whichever module is being resolved.
     * @returns The resolved identifier, or nothing where it is not this one.
     */
    resolveId(id: string): string | undefined {
      return id === ID ? RESOLVED : undefined;
    },
  };
}
