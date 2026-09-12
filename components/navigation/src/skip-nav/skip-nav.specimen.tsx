/**
 * Shows the link that only appears once it is focused, and what it jumps to.
 */

import { Box, Column, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { SkipNavContent, SkipNavLink } from "#skip-nav/skip-nav.ts";

export const focused: Scene = {
  about:
    "Nothing is visible at rest: the link is clipped until it takes focus, so this is only worth anything from the keyboard. Press Tab — it should appear over the corner, and pressing it should land focus past whatever navigation came before.",
  draw: () => (
    <Box anchor pad="0">
      <Column gap="6">
        <SkipNavLink colorPalette="primary">Skip to content</SkipNavLink>

        <Text muted>
          Press Tab. The link is clipped until it takes focus, then it sits over the corner.
        </Text>

        <Box framed pad="5" round="l3">
          <SkipNavContent />
          <Column gap="2">
            <Text strong>Content</Text>
            <Text muted>Focus lands here, past whatever navigation came before it.</Text>
          </Column>
        </Box>
      </Column>
    </Box>
  ),
  title: "From the keyboard",
};

export default specimen({
  about:
    "A link that is drawn nowhere until it takes focus, so a keyboard reader can jump past the navigation without a pointer reader ever seeing it.",
  group: "Navigation",
  id: "navigation/skip-nav",
  scenes: [focused],
  title: "Skip nav",
});
