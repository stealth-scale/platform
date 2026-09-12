/**
 * Shows the box carrying each surface, corner and elevation the theme defines.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { HStack } from "#stack/stack.ts";

/**
 * Every surface a box sits on, palest first.
 */
const SURFACES = ["bg", "bg.subtle", "bg.muted", "bg.emphasized", "bg.panel"] as const;

/**
 * Every corner the theme names.
 */
const CORNERS = ["l1", "l2", "l3"] as const;

/**
 * Every height a box is lifted to.
 */
const SHADOWS = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export const surfaces: Scene = {
  about:
    "A surface only means anything against the ones either side of it, so the row matters more than any one cell: two steps that look the same are two steps that are not doing their job.",
  draw: () => (
    <Matrix direction="row" gap="3" knob="bg" of={SURFACES}>
      {(surface) => (
        <Box bg={surface} borderColor="border" borderRadius="l2" borderWidth="1px" p="4" w="7rem">
          <Text>{surface}</Text>
        </Box>
      )}
    </Matrix>
  ),
  title: "Surfaces",
};

export const corners: Scene = {
  about:
    "Three steps, named for how far in they sit rather than for a measurement, so a theme can round everything more without every component being edited.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="borderRadius" of={CORNERS}>
      {(radius) => <Box bg="colorPalette.subtle" borderRadius={radius} boxSize="5rem" />}
    </Matrix>
  ),
  title: "Corners",
};

export const elevations: Scene = {
  about:
    "How far off the page something is lifted. The steps are what say whether a thing is on the page, above it, or floating over everything — so they have to be told apart at a glance.",
  draw: () => (
    <Matrix direction="row" gap="5" knob="boxShadow" of={SHADOWS}>
      {(shadow) => (
        <HStack bg="bg.panel" borderRadius="l2" boxShadow={shadow} boxSize="5rem" justify="center">
          <Text muted size="xs">
            {shadow}
          </Text>
        </HStack>
      )}
    </Matrix>
  ),
  title: "Elevations",
};

export default specimen({
  about:
    "The plainest thing there is: a rectangle that takes every styling property the theme defines. What it draws is the theme rather than the component.",
  group: "Layout",
  id: "layout/box",
  scenes: [surfaces, corners, elevations],
  title: "Box",
});
