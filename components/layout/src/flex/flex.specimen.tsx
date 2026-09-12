/**
 * Shows the flex box across every way it can spread its children along the main axis.
 */

import { type ReactElement, type ReactNode } from "react";

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { Flex } from "#flex/flex.ts";
import { Spacer } from "#spacer/spacer.ts";

/**
 * Every distribution that draws differently from the others.
 *
 * `stretch`, `normal` and `baseline` are left out on purpose: on a row of fixed-width children they
 * are indistinguishable from `start`, so a cell for each would say nothing.
 */
const JUSTIFY = [
  "start",
  "center",
  "end",
  "space-between",
  "space-around",
  "space-evenly",
] as const;

/**
 * Draws one of the three things being distributed.
 *
 * @param props - The label the chip carries.
 * @returns One tinted chip.
 */
function Chip(props: { children: ReactNode }): ReactElement {
  return (
    <Box bg="colorPalette.subtle" borderRadius="l1" px="3" py="1">
      <Text>{props.children}</Text>
    </Box>
  );
}

export const distribution: Scene = {
  about:
    "Where the spare room goes. Three fixed-width children in a box wider than they need is the only arrangement in which the six differ from one another at all.",
  draw: () => (
    <Matrix knob="justify" of={JUSTIFY}>
      {(justify) => (
        <Flex bg="bg.subtle" borderRadius="l2" gap="2" justify={justify} p="3" w="24rem">
          <Chip>one</Chip>
          <Chip>two</Chip>
          <Chip>three</Chip>
        </Flex>
      )}
    </Matrix>
  ),
  title: "Distribution",
};

export const spacer: Scene = {
  about:
    "A spacer does with an element what `space-between` does with a property: it eats whatever room is left. Reach for one where the split is uneven — two things here, one over there — and for the property where every gap is the same.",
  draw: () => (
    <Flex bg="bg.subtle" borderRadius="l2" gap="2" p="3" w="24rem">
      <Chip>one</Chip>
      <Chip>two</Chip>
      <Spacer />
      <Chip>three</Chip>
    </Flex>
  ),
  title: "With a spacer",
};

export default specimen({
  about:
    "A row or a column, and control over where the spare room goes. The one to reach for when the children are unlike each other; a stack is the one for when they are not.",
  group: "Layout",
  id: "layout/flex",
  scenes: [distribution, spacer],
  title: "Flex",
});
