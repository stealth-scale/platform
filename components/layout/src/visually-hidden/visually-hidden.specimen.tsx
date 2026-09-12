/**
 * Shows the words that are read out and drawn nowhere.
 */

import { Column, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { VisuallyHidden } from "#visually-hidden/visually-hidden.ts";

export const read: Scene = {
  about:
    "There are words between the two lines below and nothing is drawn for them. Clipped rather than hidden: `display: none` and `hidden` take a thing out of the accessibility tree as well as off the screen, which is the opposite of what this is for.",
  draw: () => (
    <Column gap="2" width="md">
      <Text muted>Above.</Text>
      <VisuallyHidden>
        Read out to a screen reader and drawn nowhere, which is what visually hidden is for.
      </VisuallyHidden>
      <Text muted>Below.</Text>
    </Column>
  ),
  title: "Between two lines",
};

export const naming: Scene = {
  about:
    "What it is actually for: naming a control that carries a mark rather than words, where an `aria-label` would do but the words are worth keeping as content — they can be translated, and they show up in a search of the page.",
  draw: () => (
    <Row gap="3">
      <Text>×</Text>
      <VisuallyHidden>Dismiss this notice</VisuallyHidden>
      <Text muted size="xs">
        The mark on the left is named, though nothing beside it is drawn.
      </Text>
    </Row>
  ),
  title: "Naming a mark",
};

export default specimen({
  about:
    "Words read out to a screen reader and drawn nowhere. Clipped rather than hidden, because hiding something takes it out of the accessibility tree too.",
  group: "Layout",
  id: "layout/visually-hidden",
  scenes: [read, naming],
  title: "Visually hidden",
});
