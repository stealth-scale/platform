/**
 * Shows the scroll area, whose bars are drawn rather than the browser's.
 */

import { type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "#scroll-area/scroll-area.ts";
import { Stack } from "#stack/stack.ts";

export const down: Scene = {
  about:
    "One bar, drawn rather than the browser’s. That is the whole reason to reach for this: a platform bar cannot be styled, and on a dark panel it is usually invisible.",
  draw: () => (
    <ScrollAreaRoot borderColor="border" borderRadius="l2" borderWidth="1px" h="12rem" w="12rem">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <Stack gap="0" p="3">
            {Array.from({ length: 16 }, (_, index) => (
              <Box key={index} py="1.5">
                <Text>Offer {index + 1}</Text>
              </Box>
            ))}
          </Stack>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  ),
  title: "Scrolling down",
};

export const both: Scene = {
  about:
    "The one worth having: two bars meet at a corner, and the corner is a part of its own because neither bar should run under the other. Scroll it both ways and watch what happens where they meet.",
  draw: () => (
    <ScrollAreaRoot borderColor="border" borderRadius="l2" borderWidth="1px" h="12rem" w="16rem">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <Stack gap="0" p="3" w="28rem">
            {Array.from({ length: 16 }, (_, index) => (
              <Box key={index} py="1.5">
                <Text>Offer {index + 1} — raised, accepted and settled within the week</Text>
              </Box>
            ))}
          </Stack>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollAreaRoot>
  ),
  title: "Scrolling both ways",
};

export default specimen({
  about:
    "A box that scrolls, with bars this kit draws rather than the platform. Reach for it where the bar has to be seen against the surface it sits on.",
  group: "Layout",
  id: "layout/scroll-area",
  scenes: [down, both],
  title: "Scroll area",
});
