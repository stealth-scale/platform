import { type ReactNode } from "react";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render as draw, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { only } from "#drawn.fixtures.tsx";
import { MEASURE } from "#measure.ts";
import { Prose } from "#prose.tsx";

/**
 * Draws prose with a theme in scope, which is what its spacing is read from.
 *
 * @param shown - The element to draw.
 * @returns The element it was drawn into.
 */
function render(shown: ReactNode): ReturnType<typeof draw> {
  return draw(<ChakraProvider value={defaultSystem}>{shown}</ChakraProvider>);
}

describe("Prose", () => {
  it("holds its paragraphs to a measure, so a line is short enough to find the next one", () => {
    const { container } = render(
      <Prose>
        <p>one</p>
      </Prose>,
    );

    // Read back in pixels, because the measure is stated in `rem` and the document resolves it
    // against a root of 16px before anything can be asked what it computed to.
    const held = getComputedStyle(only(container)).maxWidth;

    expect(held).toBe(`${String(Number(MEASURE.replace("rem", "")) * 16)}px`);
  });

  it("lays its paragraphs out down", () => {
    const { container } = render(
      <Prose>
        <p>one</p>
        <p>other</p>
      </Prose>,
    );

    expect(getComputedStyle(only(container)).flexDirection).toBe("column");
    expect(screen.getByText("one")).toBeTruthy();
    expect(screen.getByText("other")).toBeTruthy();
  });
});
