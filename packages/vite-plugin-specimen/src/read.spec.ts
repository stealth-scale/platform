import { expect, test } from "vite-plus/test";

import { type Entry, isRefused, read, type Refused, type Source } from "#read.ts";

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

/**
 * Reads one file the case expects to be a page.
 *
 * @param held - The file.
 * @returns The page it states.
 * @throws Error Where the reader refused it.
 */
function page(held: Source): Entry {
  const [one] = read([held]);

  if (one === undefined || isRefused(one)) throw new Error("expected a page");

  return one;
}

/**
 * Reads one file the case expects to be refused.
 *
 * @param held - The file.
 * @returns The refusal.
 * @throws Error Where the reader answered a page.
 */
function refusal(held: Source): Refused {
  const [one] = read([held]);

  if (one === undefined || !isRefused(one)) throw new Error("expected a refusal");

  return one;
}

test("reads every field a page states", () => {
  const held = page(
    file(
      `{ about: "A word.", group: "Feedback", id: "feedback/badge", title: "Badge", scenes: [] }`,
    ),
  );

  expect(held).toStrictEqual({
    about: "A word.",
    group: "Feedback",
    id: "feedback/badge",
    path: "/src/badge/badge.specimen.tsx",
    title: "Badge",
  });
});

test("reads a group and an opening as empty where a page states neither", () => {
  const held = page(file(`{ id: "feedback/badge", scenes: [] }`));

  expect(held.group).toBe("");
  expect(held.about).toBe("");
});

test("calls a page after the last part of its identifier where it states no title", () => {
  expect(page(file(`{ id: "feedback/badge", scenes: [] }`)).title).toBe("Badge");
});

test("reads a hyphenated name as words, which is how a rail lists it", () => {
  expect(page(file(`{ id: "overlays/hover-card", scenes: [] }`)).title).toBe("Hover card");
});

test("keeps the file's path, which is what the emitted loader imports", () => {
  const held = page(file(`{ id: "a/b", scenes: [] }`, "/elsewhere/a.specimen.tsx"));

  expect(held.path).toBe("/elsewhere/a.specimen.tsx");
});

test("answers one entry per file, in the order given", () => {
  const held = read([
    file(`{ id: "b", scenes: [] }`, "/b.specimen.tsx"),
    file(`{ id: "a", scenes: [] }`, "/a.specimen.tsx"),
  ]);

  expect(held.map((one) => (isRefused(one) ? one.wrong : one.id))).toStrictEqual(["b", "a"]);
});

test("reads no scenes, a component being the thing kept out of the index", () => {
  const held = page(file(`{ id: "a", scenes: [{ draw: () => null, title: "One" }] }`));

  expect(held).not.toHaveProperty("scenes");
});

test("looks through `satisfies`, an annotation on the object rather than another value", () => {
  const held = page(file(`{ id: "feedback/badge", scenes: [] } satisfies Specimen`));

  expect(held.id).toBe("feedback/badge");
});

test("looks through `as const` the same way", () => {
  expect(page(file(`{ id: "feedback/badge", scenes: [] } as const`)).id).toBe("feedback/badge");
});

test("reads a field stated under a quoted name, the quotes changing nothing", () => {
  expect(page(file(`{ "id": "feedback/badge", scenes: [] }`)).id).toBe("feedback/badge");
});

test("walks past a spread, which states fields the source does not hold", () => {
  expect(page(file(`{ ...shared, id: "feedback/badge", scenes: [] }`)).id).toBe("feedback/badge");
});

test("does not mistake a computed key for the name it is computed from", () => {
  expect(refusal(file(`{ [id]: "feedback/badge", scenes: [] }`)).wrong).toMatch(/id/u);
});

test("parses a file by its own extension, so a `.ts` page is not read as JSX", () => {
  const held = page({
    path: "/a.specimen.ts",
    text: `const same = <Held>(held: Held): Held => held;\nexport default specimen({ id: "a" });\n`,
  });

  expect(held.id).toBe("a");
});

test("refuses a file whose default export is not a call, naming what it found", () => {
  const held = refusal({ path: "/a.specimen.tsx", text: `export default { id: "a" };\n` });

  expect(held).toStrictEqual({
    path: "/a.specimen.tsx",
    wrong: "states a default export that is not a call",
  });
});

test("refuses a file with no default export at all", () => {
  const held = refusal({ path: "/a.specimen.tsx", text: `export const a = 1;\n` });

  expect(held.wrong).toMatch(/default export/u);
});

test("refuses a call taking something other than one object", () => {
  expect(refusal(file(`"feedback/badge"`)).wrong).toMatch(/object/u);
  expect(refusal(file(`{ id: "a", scenes: [] }, extra`)).wrong).toMatch(/object/u);
});

test("refuses a page stating no identifier", () => {
  expect(refusal(file(`{ title: "Badge", scenes: [] }`)).wrong).toMatch(/id/u);
});

test("refuses an identifier the source does not hold as a literal", () => {
  expect(refusal(file(`{ id: idFor("badge"), scenes: [] }`)).wrong).toMatch(/id/u);
});

test("refuses the second of two pages at one address, naming the first", () => {
  const [, second] = read([
    file(`{ id: "feedback/badge", scenes: [] }`, "/one.specimen.tsx"),
    file(`{ id: "feedback/badge", scenes: [] }`, "/two.specimen.tsx"),
  ]);

  expect(second).toStrictEqual({
    path: "/two.specimen.tsx",
    wrong: "states the id feedback/badge, which /one.specimen.tsx states too",
  });
});

test("says what it could not parse where the source is not a program", () => {
  const held = refusal({ path: "/a.specimen.tsx", text: `export default specimen(` });

  expect(held.wrong).toMatch(/parsed/u);
});

test("answers for every file, one refusal costing one page rather than the rest", () => {
  const held = read([
    file(`{ id: "a", scenes: [] }`, "/a.specimen.tsx"),
    { path: "/b.specimen.tsx", text: "export default 1;\n" },
    file(`{ id: "c", scenes: [] }`, "/c.specimen.tsx"),
  ]);

  expect(held.map((one) => isRefused(one))).toStrictEqual([false, true, false]);
});
