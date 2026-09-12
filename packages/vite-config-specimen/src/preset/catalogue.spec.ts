import { expect, test } from "vite-plus/test";

import { indexed, layers } from "#preset/catalogue.ts";

/**
 * The least a catalogue states, which is where to look.
 */
const STATED = { patterns: ["src/**/*.specimen.tsx"] };

test("appends to the plugin list rather than replacing whatever else is there", () => {
  expect(indexed(STATED).at).toBe("plugins");
});

test("carries the plugin the catalogue is indexed by", () => {
  expect(indexed(STATED).item).toBeDefined();
});

test("says why, which is that a rail lists a page before it loads one", () => {
  expect(indexed(STATED).because).toContain("before it loads one");
});

test("names itself, so a repository indexing differently can take the layer back", () => {
  expect(indexed(STATED).name).toBe("specimen.indexed");
});

test("owns what it hands over, so a name says where the layer came from", () => {
  expect(layers(STATED).every((one) => one.name.startsWith("specimen/"))).toBe(true);
});

test("names the page and every pattern as crawl entries, so no page opened costs a reload", () => {
  const entries = layers(STATED)
    .filter((one) => one.kind === "contribution" && one.at === "optimizeDeps.entries")
    .map((one) => (one as { item: string }).item);

  expect(entries).toStrictEqual(["**/*.html", "src/**/*.specimen.tsx"]);
});

test("answers a list, so a catalogue composes these with whatever tier it picked", () => {
  expect(layers(STATED).map((one) => one.name)).toStrictEqual([
    "specimen/specimen.indexed",
    "specimen/deps.crawled(**/*.html)",
    "specimen/deps.crawled(src/**/*.specimen.tsx)",
  ]);
});
