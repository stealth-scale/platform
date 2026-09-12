/**
 * Shows the round box that is as tall as it is wide.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Circle } from "#circle/circle.ts";

/**
 * How far across it is.
 */
const SIZES = ["6", "8", "10", "12", "16"] as const;

export const sizes: Scene = {
  about:
    "One size sets both axes, which is what stops a count of two digits from turning a circle into a lozenge. A dot, a count, an initial, a step number — anything that has to stay round whatever is put in it.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Circle
          bg="colorPalette.solid"
          color="colorPalette.contrast"
          colorPalette="primary"
          size={size}
        >
          <Text size="xs">4</Text>
        </Circle>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A round box, as tall as it is wide, with whatever is in it centred. One size sets both axes, so it cannot be squashed by its contents.",
  group: "Layout",
  id: "layout/circle",
  scenes: [sizes],
  title: "Circle",
});
