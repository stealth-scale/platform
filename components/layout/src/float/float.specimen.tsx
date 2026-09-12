/**
 * Shows a mark pinned to a corner of whatever it is over.
 */

import { Box, Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Circle } from "#circle/circle.ts";
import { Float } from "#float/float.ts";

/**
 * Which corner the mark is pinned to.
 */
const CORNERS = ["top-start", "top-end", "bottom-start", "bottom-end"] as const;

export const corners: Scene = {
  about:
    "The mark hangs half outside the box on purpose: a count that sat fully inside would cover what it is counting. What it is pinned to has to be a positioned box, or the mark escapes to the page.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="placement" of={CORNERS}>
      {(placement) => (
        <Box anchor height="5rem" pad="0" surface="muted">
          <Float placement={placement}>
            <Circle bg="colorPalette.solid" color="colorPalette.contrast" size="5">
              <Text size="xs">4</Text>
            </Circle>
          </Float>
        </Box>
      )}
    </Matrix>
  ),
  title: "Corners",
};

export default specimen({
  about:
    "Pins something to a corner of the box around it — a count on an avatar, a state on a tile, a mark on a card.",
  group: "Layout",
  id: "layout/float",
  scenes: [corners],
  title: "Float",
});
