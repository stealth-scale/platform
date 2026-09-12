/**
 * Shows the drawer sliding in from every edge, at every size, and inset from the window.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Text, Trigger } from "@stealthscale/foundation-specimen";

import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  type DrawerRootProps,
  DrawerTitle,
  DrawerTrigger,
} from "#drawer/drawer.ts";

/**
 * Which edge it slides in from.
 */
const PLACEMENTS = ["start", "end", "top", "bottom"] as const;

/**
 * How much of the edge it covers.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl", "full"] as const;

/**
 * Describes the props of {@link Panel}.
 */
interface PanelProps extends Omit<DrawerRootProps, "children"> {
  /**
   * What the button that opens it says.
   */
  label: string;
}

/**
 * Draws one drawer behind a button.
 *
 * @param props - The drawer. `PanelProps` documents every member.
 * @returns The button, and the drawer it opens.
 */
function Panel(props: PanelProps): ReactElement {
  const { label, ...root } = props;

  return (
    <DrawerRoot {...root}>
      <DrawerTrigger asChild>
        <Trigger>{label}</Trigger>
      </DrawerTrigger>
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent colorPalette="primary">
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Text muted>Narrow the ledger by account, date or state.</Text>
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Trigger quiet>Clear</Trigger>
            </DrawerActionTrigger>
            <Trigger>Apply</Trigger>
          </DrawerFooter>
          <DrawerCloseTrigger asChild>
            <Trigger label="Close" quiet>
              ×
            </Trigger>
          </DrawerCloseTrigger>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
}

export const edges: Scene = {
  about:
    "Open each. `start` and `end` turn with the writing direction, which is the reason to reach for those rather than left and right — a drawer that always came in from the left would come in from the wrong side of every right-to-left locale.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="placement" of={PLACEMENTS}>
      {(placement) => <Panel label={placement} placement={placement} />}
    </Matrix>
  ),
  title: "Edges",
};

export const sizes: Scene = {
  about:
    "How much of the edge it covers. `full` is the whole window, which is the one to reach for on a phone where a drawer with the page showing beside it has nowhere to put the page.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="size" of={SIZES}>
      {(size) => <Panel label={size} size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const inset: Scene = {
  about:
    "Not what the name suggests: the positioner stays fixed to the window, and all this does is pad the drawer away from the edge and round its corners. A drawer scoped to a box on the page is not something the component offers.",
  draw: () => <Panel contained label="Open inset" size="sm" />,
  title: "Inset from the window",
};

export default specimen({
  about:
    "A panel that slides in from an edge and holds the page inert until it is dismissed. A dialog anchored to a side rather than to the middle.",
  group: "Overlays",
  id: "overlays/drawer",
  scenes: [edges, sizes, inset],
  title: "Drawer",
});
