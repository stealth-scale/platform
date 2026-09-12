/**
 * The plugin: finding specimen files, and emitting what a catalogue lists them from.
 *
 * Everything here is about where the reading goes. Finding files is a glob, reading them is
 * `read`, and what is left is generating a module holding the metadata beside a loader per page.
 * A loader is a dynamic import, which is what makes the bundler split a chunk behind each file and
 * keeps every component out of the chunk a rail draws from.
 */

import { globSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import {
  createFilter,
  type EnvironmentModuleGraph,
  type EnvironmentModuleNode,
  type HotUpdateOptions,
  normalizePath,
  type Plugin,
  type ResolvedConfig,
} from "vite";

import { type Entry, isRefused, type Read, read, type Source } from "#read.ts";

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
 * The module Vite answers for a file imported with `?raw`.
 */
export interface Raw {
  /**
   * The file's text.
   */
  default: string;
}

/**
 * One page, as the emitted module lists it, with the means to open it.
 *
 * What `virtual:specimen-index` exports as `pages`. A file the reader refused is listed too, under
 * its filename, with the reason as its opening and a loader that rejects with the same; a rail
 * still shows the page, and opening it says what is wrong.
 */
export interface Indexed extends Entry {
  /**
   * Loads the module holding the scenes.
   *
   * A dynamic import, so the bundler splits the file into a chunk of its own and keeps everything
   * it imports out of the chunk holding this index.
   */
  load: () => Promise<unknown>;

  /**
   * Where the file is, against the project root, with forward slashes on every platform.
   *
   * Narrowed from what the reader answers. An absolute path would put one machine's directory
   * layout in the bundle, and two machines building the same tree would emit different output.
   */
  path: string;

  /**
   * Loads the file's own text, for a catalogue showing what drew a page.
   *
   * Vite's `?raw` suffix answers a module whose default export is the source, and it splits like
   * any other dynamic import, so a page costs its text only where somebody asks to read it.
   */
  source: () => Promise<Raw>;
}

/**
 * What this plugin reads off a resolved configuration.
 *
 * Narrowed from Vite's own, so a specification can state one in two fields rather than building a
 * whole configuration to drive one hook.
 */
type Resolved = Pick<ResolvedConfig, "command" | "root">;

/**
 * What the update hook reaches for on the environment it is called in.
 *
 * Narrowed to the one lookup it makes, so a specification can hand it a graph of one entry.
 */
interface Watching {
  /**
   * The environment a file changed in.
   */
  environment: {
    /**
     * Its module graph, which knows whether the index was ever loaded.
     */
    moduleGraph: Pick<EnvironmentModuleGraph, "getModuleById">;
  };
}

/**
 * Reads every file the patterns matched, in a stable order.
 *
 * Sorted rather than left as the filesystem answered, so two machines building the same tree emit
 * the same module and a diff of the output says something. Paths are absolute and forward-slashed,
 * which is how Vite names a file when it reports one changed.
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
    const at = normalizePath(resolve(root, path));

    return { path: at, text: readFileSync(at, "utf8") };
  });
}

/**
 * Says where a file is, as a catalogue should show it.
 *
 * @param path - Where the file is, absolute.
 * @param root - The directory to say it against.
 * @returns The path a reader sees.
 */
function shown(path: string, root: string): string {
  return relative(root, path).replaceAll("\\", "/");
}

/**
 * Writes one page as the module lists it, with the loaders a catalogue opens it through.
 *
 * The import stays absolute, being what the bundler resolves. Only what a catalogue reads is said
 * against the root.
 *
 * @param held - The reader's answer for the file.
 * @param root - The directory paths are shown against.
 * @returns The listing, as source.
 */
function listing(held: Read, root: string): string {
  const at = shown(held.path, root);
  const fields = isRefused(held)
    ? { about: held.wrong, group: "", id: at, path: at, title: at.slice(at.lastIndexOf("/") + 1) }
    : { about: held.about, group: held.group, id: held.id, path: at, title: held.title };
  const load = isRefused(held)
    ? `Promise.reject(new Error(${JSON.stringify(held.wrong)}))`
    : `import(${JSON.stringify(held.path)})`;
  const body = JSON.stringify(fields, null, 2).slice(1, -1).trimEnd();

  return `  {${body},\n    load: () => ${load},\n    source: () => import(${JSON.stringify(`${held.path}?raw`)}),\n  }`;
}

/**
 * Reads the files and writes a listing for each, by path.
 *
 * A build stops here, naming every file it cannot read. A dev server lists each such file with a
 * loader that rejects instead, leaving every other page of the catalogue working: taking the whole
 * catalogue down because one file is half-written is the wrong trade in the loop where files are
 * half-written most often.
 *
 * @param resolved - The root and command the bundler settled on.
 * @param files - The files to read.
 * @returns Each file's listing, by its path, in the order given.
 * @throws Error Where a build met a file it cannot read.
 */
function listings(resolved: Resolved, files: readonly Source[]): ReadonlyMap<string, string> {
  const held = read(files);
  const wrong = held.filter((one) => isRefused(one));

  if (wrong.length > 0 && resolved.command !== "serve") {
    const named = wrong.map((one) => `  ${one.path}: ${one.wrong}`).join("\n");

    throw new Error(`specimen: could not index ${wrong.length} of ${held.length} files:\n${named}`);
  }

  return new Map(held.map((one) => [one.path, listing(one, resolved.root)]));
}

/**
 * Writes the module a catalogue imports.
 *
 * @param lines - Every listing, in the order the pages are shown.
 * @returns The module's source.
 */
function written(lines: Iterable<string>): string {
  return `export const pages = [\n${[...lines].join(",\n")},\n];\n`;
}

/**
 * Indexes specimens, and emits that index as a virtual module.
 *
 * @param options - Where to look. `Options` documents every member.
 * @returns The plugin, as any Vite or rolldown build takes one.
 */
export function specimenIndex(options: Options): Plugin {
  let resolved: Resolved = { command: "build", root: process.cwd() };
  let last: ReadonlyMap<string, string> = new Map();

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
     * Reloads the index when a specimen appears, disappears, or changes what it states.
     *
     * A change to a scene alone is left to the page: the file is read again and its listing
     * compared with the one the index holds, and where they agree the rail has nothing to redraw.
     * A file the index refused is read the same way, so fixing it puts the page back without a
     * restart.
     *
     * @param options - The file, what happened to it, and the modules the change reached.
     * @returns The same modules with the index added, or nothing where the index is unaffected.
     */
    async hotUpdate(
      this: Watching,
      { file, modules, read: text, type }: HotUpdateOptions,
    ): Promise<EnvironmentModuleNode[] | undefined> {
      if (!createFilter(options.patterns, undefined, { resolve: resolved.root })(file)) {
        return undefined;
      }

      if (type === "update") {
        const fresh = listings(resolved, [{ path: file, text: await text() }]).get(file);

        if (fresh === last.get(file)) return undefined;
      }

      const index = this.environment.moduleGraph.getModuleById(RESOLVED);

      return index === undefined ? undefined : [...modules, index];
    },

    /**
     * Writes the index, reading every file the patterns matched.
     *
     * @param id - Whichever module is being loaded.
     * @returns The module's source, or nothing where the module is not this one.
     * @throws Error Where the patterns matched nothing, or a build met a file it cannot read.
     */
    load(id: string): string | undefined {
      if (id !== RESOLVED) return undefined;

      last = listings(resolved, found(resolved.root, options.patterns));

      return written(last.values());
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
