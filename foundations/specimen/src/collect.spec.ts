import { describe, expect, it } from "vite-plus/test";

import { collect, type Found, headingOf } from "#collect.ts";
import { type Scene } from "#specimen.ts";

/**
 * Stands in for whatever a scene draws.
 *
 * @returns Nothing, since what it draws is not what these cases are about.
 */
function draw(): null {
  return null;
}

/**
 * Writes one scene.
 *
 * @param title - What to call it.
 * @returns The scene.
 */
function shown(title: string): Scene {
  return { draw, title };
}

/**
 * Builds what an application would have handed over, for one file.
 *
 * @param page - What the file's default export declared.
 * @returns The module, keyed by one path.
 */
function found(page: unknown): Found {
  return { modules: { "./one.specimen.tsx": { default: page } } };
}

describe("collect", () => {
  it("reads what a page declared about itself", () => {
    const pages = collect(
      found({
        about: "Pressed.",
        group: "Controls",
        id: "controls/button",
        scenes: [shown("Variants")],
        title: "Button",
      }),
    );

    expect(pages).toHaveLength(1);
    expect(pages[0]?.about).toBe("Pressed.");
    expect(pages[0]?.group).toBe("Controls");
    expect(pages[0]?.id).toBe("controls/button");
    expect(pages[0]?.title).toBe("Button");
  });

  it("reads a title off the last part of the address, where the page states none", () => {
    const pages = collect(found({ id: "layout/scroll-area", scenes: [shown("One")] }));

    expect(pages[0]?.title).toBe("Scroll area");
  });

  it("leaves a page ungrouped where it names no group", () => {
    expect(collect(found({ id: "button", scenes: [shown("One")] }))[0]?.group).toBe("");
  });

  it("draws the scenes in the order the page lists them", () => {
    // The reason a page lists them at all. A module hands its names back alphabetically, so a page
    // written Variants, States, Anatomy read off its own exports would come back the other way
    // round — quietly, and in every catalogue built on it.
    const pages = collect(
      found({
        id: "controls/button",
        scenes: [shown("Variants"), shown("States"), shown("Anatomy")],
      }),
    );

    expect(pages[0]?.scenes.map((scene) => scene.title)).toEqual(["Variants", "States", "Anatomy"]);
  });

  it("keeps only what can be drawn, so a stray entry cannot break the page", () => {
    const pages = collect(
      found({ id: "controls/button", scenes: [shown("One"), "not a scene", null] }),
    );

    expect(pages[0]?.scenes).toHaveLength(1);
  });

  it("skips a file that names no address, rather than inventing one for it", () => {
    expect(collect(found({ about: "Half written.", scenes: [shown("One")] }))).toEqual([]);
    expect(collect(found("not an object"))).toEqual([]);
    expect(collect({ modules: {} })).toEqual([]);
    expect(collect({ modules: { "./one.specimen.tsx": "not a module" } })).toEqual([]);
  });

  it("skips a file that lists no scene, which is a page with no reason to exist", () => {
    expect(collect(found({ id: "controls/button" }))).toEqual([]);
    expect(collect(found({ id: "controls/button", scenes: [] }))).toEqual([]);
    expect(collect(found({ id: "controls/button", scenes: "not a list" }))).toEqual([]);
  });

  it("reads every file it was handed", () => {
    const pages = collect({
      modules: {
        "./a.specimen.tsx": { default: { id: "a", scenes: [shown("One")] } },
        "./b.specimen.tsx": { default: { id: "b", scenes: [shown("One")] } },
      },
    });

    expect(pages.map((page) => page.id)).toEqual(["a", "b"]);
  });
});

describe("headingOf", () => {
  it("reads a hyphenated name as words", () => {
    expect(headingOf("scroll-area")).toBe("Scroll area");
  });

  it("leaves a single word alone but for its first letter", () => {
    expect(headingOf("button")).toBe("Button");
  });

  it("answers nothing for nothing", () => {
    expect(headingOf("")).toBe("");
  });
});
