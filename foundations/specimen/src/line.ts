/**
 * What both of a specimen's boxes are built from: the shared props, and the rules that weld
 * attached children together.
 */

import { type ReactNode } from "react";

/**
 * Squares the corners where attached children meet, and overlaps their borders by a hairline.
 *
 * Written as rules over the children rather than as props on them, because a row is handed whatever
 * it is handed: a field, an addon, a button. None of them knows it has a neighbour.
 */
export const ATTACHED = {
  "& > *:not(:first-of-type)": {
    borderEndStartRadius: "0",
    borderStartStartRadius: "0",
    marginInlineStart: "-1px",
  },
  "& > *:not(:last-of-type)": { borderEndEndRadius: "0", borderStartEndRadius: "0" },
};

/**
 * What a welded row sets: the rules above, no gap between the children, and no wrapping.
 *
 * A row that wrapped would weld the wrong pairs together, so an attached row stays on one line
 * whatever the reader's width.
 */
export const WELDED = { css: ATTACHED, flexWrap: "nowrap", gap: "0" };

/**
 * Describes what both boxes take.
 */
export interface LineProps {
  /**
   * Where the children sit across the line.
   */
  align?: string;

  /**
   * What is in it.
   */
  children: ReactNode;

  /**
   * How far apart they sit, as a spacing token.
   */
  gap?: string;

  /**
   * Takes whatever room is left over beside its siblings.
   *
   * For the half of a scene that stands in for content rather than for a control: a placeholder
   * beside an avatar has no width of its own, and content-sized it collapses to nothing.
   */
  grows?: boolean;

  /**
   * Where they sit along it.
   */
  justify?: string;

  /**
   * How wide it is allowed to get.
   *
   * A maximum rather than a width, because that is what a scene actually wants: a text field given
   * the whole canvas says nothing true about how wide it will be in a form, and one pinned to an
   * exact width stops telling the truth the moment the canvas is narrower than that.
   */
  width?: string;
}
