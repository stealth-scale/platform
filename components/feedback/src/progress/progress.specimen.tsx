/**
 * Shows the linear progress bar at every size and variant, and where the value is unknown.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  ProgressLabel,
  ProgressRange,
  ProgressRoot,
  type ProgressRootProps,
  ProgressTrack,
  ProgressValueText,
} from "#progress/progress.ts";

/**
 * Every size the bar takes.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Every way the track is drawn.
 */
const VARIANTS = ["outline", "subtle"] as const;

/**
 * Draws a bar part of the way through, with what it is doing written over it.
 *
 * @param props - Whichever of them the scene is turning. `ProgressRootProps` documents every
 *   member.
 * @returns One labelled bar.
 */
function Reconciling(props: ProgressRootProps): ReactElement {
  return (
    <ProgressRoot colorPalette="primary" value={62} w="16rem" {...props}>
      <Row justify="space-between">
        <ProgressLabel>Reconciling</ProgressLabel>
        <ProgressValueText />
      </Row>
      <ProgressTrack>
        <ProgressRange />
      </ProgressTrack>
    </ProgressRoot>
  );
}

export const sizes: Scene = {
  about:
    "What changes with the size is the height of the track. The label and the figure over it keep the body scale, so a bar at `xs` under a full-sized label still reads as one thing.",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => <Reconciling size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const variants: Scene = {
  about:
    "Whether the track is drawn as a rule or as a fill. Subtle is the one to prefer on a panel, where an outline track disappears into the border beside it.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Reconciling variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const unknown: Scene = {
  about:
    "A null value means the end is not known, and the range sweeps instead of filling. This is the one worth watching: a track too pale to see the sweep against is a bar that reports nothing.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => (
        <ProgressRoot colorPalette="primary" value={null} variant={variant} w="10rem">
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </ProgressRoot>
      )}
    </Matrix>
  ),
  title: "Value unknown",
};

export default specimen({
  about:
    "Reports how far through something is. Where the end is not known it sweeps rather than fills, which says that work is happening without claiming to know how much is left.",
  group: "Feedback",
  id: "feedback/progress",
  scenes: [sizes, variants, unknown],
  title: "Progress",
});
