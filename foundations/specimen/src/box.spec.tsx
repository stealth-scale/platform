import { createRef } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { Box } from "#box.tsx";
import { declared } from "#declared.fixtures.ts";
import { drawn } from "#drawn.fixtures.tsx";

/**
 * One child, held still, so a redraw turns on the panel alone.
 */
const held = <p>one</p>;

/**
 * Reads back what was written for one panel.
 *
 * @param shown - The panel to draw.
 * @returns The declarations that apply to it.
 */
function css(shown: Parameters<typeof drawn>[0]): string {
  return declared(drawn(shown).container);
}

describe("Box", () => {
  it("holds what it was given", () => {
    drawn(<Box>{held}</Box>);

    expect(screen.getByText("one")).toBeTruthy();
  });

  it("draws a rule only where the sample’s own edges cannot be seen", () => {
    expect(css(<Box framed>one</Box>)).toContain("border-width:");
    expect(css(<Box>one</Box>)).not.toContain("border-width:");
  });

  it("sets the sample on a surface only when asked", () => {
    expect(css(<Box surface="subtle">one</Box>)).toContain("background:");
    expect(css(<Box>one</Box>)).not.toContain("background:");
  });

  it("tells one surface from another, so a scene can pick which recess it draws on", () => {
    expect(css(<Box surface="subtle">one</Box>)).not.toBe(css(<Box surface="panel">one</Box>));
    expect(css(<Box surface="muted">one</Box>)).not.toBe(css(<Box surface="panel">one</Box>));
  });

  it("becomes what a positioned child is placed against when asked", () => {
    expect(css(<Box anchor>one</Box>)).toContain("position: relative");
    expect(css(<Box>one</Box>)).not.toContain("position:");
  });

  it("takes the room a scene needs to give a sample to move in", () => {
    expect(css(<Box height="9rem">one</Box>)).toContain("height: 9rem");
    expect(css(<Box>one</Box>)).not.toContain("height:");
  });

  it("takes a width for a sample that has to open into something", () => {
    expect(css(<Box width="13rem">one</Box>)).toContain("width: 13rem");
    expect(css(<Box>one</Box>)).not.toContain("width:");
  });

  it("pads and rounds without being asked, since every panel wants both", () => {
    const plain = css(<Box>one</Box>);

    expect(plain).toContain("padding:");
    expect(plain).toContain("border-radius:");
  });

  it("takes a padding and a radius of its own, for a panel that frames nothing", () => {
    expect(css(<Box pad="0">one</Box>)).not.toBe(css(<Box>one</Box>));
    expect(css(<Box round="full">one</Box>)).not.toBe(css(<Box>one</Box>));
  });

  it("takes the room left beside a sibling when asked, and its own otherwise", () => {
    expect(css(<Box grows>one</Box>)).not.toBe(css(<Box>one</Box>));
  });

  it("scrolls what it holds rather than growing, and treats its height as a ceiling", () => {
    const scrolling = css(
      <Box height="9rem" scrolls>
        one
      </Box>,
    );

    expect(scrolling).toContain("max-height: 9rem");
    expect(scrolling).toContain("overflow-y: auto");
    expect(css(<Box height="9rem">one</Box>)).not.toContain("max-height:");
  });

  it("sits over the middle of whatever it is inside", () => {
    const middle = css(<Box middle>one</Box>);

    expect(middle).toContain("position: absolute");
    expect(middle).toContain("transform: translate(-50%, -50%)");
  });

  it("is placed rather than placed against, so it overrides the anchor", () => {
    expect(
      css(
        <Box anchor middle>
          one
        </Box>,
      ),
    ).toContain("position: absolute");
  });

  it("names itself, so a scene can point something at this part of it", () => {
    const { container } = drawn(<Box id="scope">one</Box>);

    expect(container.querySelector("#scope")).toBeTruthy();
  });

  it("hands the element back, for a scene that has to measure it", () => {
    const handed = createRef<HTMLDivElement>();

    drawn(<Box ref={handed}>one</Box>);

    expect(handed.current).toBeInstanceOf(HTMLElement);
  });
});
