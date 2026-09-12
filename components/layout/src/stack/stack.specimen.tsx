/**
 * Shows the stack across every alignment it takes, in both directions.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { HStack, Stack, StackSeparator } from "#stack/stack.ts";

/**
 * Every cross-axis alignment a stack takes.
 */
const ALIGNS = ["start", "center", "end", "stretch", "baseline"] as const;

export const across: Scene = {
  about:
    "The heights have to differ or every alignment looks the same. `baseline` is the one that differs from the rest only where the boxes hold text: it lines up the words, where the others line up the boxes.",
  draw: () => (
    <Matrix knob="align" of={ALIGNS}>
      {(align) => (
        <HStack
          align={align}
          bg="bg.subtle"
          borderRadius="l2"
          gap="3"
          minH="6rem"
          p="3"
          separator={<StackSeparator />}
        >
          <Box bg="colorPalette.subtle" borderRadius="l1" p="2" pt="6">
            <Text>one</Text>
          </Box>
          <Box bg="colorPalette.subtle" borderRadius="l1" p="2">
            <Text size="md">two</Text>
          </Box>
          <Box bg="colorPalette.subtle" borderRadius="l1" p="2" pb="5">
            <Text size="xs">three</Text>
          </Box>
        </HStack>
      )}
    </Matrix>
  ),
  title: "Across",
};

export const down: Scene = {
  about:
    "The same property, turned. In a column the cross axis is the width, so `stretch` is the one that makes two children of different widths agree — which is why it is the default.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="align" of={ALIGNS}>
      {(align) => (
        <Stack align={align} bg="bg.subtle" borderRadius="l2" gap="2" minW="8rem" p="3">
          <Box bg="colorPalette.subtle" borderRadius="l1" px="2" py="1">
            <Text>one</Text>
          </Box>
          <Box bg="colorPalette.subtle" borderRadius="l1" px="4" py="1">
            <Text>two</Text>
          </Box>
        </Stack>
      )}
    </Matrix>
  ),
  title: "Down",
};

export default specimen({
  about:
    "Things in a line, evenly spaced, optionally with a rule between them. The one to reach for when the children are alike; a flex is the one for when they are not.",
  group: "Layout",
  id: "layout/stack",
  scenes: [across, down],
  title: "Stack",
});
