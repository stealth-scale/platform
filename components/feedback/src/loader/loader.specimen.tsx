/**
 * Shows the spinner that stands in for something while it is working.
 */

import { type ReactElement, useState } from "react";

import {
  Box,
  Column,
  Matrix,
  Row,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import { Loader, LoaderOverlay } from "#loader/loader.ts";

/**
 * Which side of the words the spinner sits on.
 */
const PLACEMENTS = ["start", "end"] as const;

/**
 * Draws a panel that can be covered while it is worked on.
 *
 * @returns The panel, and the button that covers it.
 */
function Covered(): ReactElement {
  const [working, setWorking] = useState(false);

  return (
    <Column gap="3" width="sm">
      <Trigger
        onClick={() => {
          setWorking(!working);
        }}
        quiet
      >
        {working ? "Stop" : "Reconcile"}
      </Trigger>

      <Box anchor framed pad="5" round="l3">
        <Column gap="1">
          <Text strong>Four hundred lines</Text>
          <Text muted>Matched against the ledger, then written back.</Text>
        </Column>

        {working ? (
          <LoaderOverlay bg="bg/80" borderRadius="l3" colorPalette="primary">
            <Loader text="Matching" />
          </LoaderOverlay>
        ) : null}
      </Box>
    </Column>
  );
}

export const placements: Scene = {
  about:
    "A loader lays nothing out: it is `display: contents`, so the spinner and the words become children of whatever holds it and are spaced by that. In a row they read as one line; dropped into a column they stack — which is why both of these sit in a row.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="spinnerPlacement" of={PLACEMENTS}>
      {(placement) => (
        <Row gap="2">
          <Loader spinnerPlacement={placement} text="Matching" />
        </Row>
      )}
    </Matrix>
  ),
  title: "Which side the spinner sits",
};

export const hiding: Scene = {
  about:
    "Given children rather than words, it hides them and keeps the space they took — so the row does not collapse and reflow the moment the value arrives.",
  draw: () => (
    <Row gap="2">
      <Loader>
        <Text strong>£17,500.40 settled</Text>
      </Loader>
    </Row>
  ),
  title: "Over what it waits on",
};

export const covering: Scene = {
  about:
    "Press reconcile. The overlay carries no fill of its own — it is a positioned box and nothing more — so the scrim is the caller’s to give. Without one the spinner floats over legible text and neither reads.",
  draw: Covered,
  title: "Over a whole panel",
};

export default specimen({
  about:
    "Says that something is being worked on, beside it or over it. It lays nothing out itself, so whatever holds it decides the spacing.",
  group: "Feedback",
  id: "feedback/loader",
  scenes: [placements, hiding, covering],
  title: "Loader",
});
