import { expect, test } from "vite-plus/test";

import { type Specimen } from "@stealthscale/foundation-specimen";
import { withScratchWorkspace } from "@stealthscale/testing";

import { ID, index, specimenIndex } from "#plugin.ts";
import { type Entry } from "#read.ts";

/**
 * Answers whether the format declares a field as text a reader can lift from source.
 *
 * `false` where the field holds anything else, which the assignments below then refuse to compile.
 * A field that stopped being text would otherwise read as empty in every catalogue, quietly, since
 * the reader keeps only string literals and has nothing to complain to.
 *
 * @typeParam Field - Which field of a page.
 */
type Lifts<Field extends keyof Specimen> = Specimen[Field] extends string | undefined
  ? true
  : false;

/**
 * Answers whether the format makes a field mandatory.
 *
 * @typeParam Field - Which field of a page.
 */
type Needs<Field extends keyof Specimen> = undefined extends Specimen[Field] ? false : true;

/**
 * Answers whether the reader states a field, whatever the format calls optional.
 *
 * @typeParam Field - Which field of an entry.
 */
type States<Field extends keyof Entry> = Entry[Field] extends string ? true : false;

/**
 * Writes a specimen stating an identifier and nothing else.
 *
 * @param id - The address the page states.
 * @returns The file's text.
 */
function page(id: string): string {
  return `import { specimen } from "somewhere";\n\nexport default specimen({ id: "${id}", scenes: [] });\n`;
}

test("answers the virtual module for its own identifier and nothing else", () => {
  const plugin = specimenIndex({ patterns: ["**/*.specimen.tsx"] });

  expect(plugin.name).toBe("stealthscale:specimen-index");
  expect(typeof plugin.resolveId).toBe("function");
  expect(typeof plugin.load).toBe("function");
});

test("emits one entry per file the patterns matched", () => {
  const held = withScratchWorkspace(
    { "a/one.specimen.tsx": page("one"), "b/two.specimen.tsx": page("two") },
    (scratch) => index({ command: "build", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toContain('"id": "one"');
  expect(held).toContain('"id": "two"');
});

test("emits a dynamic import per entry, which is what splits a chunk behind each", () => {
  const held = withScratchWorkspace({ "one.specimen.tsx": page("one") }, (scratch) =>
    index({ command: "build", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toMatch(/load:\s*\(\)\s*=>\s*import\(/u);
});

test("says where a file is against the root, so no machine's layout reaches a bundle", () => {
  const held = withScratchWorkspace({ "pages/one.specimen.tsx": page("one") }, (scratch) =>
    index({ command: "build", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toContain('"path": "pages/one.specimen.tsx"');
  expect(held).not.toMatch(/"path":\s*"\//u);
});

test("imports the file by its real path, which is what the bundler resolves", () => {
  const held = withScratchWorkspace({ "pages/one.specimen.tsx": page("one") }, (scratch) =>
    index({ command: "build", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toContain(`import("/`);
});

test("emits a source loader, so a catalogue can show what drew a page", () => {
  const held = withScratchWorkspace({ "one.specimen.tsx": page("one") }, (scratch) =>
    index({ command: "build", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toMatch(/source:\s*\(\)\s*=>\s*import\([^)]*\?raw/u);
});

test("takes more than one pattern, a catalogue gathering directories that share no parent", () => {
  const held = withScratchWorkspace(
    { "here/one.specimen.tsx": page("one"), "there/two.specimen.tsx": page("two") },
    (scratch) =>
      index({ command: "build", root: scratch.root }, [
        "here/**/*.specimen.tsx",
        "there/**/*.specimen.tsx",
      ]),
  );

  expect(held).toContain('"id": "one"');
  expect(held).toContain('"id": "two"');
});

test("refuses a pattern matching nothing, which is a mistyped pattern rather than a catalogue", () => {
  expect(() =>
    withScratchWorkspace({ "one.specimen.tsx": page("one") }, (scratch) =>
      index({ command: "build", root: scratch.root }, ["nowhere/**/*.specimen.tsx"]),
    ),
  ).toThrow(/matched no file/u);
});

test("stops a build on a file it cannot read", () => {
  expect(() =>
    withScratchWorkspace({ "one.specimen.tsx": "export default 1;\n" }, (scratch) =>
      index({ command: "build", root: scratch.root }, ["**/*.specimen.tsx"]),
    ),
  ).toThrow(/one\.specimen\.tsx/u);
});

test("keeps serving where one file cannot be read, the rest of a catalogue still working", () => {
  const held = withScratchWorkspace(
    { "bad.specimen.tsx": "export default 1;\n", "good.specimen.tsx": page("good") },
    (scratch) => index({ command: "serve", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toContain('"id": "good"');
  expect(held).toContain("bad.specimen.tsx");
});

test("gives the file it could not read a loader that throws, so opening it shows why", () => {
  const held = withScratchWorkspace({ "bad.specimen.tsx": "export default 1;\n" }, (scratch) =>
    index({ command: "serve", root: scratch.root }, ["**/*.specimen.tsx"]),
  );

  expect(held).toMatch(/load:\s*\(\)\s*=>\s*Promise\.reject/u);
});

test("lifts only the fields the format declares as text", () => {
  const about: Lifts<"about"> = true;
  const group: Lifts<"group"> = true;
  const id: Lifts<"id"> = true;
  const title: Lifts<"title"> = true;

  expect([about, group, id, title]).toStrictEqual([true, true, true, true]);
});

test("refuses a page without the one field the format makes mandatory", () => {
  const id: Needs<"id"> = true;

  expect(id).toBe(true);
});

test("fills in what the format leaves optional, an entry stating all four", () => {
  const about: States<"about"> = true;
  const group: States<"group"> = true;
  const title: States<"title"> = true;

  expect([about, group, title]).toStrictEqual([true, true, true]);
});

test("reads the scenes as something no source text hands over", () => {
  const scenes: Specimen["scenes"] = [];

  expect(Array.isArray(scenes)).toBe(true);
  expect("scenes" in ({} as Entry)).toBe(false);
});

test("names the identifier a catalogue imports, which nothing else should claim", () => {
  expect(ID).toBe("virtual:specimen-index");
});
