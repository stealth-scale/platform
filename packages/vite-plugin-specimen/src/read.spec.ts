import { expect, test } from "vite-plus/test";

import { read, type Source } from "#read.ts";

/**
 * Writes a specimen file around whatever a page declares.
 *
 * @param declared - The object literal the default export is called with.
 * @param path - Where the file is. Default: a badge under feedback.
 * @returns The file, as the reader takes it.
 */
function file(declared: string, path = "/src/badge/badge.specimen.tsx"): Source {
  return {
    path,
    text: `import { specimen } from "somewhere";\n\nexport default specimen(${declared});\n`,
  };
}

test("reads every field a page states", () => {
  const [held] = read([
    file(
      `{ about: "A word.", group: "Feedback", id: "feedback/badge", title: "Badge", scenes: [] }`,
    ),
  ]);

  expect(held).toStrictEqual({
    about: "A word.",
    group: "Feedback",
    id: "feedback/badge",
    path: "/src/badge/badge.specimen.tsx",
    title: "Badge",
  });
});

test("reads a group and an opening as empty where a page states neither", () => {
  const [held] = read([file(`{ id: "feedback/badge", scenes: [] }`)]);

  expect(held?.group).toBe("");
  expect(held?.about).toBe("");
});

test("calls a page after the last part of its identifier where it states no title", () => {
  const [held] = read([file(`{ id: "feedback/badge", scenes: [] }`)]);

  expect(held?.title).toBe("Badge");
});

test("reads a hyphenated name as words, which is how a rail lists it", () => {
  const [held] = read([file(`{ id: "overlays/hover-card", scenes: [] }`)]);

  expect(held?.title).toBe("Hover card");
});

test("keeps the file's path, which is what the emitted loader imports", () => {
  const [held] = read([file(`{ id: "a/b", scenes: [] }`, "/elsewhere/a.specimen.tsx")]);

  expect(held?.path).toBe("/elsewhere/a.specimen.tsx");
});

test("answers one entry per file, in the order given", () => {
  const held = read([
    file(`{ id: "b", scenes: [] }`, "/b.specimen.tsx"),
    file(`{ id: "a", scenes: [] }`, "/a.specimen.tsx"),
  ]);

  expect(held.map((one) => one.id)).toStrictEqual(["b", "a"]);
});

test("reads no scenes, a component being the thing kept out of the index", () => {
  const [held] = read([file(`{ id: "a", scenes: [{ draw: () => null, title: "One" }] }`)]);

  expect(held).not.toHaveProperty("scenes");
});

test("refuses a file whose default export is not a call, naming the file", () => {
  expect(() => read([{ path: "/a.specimen.tsx", text: `export default { id: "a" };\n` }])).toThrow(
    "/a.specimen.tsx",
  );
});

test("refuses a file with no default export at all", () => {
  expect(() => read([{ path: "/a.specimen.tsx", text: `export const a = 1;\n` }])).toThrow(
    /default export/u,
  );
});

test("refuses a call taking something other than one object", () => {
  expect(() => read([file(`"feedback/badge"`)])).toThrow(/object/u);
});

test("refuses a page stating no identifier", () => {
  expect(() => read([file(`{ title: "Badge", scenes: [] }`)])).toThrow(/id/u);
});

test("refuses an identifier the source does not hold as a literal", () => {
  expect(() => read([file(`{ id: idFor("badge"), scenes: [] }`)])).toThrow(/id/u);
});

test("refuses two pages at one address, the second being unreachable otherwise", () => {
  expect(() =>
    read([
      file(`{ id: "feedback/badge", scenes: [] }`, "/one.specimen.tsx"),
      file(`{ id: "feedback/badge", scenes: [] }`, "/two.specimen.tsx"),
    ]),
  ).toThrow(/feedback\/badge/u);
});

test("says what it could not parse where the source is not a program", () => {
  expect(() => read([{ path: "/a.specimen.tsx", text: `export default specimen(` }])).toThrow(
    "/a.specimen.tsx",
  );
});
