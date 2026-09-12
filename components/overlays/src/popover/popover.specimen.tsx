/**
 * Shows the popover at every size, and against every side of its trigger.
 */

import { type ReactElement } from "react";

import { Field, Matrix, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  PopoverArrow,
  PopoverArrowTip,
  PopoverBody,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverPositioner,
  PopoverRoot,
  type PopoverRootProps,
  PopoverTitle,
  PopoverTrigger,
} from "#popover/popover.ts";

/**
 * How large the panel is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Which side of the trigger it opens on.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Describes the props of {@link Note}.
 */
interface NoteProps extends Omit<PopoverRootProps, "children"> {
  /**
   * What the button that opens it says.
   */
  label: string;
}

/**
 * Draws one popover behind a button, with a field in it so focus has somewhere to go.
 *
 * @param props - The popover. `NoteProps` documents every member.
 * @returns The button, and the panel it opens.
 */
function Note(props: NoteProps): ReactElement {
  const { label, ...root } = props;

  return (
    <PopoverRoot {...root}>
      <PopoverTrigger asChild>
        <Trigger>{label}</Trigger>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent colorPalette="primary">
          <PopoverArrow>
            <PopoverArrowTip />
          </PopoverArrow>
          <PopoverHeader>
            <PopoverTitle>Add a note</PopoverTitle>
          </PopoverHeader>
          <PopoverBody>
            <Field placeholder="Why the payout was held" />
          </PopoverBody>
          <PopoverFooter>
            <Trigger>Save</Trigger>
          </PopoverFooter>
          <PopoverCloseTrigger asChild insetEnd="1" position="absolute" top="1">
            <Trigger label="Close" quiet>
              ×
            </Trigger>
          </PopoverCloseTrigger>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}

export const sizes: Scene = {
  about:
    "Open one. Unlike a dialog, a popover leaves the page live behind it — so it is the one to reach for where the reader may want to look something up before answering.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="size" of={SIZES}>
      {(size) => <Note label={size} size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const sides: Scene = {
  about:
    "The arrow is what these are for: it has to stay pointed at the trigger as the panel flips to whichever side has room, and four together are the check that it does.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="placement" of={SIDES}>
      {(side) => <Note label={side} positioning={{ placement: side }} />}
    </Matrix>
  ),
  title: "Sides",
};

export default specimen({
  about:
    "A panel anchored to what opened it, with the page still live behind. Where the close button sits is the caller’s to say — no slot is styled for it, so left to flow it lands under the footer.",
  group: "Overlays",
  id: "overlays/popover",
  scenes: [sizes, sides],
  title: "Popover",
});
