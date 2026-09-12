/**
 * Shows the box that puts one thing in the middle of itself.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Center } from "#center/center.ts";

/**
 * The shapes worth centring in, since a square hides a mistake on one axis.
 */
const SHAPES = [
  { height: "5rem", label: "square", width: "5rem" },
  { height: "5rem", label: "wide", width: "12rem" },
  { height: "9rem", label: "tall", width: "5rem" },
] as const;

export const shapes: Scene = {
  about:
    "Both axes at once, which is the only thing it does. A square box hides a mistake on one of them, so the wide and tall ones beside it are what the scene is for.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="box" label={(shape) => shape.label} of={SHAPES}>
      {(shape) => (
        <Center bg="bg.muted" borderRadius="l2" height={shape.height} width={shape.width}>
          <Text muted size="xs">
            {shape.label}
          </Text>
        </Center>
      )}
    </Matrix>
  ),
  title: "In any shape",
};

export default specimen({
  about:
    "Puts one thing in the middle of itself, on both axes. The plainest of the placement boxes and the one reached for most.",
  group: "Layout",
  id: "layout/center",
  scenes: [shapes],
  title: "Center",
});
