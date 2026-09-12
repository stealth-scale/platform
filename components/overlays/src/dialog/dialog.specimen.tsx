/**
 * Shows the modal at every size, in every place it can sit, and scrolling both ways.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Text, Trigger } from "@stealthscale/foundation-specimen";

import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  type DialogRootProps,
  DialogTitle,
  DialogTrigger,
} from "#dialog/dialog.ts";

/**
 * How large the modal is.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl", "cover", "full"] as const;

/**
 * Where in the viewport it sits.
 */
const PLACEMENTS = ["top", "center", "bottom"] as const;

/**
 * Whether the modal itself scrolls, or the page behind it does.
 */
const SCROLLS = ["outside", "inside"] as const;

/**
 * Describes the props of {@link Modal}.
 */
interface ModalProps extends Omit<DialogRootProps, "children"> {
  /**
   * What the button that opens it says.
   */
  label: string;

  /**
   * How much prose the body holds, which is what makes it scroll.
   */
  lines?: number;
}

/**
 * Draws one modal behind a button.
 *
 * @param props - The modal. `ModalProps` documents every member.
 * @returns The button, and the modal it opens.
 */
function Modal(props: ModalProps): ReactElement {
  const { label, lines = 1, ...root } = props;

  return (
    <DialogRoot {...root}>
      <DialogTrigger asChild>
        <Trigger>{label}</Trigger>
      </DialogTrigger>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent colorPalette="primary">
          <DialogHeader>
            <DialogTitle>Release the payout</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription mb="4">
              Four lines are matched. Releasing sends the payout tonight.
            </DialogDescription>
            {Array.from({ length: lines }, (_, index) => (
              <Text key={index} muted>
                Line {index + 1} was raised against the ledger and reconciled without a query.
              </Text>
            ))}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Trigger quiet>Cancel</Trigger>
            </DialogActionTrigger>
            <Trigger>Release</Trigger>
          </DialogFooter>
          <DialogCloseTrigger asChild>
            <Trigger label="Close" quiet>
              ×
            </Trigger>
          </DialogCloseTrigger>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}

export const sizes: Scene = {
  about:
    "Open one. `cover` and `full` are the two that stop being modals and become screens — reach for those on a phone, where a dialog with the page showing round it has nowhere to put the page.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="size" of={SIZES}>
      {(size) => <Modal label={size} size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const placements: Scene = {
  about:
    "Where in the viewport it lands. Top is what a phone wants, since a centred dialog moves under the keyboard the moment a field in it takes focus.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="placement" of={PLACEMENTS}>
      {(placement) => <Modal label={placement} placement={placement} />}
    </Matrix>
  ),
  title: "Placements",
};

export const scrolling: Scene = {
  about:
    "Whether the modal scrolls or the page behind it does. The two only differ once the body is longer than the viewport, so both of these carry twenty paragraphs.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="scrollBehavior" of={SCROLLS}>
      {(scrollBehavior) => (
        <Modal label={scrollBehavior} lines={20} scrollBehavior={scrollBehavior} />
      )}
    </Matrix>
  ),
  title: "Scrolling",
};

export default specimen({
  about:
    "A modal: everything behind it is inert until it is answered. Reach for it where the answer has to come before anything else can, and for a popover where it does not.",
  group: "Overlays",
  id: "overlays/dialog",
  scenes: [sizes, placements, scrolling],
  title: "Dialog",
});
