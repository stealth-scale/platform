import { screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { Column } from "#column.tsx";
import { drawn, only } from "#drawn.fixtures.tsx";
import { Row } from "#row.tsx";

/**
 * One child, held still, so a redraw turns on the line alone.
 */
const held = <p>one</p>;

/**
 * Reads back what a line computed to.
 *
 * @param shown - The line to draw.
 * @returns Its styles.
 */
function styles(shown: Parameters<typeof drawn>[0]): CSSStyleDeclaration {
  return getComputedStyle(only(drawn(shown).container));
}

describe("Row", () => {
  it("lays its children out across", () => {
    const { container } = drawn(<Row>{held}</Row>);

    expect(getComputedStyle(only(container)).display).toBe("flex");
    expect(screen.getByText("one")).toBeTruthy();
  });

  it("wraps, because a specimen is read at whatever width the reader has", () => {
    expect(styles(<Row>{held}</Row>).flexWrap).toBe("wrap");
  });

  it("stays on one line when told to", () => {
    expect(styles(<Row nowrap>{held}</Row>).flexWrap).toBe("nowrap");
  });

  it("takes where its children sit along it and across it", () => {
    const told = styles(
      <Row align="flex-end" gap="8" justify="space-between">
        {held}
      </Row>,
    );

    expect(told.alignItems).toBe("flex-end");
    expect(told.justifyContent).toBe("space-between");
  });

  it("centres them across it and starts them along it otherwise", () => {
    const left = styles(<Row>{held}</Row>);

    expect(left.alignItems).toBe("center");
    expect(left.justifyContent).toBe("flex-start");
  });
});

describe("Column", () => {
  it("lays its children out down", () => {
    const { container } = drawn(<Column>{held}</Column>);

    expect(getComputedStyle(only(container)).flexDirection).toBe("column");
    expect(screen.getByText("one")).toBeTruthy();
  });

  it("takes where its children sit, for a scene that is not a plain stack", () => {
    const told = styles(
      <Column align="center" gap="8" justify="space-between">
        {held}
      </Column>,
    );

    expect(told.alignItems).toBe("center");
    expect(told.justifyContent).toBe("space-between");
  });

  it("stretches them and starts them otherwise", () => {
    const left = styles(<Column>{held}</Column>);

    expect(left.alignItems).toBe("stretch");
    expect(left.justifyContent).toBe("flex-start");
  });
});

describe("a line held to a width", () => {
  it("takes a maximum rather than a width, so a narrow canvas still tells the truth", () => {
    const drawnTo = styles(<Column width="20rem">{held}</Column>);

    expect(drawnTo.maxWidth).toBe("320px");
    expect(drawnTo.width).toBe("");
  });

  it("holds a row to one too, for a scene whose sample runs off the side", () => {
    expect(styles(<Row width="20rem">{held}</Row>).maxWidth).toBe("320px");
  });
});

describe("a line that grows", () => {
  it("takes the room left beside its siblings, so a placeholder does not collapse", () => {
    expect(styles(<Column grows>{held}</Column>).flexGrow).toBe("1");
    expect(styles(<Row grows>{held}</Row>).flexGrow).toBe("1");
  });

  it("stays content-sized when it is not asked to", () => {
    expect(styles(<Column>{held}</Column>).flexGrow).toBe("");
    expect(styles(<Row>{held}</Row>).flexGrow).toBe("");
  });
});

describe("a row of attached children", () => {
  it("closes the gap, so the children touch", () => {
    expect(
      styles(
        <Row attached gap="4">
          {held}
        </Row>,
      ).gap,
    ).not.toBe("16px");
  });

  it("keeps them on one line, since an attached control cannot wrap", () => {
    expect(styles(<Row attached>{held}</Row>).flexWrap).toBe("nowrap");
  });
});
