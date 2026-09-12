/**
 * Shows the figure at every size, with the arrow that says which way it moved.
 */

import { Box, Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  StatDownIndicator,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatRoot,
  StatUpIndicator,
  StatValueText,
  StatValueUnit,
} from "#stat/stat.ts";

/**
 * How large the figure is set.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Which way the figure moved.
 */
const DIRECTIONS = ["up", "down"] as const;

export const sizes: Scene = {
  about:
    "The label and the help text keep the body scale while the figure grows, which is what makes a large stat read as one figure with two captions rather than as three lines.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => (
        <StatRoot size={size}>
          <StatLabel>Settled this week</StatLabel>
          <StatValueText>£17,500.40</StatValueText>
          <StatHelpText>against £14,200 last week</StatHelpText>
        </StatRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const movement: Scene = {
  about:
    "The arrow says which way it moved and the palette says whether that is good — which are not the same thing, and the component decides neither. A rise in queries is a fall in health.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="direction" of={DIRECTIONS}>
      {(direction) => (
        <StatRoot>
          <StatLabel>Queries raised</StatLabel>
          <StatValueText>
            {direction === "up" ? "12" : "3"}
            <StatValueUnit>this week</StatValueUnit>
          </StatValueText>
          <StatHelpText>
            {direction === "up" ? <StatUpIndicator /> : <StatDownIndicator />}
            {direction === "up" ? "9%" : "4%"}
          </StatHelpText>
        </StatRoot>
      )}
    </Matrix>
  ),
  title: "Which way it moved",
};

export const grouped: Scene = {
  about:
    "Several across a row, sharing their baselines so the figures line up whether or not each carries help text under it.",
  draw: () => (
    <StatGroup maxW="2xl">
      <StatRoot>
        <StatLabel>Raised</StatLabel>
        <StatValueText>240</StatValueText>
      </StatRoot>
      <StatRoot>
        <StatLabel>Settled</StatLabel>
        <StatValueText>228</StatValueText>
      </StatRoot>
      <StatRoot>
        <StatLabel>Held</StatLabel>
        <StatValueText>12</StatValueText>
        <StatHelpText>
          <Box pad="1" round="l1" surface="subtle">
            <Text size="xs">needs review</Text>
          </Box>
        </StatHelpText>
      </StatRoot>
    </StatGroup>
  ),
  title: "In a group",
};

export default specimen({
  about:
    "One figure, what it is, and how it moved. The value is a plain element, so whatever formats a number can be put inside it.",
  group: "Metrics",
  id: "metrics/stat",
  scenes: [sizes, movement, grouped],
  title: "Stat",
});
