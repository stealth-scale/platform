/**
 * Shows presence, which keeps a subtree mounted long enough for it to animate away.
 */

import { type ReactElement, useState } from "react";

import {
  Box,
  Column,
  Row,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import { Presence } from "#presence/presence.ts";

/**
 * Draws a panel held by presence, with the control that opens and closes it.
 *
 * @returns The panel and its control.
 */
function Held(): ReactElement {
  const [present, setPresent] = useState(true);

  return (
    <Column gap="3" width="sm">
      <Row gap="2">
        <Trigger
          onClick={() => {
            setPresent(!present);
          }}
          quiet
        >
          {present ? "Hide" : "Show"}
        </Trigger>
        <Text muted size="xs">
          watch it leave rather than disappear
        </Text>
      </Row>

      <Presence
        animationDuration="moderate"
        animationName={{ _closed: "fade-out, scale-out", _open: "fade-in, scale-in" }}
        present={present}
      >
        <Box surface="subtle">
          <Text>Kept mounted until the exit animation has run.</Text>
        </Box>
      </Presence>
    </Column>
  );
}

export const leaving: Scene = {
  about:
    "Press hide. The interesting part is what happens on the way out: the panel stays in the document until its exit animation has run, which is the difference between a panel that fades and one that vanishes. Nothing else can do this — a subtree removed from the tree is gone before it can animate.",
  draw: Held,
  title: "Leaving rather than vanishing",
};

export default specimen({
  about:
    "Keeps a subtree mounted while it animates away, then removes it. What every overlay in this kit is built on, and what to reach for directly when something has to leave rather than disappear.",
  group: "Layout",
  id: "layout/presence",
  scenes: [leaving],
  title: "Presence",
});
