/**
 * Shows a band pulled back out past the padding that holds everything else in.
 */

import { Box, Column, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Bleed } from "#bleed/bleed.ts";

export const past: Scene = {
  about:
    "The panel pads its contents; the band undoes that padding for itself and nothing else. Reach for it where something has to touch the edge — an image at the head of a card, a rule across a section, a highlighted row in a padded list.",
  draw: () => (
    <Box pad="6" surface="subtle">
      <Column gap="4">
        <Text muted>Held in by the panel’s padding, like everything else.</Text>
        <Bleed inline="6">
          <Box pad="0" round="0" surface="muted">
            <Box pad="2" round="0">
              <Text>Bled out to the edge</Text>
            </Box>
          </Box>
        </Bleed>
        <Text muted>And back inside it again.</Text>
      </Column>
    </Box>
  ),
  title: "Past the padding",
};

export default specimen({
  about:
    "Pulls its contents back out past the padding around them, so one thing can reach the edge while everything beside it stays held in.",
  group: "Layout",
  id: "layout/bleed",
  scenes: [past],
  title: "Bleed",
});
