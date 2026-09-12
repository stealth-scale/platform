/**
 * The one layout helper a specimen shares: a component drawn once per value of some axis, each
 * under the value's name.
 */

import { type ReactElement, type ReactNode } from "react";

import { chakra } from "@chakra-ui/react";

/**
 * Describes the props of {@link Matrix}.
 *
 * @typeParam T - What one cell is drawn for: a variant name, a size, a state.
 */
export interface MatrixProps<T> {
  /**
   * Draws one cell.
   */
  children: (value: T) => ReactNode;

  /**
   * Which way the cells run. A column by default, because most components are wider than they are
   * tall and a row of them wraps.
   */
  direction?: "column" | "row";

  /**
   * How far apart the cells sit.
   */
  gap?: string;

  /**
   * Which knob the axis turns, written before the value. Left out where the values name themselves.
   */
  knob?: string;

  /**
   * Names a cell. Defaults to the value written out, which is what a variant or size name already
   * is.
   */
  label?: (value: T) => string;

  /**
   * The axis: one cell per value, in this order.
   */
  of: readonly T[];
}

/**
 * Draws one cell per value of an axis, each captioned with the value.
 *
 * A specimen showing a component at three sizes, or in every variant, is the same shape every time:
 * a caption, the thing, repeat. This is that shape, so a specimen holds only what it is showing.
 *
 * Nest one inside another for two axes — variants down, sizes across.
 *
 * Drawn with the styling factory rather than with this kit's own stack, which is what keeps this
 * package a leaf: `components/layout` has specimens of its own, and a stack imported from there
 * would have the layout package depending on the thing that documents it.
 *
 * @typeParam T - What one cell is drawn for: a variant name, a size, a state.
 * @param props - The axis and what to draw. `MatrixProps` documents every member.
 * @returns The cells, captioned and spaced.
 */
export function Matrix<T>(props: MatrixProps<T>): ReactElement {
  const { children, direction = "column", gap = "6", knob, label = String, of } = props;

  /**
   * Writes a cell's caption, naming the knob where the axis has one.
   *
   * @param value - The axis value this cell is drawn for.
   * @returns The line above the cell.
   */
  function caption(value: T): string {
    return knob === undefined ? label(value) : `${knob} = ${label(value)}`;
  }

  return (
    <chakra.div
      alignItems={direction === "row" ? "start" : "stretch"}
      display="flex"
      flexDirection={direction}
      flexWrap="wrap"
      gap={gap}
    >
      {of.map((value) => (
        <chakra.div display="flex" flexDirection="column" gap="2" key={label(value)}>
          <chakra.p color="fg.muted" fontSize="xs" letterSpacing="wide">
            {caption(value)}
          </chakra.p>
          {children(value)}
        </chakra.div>
      ))}
    </chakra.div>
  );
}
