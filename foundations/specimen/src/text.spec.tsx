import { screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { declared } from "#declared.fixtures.ts";
import { drawn } from "#drawn.fixtures.tsx";
import { Text } from "#text.tsx";

/**
 * Reads back what was written for one line.
 *
 * @param shown - The line to draw.
 * @returns The declarations that apply to it.
 */
function css(shown: Parameters<typeof drawn>[0]): string {
  return declared(drawn(shown).container);
}

describe("Text", () => {
  it("writes the words as a paragraph rather than a heading", () => {
    drawn(<Text>Four offers arrived overnight.</Text>);

    expect(screen.getByText("Four offers arrived overnight.").tagName).toBe("P");
  });

  it("sets a quieter ink when asked, and states no colour of its own when not", () => {
    expect(css(<Text muted>Annotated.</Text>)).toContain("color:");
    expect(css(<Text>Stated.</Text>)).not.toContain("color:");
  });

  it("opens small, since a scene’s words are never the thing being looked at", () => {
    expect(css(<Text>Annotated.</Text>)).not.toBe(css(<Text size="md">Annotated.</Text>));
    expect(css(<Text>Annotated.</Text>)).toBe(css(<Text size="sm">Annotated.</Text>));
  });

  it("sets a naming word heavier, and leaves an ordinary one alone", () => {
    expect(css(<Text strong>Ledger</Text>)).toContain("font-weight:");
    expect(css(<Text>Ledger</Text>)).not.toContain("font-weight:");
  });

  it("takes every knob at once, since a quiet naming word is an ordinary thing to want", () => {
    const drawnAll = css(
      <Text muted size="xs" strong>
        Ledger
      </Text>,
    );

    expect(drawnAll).toContain("color:");
    expect(drawnAll).toContain("font-weight:");
  });
});
