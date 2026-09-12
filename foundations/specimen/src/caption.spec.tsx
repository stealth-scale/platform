import { screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { Caption } from "#caption.tsx";
import { declared } from "#declared.fixtures.ts";
import { drawn } from "#drawn.fixtures.tsx";

/**
 * One child, held still, so a redraw turns on the label alone.
 */
const held = <p>one</p>;

describe("Caption", () => {
  it("names what the block under it shows", () => {
    drawn(<Caption of="Sizes">{held}</Caption>);

    expect(screen.getByText("Sizes")).toBeTruthy();
    expect(screen.getByText("one")).toBeTruthy();
  });

  it("writes the label as a phrase rather than a heading, so a specimen does not read as a document", () => {
    drawn(<Caption of="Sizes">{held}</Caption>);

    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("puts the label above what it names, which is the whole of what a caption is", () => {
    drawn(<Caption of="Sizes">{held}</Caption>);

    const order = screen.getByText("Sizes").compareDocumentPosition(screen.getByText("one"));

    expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("takes how far the label sits from what it names, and picks a distance otherwise", () => {
    const told = drawn(
      <Caption gap="8" of="Sizes">
        {held}
      </Caption>,
    );
    const left = drawn(<Caption of="Sizes">{held}</Caption>);

    expect(declared(told.container)).not.toBe(declared(left.container));
  });
});
