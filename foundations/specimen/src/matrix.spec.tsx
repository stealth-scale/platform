import { type ReactNode } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { declared } from "#declared.fixtures.ts";
import { drawn, only } from "#drawn.fixtures.tsx";
import { Matrix } from "#matrix.tsx";

/**
 * One cell, drawn the same way every time, so a redraw turns on the caption alone.
 *
 * @param value - The value the cell is drawn for.
 * @returns One cell.
 */
function cell(value: string): ReactNode {
  return <p>{value} cell</p>;
}

describe("Matrix", () => {
  it("draws one cell per value of the axis", () => {
    drawn(<Matrix of={["solid", "subtle"]}>{cell}</Matrix>);

    expect(screen.getByText("solid cell")).toBeTruthy();
    expect(screen.getByText("subtle cell")).toBeTruthy();
  });

  it("captions each cell with the value, which is what a variant name already is", () => {
    drawn(<Matrix of={["sm", "md"]}>{(size) => <p>{size}</p>}</Matrix>);

    expect(screen.getAllByText("sm")).toHaveLength(2);
  });

  it("names the knob before the value, where the values do not name themselves", () => {
    drawn(
      <Matrix knob="size" of={["sm"]}>
        {cell}
      </Matrix>,
    );

    expect(screen.getByText("size = sm")).toBeTruthy();
  });

  it("takes a label for an axis whose values are not text", () => {
    drawn(
      <Matrix knob="columns" label={String} of={[2, 3]}>
        {(columns) => <p>{columns} across</p>}
      </Matrix>,
    );

    expect(screen.getByText("columns = 2")).toBeTruthy();
    expect(screen.getByText("3 across")).toBeTruthy();
  });

  it("runs the cells across when asked, and down otherwise", () => {
    const across = drawn(
      <Matrix direction="row" of={["one"]}>
        {cell}
      </Matrix>,
    );
    const down = drawn(<Matrix of={["one"]}>{cell}</Matrix>);

    expect(getComputedStyle(only(across.container)).flexDirection).toBe("row");
    expect(getComputedStyle(only(down.container)).flexDirection).toBe("column");
  });

  it("takes how far apart the cells sit, and picks a distance otherwise", () => {
    const told = drawn(
      <Matrix gap="12" of={["one"]}>
        {cell}
      </Matrix>,
    );
    const left = drawn(<Matrix of={["one"]}>{cell}</Matrix>);

    expect(declared(told.container)).not.toBe(declared(left.container));
  });

  it("nests, which is how two axes are crossed", () => {
    drawn(
      <Matrix knob="variant" of={["solid"]}>
        {(variant) => (
          <Matrix knob="size" of={["sm"]}>
            {(size) => (
              <p>
                {variant}/{size}
              </p>
            )}
          </Matrix>
        )}
      </Matrix>,
    );

    expect(screen.getByText("solid/sm")).toBeTruthy();
    expect(screen.getByText("variant = solid")).toBeTruthy();
    expect(screen.getByText("size = sm")).toBeTruthy();
  });
});
