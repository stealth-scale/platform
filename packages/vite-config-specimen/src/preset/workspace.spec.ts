import { expect, test } from "vite-plus/test";

import { workspace } from "#preset/workspace.ts";

/**
 * Reads what a relaxation states, which the contribution carries as its item.
 *
 * @param files - Which files the layers were asked for.
 * @returns The files and rules of each, in the order they compose.
 */
function stated(
  files?: readonly string[],
): Array<{ files: string[]; rules: Record<string, string> }> {
  return workspace(files).map(
    (one) => (one as { item: { files: string[]; rules: Record<string, string> } }).item,
  );
}

test("states every layer at the root, where the linter is the only reader", () => {
  expect(workspace()).toHaveLength(5);
});

test("appends to the overrides rather than replacing what a repository states itself", () => {
  const at = workspace().map((one) => (one as { at?: string }).at);

  expect(at).toStrictEqual(Array.from({ length: 5 }, () => "lint.overrides"));
});

test("owns what it hands over, so a name says where the layer came from", () => {
  expect(workspace().every((one) => one.name.startsWith("specimen/"))).toBe(true);
});

test("lets a specimen be read by its default export, having nowhere else to put one", () => {
  const rules = stated().flatMap((one) => Object.keys(one.rules));

  expect(rules).toContain("no-default-export");
});

test("turns off the four rules a scene file is refused by", () => {
  const rules = stated().flatMap((one) => Object.keys(one.rules));

  expect(rules).toContain("react/only-export-components");
  expect(rules).toContain("react/no-multi-comp");
  expect(rules).toContain("react/refs");
});

test("asks for no docblock, a specimen being documented by the captions it draws", () => {
  const rules = stated().flatMap((one) => Object.keys(one.rules));

  expect(rules.some((one) => one.startsWith("jsdoc-js/"))).toBe(true);
});

test("takes the files as an argument, a repository naming its specimens differently", () => {
  for (const one of stated(["pages/**/*.demo.tsx"])) {
    expect(one.files).toStrictEqual(["pages/**/*.demo.tsx"]);
  }
});

test("says why each rule is off, a departure being the caller's to justify", () => {
  for (const one of workspace()) {
    expect((one as { because?: string }).because).toBeTruthy();
  }
});
