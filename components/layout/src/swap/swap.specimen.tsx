/**
 * Shows the two marks that change places, in each way the change can read.
 */

import { type ReactElement, useState } from "react";

import { BellIcon, BellOffIcon, CheckIcon, CopyIcon, PauseIcon, PlayIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import { SwapIndicator, SwapRoot } from "#swap/swap.ts";

/**
 * How the change from one mark to the other reads.
 */
const TRANSITIONS = ["scale", "fade", "slide", "none"] as const;

/**
 * Describes the props of {@link Marks}.
 */
interface MarksProps {
  /**
   * What is shown while the swap is off.
   */
  off: ReactElement;

  /**
   * What is shown while it is on.
   */
  on: ReactElement;

  /**
   * How the change reads.
   */
  transition?: (typeof TRANSITIONS)[number];
}

/**
 * Draws one button that turns its own mark over when pressed.
 *
 * Both marks are in the document at once and stacked in a single grid cell, so the button keeps its
 * width through the change and nothing beside it moves.
 *
 * @param props - The marks. `MarksProps` documents every member.
 * @returns One button.
 */
function Marks(props: MarksProps): ReactElement {
  const [swapped, setSwapped] = useState(false);

  return (
    <Trigger
      label="Turn it over"
      onClick={() => {
        setSwapped(!swapped);
      }}
    >
      <SwapRoot swap={swapped} transition={props.transition}>
        <SwapIndicator type="on">{props.on}</SwapIndicator>
        <SwapIndicator type="off">{props.off}</SwapIndicator>
      </SwapRoot>
    </Trigger>
  );
}

export const transitions: Scene = {
  about:
    "Press one. At rest every cell is the same button, and the whole component is the quarter of a second in between — so this is a scene that says nothing until it is touched.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="transition" of={TRANSITIONS}>
      {(transition) => (
        <Marks off={<CopyIcon size={18} />} on={<CheckIcon size={18} />} transition={transition} />
      )}
    </Matrix>
  ),
  title: "Transitions",
};

export const pairs: Scene = {
  about:
    "The pairs it is usually built from. Each is one idea with two states rather than two ideas — which is the test for whether a swap is right: play and pause, muted and not, copy and copied.",
  draw: () => (
    <Row gap="4">
      <Marks off={<PlayIcon size={18} />} on={<PauseIcon size={18} />} />
      <Marks off={<BellOffIcon size={18} />} on={<BellIcon size={18} />} />
      <Marks off={<CopyIcon size={18} />} on={<CheckIcon size={18} />} />
    </Row>
  ),
  title: "The usual pairs",
};

export default specimen({
  about:
    "Two marks in one place, changing over. Both are in the document at once and stacked, so nothing around them moves as they change.",
  group: "Layout",
  id: "layout/swap",
  scenes: [transitions, pairs],
  title: "Swap",
});
