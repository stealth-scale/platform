/**
 * Shows the segmented control at every size, in both directions.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  SegmentGroupIndicator,
  SegmentGroupItem,
  SegmentGroupItemHiddenInput,
  SegmentGroupItemText,
  SegmentGroupRoot,
  type SegmentGroupRootProps,
} from "#segment-group/segment-group.ts";

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Which way it runs.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Describes the props of {@link Windows}.
 */
interface WindowsProps extends Omit<SegmentGroupRootProps, "children"> {
  /**
   * Which item is unavailable.
   */
  closed?: string;
}

/**
 * Draws the three windows as one segmented control.
 *
 * @param props - The control. `WindowsProps` documents every member.
 * @returns One segmented control of three.
 */
function Windows(props: WindowsProps): ReactElement {
  const { closed, ...root } = props;

  return (
    <SegmentGroupRoot alignSelf="start" colorPalette="primary" defaultValue="Month" {...root}>
      <SegmentGroupIndicator />
      {["Week", "Month", "Quarter"].map((window) => (
        <SegmentGroupItem disabled={window === closed} key={window} value={window}>
          <SegmentGroupItemHiddenInput />
          <SegmentGroupItemText>{window}</SegmentGroupItemText>
        </SegmentGroupItem>
      ))}
    </SegmentGroupRoot>
  );
}

export const sizes: Scene = {
  about:
    "The indicator is a single element that slides between items rather than a border on each, so what to watch is whether it lands square on the picked item at every size.",
  draw: () => (
    <Matrix gap="6" knob="size" of={SIZES}>
      {(size) => <Windows size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const orientations: Scene = {
  about:
    "Turned, the indicator slides down instead of across. Reach for the vertical one in a narrow rail, where three words side by side would wrap.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="orientation" of={ORIENTATIONS}>
      {(orientation) => <Windows orientation={orientation} />}
    </Matrix>
  ),
  title: "Orientations",
};

export const states: Scene = {
  about:
    "A disabled item keeps its place in the row rather than disappearing, so the control does not change width as options come and go.",
  draw: () => <Windows closed="Quarter" defaultValue="Week" />,
  title: "With one item closed",
};

export default specimen({
  about:
    "One choice out of a few, all of them on show, with an indicator that slides to the one picked. Reach for it where the options are a scale or a span rather than a list.",
  group: "Controls",
  id: "controls/segment-group",
  scenes: [sizes, orientations, states],
  title: "Segment group",
});
