/**
 * The panel a scene sets a sample in, or on.
 */

import { type ReactElement, type ReactNode, type Ref } from "react";

import { chakra } from "@chakra-ui/react";

/**
 * Names the surfaces a sample can be set on, as the theme names them.
 */
const SURFACES = {
  muted: "bg.muted",
  panel: "bg.panel",
  subtle: "bg.subtle",
};

/**
 * Draws the rule that shows where a sample's own edges cannot be seen.
 */
const FRAMED = { borderColor: "border", borderWidth: "1px" };

/**
 * Takes the room left beside a sibling.
 */
const GROWS = { flex: "1" };

/**
 * Marks what a positioned child is placed against.
 */
const ANCHOR = { position: "relative" };

/**
 * Places a child over the middle of whatever holds it.
 */
const MIDDLE = {
  insetStart: "50%",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
};

/**
 * Describes the props of {@link Box}.
 */
export interface BoxProps {
  /**
   * Makes this the thing a positioned child is placed against.
   *
   * A tooltip, a popover and a sticky heading are all placed relative to the nearest positioned
   * ancestor. Without one they escape to the page, and a scene that draws two of them side by side
   * gets both in the same corner.
   */
  anchor?: boolean;

  /**
   * What is in it.
   */
  children: ReactNode;

  /**
   * Draws a rule around it, for a sample whose own edges are invisible.
   */
  framed?: boolean;

  /**
   * Takes whatever room is left over beside its siblings.
   */
  grows?: boolean;

  /**
   * How tall, where a scene has to give the sample room to move.
   */
  height?: string;

  /**
   * Names it, for a scene that has to point something at this part of itself.
   */
  id?: string;

  /**
   * Sits in the middle of whatever it is inside, over the top of it.
   *
   * The other half of {@link BoxProps.anchor}: one marks what to be placed against, this is what is
   * placed. For a reading inside a ring, a badge over a tile, a label across a picture.
   */
  middle?: boolean;

  /**
   * How much room inside, as a spacing token.
   */
  pad?: string;

  /**
   * Hands the element back, for a scene that has to measure it or point a component at it.
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * How round the corners are, as a radius token.
   */
  round?: string;

  /**
   * Scrolls what it holds rather than growing to fit it, which needs a height to scroll within.
   */
  scrolls?: boolean;

  /**
   * Fills it with one of the theme's surfaces, for a sample that has to be seen against something
   * other than the page.
   */
  surface?: keyof typeof SURFACES;

  /**
   * How wide, where a scene has to give the sample room to open into.
   */
  width?: string;
}

/**
 * Sets a sample inside a panel.
 *
 * Two jobs, and the measurements say they are the only two a specimen ever wanted: draw a rule
 * around something whose own edges cannot be seen, and put something on a surface other than the
 * page. Everything else a box could do is a scene arranging itself, which is what `Row`, `Column`
 * and `Matrix` are for.
 *
 * @param props - The sample and how to set it. `BoxProps` documents every member.
 * @returns One panel.
 */
export function Box(props: BoxProps): ReactElement {
  const { children, height, id, pad = "4", ref, round = "l2", surface, width } = props;

  // Composed from named groups rather than a ternary for every property, because half of these
  // draw two or three declarations each and a box that states all of them at once reads as a
  // list of `undefined`.
  const placed = {
    ...(props.framed === true && FRAMED),
    ...(props.grows === true && GROWS),
    ...(props.anchor === true && ANCHOR),
    ...(props.middle === true && MIDDLE),
    ...(props.scrolls === true ? { maxHeight: height, overflowY: "auto" } : { height }),
    ...(surface !== undefined && { bg: SURFACES[surface] }),
  };

  return (
    <chakra.div borderRadius={round} id={id} p={pad} ref={ref} width={width} {...placed}>
      {children}
    </chakra.div>
  );
}
