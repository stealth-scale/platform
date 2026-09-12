/**
 * Shows the conditional: one subtree when something holds, another when it does not.
 */

import { type ReactElement, useState } from "react";

import {
  Column,
  Row,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import { Show } from "#show/show.ts";

/**
 * Draws a line swapped by a condition, with the control that flips it.
 *
 * @returns The line and its control.
 */
function Swapped(): ReactElement {
  const [count, setCount] = useState(2);

  return (
    <Column gap="3" width="sm">
      <Row gap="2">
        <Trigger
          onClick={() => {
            setCount(count === 0 ? 2 : 0);
          }}
          quiet
        >
          {count === 0 ? "Add offers" : "Clear"}
        </Trigger>
        <Text muted size="xs">
          the fallback is a prop, not a second branch
        </Text>
      </Row>

      <Show fallback={<Text muted>Nothing waiting.</Text>} when={count > 0}>
        <Text strong>{count} offers waiting</Text>
      </Show>
    </Column>
  );
}

export const swapping: Scene = {
  about:
    "Press it. This is a ternary with a name — what the name buys is that the fallback is a prop rather than the far side of a `?`, so a long branch does not push the condition off the top of the block.",
  draw: Swapped,
  title: "One subtree or the other",
};

export default specimen({
  about:
    "Draws one subtree when a condition holds and another when it does not. A ternary with the fallback moved into a prop, so neither branch hides the condition.",
  group: "Layout",
  id: "layout/show",
  scenes: [swapping],
  title: "Show",
});
