import { createSystem, defaultConfig } from "@chakra-ui/react";
import { describe, expect, it } from "vite-plus/test";

import { type Catalogue, defineCatalogue } from "#catalogue.ts";
import { type Scene } from "#specimen.ts";

/**
 * A theme to state, since a catalogue has to be drawn in one.
 */
const system = createSystem(defaultConfig);

/**
 * Stands in for whatever a scene draws.
 *
 * @returns Nothing, since what it draws is not what these cases are about.
 */
function draw(): null {
  return null;
}

/**
 * One scene, which every page needs at least one of.
 */
const shown: Scene = { draw, title: "Variants" };

/**
 * One page, as a module would export it.
 */
const page = { default: { id: "controls/button", scenes: [shown] } };

describe("defineCatalogue", () => {
  it("answers back what an application stated", () => {
    const stated: Catalogue = {
      specimens: { modules: { "./button.specimen.tsx": page } },
      themes: [{ name: "base", system }],
    };

    expect(defineCatalogue(stated)).toEqual(stated);
  });

  it("holds an application to naming at least one theme", () => {
    // The type asks for one and the tuple is why: a catalogue with no theme has nothing to draw
    // its specimens in, and the picker would have nothing to pick between.
    const one = defineCatalogue({
      specimens: { modules: {} },
      themes: [{ name: "base", system }],
    });

    expect(one.themes).toHaveLength(1);
    expect(one.themes[0].name).toBe("base");
  });

  it("takes as many themes as an application ships", () => {
    const several = defineCatalogue({
      specimens: { modules: {} },
      themes: [
        { name: "base", system },
        { name: "ember", system },
        { name: "harbor", system },
      ],
    });

    expect(several.themes.map((worn) => worn.name)).toEqual(["base", "ember", "harbor"]);
  });

  it("carries the modules through untouched, since reading them is somebody else’s job", () => {
    const stated = defineCatalogue({
      specimens: { modules: { "./button.specimen.tsx": page } },
      themes: [{ name: "base", system }],
    });

    expect(stated.specimens.modules["./button.specimen.tsx"]).toBe(page);
  });
});
