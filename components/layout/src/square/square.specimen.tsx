/**
 * Shows the box that is as tall as it is wide.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Square } from "#square/square.ts";

/**
 * How far across it is.
 */
const SIZES = ["6", "8", "10", "12", "16"] as const;

export const sizes: Scene = {
  about:
    "The same box as a circle without the rounding, which is what an icon tile, a swatch and a placeholder all want. One size sets both axes, so the contents cannot squash it.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Square bg="bg.muted" borderRadius="l1" size={size}>
          <Text muted size="xs">
            4
          </Text>
        </Square>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A box as tall as it is wide, with whatever is in it centred. A circle without the rounding.",
  group: "Layout",
  id: "layout/square",
  scenes: [sizes],
  title: "Square",
});
