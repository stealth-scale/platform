/**
 * Shows the box that centres itself over whatever holds it.
 */

import { Box, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { AbsoluteCenter } from "#absolute-center/absolute-center.ts";
import { Square } from "#square/square.ts";

export const over: Scene = {
  about:
    "Different from a centre: this one is taken out of the flow and placed over what is already there, so it can sit on top of something rather than beside it. What holds it has to be positioned, or it escapes to the page — which is the mistake that puts two of them in the same corner.",
  draw: () => (
    <Box anchor height="9rem" surface="subtle">
      <Text muted>Whatever was already in the box.</Text>
      <AbsoluteCenter>
        <Square bg="bg.muted" borderRadius="l1" size="3rem">
          <Text size="xs">over</Text>
        </Square>
      </AbsoluteCenter>
    </Box>
  ),
  title: "Over what holds it",
};

export default specimen({
  about:
    "Centres itself over the box around it rather than centring what is inside it. Reach for it to lay something on top — a reading in a ring, a label across a picture, a spinner over a panel.",
  group: "Layout",
  id: "layout/absolute-center",
  scenes: [over],
  title: "Absolute center",
});
