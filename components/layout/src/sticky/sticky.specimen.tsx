/**
 * Shows the header that stays put while what is under it scrolls away.
 */

import { type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { HStack, Stack } from "#stack/stack.ts";
import { Sticky } from "#sticky/sticky.ts";

export const scrolling: Scene = {
  about:
    "A sticky element does nothing until there is something to scroll past, so the scene has to be a box with more in it than fits. Scroll the panel: the heading stays and the days run under it.",
  draw: () => (
    <Box
      borderColor="border"
      borderRadius="l2"
      borderWidth="1px"
      h="14rem"
      maxW="sm"
      overflowY="auto"
      position="relative"
    >
      <Sticky top="0" zIndex="docked">
        <HStack bg="bg.panel" borderBottomWidth="1px" borderColor="border" px="4" py="3">
          <Text strong>Offers</Text>
        </HStack>
      </Sticky>

      <Stack gap="0" p="4">
        {Array.from({ length: 16 }, (_, index) => (
          <Box key={index} py="1.5">
            <Text muted>Raised on day {index + 1}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  ),
  title: "Stuck to the top",
};

export default specimen({
  about:
    "Holds something in place while what is around it scrolls. It sticks to the nearest scrolling ancestor, so where that is decides what it sticks to.",
  group: "Layout",
  id: "layout/sticky",
  scenes: [scrolling],
  title: "Sticky",
});
