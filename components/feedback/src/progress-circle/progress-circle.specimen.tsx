/**
 * Shows the circular progress ring at every size, and where the value is unknown.
 */

import { Box, Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  ProgressCircleCircle,
  ProgressCircleRange,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleValueText,
} from "#progress-circle/progress-circle.ts";

/**
 * Every size the ring takes.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * The sizes whose hole is too narrow to hold two digits.
 */
const CRAMPED = new Set(["sm", "xs"]);

export const sizes: Scene = {
  about:
    "The figure only goes inside the ring from `md` up. Below that the hole is narrower than two digits and the text crosses the track, so the small sizes are drawn as rings alone and the reading, where one is needed, belongs beside them.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => (
        <ProgressCircleRoot colorPalette="primary" size={size} value={62}>
          <ProgressCircleCircle>
            <ProgressCircleTrack />
            <ProgressCircleRange />
          </ProgressCircleCircle>
          {CRAMPED.has(size) ? null : (
            <Box middle pad="0">
              <ProgressCircleValueText fontSize={size === "md" ? "2xs" : "xs"} />
            </Box>
          )}
        </ProgressCircleRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const unknown: Scene = {
  about:
    "A null value means the end is not known, and the range sweeps round instead of filling. At that point it is a spinner with a track — reach for a spinner unless the ring is going to become a real reading.",
  draw: () => (
    <Row gap="10">
      {SIZES.map((size) => (
        <ProgressCircleRoot colorPalette="primary" key={size} size={size} value={null}>
          <ProgressCircleCircle>
            <ProgressCircleTrack />
            <ProgressCircleRange />
          </ProgressCircleCircle>
        </ProgressCircleRoot>
      ))}
    </Row>
  ),
  title: "Value unknown",
};

export default specimen({
  about:
    "How far through something is, drawn as a ring. Reach for it where the figure has to sit inside the shape — a tile, a button, a compact row — and for the bar everywhere else.",
  group: "Feedback",
  id: "feedback/progress-circle",
  scenes: [sizes, unknown],
  title: "Progress circle",
});
