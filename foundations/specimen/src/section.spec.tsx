import { screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { drawn } from "#drawn.fixtures.tsx";
import { Section } from "#section.tsx";

/**
 * One child, held still, so a redraw turns on the title alone.
 */
const held = <p>one</p>;

describe("Section", () => {
  it("heads the block with what it is called", () => {
    drawn(<Section title="Variants">{held}</Section>);

    expect(screen.getByRole("heading", { name: "Variants" })).toBeTruthy();
  });

  it("heads it at the third level, since a page already carries the first two", () => {
    drawn(<Section title="Variants">{held}</Section>);

    expect(screen.getByRole("heading", { name: "Variants" }).tagName).toBe("H3");
  });

  it("holds what the section is about", () => {
    drawn(<Section title="Variants">{held}</Section>);

    expect(screen.getByText("one")).toBeTruthy();
  });
});
