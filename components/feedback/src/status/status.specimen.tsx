/**
 * Shows the status dot in every colour and at every size.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { StatusIndicator, StatusRoot } from "#status/status.ts";

/**
 * Every size the dot takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * What a status can be, against the palette it reads in.
 */
const STATES = [
  { name: "live", palette: "green" },
  { name: "degraded", palette: "orange" },
  { name: "down", palette: "red" },
  { name: "unknown", palette: "gray" },
] as const;

export const states: Scene = {
  about:
    "On one line, since a status is nearly always read against its neighbours rather than alone. The dot carries the colour and the word carries the meaning, so neither is doing the job on its own.",
  draw: () => (
    <Row gap="5">
      {STATES.map((state) => (
        <StatusRoot colorPalette={state.palette} key={state.name}>
          <StatusIndicator />
          {state.name}
        </StatusRoot>
      ))}
    </Row>
  ),
  title: "States",
};

export const sizes: Scene = {
  about:
    "The dot grows with the word beside it. What to watch at the small end is whether it stays round rather than becoming a square with rounded corners.",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => (
        <StatusRoot colorPalette="green" size={size}>
          <StatusIndicator />
          live
        </StatusRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A dot and a word, for reporting what something is doing right now. The colour is a shortcut rather than the message, which is why the word is always there.",
  group: "Feedback",
  id: "feedback/status",
  scenes: [states, sizes],
  title: "Status",
});
