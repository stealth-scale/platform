import {
  build,
  createServer,
  type EnvironmentModuleNode,
  type HotUpdateOptions,
  type ViteDevServer,
} from "vite";
import { expect, test, vi } from "vite-plus/test";

import { withScratchWorkspace, withScratchWorkspaceAsync } from "@stealthscale/testing";

import { ID, specimenIndex } from "#plugin.ts";

/**
 * The two fields the plugin reads off a configuration.
 */
interface Resolved {
  command: "build" | "serve";
  root: string;
}

/**
 * The graph the update hook asks whether the index was loaded.
 */
interface Watching {
  environment: {
    moduleGraph: { getModuleById: (id: string) => EnvironmentModuleNode | undefined };
  };
}

/**
 * The hooks, as functions rather than as whatever `ObjectHook` allows.
 */
interface Hooks {
  configResolved: (config: Resolved) => void;
  hotUpdate: (
    this: Watching,
    options: HotUpdateOptions,
  ) => Promise<EnvironmentModuleNode[] | undefined>;
  load: (id: string) => string | undefined;
  resolveId: (id: string) => string | undefined;
}

/**
 * Stands in for the index's node in a module graph.
 */
const INDEX = { id: `\0${ID}` } as EnvironmentModuleNode;

/**
 * A graph holding the index, or holding nothing.
 *
 * @param loaded - Whether the index was ever imported in this environment.
 * @returns What the update hook is called on.
 */
function graph(loaded: boolean): Watching {
  return {
    environment: {
      moduleGraph: { getModuleById: (id) => (loaded && id === INDEX.id ? INDEX : undefined) },
    },
  };
}

/**
 * Builds the plugin and reaches its hooks as functions.
 *
 * @param patterns - Where to look.
 * @returns The hooks.
 */
function hooks(patterns: readonly string[]): Hooks {
  return specimenIndex({ patterns }) as unknown as Hooks;
}

/**
 * Writes a specimen stating an identifier and a title.
 *
 * @param id - The address the page states.
 * @param title - What it is called. Default: nothing stated.
 * @returns The file's text.
 */
function page(id: string, title = ""): string {
  const named = title === "" ? "" : `, title: "${title}"`;

  return `import { specimen } from "somewhere";\n\nexport default specimen({ id: "${id}"${named}, scenes: [] });\n`;
}

/**
 * Loads the index over a scratch tree, the way a build or a dev server would.
 *
 * @param files - The tree.
 * @param patterns - Where to look.
 * @param command - What the bundler is doing. Default: building.
 * @returns The module's source.
 */
function emitted(
  files: Readonly<Record<string, string>>,
  patterns: readonly string[],
  command: "build" | "serve" = "build",
): string {
  return withScratchWorkspace(files, (scratch) => {
    const held = hooks(patterns);

    held.configResolved({ command, root: scratch.root });

    return held.load(held.resolveId(ID) ?? "") ?? "";
  });
}

/**
 * What happened to one file, as the update hook is told.
 */
interface Change {
  file: string;
  loaded?: boolean;
  text?: string;
  type?: HotUpdateOptions["type"];
}

/**
 * Calls the update hook the way a dev server does, for one file that changed.
 *
 * @param held - The plugin's hooks.
 * @param change - The file, its text now, what happened to it (default: it changed), and whether
 *   the index was ever imported (default: it was).
 * @returns What the hook answered.
 */
function changed(
  held: Hooks,
  { file, loaded = true, text = "", type = "update" }: Change,
): Promise<EnvironmentModuleNode[] | undefined> {
  const options = { file, modules: [], read: () => text, type } as unknown as HotUpdateOptions;

  return held.hotUpdate.call(graph(loaded), options);
}

test("claims its own identifier and leaves every other import alone", () => {
  const held = hooks(["**/*.specimen.tsx"]);

  expect(held.resolveId(ID)).toBe(`\0${ID}`);
  expect(held.resolveId("./elsewhere.ts")).toBeUndefined();
  expect(held.load("./elsewhere.ts")).toBeUndefined();
});

test("emits one entry per file the patterns matched", () => {
  const held = emitted({ "a/one.specimen.tsx": page("one"), "b/two.specimen.tsx": page("two") }, [
    "**/*.specimen.tsx",
  ]);

  expect(held).toContain('"id": "one"');
  expect(held).toContain('"id": "two"');
});

test("emits a dynamic import per entry, which is what splits a chunk behind each", () => {
  const held = emitted({ "one.specimen.tsx": page("one") }, ["**/*.specimen.tsx"]);

  expect(held).toMatch(/load:\s*\(\)\s*=>\s*import\(/u);
});

test("says where a file is against the root, so no machine's layout reaches a bundle", () => {
  const held = emitted({ "pages/one.specimen.tsx": page("one") }, ["**/*.specimen.tsx"]);

  expect(held).toContain('"path": "pages/one.specimen.tsx"');
  expect(held).not.toMatch(/"path":\s*"\//u);
});

test("imports the file by its real path, which is what the bundler resolves", () => {
  const held = emitted({ "pages/one.specimen.tsx": page("one") }, ["**/*.specimen.tsx"]);

  expect(held).toContain(`import("/`);
});

test("emits a source loader, so a catalogue can show what drew a page", () => {
  const held = emitted({ "one.specimen.tsx": page("one") }, ["**/*.specimen.tsx"]);

  expect(held).toMatch(/source:\s*\(\)\s*=>\s*import\([^)]*\?raw/u);
});

test("takes more than one pattern, a catalogue gathering directories that share no parent", () => {
  const held = emitted(
    { "here/one.specimen.tsx": page("one"), "there/two.specimen.tsx": page("two") },
    ["here/**/*.specimen.tsx", "there/**/*.specimen.tsx"],
  );

  expect(held).toContain('"id": "one"');
  expect(held).toContain('"id": "two"');
});

test("refuses a pattern matching nothing, which is a mistyped pattern rather than a catalogue", () => {
  expect(() => emitted({ "one.specimen.tsx": page("one") }, ["nowhere/**/*.specimen.tsx"])).toThrow(
    /matched no file/u,
  );
});

test("stops a build on the files it cannot read, naming every one of them", () => {
  expect(() =>
    emitted(
      { "one.specimen.tsx": "export default 1;\n", "two.specimen.tsx": "export const a = 1;\n" },
      ["**/*.specimen.tsx"],
    ),
  ).toThrow(/2 of 2 files:\n {2}\S*one\.specimen\.tsx: .*\n {2}\S*two\.specimen\.tsx: /u);
});

test("keeps serving where one file cannot be read, the rest of a catalogue still working", () => {
  const held = emitted(
    { "bad.specimen.tsx": "export default 1;\n", "good.specimen.tsx": page("good") },
    ["**/*.specimen.tsx"],
    "serve",
  );

  expect(held).toContain('"id": "good"');
  expect(held).toContain('"id": "bad.specimen.tsx"');
});

test("gives the file it could not read a loader that rejects, so opening it shows why", () => {
  const held = emitted(
    { "bad.specimen.tsx": "export default 1;\n" },
    ["**/*.specimen.tsx"],
    "serve",
  );

  expect(held).toMatch(/load:\s*\(\)\s*=>\s*Promise\.reject/u);
  expect(held).toContain('"about": "states a default export that is not a call"');
});

test("leaves a change outside the patterns to the server", async () => {
  const held = hooks(["pages/**/*.specimen.tsx"]);

  held.configResolved({ command: "serve", root: "/anywhere" });

  await expect(changed(held, { file: "/anywhere/pages/one.tsx" })).resolves.toBeUndefined();
});

test("leaves a change to the scenes alone, the rail having nothing to redraw", async () => {
  await withScratchWorkspaceAsync({ "pages/one.specimen.tsx": page("one") }, async (scratch) => {
    const held = hooks(["pages/**/*.specimen.tsx"]);

    held.configResolved({ command: "serve", root: scratch.root });
    held.load(`\0${ID}`);

    const same = page("one").replace("scenes: []", "scenes: [variants]");

    await expect(
      changed(held, { file: scratch.path("pages/one.specimen.tsx"), text: same }),
    ).resolves.toBeUndefined();
  });
});

test("reloads the index when a page changes what it states about itself", async () => {
  await withScratchWorkspaceAsync({ "pages/one.specimen.tsx": page("one") }, async (scratch) => {
    const held = hooks(["pages/**/*.specimen.tsx"]);

    held.configResolved({ command: "serve", root: scratch.root });
    held.load(`\0${ID}`);

    const renamed = page("one", "One, renamed");

    await expect(
      changed(held, { file: scratch.path("pages/one.specimen.tsx"), text: renamed }),
    ).resolves.toStrictEqual([INDEX]);
  });
});

test("reloads the index when a page appears or disappears, without reading it", async () => {
  const held = hooks(["pages/**/*.specimen.tsx"]);

  held.configResolved({ command: "serve", root: "/anywhere" });

  await expect(
    changed(held, { file: "/anywhere/pages/new.specimen.tsx", type: "create" }),
  ).resolves.toStrictEqual([INDEX]);
  await expect(
    changed(held, { file: "/anywhere/pages/old.specimen.tsx", type: "delete" }),
  ).resolves.toStrictEqual([INDEX]);
});

test("has nothing to reload where the index was never imported in that environment", async () => {
  const held = hooks(["pages/**/*.specimen.tsx"]);

  held.configResolved({ command: "serve", root: "/anywhere" });

  await expect(
    changed(held, { file: "/anywhere/pages/new.specimen.tsx", loaded: false, type: "create" }),
  ).resolves.toBeUndefined();
});

/**
 * Starts a dev server over a scratch tree, with the plugin and nothing else.
 *
 * @param root - The tree.
 * @returns The server, which the caller closes.
 */
function served(root: string): Promise<ViteDevServer> {
  return createServer({
    configFile: false,
    logLevel: "silent",
    plugins: [specimenIndex({ patterns: ["pages/**/*.specimen.tsx"] })],
    root,
    server: { middlewareMode: true, watch: null },
  });
}

/**
 * Reads the index as a browser would receive it from a server.
 *
 * @param server - The server.
 * @returns The transformed module, or nothing where the server answered none.
 */
async function received(server: ViteDevServer): Promise<string> {
  return (await server.environments.client.transformRequest(ID))?.code ?? "";
}

/**
 * Writes a specimen that draws something imported, the way a real page draws a component.
 *
 * @param id - The address the page states.
 * @returns The file's text.
 */
function drawn(id: string): string {
  return [
    `import { HEAVY } from "../heavy.ts";`,
    ``,
    `const specimen = (page: { id: string; scenes: readonly unknown[] }): unknown => page;`,
    ``,
    `export default specimen({ id: "${id}", scenes: [{ draw: () => HEAVY, title: "One" }] });`,
    ``,
  ].join("\n");
}

test("serves the index through a dev server, the loaders rewritten to what a browser fetches", async () => {
  const held = await withScratchWorkspaceAsync(
    { "pages/one.specimen.tsx": page("one") },
    async (scratch) => {
      const server = await served(scratch.root);

      try {
        return await received(server);
      } finally {
        await server.close();
      }
    },
  );

  expect(held).toContain('"id": "one"');
  expect(held).toMatch(/import\("\/pages\/one\.specimen\.tsx/u);
});

test("reloads the index through a real server's own update pipeline when a page is renamed", async () => {
  const [before, after] = await withScratchWorkspaceAsync(
    { "pages/one.specimen.tsx": page("one") },
    async (scratch) => {
      const server = await served(scratch.root);

      try {
        const first = await received(server);

        scratch.write({ "pages/one.specimen.tsx": page("one", "One, renamed") });
        server.watcher.emit("change", scratch.path("pages/one.specimen.tsx"));

        const second = await vi.waitFor(
          async () => {
            const code = await received(server);

            expect(code).toContain("One, renamed");

            return code;
          },
          { interval: 20, timeout: 2000 },
        );

        return [first, second];
      } finally {
        await server.close();
      }
    },
  );

  expect(before).toContain('"title": "One"');
  expect(after).toContain('"title": "One, renamed"');
});

test("builds one chunk behind each page, keeping what a page imports out of the index", async () => {
  const chunks = await withScratchWorkspaceAsync(
    {
      "heavy.ts": `export const HEAVY = "heavy-component-marker";\n`,
      "main.ts": `import { pages } from "virtual:specimen-index";\n\nconsole.log(pages);\n`,
      "pages/one.specimen.tsx": drawn("one"),
      "pages/two.specimen.tsx": drawn("two"),
    },
    async (scratch) => {
      const built = await build({
        build: { rolldownOptions: { input: "main.ts" }, write: false },
        configFile: false,
        logLevel: "silent",
        plugins: [specimenIndex({ patterns: ["pages/**/*.specimen.tsx"] })],
        root: scratch.root,
      });
      const first = Array.isArray(built) ? built[0] : built;

      if (first === undefined || !("output" in first)) throw new Error("expected one build");

      return first.output.filter((one) => one.type === "chunk");
    },
  );
  const entry = chunks.find((one) => one.isEntry);
  const pages = chunks.filter((one) => one.facadeModuleId?.endsWith(".specimen.tsx") === true);

  expect(pages).toHaveLength(2);
  // Read back by path rather than by id, a build being minified: the key loses its quotes and the
  // minifier rewrites every string as a template, so nothing about how the pair is punctuated
  // survives. A path is content rather than syntax and comes through as it was written.
  expect(entry?.code).toContain("pages/one.specimen.tsx");
  expect(entry?.code).not.toContain("heavy-component-marker");
  expect(chunks.some((one) => one.code.includes("heavy-component-marker"))).toBe(true);
});

test("names the identifier a catalogue imports, which nothing else should claim", () => {
  expect(ID).toBe("virtual:specimen-index");
});
