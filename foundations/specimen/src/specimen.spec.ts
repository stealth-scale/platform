import { describe, expect, it } from "vite-plus/test";

import { scene, type Specimen, specimen } from "#specimen.ts";

/**
 * Answers whether a field is text, or absent.
 *
 * `false` where the field holds anything else, which the assignment below then refuses to compile.
 * The index plugin lifts these four out of a file's text without running it, so a field that
 * stopped being text would read as empty in every catalogue, quietly.
 *
 * @typeParam Field - Which field of a page.
 */
type Text<Field extends keyof Specimen> = Specimen[Field] extends string | undefined ? true : false;

/**
 * Stands in for whatever a scene draws.
 *
 * @returns Nothing, since what it draws is not what these cases are about.
 */
function draw(): null {
  return null;
}

describe("specimen", () => {
  it("states what addresses, names, groups and opens a page as text, which an index reads from source", () => {
    const lifted: [Text<"id">, Text<"title">, Text<"group">, Text<"about">] = [
      true,
      true,
      true,
      true,
    ];
    const addressed: undefined extends Specimen["id"] ? false : true = true;

    expect([...lifted, addressed]).toStrictEqual([true, true, true, true, true]);
  });

  it("answers back what a page declared about itself", () => {
    const stated = {
      about: "What a person presses.",
      group: "Controls",
      id: "controls/button",
      scenes: [scene({ draw, title: "Variants" })],
      title: "Button",
    };

    expect(specimen(stated)).toEqual(stated);
  });

  it("asks for an address and what is on it, and takes the rest only where there is something to say", () => {
    const bare = { id: "controls/button", scenes: [scene({ draw, title: "Variants" })] };

    expect(specimen(bare)).toEqual(bare);
  });
});

describe("scene", () => {
  it("answers back what one scene declared", () => {
    expect(scene({ draw, title: "Variants" })).toEqual({ draw, title: "Variants" });
  });

  it("carries the prose a scene sets above what it draws", () => {
    const shown = scene({ about: "Six ways a button is set off.", draw, title: "Variants" });

    expect(shown.about).toBe("Six ways a button is set off.");
  });
});
